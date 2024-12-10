type PlanType = 'free' | 'basic' | 'premium';

interface PlanFeatures {
  maxFonts: number;
  maxLayers: number;
  hasAdvancedPositioning: boolean;
  hasCustomColors: boolean;
  hasEffects: boolean;
  hasTemplates: boolean;
  hasExport: boolean;
}

const planFeatures: Record<PlanType, PlanFeatures> = {
  free: {
    maxFonts: 5,
    maxLayers: 1,
    hasAdvancedPositioning: false,
    hasCustomColors: false,
    hasEffects: false,
    hasTemplates: false,
    hasExport: false,
  },
  basic: {
    maxFonts: 15,
    maxLayers: 3,
    hasAdvancedPositioning: true,
    hasCustomColors: true,
    hasEffects: false,
    hasTemplates: true,
    hasExport: true,
  },
  premium: {
    maxFonts: -1, // unlimited
    maxLayers: -1, // unlimited
    hasAdvancedPositioning: true,
    hasCustomColors: true,
    hasEffects: true,
    hasTemplates: true,
    hasExport: true,
  },
};

export function isFeatureAvailable(userPlan: PlanType, feature: keyof PlanFeatures): boolean {
  return planFeatures[userPlan][feature];
}

export function getMaxValue(userPlan: PlanType, feature: 'maxFonts' | 'maxLayers'): number {
  return planFeatures[userPlan][feature];
}

export function isPlanActive(currentPlan: PlanType, requiredPlan: PlanType): boolean {
  const planOrder: PlanType[] = ['free', 'basic', 'premium'];
  return planOrder.indexOf(currentPlan) >= planOrder.indexOf(requiredPlan);
}

export { planFeatures };
export type { PlanType, PlanFeatures };
