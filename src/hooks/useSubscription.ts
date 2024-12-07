import { useSession } from 'next-auth/react'
import { PLAN_FEATURES } from '@/lib/subscription'
import type { FeatureKey } from '@/lib/subscription'
import type { UserPlan } from '@/lib/utils'
import { useEffect } from 'react'

export function useSubscription() {
  const { data: session, update } = useSession()
  const currentPlan = (session?.user?.plan ?? 'free') as UserPlan
  const imagesUsed = session?.user?.imagesUsed ?? 0

  // Force session refresh when component mounts
  useEffect(() => {
    update()
  }, [update])

  const canUseFeature = (feature: FeatureKey): boolean => {
    if (!session?.user) return false
    return PLAN_FEATURES[currentPlan][feature]
  }

  const canProcessImage = (): boolean => {
    if (!session?.user) return false
    const planLimit = PLAN_FEATURES[currentPlan].maxImages
    return imagesUsed < planLimit
  }

  const getRemainingImages = (): number => {
    if (!session?.user) return 0
    const planLimit = PLAN_FEATURES[currentPlan].maxImages
    return Math.max(0, planLimit - imagesUsed)
  }

  const getMaxTextLayers = (): number => {
    return PLAN_FEATURES[currentPlan].maxTextLayers
  }

  const refreshSession = async () => {
    await update()
  }

  return {
    currentPlan,
    imagesUsed,
    canUseFeature,
    canProcessImage,
    getRemainingImages,
    getMaxTextLayers,
    isAuthenticated: !!session?.user,
    refreshSession
  }
}