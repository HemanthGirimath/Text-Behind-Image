import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { PLAN_FEATURES } from '@/lib/subscription';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentCount = user.imagesUsed || 0;
    const planLimit = PLAN_FEATURES[user.plan].maxImages;

    if (currentCount >= planLimit) {
      return NextResponse.json(
        { error: 'Image limit reached for your plan' },
        { status: 403 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { imagesUsed: currentCount + 1 }
    });

    return NextResponse.json({
      success: true,
      imagesUsed: currentCount + 1,
      remaining: planLimit - (currentCount + 1)
    });

  } catch (error) {
    console.error('Error updating image count:', error);
    return NextResponse.json(
      { error: 'Failed to update image count' },
      { status: 500 }
    );
  }
}