'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/UI/use-toast'
import { createOrder } from '@/app/actions/payment'
import { Button } from '@/components/UI/button'
import { PLAN_FEATURES, FEATURE_DESCRIPTIONS } from '@/lib/plans'

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    email: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function UpgradePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!session?.user) {
      router.push('/login')
      return
    }

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [session, router])

  const handlePayment = async (planType: 'basic' | 'premium') => {
    try {
      setIsLoading(true)
      const order = await createOrder(planType)

      const options: RazorpayOptions = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Text Behind Image',
        description: `Upgrade to ${planType} plan`,
        order_id: order.orderId,
        handler: function (response: RazorpayResponse) {
          // Verify payment on the server
          fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }),
          })
          .then(res => {
            if (!res.ok) {
              throw new Error('Payment verification failed')
            }
            return res.json()
          })
          .then(data => {
            toast({
              title: 'Payment Successful',
              description: `Your account has been upgraded to ${planType} plan!`,
            })
            router.refresh()
            router.push('/editor')
          })
          .catch(error => {
            console.error('Payment verification error:', error)
            toast({
              title: 'Payment Failed',
              description: error.message,
              variant: 'destructive',
            })
          })
        },
        prefill: {
          email: session?.user?.email || '',
        },
        theme: {
          color: '#0066FF',
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Upgrade Your Plan</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Basic Plan</h2>
          <p className="text-3xl font-bold mb-4">₹900<span className="text-sm font-normal">/month</span></p>
          <ul className="space-y-2 mb-6">
            {PLAN_FEATURES.basic.map((feature) => (
              <li key={feature} className="flex items-center">
                <span className="mr-2">✓</span>
                {FEATURE_DESCRIPTIONS[feature]}
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            onClick={() => handlePayment('basic')}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Upgrade to Basic'}
          </Button>
        </div>

        {/* Premium Plan */}
        <div className="border rounded-lg p-6 shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-50 border-blue-200">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Premium Plan</h2>
          <p className="text-3xl font-bold mb-4 text-blue-900">₹1900<span className="text-sm font-normal text-blue-600">/month</span></p>
          <ul className="space-y-2 mb-6">
            {PLAN_FEATURES.premium.map((feature) => (
              <li key={feature} className="flex items-center text-blue-700">
                <span className="mr-2 text-blue-500">✓</span>
                {FEATURE_DESCRIPTIONS[feature]}
              </li>
            ))}
          </ul>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handlePayment('premium')}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Upgrade to Premium'}
          </Button>
        </div>
      </div>
    </div>
  )
}
