'use server'

import Razorpay from 'razorpay'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { URL } from 'url'
import { UserPlan } from '@/lib/utils'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  url: string;
}

interface VerifyResponse {
  verified: boolean;
  error?: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  notes?: Record<string, string>;
}

interface RazorpayOrderCreateOptions {
  amount: number;
  currency: string;
  receipt: string;
  payment_capture?: 0 | 1;
  notes?: Record<string, string>;
}

export async function createOrder(planType: UserPlan): Promise<OrderResponse> {
  if (planType === 'free') {
    throw new Error('Free plan does not require payment');
  }

  const amount = planType === 'basic' ? 900 : 1900;

  try {
    const orderOptions: RazorpayOrderCreateOptions = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        planType
      }
    };

    const order = await razorpay.orders.create(orderOptions) as RazorpayOrder;
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const checkoutUrl = new URL('/checkout', baseUrl);
    checkoutUrl.searchParams.set('orderId', order.id);
    checkoutUrl.searchParams.set('plan', planType);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID!,
      url: checkoutUrl.toString()
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string,
  userEmail: string
): Promise<VerifyResponse> {
  try {
    const text = orderId + "|" + paymentId;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    if (generated_signature !== signature) {
      return { verified: false, error: 'Invalid signature' };
    }

    const order = await razorpay.orders.fetch(orderId) as RazorpayOrder;
    const planType = (order.notes?.planType as UserPlan) || 'basic';

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const updateData = {
      plan: planType,
      subscriptionEndDate: thirtyDaysFromNow
    } as const;

    await prisma.user.update({
      where: { email: userEmail },
      data: updateData
    });

    return { verified: true };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { verified: false, error: 'Payment verification failed' };
  }
}