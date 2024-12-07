'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useUser } from '@/lib/user-context'
import { UserPlan } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'

const publicPaths = ['/login', '/signup', '/pricing']
const protectedPaths = ['/editor', '/profile']

export function SessionHandler() {
  const { data: session, status } = useSession()
  const { dispatch } = useUser()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Don't do anything while loading
    if (status === 'loading') return

    if (session?.user) {
      const userPlan = session.user.plan || 'free'
      dispatch({
        type: 'LOGIN',
        payload: {
          email: session.user.email,
          name: session.user.name || 'User',
          plan: userPlan,
          subscriptionEndDate: session.user.subscriptionEndDate || null
        }
      })

      // If on a public path after login, redirect to home
      if (publicPaths.includes(pathname)) {
        router.push('/')
      }
    } else if (status === 'unauthenticated') {
      dispatch({ type: 'LOGOUT' })
      
      // If on a protected path without auth, redirect to login
      if (protectedPaths.includes(pathname)) {
        router.push('/login')
      }
    }
  }, [session, status, dispatch, pathname, router])

  // Block render of protected pages while loading
  if (status === 'loading' && protectedPaths.includes(pathname)) {
    return null
  }

  return null
}
