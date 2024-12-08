'use client'

import { Check, Lock } from 'lucide-react'
import { Button } from '@/components/UI/button'
import { Card } from '@/components/UI/card'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/user-context'

const features = {
  free: [
    'Basic text input',
    '5 basic fonts',
    'Simple positioning (x, y coordinates)',
    'Basic color selection',
    'Single text layer'
  ],
  basic: [
    'Everything in Free plan',
    'Unlimited fonts',
    'Multiple text layers (up to 3)',
    'Text styling (Bold/Italic/Underline)',
    'Letter spacing',
    'Opacity',
    'Text alignment options',
    'Rotation'
  ],
  premium: [
    'Everything in Basic plan',
    'Shadows',
    'Gradients',
    'Glow effects',
    'Outlines',
    'Transform options (skew, scale)',
    'Unlimited text layers'
  ],
  comingSoon: [
    'AI Text Style Generation',
    'Smart Image Enhancement',
    'AI Background Removal',
    'Smart Layout Suggestions',
    'Text Effect Templates'
  ]
}

export default function PricingPage() {
  const router = useRouter()
  const { state } = useUser()

  return (
    <div className="container py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground">Choose the plan that&apos;s right for you</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Free Plan */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Free</h2>
            <p className="text-3xl font-bold mt-2">$0</p>
            <p className="text-sm text-muted-foreground">Forever free</p>
          </div>
          <div className="space-y-4 mb-6">
            {features.free.map((feature, i) => (
              <div key={i} className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Button 
            className="w-full" 
            variant={state.isAuthenticated ? "secondary" : "default"}
            onClick={() => router.push(state.isAuthenticated ? '/editor' : '/signup')}
          >
            {state.isAuthenticated ? 'Go to Editor' : 'Get Started'}
          </Button>
        </Card>

        {/* Basic Plan */}
        <Card className="p-6 border-blue-500">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Basic</h2>
            <p className="text-3xl font-bold mt-2">$9.99</p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
          <div className="space-y-4 mb-6">
            {features.basic.map((feature, i) => (
              <div key={i} className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Button 
            className="w-full" 
            onClick={() => router.push(state.isAuthenticated ? '/upgrade' : '/signup')}
          >
            {state.isAuthenticated ? 'Upgrade Now' : 'Get Started'}
          </Button>
        </Card>

        {/* Premium Plan */}
        <Card className="p-6 border-purple-500">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Premium</h2>
            <p className="text-3xl font-bold mt-2">$19.99</p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
          <div className="space-y-4 mb-6">
            {features.premium.map((feature, i) => (
              <div key={i} className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Button 
            className="w-full" 
            variant="default"
            onClick={() => router.push(state.isAuthenticated ? '/upgrade' : '/signup')}
          >
            {state.isAuthenticated ? 'Upgrade Now' : 'Get Started'}
          </Button>
        </Card>
      </div>

      {/* Coming Soon Features */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Coming Soon</h2>
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {features.comingSoon.map((feature, i) => (
              <div key={i} className="flex items-center">
                <Lock className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}