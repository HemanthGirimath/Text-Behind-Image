import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function checkPlanMiddleware(request: NextRequest) {
  try {
    // Get the token
    const token = await getToken({ req: request });
    
    if (!token?.sub) {
      return NextResponse.next();
    }

    // Get user plan from the token instead of querying the database
    const userPlan = (token as any)?.activePlan || 'free';

    // Add plan info to response headers
    const response = NextResponse.next();
    response.headers.set('x-user-plan', userPlan);
    return response;
  } catch (error) {
    console.error('Plan check middleware error:', error);
    return NextResponse.next();
  }
}
