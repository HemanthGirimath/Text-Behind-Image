'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { RazorpayButton } from '@/components/payment/RazorpayButton'
import { useToast } from '@/components/UI/use-toast'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { Crown } from 'lucide-react'

export default function UpgradePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, update: updateSession } = useSession()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Handle success/error messages from Razorpay callback
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success) {
      // Force session update to get the new plan
      updateSession()
      toast({
        title: 'Success',
        description: 'Your plan has been upgraded successfully!',
      })
      router.replace('/upgrade')
    } else if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive'
      })
      router.replace('/upgrade')
    }
  }, [searchParams, toast, router, updateSession])

  const basicFeatures = [
    '✓ Multiple text layers',
    '✓ Basic text styling',
    '✓ Custom colors',
    '✓ Letter spacing',
    '✓ Text rotation',
    '✓ Opacity control',
    '✓ Font selection',
    '✓ Basic positioning'
  ]

  const premiumFeatures = [
    '✓ All Basic features',
    '✓ Advanced text effects',
    '✓ Shadow effects',
    '✓ Gradient text',
    '✓ Transform options (skew, scale)',
    '✓ Multiple text layers',
    '✓ Advanced positioning',
    '✓ Premium fonts',
    '✓ Export in high quality',
    '✓ Priority support'
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Plan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <div className="border rounded-lg p-6 bg-card flex flex-col h-full">
          <div className="flex-grow">
            <h2 className="text-2xl font-semibold mb-4">Basic Plan</h2>
            <p className="text-gray-600 mb-4">Perfect for getting started</p>
            <ul className="space-y-2 mb-6">
              {basicFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{feature.substring(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto">
            <p className="text-2xl font-bold mb-6">₹900/month</p>
            <RazorpayButton planType="basic" />
          </div>
        </div>

        {/* Premium Plan */}
        <div className="relative border-2 border-primary rounded-lg p-6 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg flex flex-col h-full">
          <div className="absolute -top-3 -right-3 bg-primary rounded-full p-1">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-primary text-white text-sm px-3 py-0.5 rounded-full">
            Most Popular
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-semibold mb-4 mt-4">Premium Plan</h2>
            <p className="text-gray-600 mb-4">For professional creators</p>
            <ul className="space-y-2 mb-6">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>{feature.substring(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto">
            <p className="text-2xl font-bold mb-6">₹1900/month</p>
            <RazorpayButton planType="premium" />
          </div>
        </div>
      </div>
    </div>
  )
}
