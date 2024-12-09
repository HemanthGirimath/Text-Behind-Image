import { FeatureType, PLAN_FEATURES } from './plans';

export function hasPermission(userPlan: string, feature: FeatureType): boolean {
  const planFeatures = PLAN_FEATURES[userPlan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.free;
  return planFeatures.includes(feature);
}
