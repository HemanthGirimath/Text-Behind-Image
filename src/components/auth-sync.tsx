'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useUser } from '@/lib/user-context'

export function AuthSync() {
  const { data: session } = useSession()
  const { dispatch } = useUser()

  useEffect(() => {
    if (session?.user) {
      // Sync NextAuth session with our user context
      dispatch({
        type: 'LOGIN',
        payload: {
          email: session.user.email,
          name: session.user.name,
          plan: session.user.plan
        }
      })
    } else {
      // Clear user context when session is gone
      dispatch({ type: 'LOGOUT' })
    }
  }, [session, dispatch])

  return null
}
