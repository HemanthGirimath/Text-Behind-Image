'use client'

import { useSubscription } from '@/hooks/use-subscription'
import { Badge } from '@/components/UI/badge'

export function SubscriptionBadge() {
  const { planName } = useSubscription()

  return (
    <Badge variant={planName === 'Free' ? 'outline' : 'default'} className="ml-2">
      {planName} Plan
    </Badge>
  )
}
