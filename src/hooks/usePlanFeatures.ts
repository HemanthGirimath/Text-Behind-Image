import { useSession } from 'next-auth/react';
import { isFeatureAvailable, getMaxValue, isPlanActive, PlanType } from '@/lib/planFeatures';

export function usePlanFeatures() {
  const { data: session } = useSession();
  const userPlan = (session?.user as any)?.activePlan as PlanType || 'free';

  return {
    canUseFeature: (feature: string) => isFeatureAvailable(userPlan, feature as any),
    getMaxValue: (feature: 'maxFonts' | 'maxLayers') => getMaxValue(userPlan, feature),
    isPlanActive: (requiredPlan: PlanType) => isPlanActive(userPlan, requiredPlan),
    currentPlan: userPlan,
  };
}
