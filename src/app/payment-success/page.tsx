'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/UI/use-toast'
import { Loader2 } from 'lucide-react'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { update: updateSession } = useSession()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('orderId')
        const paymentId = searchParams.get('paymentId')
        const signature = searchParams.get('signature')
        const planType = searchParams.get('planType')

        if (!orderId || !paymentId || !signature || !planType) {
          throw new Error('Missing payment parameters')
        }

        // Verify payment with backend
        const response = await fetch('/api/razorpay', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            paymentId,
            signature,
            planType
          })
        })

        if (!response.ok) {
          throw new Error('Payment verification failed')
        }

        // Force session update
        await updateSession()

        // Wait for session to update
        await new Promise(resolve => setTimeout(resolve, 2000))

        toast({
          title: 'Payment Successful!',
          description: 'Your plan has been upgraded successfully.',
          duration: 5000,
        })

        // Redirect to profile with force reload
        window.location.href = '/profile'
      } catch (error) {
        console.error('Payment verification error:', error)
        toast({
          title: 'Error',
          description: 'Failed to verify payment. Please contact support.',
          variant: 'destructive',
          duration: 5000,
        })
        setIsProcessing(false)
      }
    }

    verifyPayment()
  }, [searchParams, updateSession, toast, router])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        <h1 className="text-2xl font-bold">Processing Your Payment</h1>
        <p className="text-muted-foreground">
          Please wait while we verify your payment and update your account...
        </p>
      </div>
    </div>
  )
}