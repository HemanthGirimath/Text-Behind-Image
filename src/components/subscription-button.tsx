'use client'

import { useState } from 'react'
import { Button } from './UI/button'
import { useToast } from './UI/use-toast'
import { useUser } from '@/lib/user-context'
import { updateUserPlan } from '@/app/actions/subscription'
import { UserPlan } from '@/lib/utils'

interface SubscriptionButtonProps {
  plan: UserPlan
  price: number
  buttonText?: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function SubscriptionButton({ plan, price, buttonText = 'Subscribe' }: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { state, dispatch } = useUser()

  const handlePayment = async () => {
    try {
      setLoading(true)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: price * 100, // Amount in paise
        currency: 'INR',
        name: 'TextBehindImage',
        description: `${plan} Plan Subscription`,
        handler: async function (response: any) {
          try {
            // Update the subscription in the database
            const result = await updateUserPlan(plan)

            if (result.success) {
              // Update the user context
              dispatch({
                type: 'LOGIN',
                payload: {
                  ...state.user!,
                  plan: result.user.plan,
                  subscriptionEndDate: result.user.subscriptionEndDate
                }
              })

              toast({
                title: 'Success!',
                description: `Your subscription has been updated to ${plan} plan.`,
              })
            }
          } catch (error) {
            console.error('Error updating subscription:', error)
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Failed to update subscription. Please contact support.',
            })
          }
        },
        prefill: {
          email: state.user?.email,
          name: state.user?.name,
        },
        theme: {
          color: '#0066FF',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Error initiating payment:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to initiate payment. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || (state.user?.plan === plan && state.user?.subscriptionEndDate && new Date(state.user.subscriptionEndDate) > new Date())}
    >
      {loading ? 'Processing...' : buttonText}
    </Button>
  )
}
