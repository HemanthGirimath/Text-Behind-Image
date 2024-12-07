'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createOrder, verifyPayment, type PlanType } from '@/app/actions/payment';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/UI/card';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import type { RazorpayResponse, RazorpayOptions } from '@/types/razorpay';

declare global {
  interface Window {
    Razorpay: {
      (options: RazorpayOptions): { open(): void };
      new (options: RazorpayOptions): { open(): void };
    };
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = searchParams.get('plan') as PlanType;
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!plan || !session?.user?.email) {
      router.push('/pricing');
      return;
    }

    const loadRazorpay = async () => {
      return new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, [plan, router, session?.user?.email]);

  const handlePaymentVerification = async (response: RazorpayResponse) => {
    try {
      if (!session?.user?.email) {
        throw new Error('User not authenticated');
      }

      const result = await verifyPayment(
        response.razorpay_order_id,
        response.razorpay_payment_id,
        response.razorpay_signature,
        session.user.email
      );

      if (result.verified) {
        router.push(`/payment/success?reference=${response.razorpay_payment_id}`);
      } else {
        setError(result.error || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Payment verification failed. Please contact support.');
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const order = await createOrder(plan);

      const options: RazorpayOptions = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Text Behind Image',
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
        order_id: order.orderId,
        handler: handlePaymentVerification,
        prefill: {
          name: session?.user?.name || undefined,
          email: session?.user?.email || undefined,
        },
        theme: {
          color: '#6366f1',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const planDetails = {
    basic: {
      name: 'Basic Plan',
      price: '₹900/month',
      features: [
        'All basic text effects',
        'Up to 50 images per month',
        'Standard support',
      ],
    },
    premium: {
      name: 'Premium Plan',
      price: '₹1900/month',
      features: [
        'All advanced text effects',
        'Unlimited images',
        'Priority support',
        'Custom fonts',
      ],
    },
  } as const;

  const selectedPlan = plan && plan !== 'free' ? planDetails[plan] : null;

  if (!selectedPlan) {
    return null;
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{selectedPlan.name}</CardTitle>
          <CardDescription>Complete your subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-2xl font-bold">{selectedPlan.price}</div>
            <ul className="space-y-2">
              {selectedPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            className="w-full" 
            onClick={handlePayment}
            disabled={loading || !session?.user?.email}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : !session?.user?.email ? (
              'Please sign in to continue'
            ) : (
              'Proceed to Payment'
            )}
          </Button>
          {error && (
            <div className="text-red-500 text-sm text-center w-full">{error}</div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}