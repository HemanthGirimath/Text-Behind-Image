import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { UserPlan } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { plan, paymentId } = body;

    if (!plan || !paymentId) {
      return NextResponse.json(
        { error: 'Plan and payment ID are required' },
        { status: 400 }
      );
    }

    if (!['basic', 'premium'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Calculate subscription end date (30 days from now)
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

    // Update user's plan in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        plan,
        subscriptionEndDate,
        lastPaymentId: paymentId,
        planUpdatedAt: new Date(),
        imagesUsed: 0, // Reset image count for new subscription
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        subscriptionEndDate: true,
      },
    });

    if (!updatedUser) {
      throw new Error('Failed to update user subscription');
    }

    // Convert the plan string to UserPlan type for the response
    const userPlan = updatedUser.plan as UserPlan;

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${userPlan} plan`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        plan: userPlan,
        subscriptionEndDate: updatedUser.subscriptionEndDate,
      },
    });
  } catch (error) {
    console.error('Subscription update error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
