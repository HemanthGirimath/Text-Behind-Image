import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/editor/:path*',
    '/api/subscription/:path*',
    // Add other protected routes here
  ]
}
