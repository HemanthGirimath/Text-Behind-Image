import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { checkPlanStatus } from './app/actions/plans'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // If user is not logged in, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
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
    '/api/premium/:path*',
  ],
}
