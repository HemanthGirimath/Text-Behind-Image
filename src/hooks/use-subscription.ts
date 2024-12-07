'use client'

import { useUser } from '@/lib/user-context'
import { UserPlan } from '@/lib/utils'

interface PlanFeatures {
  imageGenerations: number
  fonts: number
  imageAdjustments: boolean
  multipleTextLayers: boolean
  aiFeatures: boolean
}

const PLAN_FEATURES: Record<UserPlan, PlanFeatures> = {
  free: {
    imageGenerations: 3,
    fonts: 5,
    imageAdjustments: false,
    multipleTextLayers: false,
    aiFeatures: false,
  },
  basic: {
    imageGenerations: 20,
    fonts: 15,
    imageAdjustments: true,
    multipleTextLayers: true,
    aiFeatures: false,
  },
  premium: {
    imageGenerations: 100,
    fonts: 50,
    imageAdjustments: true,
    multipleTextLayers: true,
    aiFeatures: true,
  },
}

export function useSubscription() {
  const { state } = useUser()
  const userPlan = state.user?.plan || 'free'
  const features = PLAN_FEATURES[userPlan]

  const canUseFeature = (feature: keyof PlanFeatures) => {
    return features[feature]
  }

  const getLimit = (feature: 'imageGenerations' | 'fonts') => {
    return features[feature]
  }

  const getPlanName = () => {
    return userPlan.charAt(0).toUpperCase() + userPlan.slice(1)
  }

  return {
    plan: userPlan,
    planName: getPlanName(),
    features,
    canUseFeature,
    getLimit,
  }
}
