'use server'

import Razorpay from 'razorpay'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import crypto from 'crypto'

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

export async function createOrder(planType: 'basic' | 'premium'): Promise<OrderResponse> {
  const amount = planType === 'basic' ? 900 : 1900; // Amount in cents ($9 or $19)

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID!,
      url: `/api/checkout?plan=${planType}` // Added url for redirect
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

interface VerifyResponse {
  verified: boolean;
  error?: string;
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string,
  userId: string,
  planType: 'basic' | 'premium'
): Promise<VerifyResponse> {
  try {
    const headersList = headers();
    const host = headersList.get('host');

    // Verify payment signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === signature;

    if (!isValid) {
      return { verified: false, error: 'Invalid payment signature' };
    }

    // Update user's plan in database
    const planEndDate = new Date();
    planEndDate.setDate(planEndDate.getDate() + 30); // 30 days subscription

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: planType,
        planStartDate: new Date(),
        planEndDate: planEndDate,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId,
        orderId,
        paymentId,
        amount: planType === 'basic' ? 900 : 1900,
        planType,
        status: 'completed'
      }
    });

    return { verified: true };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { verified: false, error: 'Payment verification failed' };
  }
}