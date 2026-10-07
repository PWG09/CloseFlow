-- CloseFlow RLS Policies
-- Never use USING (true) on private tables.
-- Organization membership is resolved via organization_members.

-- Helper function: get organizations the current user belongs to
CREATE OR REPLACE FUNCTION public.user_organization_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM organization_members
  WHERE user_id = auth.uid();
$$;

-- Helper: check if user has at least a given role in an organization
CREATE OR REPLACE FUNCTION public.has_org_role(org_id UUID, allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM organization_members
    WHERE organization_id = org_id
      AND user_id = auth.uid()
      AND role = ANY(allowed_roles)
  );
$$;

-- ============================================================
-- ENABLE RLS
-- ============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (id IN (SELECT public.user_organization_ids()));

CREATE POLICY "Owners and admins can update organization"
  ON organizations FOR UPDATE
  USING (public.has_org_role(id, ARRAY['owner', 'admin']));

-- Insert is handled via service role / secure signup function

-- ============================================================
-- ORGANIZATION MEMBERS
-- ============================================================
CREATE POLICY "Members can view org members"
  ON organization_members FOR SELECT
  USING (organization_id IN (SELECT public.user_organization_ids()));

CREATE POLICY "Owners and admins can manage members"
  ON organization_members FOR ALL
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin']));

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE POLICY "Org members can view customers"
  ON customers FOR SELECT
  USING (organization_id IN (SELECT public.user_organization_ids()));

CREATE POLICY "Managers+ can insert customers"
  ON customers FOR INSERT
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Managers+ can update customers"
  ON customers FOR UPDATE
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Admins+ can delete customers"
  ON customers FOR DELETE
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin']));

-- ============================================================
-- LEADS
-- ============================================================
CREATE POLICY "Org members can view leads"
  ON leads FOR SELECT
  USING (organization_id IN (SELECT public.user_organization_ids()));

CREATE POLICY "Managers+ can insert leads"
  ON leads FOR INSERT
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Managers+ can update leads"
  ON leads FOR UPDATE
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Admins+ can delete leads"
  ON leads FOR DELETE
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin']));

-- ============================================================
-- QUOTES
-- ============================================================
CREATE POLICY "Org members can view quotes"
  ON quotes FOR SELECT
  USING (organization_id IN (SELECT public.user_organization_ids()));

CREATE POLICY "Managers+ can insert quotes"
  ON quotes FOR INSERT
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Managers+ can update quotes"
  ON quotes FOR UPDATE
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Admins+ can delete quotes"
  ON quotes FOR DELETE
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin']));

-- ============================================================
-- QUOTE ITEMS
-- ============================================================
CREATE POLICY "Org members can view quote items"
  ON quote_items FOR SELECT
  USING (
    quote_id IN (
      SELECT id FROM quotes
      WHERE organization_id IN (SELECT public.user_organization_ids())
    )
  );

CREATE POLICY "Managers+ can manage quote items"
  ON quote_items FOR ALL
  USING (
    quote_id IN (
      SELECT id FROM quotes
      WHERE organization_id IN (SELECT public.user_organization_ids())
        AND public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member'])
    )
  );

-- ============================================================
-- OPPORTUNITIES
-- ============================================================
CREATE POLICY "Org members can view opportunities"
  ON opportunities FOR SELECT
  USING (organization_id IN (SELECT public.user_organization_ids()));

CREATE POLICY "Managers+ can insert opportunities"
  ON opportunities FOR INSERT
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Managers+ can update opportunities"
  ON opportunities FOR UPDATE
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Admins+ can delete opportunities"
  ON opportunities FOR DELETE
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin']));

-- ============================================================
-- AUTOMATION RULES
-- ============================================================
CREATE POLICY "Org members can view automation rules"
  ON automation_rules FOR SELECT
  USING (organization_id IN (SELECT public.user_organization_ids()));

CREATE POLICY "Managers+ can manage automation rules"
  ON automation_rules FOR ALL
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager']));

-- ============================================================
-- AUTOMATION RUNS
-- ============================================================
CREATE POLICY "Org members can view automation runs"
  ON automation_runs FOR SELECT
  USING (organization_id IN (SELECT public.user_organization_ids()));

CREATE POLICY "System and managers can insert runs"
  ON automation_runs FOR INSERT
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager']));

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE POLICY "Org members can view messages"
  ON messages FOR SELECT
  USING (organization_id IN (SELECT public.user_organization_ids()));

CREATE POLICY "Members+ can insert messages"
  ON messages FOR INSERT
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

CREATE POLICY "Members+ can update messages"
  ON messages FOR UPDATE
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

-- ============================================================
-- MESSAGE TEMPLATES
-- ============================================================
CREATE POLICY "Org members can view templates"
  ON message_templates FOR SELECT
  USING (
    organization_id IS NULL  -- system defaults
    OR organization_id IN (SELECT public.user_organization_ids())
  );

CREATE POLICY "Managers+ can manage org templates"
  ON message_templates FOR ALL
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager']));

-- ============================================================
-- AI GENERATIONS
-- ============================================================
CREATE POLICY "Org members can view AI generations"
  ON ai_generations FOR SELECT
  USING (organization_id IN (SELECT public.user_organization_ids()));

CREATE POLICY "Members+ can insert AI generations"
  ON ai_generations FOR INSERT
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'manager', 'member']));

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE POLICY "Org members can view subscription"
  ON subscriptions FOR SELECT
  USING (organization_id IN (SELECT public.user_organization_ids()));

-- Updates only via service role / Stripe webhooks

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE POLICY "Org members can view audit logs"
  ON audit_logs FOR SELECT
  USING (organization_id IN (SELECT public.user_organization_ids()));

CREATE POLICY "Authenticated users can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (actor_id = auth.uid());
