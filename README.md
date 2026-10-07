# CloseFlow

**Turn missed opportunities into revenue.**

AI-powered revenue recovery platform for local service businesses (auto detailing, HVAC, plumbing, roofing, cleaning, etc.).

## Stack

- **Frontend/API**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL + Row Level Security)
- **Payments**: Stripe (Checkout, Customer Portal, Webhooks)
- **Hosting**: Vercel
- **AI**: Controlled server-side tools (OpenAI / Anthropic)

## Getting Started

1. Clone the repository
2. Create a Supabase project and run the migrations in `supabase/migrations/`
3. Copy environment variables (see below)
4. Install dependencies:

```bash
npm install
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_GROWTH=
STRIPE_PRICE_PRO=

OPENAI_API_KEY=          # or ANTHROPIC_API_KEY
```

Never commit `.env.local` or any secrets.

## Project Structure

```
src/
  app/              # App Router (pages + API routes)
  components/       # Shared UI components
  lib/              # Auth helpers, plans, utilities
  types/            # TypeScript domain types
  schemas/          # Zod validation schemas
  services/         # Business logic services
  hooks/            # Client hooks
supabase/
  migrations/       # Reproducible SQL migrations + RLS
```

## Core Product Loop

1. Business imports/connects customer & quote data
2. CloseFlow analyzes opportunities (stale quotes, inactive customers, new leads)
3. AI scores and recommends actions
4. Business approves automation / messages
5. Follow-ups are sent
6. Revenue recovery is measured

## Security Principles (Non-negotiable)

- Organization isolation via RLS on every private table
- Never trust `organization_id`, `role`, or subscription status from the client
- AI tools authorize before querying data
- Human-in-the-loop for all outbound messaging in MVP
- Stripe webhook signature verification
- Server-side trial and entitlement enforcement

## Plans

| Plan    | Monthly | Notes                          |
|---------|---------|--------------------------------|
| Trial   | Free    | 14 days                        |
| Starter | $29     | Small businesses               |
| Growth  | $79     | Main recommended plan          |
| Pro     | $149    | Advanced automation & limits   |

Prices and limits are centralized in `src/lib/plans.ts`.

## Development Status

**Phase 0 – Foundation** (in progress)
- Database schema + RLS policies
- Auth helpers
- Plan/entitlement definitions
- Project structure

Next: Authentication flows, organization onboarding, core dashboard shell.
