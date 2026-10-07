import type { PlanId } from '@/types/database';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  priceMonthly: number; // in cents
  stripePriceId: string | null; // set via env in production
  trialDays: number;
  features: {
    aiGenerationsPerMonth: number;
    automations: number;
    teamMembers: number;
    csvImports: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    customTemplates: boolean;
  };
}

/**
 * Centralized plan definitions.
 * Never hardcode prices or limits elsewhere.
 * Stripe Price IDs must come from environment variables in production.
 */
export const PLANS: Record<PlanId, PlanDefinition> = {
  trial: {
    id: 'trial',
    name: 'Trial',
    priceMonthly: 0,
    stripePriceId: null,
    trialDays: 14,
    features: {
      aiGenerationsPerMonth: 50,
      automations: 3,
      teamMembers: 2,
      csvImports: true,
      advancedAnalytics: false,
      prioritySupport: false,
      customTemplates: false,
    },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 2900, // $29
    stripePriceId: process.env.STRIPE_PRICE_STARTER ?? null,
    trialDays: 0,
    features: {
      aiGenerationsPerMonth: 100,
      automations: 5,
      teamMembers: 3,
      csvImports: true,
      advancedAnalytics: false,
      prioritySupport: false,
      customTemplates: false,
    },
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    priceMonthly: 7900, // $79
    stripePriceId: process.env.STRIPE_PRICE_GROWTH ?? null,
    trialDays: 0,
    features: {
      aiGenerationsPerMonth: 500,
      automations: 25,
      teamMembers: 10,
      csvImports: true,
      advancedAnalytics: true,
      prioritySupport: false,
      customTemplates: true,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 14900, // $149
    stripePriceId: process.env.STRIPE_PRICE_PRO ?? null,
    trialDays: 0,
    features: {
      aiGenerationsPerMonth: 2000,
      automations: 100,
      teamMembers: 50,
      csvImports: true,
      advancedAnalytics: true,
      prioritySupport: true,
      customTemplates: true,
    },
  },
};

export function getPlan(planId: PlanId): PlanDefinition {
  return PLANS[planId] ?? PLANS.trial;
}

export function canUseFeature(
  planId: PlanId,
  feature: keyof PlanDefinition['features']
): boolean {
  const plan = getPlan(planId);
  const value = plan.features[feature];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  return false;
}
