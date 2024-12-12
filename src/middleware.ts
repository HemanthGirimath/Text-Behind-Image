import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/', '/login', '/register', '/api/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Verify the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // Redirect to login if no token and trying to access protected route
  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', encodeURIComponent(pathname))
    return NextResponse.redirect(url)
  }

  // Allow access to protected routes if authenticated
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication endpoints)
     * 2. /_next/* (static files)
     * 3. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api/auth|_next/|favicon.ico|sitemap.xml).*)',
  ],
}
