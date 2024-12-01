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
}

export async function createOrder(planType: 'pro' | 'enterprise'): Promise<OrderResponse> {
  const amount = planType === 'pro' ? 299 : 499; // Amount in INR

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
  userEmail: string
): Promise<VerifyResponse> {
  const text = orderId + '|' + paymentId;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest('hex');

  if (generated_signature === signature) {
    try {
      // Get order details to know which plan was purchased
      const order = await razorpay.orders.fetch(orderId);
      const planType = order.amount === 29900 ? 'pro' : 'enterprise';
      
      // Update user plan in database
      await prisma.user.update({
        where: { email: userEmail },
        data: { plan: planType },
      });

      return { verified: true };
    } catch (error) {
      console.error('Error updating user plan:', error);
      return { verified: false, error: 'Failed to update user plan' };
    }
  }
  
  return { verified: false, error: 'Invalid payment signature' };
}