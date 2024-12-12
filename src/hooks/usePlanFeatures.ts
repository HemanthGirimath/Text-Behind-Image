'use client'

import { useSession } from 'next-auth/react';
import { PLAN_FEATURES, PlanType, FeatureType } from '@/lib/plans';

export function usePlanFeatures() {
  const { data: session } = useSession();
  const userPlan = (session?.user?.plan || 'free') as PlanType;

  const hasFeature = (feature: FeatureType) => {
    const planFeatures = PLAN_FEATURES[userPlan];
    return planFeatures.includes(feature);
  };

  const canAccessPlanFeatures = (plan: PlanType) => {
    const planOrder: PlanType[] = ['free', 'basic', 'premium'];
    const userPlanIndex = planOrder.indexOf(userPlan);
    const requiredPlanIndex = planOrder.indexOf(plan);
    return userPlanIndex >= requiredPlanIndex;
  };

  return {
    userPlan,
    hasFeature,
    canAccessPlanFeatures,
    isAuthenticated: !!session?.user
  };
}
