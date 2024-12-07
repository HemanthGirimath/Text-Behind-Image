'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useUser } from '@/lib/user-context'
import { UserPlan } from '@/lib/utils'

export function SessionSync() {
  const { data: session, status, update } = useSession()
  const { state, dispatch } = useUser()

  useEffect(() => {
    const syncSession = async () => {
      if (status === 'loading') return

      if (status === 'authenticated' && session?.user) {
        const userPlan = (session.user.plan || 'free') as UserPlan
        dispatch({
          type: 'LOGIN',
          payload: {
            email: session.user.email,
            name: session.user.name || 'User',
            plan: userPlan,
            subscriptionEndDate: session.user.subscriptionEndDate || null
          }
        })
      } else {
        dispatch({ type: 'LOGOUT' })
      }
    }

    syncSession()
  }, [session, status, dispatch])

  // Function to update session after subscription change
  const updateSession = async (newPlan: UserPlan, newSubscriptionEndDate: Date) => {
    if (status === 'authenticated') {
      await update({
        ...session,
        user: {
          ...session?.user,
          plan: newPlan,
          subscriptionEndDate: newSubscriptionEndDate
        }
      })
    }
  }

  return null
}
