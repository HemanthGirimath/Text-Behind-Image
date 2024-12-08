import { useSession } from 'next-auth/react';
import { PLAN_FEATURES, PlanType, FeatureType } from '@/lib/plans';

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
    return 'premium'; // Default to premium if feature is not found
  };

  const canUseFeature = (feature: FeatureType) => {
    if (feature === 'basic_text') return true;
    
    // Check if the feature is available in the current plan or higher plans
    for (const [plan, features] of Object.entries(PLAN_FEATURES)) {
      if (features.includes(feature)) {
        // If the feature is found in the current plan or a lower tier plan, allow access
        if (
          (userPlan === 'premium') ||
          (userPlan === 'basic' && plan !== 'premium') ||
          (userPlan === 'free' && plan === 'free')
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const getMaxTextLayers = () => {
    return PLAN_CONFIGS[userPlan].maxTextLayers;
  };

  const getAvailableFonts = () => {
    return PLAN_CONFIGS[userPlan].fonts;
  };

  return {
    hasAccess,
    canUseFeature,
    getMaxTextLayers,
    getAvailableFonts,
    getPlanForFeature,
    userPlan
  };
}
