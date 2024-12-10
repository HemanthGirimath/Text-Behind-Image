import { PLAN_SECTIONS, SECTION_FEATURES } from './plans';
import { PlanType } from './plans';

// Get all possible feature values from SECTION_FEATURES
type AllFeatures = typeof SECTION_FEATURES[keyof typeof SECTION_FEATURES][number];

export function hasPermission(userPlan: PlanType | string, feature: AllFeatures): boolean {
  const plan = userPlan as PlanType;
  const availableSections = PLAN_SECTIONS[plan] || PLAN_SECTIONS.free;
  
  // Find which section contains this feature
  for (const section of availableSections) {
    const sectionFeatures = SECTION_FEATURES[section];
    if (sectionFeatures.includes(feature)) {
      return true;
    }
  }
  
  return false;
}

export function getAvailableFeatures(userPlan: PlanType | string): AllFeatures[] {
  const plan = userPlan as PlanType;
  const availableSections = PLAN_SECTIONS[plan] || PLAN_SECTIONS.free;
  
  // Collect all features from available sections
  return availableSections.flatMap(section => SECTION_FEATURES[section]);
}
