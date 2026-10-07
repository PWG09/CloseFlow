export type UserRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost' | 'inactive';

export type QuoteStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled';

export type OpportunityType = 'new_lead' | 'quote_followup' | 'reactivation' | 'other';

export type OpportunityStatus = 'open' | 'in_progress' | 'won' | 'lost' | 'dismissed';

export type MessageChannel = 'email' | 'sms' | 'whatsapp' | 'other';

export type MessageStatus =
  | 'draft'
  | 'pending_approval'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'bounced';

export type PlanId = 'trial' | 'starter' | 'growth' | 'pro';

export interface Organization {
  id: string;
  name: string;
  industry: string;
  timezone: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: UserRole;
  invited_by: string | null;
  joined_at: string;
}

export interface Customer {
  id: string;
  organization_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  email_opt_in: boolean;
  sms_opt_in: boolean;
  marketing_opt_in: boolean;
  unsubscribed_at: string | null;
  lifetime_value: number;
  last_service_at: string | null;
  last_contacted_at: string | null;
  notes: string | null;
  external_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  organization_id: string;
  customer_id: string | null;
  source: string | null;
  service: string | null;
  estimated_value: number | null;
  status: LeadStatus;
  notes: string | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  organization_id: string;
  customer_id: string;
  lead_id: string | null;
  quote_number: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: QuoteStatus;
  sent_at: string | null;
  viewed_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  organization_id: string;
  customer_id: string | null;
  lead_id: string | null;
  quote_id: string | null;
  type: OpportunityType;
  title: string;
  estimated_value: number;
  recovery_score: number;
  status: OpportunityStatus;
  reason: string | null;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  organization_id: string;
  customer_id: string | null;
  opportunity_id: string | null;
  channel: MessageChannel;
  direction: 'outbound' | 'inbound';
  subject: string | null;
  body: string;
  status: MessageStatus;
  provider_message_id: string | null;
  sent_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  organization_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_id: PlanId;
  status: string;
  trial_ends_at: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  revenue_recovered: number;
  revenue_at_risk: number;
  leads_needing_attention: number;
  unclosed_quotes_count: number;
  unclosed_quotes_value: number;
  reactivation_candidates: number;
  opportunities_open: number;
}
