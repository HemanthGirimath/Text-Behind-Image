import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { checkPlanStatus } from './app/actions/plans'
import { checkPlanMiddleware } from './middleware/checkPlan'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // If user is not logged in, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check plan status
  const planCheckResponse = await checkPlanMiddleware(request);
  
  // If plan check modified the response, return it
  if (planCheckResponse.headers.has('x-plan-expired')) {
    return planCheckResponse;
  }

  // Check if accessing premium features
  if (request.nextUrl.pathname.startsWith('/api/premium')) {
    const planStatus = await checkPlanStatus(token.sub!)
    if (!planStatus.success || planStatus.plan === 'free') {
      return new NextResponse(
        JSON.stringify({ error: 'Premium plan required' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/editor/:path*',
    '/api/((?!auth|cron|webhook).*)/:path*'
  ]
}
