'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/card'
import { Button } from '@/components/UI/button'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/UI/use-toast'
import { useState } from 'react'
import { User, Crown, Check } from 'lucide-react'
import { upgradePlan, cancelPlan } from '@/app/actions/plans'
import { PlanType } from '@/lib/plans'

const PLAN_FEATURES: { [key in PlanType]: string[] } = {
  free: [
    'Basic text input',
    'Basic fonts',
    'Basic positioning',
    'Basic color selection',
    'Text alignment',
  ],
  basic: [
    'Everything in Free plan',
    'Text styling (bold/italic)',
    'Opacity control',
    'Rotation',
    'Font size and letter spacing',
  ],
  premium: [
    'Everything in Basic plan',
    'Shadow effects',
    'Gradient text',
    'Glow effects',
    'Text outlines',
    'Transform options',
    'Unlimited layers',
  ],
}

const PLAN_PRICES: { [key in PlanType]: string } = {
  basic: '$9.99/month',
  premium: '$19.99/month',
  free: ''
}

export function UserProfile() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  if (!session?.user) {
    return null
  }

  const userPlan = session.user.plan as PlanType

  const handleUpgrade = async (plan: PlanType) => {
    setIsLoading(true)
    try {
      const result = await upgradePlan(session.user.id, plan)
      if (result.success) {
        toast({
          title: 'Success',
          description: `Successfully upgraded to ${plan} plan!`,
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to upgrade plan',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      const result = await cancelPlan(session.user.id)
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Successfully cancelled plan',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to cancel plan',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {session.user.name}
          </CardTitle>
          <CardDescription className="text-center text-lg">
            {session.user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subscription Type</span>
              <span className="font-medium capitalize">{userPlan}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <Card className={`relative ${userPlan === 'free' ? 'border-blue-500 border-2' : ''}`}>
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
            <CardDescription>Get started with basic features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">$0/month</div>
            <ul className="space-y-2">
              {PLAN_FEATURES.free.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Basic Plan */}
        <Card className={`relative ${userPlan === 'basic' ? 'border-blue-500 border-2' : ''}`}>
          <CardHeader>
            <CardTitle>Basic Plan</CardTitle>
            <CardDescription>Perfect for hobbyists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">{PLAN_PRICES.basic}</div>
            <ul className="space-y-2">
              {PLAN_FEATURES.basic.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            {userPlan === 'free' && (
              <Button
                className="w-full mt-4"
                onClick={() => handleUpgrade('basic')}
                disabled={isLoading}
              >
                Upgrade to Basic
              </Button>
            )}
            {userPlan === 'basic' && (
              <Button
                className="w-full mt-4"
                variant="destructive"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel Plan
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className={`relative ${userPlan === 'premium' ? 'border-blue-500 border-2' : ''}`}>
          <div className="absolute -top-2 -right-2">
            <Crown className="w-8 h-8 text-yellow-500" />
          </div>
          <CardHeader>
            <CardTitle>Premium Plan</CardTitle>
            <CardDescription>For professional creators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">{PLAN_PRICES.premium}</div>
            <ul className="space-y-2">
              {PLAN_FEATURES.premium.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            {(userPlan === 'free' || userPlan === 'basic') && (
              <Button
                className="w-full mt-4"
                onClick={() => handleUpgrade('premium')}
                disabled={isLoading}
              >
                Upgrade to Premium
              </Button>
            )}
            {userPlan === 'premium' && (
              <Button
                className="w-full mt-4"
                variant="destructive"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel Plan
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}