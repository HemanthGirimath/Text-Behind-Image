import { useSession } from 'next-auth/react';
import { PLAN_FEATURES, PLAN_PRICES, PlanType, FeatureType } from '@/lib/plans';

// Plan-specific configurations
const PLAN_CONFIGS = {
  free: {
    maxTextLayers: 1,
    fonts: ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana']
  },
  basic: {
    maxTextLayers: 3,
    fonts: ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Helvetica', 'Roboto', 'Open Sans', 'Lato', 'Montserrat']
  },
  premium: {
    maxTextLayers: Infinity,
    fonts: [
      'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Helvetica', 
      'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 
      'Source Sans Pro', 'Merriweather', 'Ubuntu', 'Raleway'
    ]
  }
} as const;

export function useFeatureAccess() {
  const { data: session } = useSession();
  const userPlan = (session?.user?.plan || 'free') as PlanType;

  const hasAccess = (feature: FeatureType): boolean => {
    return PLAN_FEATURES[userPlan].includes(feature);
  };

  const getPlanForFeature = (feature: FeatureType): PlanType => {
    for (const [plan, features] of Object.entries(PLAN_FEATURES)) {
      if (features.includes(feature)) {
        return plan as PlanType;
      }
    }
    return 'premium';
  };

  const getUpgradeInfo = (feature: FeatureType) => {
    const requiredPlan = getPlanForFeature(feature);
    const currentPlanIndex = ['free', 'basic', 'premium'].indexOf(userPlan);
    const requiredPlanIndex = ['free', 'basic', 'premium'].indexOf(requiredPlan);
    
    if (currentPlanIndex >= requiredPlanIndex) return null;
    
    return {
      plan: requiredPlan,
      price: PLAN_PRICES[requiredPlan],
      features: PLAN_FEATURES[requiredPlan]
    };
  };

  const canUseFeature = (feature: FeatureType): boolean => {
    if (feature === 'basic_text') return true;
    
    const planOrder = { premium: 3, basic: 2, free: 1 };
    const requiredPlan = getPlanForFeature(feature);
    
    return planOrder[userPlan] >= planOrder[requiredPlan];
  };

  const getConfig = () => PLAN_CONFIGS[userPlan];

  const isFeatureUnlocked = (feature: FeatureType): boolean => {
    const planOrder = { premium: 3, basic: 2, free: 1 };
    const requiredPlan = getPlanForFeature(feature);
    return planOrder[userPlan] >= planOrder[requiredPlan];
  };

  return {
    userPlan,
    hasAccess,
    canUseFeature,
    getPlanForFeature,
    getUpgradeInfo,
    getConfig,
    isFeatureUnlocked,
    planConfig: PLAN_CONFIGS[userPlan]
  };
}
