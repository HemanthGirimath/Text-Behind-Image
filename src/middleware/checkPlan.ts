import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

export async function checkPlanMiddleware(request: NextRequest) {
  try {
    // Get the token
    const token = await getToken({ req: request });
    
    if (!token?.sub) {
      return NextResponse.next();
    }

    // Check if user's plan is expired
    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      select: { plan: true, planEndDate: true }
    });

    if (!user) {
      return NextResponse.next();
    }

    // If plan is expired, reset to free
    if (user.planEndDate && user.planEndDate < new Date() && user.plan !== 'free') {
      await prisma.user.update({
        where: { id: token.sub },
        data: {
          plan: 'free',
          planEndDate: null
        }
      });

      // Modify the response to include updated plan info
      const response = NextResponse.next();
      response.headers.set('x-plan-expired', 'true');
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Plan check middleware error:', error);
    return NextResponse.next();
  }
}
