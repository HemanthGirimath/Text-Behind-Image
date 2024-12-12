'use client'

import { useState } from 'react'
import { Button } from '@/components/UI/button'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/UI/use-toast'
import { useRouter } from 'next/navigation'

interface RazorpayButtonProps {
  planType: 'basic' | 'premium'
}

export function RazorpayButton({ planType }: RazorpayButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()

  const handlePayment = async () => {
    if (!session?.user) {
      toast({
        title: 'Error',
        description: 'Please login to continue',
        variant: 'destructive'
      })
      return
    }

    try {
      setIsLoading(true)
      console.log('Creating order...')

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
        console.error('Order creation failed:', error)
        throw new Error(error.error || 'Failed to create order')
      }

      const order = await orderResponse.json()
      console.log('Order created:', order)

      // Build callback URL with origin
      const origin = window.location.origin
      const callbackUrl = new URL('/api/razorpay/callback', origin)
      
      // Add success and error redirect URLs
      const successUrl = new URL('/upgrade', origin)
      successUrl.searchParams.set('success', 'true')
      
      const errorUrl = new URL('/upgrade', origin)
      errorUrl.searchParams.set('error', 'Payment failed')

      // Redirect to Razorpay checkout page
      const checkoutUrl = new URL('https://checkout.razorpay.com/v1/checkout.html')
      checkoutUrl.searchParams.set('key', order.keyId)
      checkoutUrl.searchParams.set('amount', order.amount.toString())
      checkoutUrl.searchParams.set('currency', order.currency)
      checkoutUrl.searchParams.set('name', 'Text Behind Image')
      checkoutUrl.searchParams.set('description', `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`)
      checkoutUrl.searchParams.set('order_id', order.orderId)
      checkoutUrl.searchParams.set('prefill[name]', session.user.name || '')
      checkoutUrl.searchParams.set('prefill[email]', session.user.email || '')
      checkoutUrl.searchParams.set('callback_url', callbackUrl.toString())
      checkoutUrl.searchParams.set('redirect', 'true')
      checkoutUrl.searchParams.set('handler_url', callbackUrl.toString())
      checkoutUrl.searchParams.set('success_url', successUrl.toString())
      checkoutUrl.searchParams.set('cancel_url', errorUrl.toString())

      console.log('Redirecting to checkout:', checkoutUrl.toString())
      window.location.href = checkoutUrl.toString()
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Payment failed',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? 'Processing...' : `Upgrade to ${planType.charAt(0).toUpperCase() + planType.slice(1)}`}
    </Button>
  )
} 