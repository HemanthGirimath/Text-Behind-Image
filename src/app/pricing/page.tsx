'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createOrder } from '../actions/payment';
import { useToast } from '@/components/UI/use-toast';
import { useUser } from '@/lib/user-context';
import { UserPlan } from '@/lib/utils';
import { updateUserPlan } from '../actions/subscription';

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
  const { toast } = useToast();
  const { state, dispatch } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (selectedPlan: UserPlan, price: number) => {
    if (!state.isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to a plan.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    try {
      setLoading(true);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: price * 100,
        currency: "INR",
        name: "TextBehindImage",
        description: `${selectedPlan} Plan Subscription`,
        prefill: {
          email: state.user?.email,
          name: state.user?.name,
        },
        theme: {
          color: "#0066FF",
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        handler: async function(response: any) {
          try {
            if (response.razorpay_payment_id) {
              const result = await updateUserPlan(selectedPlan);

              if (result.success) {
                // Ensure the plan is of type UserPlan
                const updatedPlan = result.user.plan as UserPlan;
                
                dispatch({
                  type: 'LOGIN',
                  payload: {
                    ...state.user!,
                    plan: updatedPlan,
                    subscriptionEndDate: result.user.subscriptionEndDate
                  }
                });

                toast({
                  title: "Success!",
                  description: `Your subscription has been updated to ${selectedPlan} plan.`,
                });

                router.push('/profile');
              }
            }
          } catch (error) {
            console.error('Error updating subscription:', error);
            toast({
              title: "Update Failed",
              description: "Failed to update subscription. Please contact support.",
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose your plan</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Select the perfect plan for your needs
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Free Tier */}
        <div className="flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-muted/10 sm:p-10">
          <div>
            <h3 className="text-base font-semibold leading-7 text-primary">Free</h3>
            <div className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight">$0</span>
              <span className="text-base text-muted-foreground">/month</span>
            </div>
            <ul role="list" className="mt-8 space-y-3">
              <Feature available={true}>3 image generations per month</Feature>
              <Feature available={true}>5 basic fonts</Feature>
              <Feature available={true}>Basic text editing</Feature>
              <Feature available={false}>Image adjustments</Feature>
              <Feature available={false}>Multiple text layers</Feature>
              <Feature available={false}>AI features</Feature>
            </ul>
          </div>
          <Link
            href="/signup"
            className="mt-8 block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Get started for free
          </Link>
        </div>

        {/* Basic Tier */}
        <div className="flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-primary/30 sm:p-10">
          <div>
            <h3 className="text-base font-semibold leading-7 text-primary">Basic</h3>
            <div className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight">$9</span>
              <span className="text-base text-muted-foreground">/month</span>
            </div>
            <ul role="list" className="mt-8 space-y-3">
              <Feature available={true}>Unlimited image generations</Feature>
              <Feature available={true}>All fonts</Feature>
              <Feature available={true}>Advanced text editing</Feature>
              <Feature available={true}>Image adjustments</Feature>
              <Feature available={true}>Multiple text layers</Feature>
              <Feature available={false}>AI features</Feature>
            </ul>
          </div>
          <button
            onClick={() => handlePayment('basic', 9)}
            disabled={loading}
            className="mt-8 block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Subscribe to Basic'}
          </button>
        </div>

        {/* Premium Tier */}
        <div className="flex flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-muted/10 sm:p-10">
          <div>
            <h3 className="text-base font-semibold leading-7 text-primary">Premium</h3>
            <div className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight">$19</span>
              <span className="text-base text-muted-foreground">/month</span>
            </div>
            <ul role="list" className="mt-8 space-y-3">
              <Feature available={true}>Everything in Basic</Feature>
              <Feature available={true}>AI background removal</Feature>
              <Feature available={true}>AI image enhancement</Feature>
              <Feature available={true}>Priority support</Feature>
              <Feature available={true}>Early access to new features</Feature>
            </ul>
          </div>
          <button
            onClick={() => handlePayment('premium', 19)}
            disabled={loading}
            className="mt-8 block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Subscribe to Premium'}
          </button>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Test Mode: Use card number 4111 1111 1111 1111, any future expiry date, and any CVV</p>
      </div>
    </div>
  );
}