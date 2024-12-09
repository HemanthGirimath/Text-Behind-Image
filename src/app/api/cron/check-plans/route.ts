import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Find all users with expired plans
    const expiredUsers = await prisma.user.findMany({
      where: {
        AND: [
          { planEndDate: { not: null } },
          { planEndDate: { lt: new Date() } },
          { plan: { not: 'free' } }
        ]
      }
    });

    // Reset expired plans to free
    const updates = expiredUsers.map(user =>
      prisma.user.update({
        where: { id: user.id },
        data: {
          plan: 'free',
          planEndDate: null
        }
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({
      success: true,
      message: `Reset ${expiredUsers.length} expired plans`,
      expiredCount: expiredUsers.length
    });
  } catch (error) {
    console.error('Plan check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check plans' },
      { status: 500 }
    );
  }
}
