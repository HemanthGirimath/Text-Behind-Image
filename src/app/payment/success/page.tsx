'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/UI/use-toast';
import { UserPlan } from '@/lib/utils';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, update: updateSession } = useSession();
  const [isUpdating, setIsUpdating] = useState(true);

  const paymentId = searchParams.get('razorpay_payment_id');
  const planParam = searchParams.get('plan');
  const plan = planParam as UserPlan;

  useEffect(() => {
    if (!paymentId || !plan || !['basic', 'premium'].includes(plan)) {
      router.push('/pricing');
      return;
    }

    const updateSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan, paymentId }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update subscription');
        }

        // Update the session to reflect new plan
        await updateSession();
        
        setIsUpdating(false);
        toast({
          title: 'Success!',
          description: `Your subscription has been upgraded to ${plan} plan.`,
        });

        // Short delay before redirect to ensure session is updated
        setTimeout(() => {
          router.push('/editor');
        }, 2000);
      } catch (error) {
        console.error('Error updating subscription:', error);
        toast({
          title: 'Error',
          description: 'Failed to update subscription. Please contact support.',
          variant: 'destructive',
        });
        setIsUpdating(false);
      }
    };

    updateSubscription();
  }, [paymentId, plan, router, updateSession, toast]);

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-center text-white">
            {isUpdating ? 'Processing Payment...' : 'Payment Successful!'}
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            {isUpdating
              ? 'Please wait while we update your subscription'
              : 'Your subscription has been updated successfully'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          {isUpdating ? (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          ) : (
            <CheckCircle className="h-12 w-12 text-green-500" />
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => router.push('/editor')}
            disabled={isUpdating}
            className="w-full"
          >
            {isUpdating ? 'Please wait...' : 'Continue to Editor'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}