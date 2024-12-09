import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/app/actions/payment';

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentId, signature, userId, planType } = await request.json();

    const result = await verifyPayment(
      orderId,
      paymentId,
      signature,
      userId,
      planType
    );

    if (!result.verified) {
      return NextResponse.json(
        { error: result.error || 'Payment verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
