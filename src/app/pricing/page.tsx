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
  const { toast } = useToast();
  const { state } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: 'basic' | 'premium') => {
    if (!state?.user?.email) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder(plan);
      if (order.url) {
        window.location.href = order.url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subscription",
        variant: "destructive",
      });
    } finally {
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
            onClick={() => handleSubscribe('basic')}
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
            onClick={() => handleSubscribe('premium')}
            disabled={loading}
            className="mt-8 block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Subscribe to Premium'}
          </button>
        </div>
      </div>
    </div>
  );
}