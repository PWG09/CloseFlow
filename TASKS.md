# CloseFlow — Remaining Tasks

Prototipo actual: UI + mock data + schema + RLS.  
Repo local listo en `main` (commit `d7ebfd8`).

---

## 0. Subir a GitHub (hacer ahora)

```bash
cd /home/workdir/artifacts/closeflow

# Si el repo no existe aún, créalo en GitHub: PWG09/closeflow (vacío)

git remote add origin https://github.com/PWG09/closeflow.git   # ya configurado
git push -u origin main
```

Si pide autenticación, usa un **Personal Access Token** (permiso `repo`) como password.

---

## 1. Fundación (bloqueante)

- [ ] Crear proyecto en Supabase
- [ ] Ejecutar migraciones:
  - `supabase/migrations/20261007120000_initial_schema.sql`
  - `supabase/migrations/20261007120100_rls_policies.sql`
- [ ] Completar `.env.local` (ver `.env.example`)
- [ ] `npm install` y verificar `npm run dev` / `npm run build`
- [ ] Instalar dependencias faltantes si hace falta: `@supabase/ssr`, `@supabase/supabase-js`, `zod`, `lucide-react`, `date-fns`

---

## 2. Autenticación real

- [ ] Signup: crear `auth.users` + `organizations` + `organization_members` (role owner) + `subscriptions` (trial 14 días)
- [ ] Login con Supabase Auth
- [ ] Middleware de sesión (proteger rutas `/today`, `/opportunities`, etc.)
- [ ] Resolver `organization_id` siempre en servidor (nunca confiar del cliente)
- [ ] Logout

---

## 3. Onboarding

- [ ] Flujo: negocio → industria → cómo gestionan clientes → importar datos
- [ ] Momento “aha”: “Encontramos X oportunidades por $Y”
- [ ] Selección de industria adapta terminología y plantillas

---

## 4. Datos core (CRUD + RLS)

- [ ] Customers: list / create / edit / detail
- [ ] Leads: list / create / status updates
- [ ] Quotes: create (total calculado en servidor) / send / status
- [ ] Quote items
- [ ] Opportunities: generación automática + listado + detalle
- [ ] Activity timeline por cliente/oportunidad

---

## 5. Import CSV

- [ ] Upload + preview
- [ ] Mapeo de columnas
- [ ] Validación (email, fechas, montos, required)
- [ ] Detección de duplicados (email / phone / nombre normalizado)
- [ ] Errores claros + no importar a ciegas

---

## 6. Inteligencia (corazón del producto)

- [ ] Detector de oportunidades:
  - Quotes enviados sin respuesta (día 2 / 5 / 10)
  - Leads nuevos sin contacto
  - Clientes inactivos (90+ días configurable)
- [ ] AI Opportunity Score (factores explicables, etiquetado “AI Score”)
- [ ] Generador de follow-ups (draft + aprobación humana)
- [ ] Generador de mensajes de reactivación
- [ ] Respuesta sugerida a leads nuevos
- [ ] **Today** con datos reales (no mock)
- [ ] Daily AI Briefing

---

## 7. Mensajería (MVP = email)

- [ ] Abstracción `CommunicationProvider`
- [ ] Envío de email (Resend / similar)
- [ ] Estados: draft → pending_approval → sent → delivered/failed
- [ ] Historial de mensajes
- [ ] Consent / opt-out (email_opt_in, unsubscribed_at)
- [ ] No enviar marketing a opted-out

---

## 8. Automatizaciones

- [ ] CRUD de `automation_rules`
- [ ] Triggers: quote_sent, customer_inactive, new_lead
- [ ] Condiciones + acciones (JSONB)
- [ ] Runs auditables, cancelables, con límite de reintentos
- [ ] Nunca loops autónomos sin control
- [ ] Aprobación humana antes de enviar en MVP

---

## 9. Billing (Stripe)

- [ ] Planes: Trial / Starter $29 / Growth $79 / Pro $149 (centralizados en `src/lib/plans.ts`)
- [ ] Checkout Session + Customer Portal
- [ ] Webhooks firmados + idempotencia
- [ ] Tabla `subscriptions` como fuente de verdad
- [ ] Trial 14 días enforced server-side
- [ ] Entitlements por plan (límites AI, automatizaciones, etc.)
- [ ] Nunca confiar plan/status del frontend

---

## 10. Analytics & ROI

- [ ] Revenue recovered (solo con señal verificable)
- [ ] Revenue at risk (oportunidades abiertas)
- [ ] Follow-up conversion
- [ ] Reactivation revenue
- [ ] Página ROI separando: Verified / Estimated / Potential
- [ ] No inventar métricas

---

## 11. AI Assistant (opcional MVP+)

- [ ] Chat sobre datos de la org
- [ ] Tools controlados con autorización server-side
- [ ] Sin SQL arbitrario
- [ ] Rate limits + tracking de tokens
- [ ] Validación de outputs con Zod

---

## 12. Seguridad (antes de producción)

- [ ] Tests IDOR (cambiar IDs entre orgs)
- [ ] Tests de roles (viewer no escribe, etc.)
- [ ] XSS en notes / mensajes / AI
- [ ] Rate limit: login, AI, import, messaging
- [ ] Prompt injection tests
- [ ] Stripe webhook replay / firma inválida
- [ ] No secrets en repo
- [ ] `npm run build` + `tsc --noEmit` pasan

---

## 13. UX / Polish

- [ ] Empty states útiles en todas las pantallas
- [ ] Mobile-responsive (nav, tablas, modales)
- [ ] Loading / error states
- [ ] Página Settings (org, equipo, notificaciones)
- [ ] Página Billing
- [ ] Página Automations
- [ ] Página Messages
- [ ] Página Analytics / ROI

---

## 14. Deploy

- [ ] Proyecto en Vercel
- [ ] Variables de entorno en Vercel
- [ ] Supabase production
- [ ] Stripe live + webhook endpoint
- [ ] Dominio (opcional)
- [ ] Monitoreo de errores

---

## Orden recomendado

1. GitHub push  
2. Supabase + migraciones + `.env`  
3. Auth real + org on signup  
4. CRUD customers/leads/quotes  
5. Opportunity detection + Today real  
6. AI drafts + approve/send email  
7. CSV import  
8. Stripe + trial  
9. Automations  
10. Analytics/ROI  
11. Security pass + deploy  

---

## Definition of Done (recordatorio)

CloseFlow no está terminado cuando “se ve bien”.  
Está terminado cuando:

- Auth + RLS + aislamiento multi-tenant funcionan  
- IDOR tests pasan  
- Core workflows funcionan con datos reales  
- AI es seguro y con aprobación humana  
- Stripe y trial son server-side  
- Build y typecheck pasan  
- No hay métricas inventadas ni secrets en el repo  
