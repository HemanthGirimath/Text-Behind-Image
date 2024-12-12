import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const session = event.data.object;

  if (event.type === 'checkout.session.completed') {
    // Update user's subscription in database
    const userId = session.metadata.userId;
    const planName = session.metadata.planName;

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: planName,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
      },
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    // Downgrade user to free plan when subscription is cancelled
    const subscription = event.data.object;
    await prisma.user.update({
      where: { stripeSubscriptionId: subscription.id },
      data: { plan: 'Free' },
    });
  }

  return NextResponse.json({ received: true });
}
