import { UserPlan } from '@/lib/utils';

export interface PlanFeatures {
  maxImages: number;
  maxTextLayers: number;
  advancedEffects: boolean;
  basicEffects: boolean;
  customFonts: boolean;
  priority: boolean;
  multipleTextLayers: boolean;
  aiFeatures: boolean;
}

export const PLAN_FEATURES: Record<UserPlan, PlanFeatures> = {
  free: {
    maxImages: 3,
    maxTextLayers: 1,
    advancedEffects: false,
    basicEffects: false,
    customFonts: false,
    priority: false,
    multipleTextLayers: false,
    aiFeatures: false
  },
  basic: {
    maxImages: 50,
    maxTextLayers: 3,
    advancedEffects: false,
    basicEffects: true,
    customFonts: true,
    priority: false,
    multipleTextLayers: true,
    aiFeatures: false
  },
  premium: {
    maxImages: 200,
    maxTextLayers: Infinity,
    advancedEffects: true,
    basicEffects: true,
    customFonts: true,
    priority: true,
    multipleTextLayers: true,
    aiFeatures: true
  }
};

export const FREE_TIER_FONTS = [
  'Arial',
  'Times New Roman',
  'Verdana',
  'Georgia',
  'Helvetica'
];

export type FeatureKey = keyof Omit<PlanFeatures, 'maxImages' | 'maxTextLayers'>;

export function checkFeatureAccess(plan: UserPlan, feature: FeatureKey): boolean {
  return PLAN_FEATURES[plan][feature];
}

export function getMaxTextLayers(plan: UserPlan): number {
  return PLAN_FEATURES[plan].maxTextLayers;
}

export function canAddTextLayer(plan: UserPlan, currentLayers: number): boolean {
  return currentLayers < PLAN_FEATURES[plan].maxTextLayers;
}

export function getRemainingImages(plan: UserPlan, usedImages: number): number {
  return Math.max(0, PLAN_FEATURES[plan].maxImages - usedImages);
}

export function canProcessImage(plan: UserPlan, usedImages: number): boolean {
  return usedImages < PLAN_FEATURES[plan].maxImages;
}

export function canUseFontFamily(plan: UserPlan, fontFamily: string): boolean {
  if (plan === 'premium' || plan === 'basic') return true;
  return FREE_TIER_FONTS.includes(fontFamily);
}