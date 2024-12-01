'use client'

import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { useToast } from '@/components/UI/use-toast'
import { createOrder, verifyPayment } from '../actions/payment'
import { useUser } from '@/lib/user-context'
import { useRouter } from 'next/navigation'

interface FeatureProps {
  children: ReactNode;
  available?: boolean;
}

const PricingPage = () => {
  const { toast } = useToast()
  const router = useRouter()
  const { state } = useUser()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handlePayment = async (planType: 'pro' | 'enterprise') => {
    if (!state.isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to upgrade your plan",
        variant: "destructive"
      })
      router.push('/login')
      return
    }

    try {
      setIsLoading(planType)
      const order = await createOrder(planType)
      
      const options: Razorpay.RazorpayOptions = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Manga Reading',
        description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan Subscription`,
        order_id: order.orderId,
        handler: async function (response) {
          try {
            const result = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              state.email!
            )

            if (result.verified) {
              toast({
                title: "Payment Successful",
                description: "Your plan has been upgraded!",
              })
              router.refresh()
            } else {
              toast({
                title: "Payment Verification Failed",
                description: result.error || "Please contact support if the issue persists",
                variant: "destructive"
              })
            }
          } catch (error) {
            toast({
              title: "Verification Error",
              description: "Failed to verify payment. Please contact support.",
              variant: "destructive"
            })
          }
        },
        prefill: {
          name: state.name,
          email: state.email,
        },
        theme: {
          color: '#6366f1',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your manga reading needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="relative rounded-2xl bg-background p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground">Perfect for getting started</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">₹0</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <Feature available>Access to free manga</Feature>
              <Feature available>Basic reading features</Feature>
              <Feature available>Standard quality</Feature>
              <Feature>Ad-free experience</Feature>
              <Feature>Offline reading</Feature>
              <Feature>Early access</Feature>
            </ul>
            <Link 
              href="/manga" 
              className="block w-full py-3 px-6 rounded-lg text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative rounded-2xl bg-background p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="absolute -top-5 right-8">
              <span className="bg-primary px-3 py-1 text-sm rounded-full text-primary-foreground">
                Popular
              </span>
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground">Perfect for manga enthusiasts</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">₹299</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Billed monthly</p>
            </div>
            <ul className="space-y-4 mb-8">
              <Feature available>Everything in Free</Feature>
              <Feature available>Ad-free experience</Feature>
              <Feature available>HD quality</Feature>
              <Feature available>Offline reading</Feature>
              <Feature available>Early access</Feature>
              <Feature>Custom reading lists</Feature>
            </ul>
            <button 
              onClick={() => handlePayment('pro')}
              disabled={isLoading === 'pro'}
              className={`block w-full py-3 px-6 rounded-lg text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ${
                isLoading === 'pro' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading === 'pro' ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="relative rounded-2xl bg-background p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
            <div className="absolute -top-5 right-8">
              <span className="bg-secondary px-3 py-1 text-sm rounded-full">
                Best Value
              </span>
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground">For the ultimate experience</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">₹499</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Save 20% with annual billing
              </p>
            </div>
            <ul className="space-y-4 mb-8">
              <Feature available>Everything in Pro</Feature>
              <Feature available>Early access to new manga</Feature>
              <Feature available>Custom reading lists</Feature>
              <Feature available>Priority support</Feature>
              <Feature available>Exclusive content</Feature>
              <Feature available>API access</Feature>
            </ul>
            <button
              onClick={() => handlePayment('enterprise')}
              disabled={isLoading === 'enterprise'}
              className={`block w-full py-3 px-6 rounded-lg text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ${
                isLoading === 'enterprise' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading === 'enterprise' ? 'Processing...' : 'Upgrade to Enterprise'}
            </button>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Contact us for custom enterprise solutions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Feature({ children, available = false }: FeatureProps) {
  return (
    <li className="flex items-center space-x-3">
      {available ? (
        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        <X className="h-5 w-5 text-red-500 flex-shrink-0" />
      )}
      <span className={available ? 'text-foreground' : 'text-muted-foreground'}>
        {children}
      </span>
    </li>
  )
}

export default PricingPage