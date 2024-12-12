'use client'

import { useSession } from 'next-auth/react'
import { Button } from '@/components/UI/button'
import { Crown, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/UI/use-toast'
import Script from 'next/script'
import { useCallback, useState } from 'react'
import type { RazorpayOptions, RazorpayResponse, RazorpayOrder } from '@/types/razorpay'

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  const handleScriptLoad = useCallback(() => {
    setIsScriptLoaded(true)
  }, [])

  const handleUpgrade = async (planType: 'basic' | 'premium') => {
    if (!session?.user) {
      toast({
        title: 'Error',
        description: 'Please login to continue',
        variant: 'destructive'
      })
      router.push('/login')
      return
    }

    // Check if user is already on the same or higher plan
    if (session.user.plan === 'premium' || 
       (session.user.plan === 'basic' && planType === 'basic')) {
      toast({
        title: 'Already Subscribed',
        description: 'You are already subscribed to this plan or a higher tier',
        variant: 'destructive'
      })
      return
    }

    if (!isScriptLoaded) {
      toast({
        title: 'Error',
        description: 'Payment system is loading. Please try again.',
        variant: 'destructive'
      })
      return
    }

    try {
      // Create order through API
      const orderResponse = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType })
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const order: { keyId: string; orderId: string; amount: number; currency: string } = await orderResponse.json()

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Text Behind Image',
        description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`,
        order_id: order.orderId,
        prefill: {
          name: session.user.name || '',
          email: session.user.email || '',
        },
        handler: async function(response: RazorpayResponse) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planType
              })
            })

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed')
            }

            toast({
              title: 'Success',
              description: 'Payment successful! Your plan has been upgraded.',
            })

            router.refresh()
          } catch (error) {
            console.error('Verification error:', error)
            toast({
              title: 'Error',
              description: 'Payment verification failed. Please contact support.',
              variant: 'destructive'
            })
          }
        },
        modal: {
          ondismiss: function() {
            toast({
              title: 'Info',
              description: 'Payment cancelled',
            })
          }
        },
        theme: {
          color: '#0F172A'
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Payment failed',
        variant: 'destructive'
      })
    }
  }

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      description: 'Perfect for trying out',
      features: [
        'Basic text styling',
        'Single text layer',
        'Limited fonts',
        'Basic export options',
        'Community support'
      ],
      action: session ? 'Current Plan' : 'Get Started',
      disabled: true
    },
    {
      name: 'Basic',
      price: '₹900',
      period: '/month',
      description: 'Great for regular use',
      features: [
        'Multiple text layers',
        'Advanced text styling',
        'Custom colors',
        'Shadow effects',
        'Export in HD',
        'Email support'
      ],
      action: 'Upgrade to Basic',
      onClick: () => handleUpgrade('basic')
    },
    {
      name: 'Premium',
      price: '₹1900',
      period: '/month',
      description: 'For professional creators',
      popular: true,
      features: [
        'All Basic features',
        'Unlimited text layers',
        'Premium fonts',
        'Advanced effects',
        'Priority support',
        'Early access to features'
      ],
      action: 'Upgrade to Premium',
      onClick: () => handleUpgrade('premium')
    }
  ]

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={handleScriptLoad}
      />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 shadow-lg ${
                  plan.popular ? 'border-primary' : ''
                }`}
              >
                {plan.popular && (
                  <>
                    <div className="absolute -top-3 -right-3 bg-primary rounded-full p-1">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-primary text-white text-sm px-3 py-0.5 rounded-full">
                      Most Popular
                    </div>
                  </>
                )}

                <div className="mt-4">
                  <h3 className="text-lg font-semibold leading-6">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <p className="mt-4">
                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm font-semibold text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </p>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-primary shrink-0" />
                        <span className="ml-3 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="mt-8 w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    disabled={plan.disabled}
                    onClick={plan.onClick}
                  >
                    {plan.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}