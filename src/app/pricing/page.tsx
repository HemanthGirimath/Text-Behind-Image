'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createOrder } from '../actions/payment';
import { useToast } from '@/components/UI/use-toast';
import { useUser } from '@/lib/user-context';

interface FeatureProps {
  children: React.ReactNode;
  available?: boolean;
}

function Feature({ children, available }: FeatureProps) {
  return (
    <li className={`flex items-center gap-2 ${available ? 'text-foreground' : 'text-muted-foreground'}`}>
      {available ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      )}
      {children}
    </li>
  );
}

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<'pro' | 'enterprise' | null>(null);
  const { toast } = useToast();
  const { state } = useUser();

  const handlePayment = async (planType: 'pro' | 'enterprise') => {
    if (!state?.user?.email) {
      toast({
        title: "Not logged in",
        description: "Please log in to upgrade your plan",
        variant: "destructive",
      });
      return;
    }

    // Store user email to ensure it's available throughout the function
    const userEmail = state.user.email;

    try {
      setIsLoading(planType);
      const order = await createOrder(planType);

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Manga Reading',
        description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan Subscription`,
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            const verificationResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                email: userEmail,
              }),
            });

            const data = await verificationResponse.json();

            if (data.verified) {
              toast({
                title: "Payment successful",
                description: `You have been upgraded to ${planType} plan`,
              });
            } else {
              toast({
                title: "Payment verification failed",
                description: data.error || "Please contact support",
                variant: "destructive",
              });
            }
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to verify payment",
              variant: "destructive",
            });
          }
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: '#10b981',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payment order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container py-8 md:py-20 px-4 md:px-6">
      <div className="text-center mb-8 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">Simple, transparent pricing</h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Choose the plan that best suits your reading needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        {/* Free Tier */}
        <div className="relative rounded-2xl bg-background p-6 md:p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Free</h3>
            <p className="text-sm md:text-base text-muted-foreground">Perfect for getting started</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl md:text-4xl font-bold">₹0</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>
          </div>
          <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <Feature available>Access to free manga</Feature>
            <Feature available>Basic reading features</Feature>
            <Feature available>Standard quality</Feature>
            <Feature>Ad-free experience</Feature>
            <Feature>Offline reading</Feature>
            <Feature>Early access</Feature>
          </ul>
          <Link 
            href="/manga" 
            className="block w-full py-4 md:py-3 px-6 rounded-lg text-center text-base md:text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors touch-manipulation"
          >
            Get Started
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="relative rounded-2xl bg-background p-6 md:p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
          <div className="absolute -top-3 md:-top-5 right-4 md:right-8">
            <span className="bg-primary px-3 py-1 text-sm rounded-full text-primary-foreground">
              Popular
            </span>
          </div>
          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Pro</h3>
            <p className="text-sm md:text-base text-muted-foreground">Perfect for manga enthusiasts</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl md:text-4xl font-bold">₹299</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Billed monthly</p>
          </div>
          <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
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
            className={`block w-full py-4 md:py-3 px-6 rounded-lg text-center text-base md:text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors touch-manipulation ${
              isLoading === 'pro' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading === 'pro' ? 'Processing...' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Enterprise Tier */}
        <div className="relative rounded-2xl bg-background p-6 md:p-8 shadow-lg border border-border hover:shadow-xl transition-shadow">
          <div className="absolute -top-3 md:-top-5 right-4 md:right-8">
            <span className="bg-secondary px-3 py-1 text-sm rounded-full">
              Best Value
            </span>
          </div>
          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-sm md:text-base text-muted-foreground">For the ultimate experience</p>
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl md:text-4xl font-bold">₹499</span>
              <span className="text-muted-foreground ml-2">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Save 20% with annual billing
            </p>
          </div>
          <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
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
            className={`block w-full py-4 md:py-3 px-6 rounded-lg text-center text-base md:text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors touch-manipulation ${
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
  );
}