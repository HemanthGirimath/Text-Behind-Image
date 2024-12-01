'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/user-context'
import { UserProfile } from '@/components/user-profile'

export default function ProfilePage() {
  const router = useRouter()
  const { state } = useUser()

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/login')
    }
  }, [state.isAuthenticated, router])

  if (!state.isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Your Profile</h1>
      <UserProfile />
    </div>
  )
}