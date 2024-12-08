'use client'

import { useSession } from 'next-auth/react'
import { Avatar } from '@/components/UI/avatar'
import { Button } from '@/components/UI/button'
import { Card } from '@/components/UI/card'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar user={session.user} className="h-16 w-16" />
          <div>
            <h1 className="text-2xl font-bold">{session.user.name}</h1>
            <p className="text-gray-500">{session.user.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium capitalize">{session.user.plan}</p>
                <p className="text-sm text-gray-500">
                  {session.user.plan === 'free' && 'Basic features with limited access'}
                  {session.user.plan === 'basic' && 'Enhanced features with more options'}
                  {session.user.plan === 'premium' && 'Full access to all features'}
                </p>
              </div>
              {session.user.plan !== 'premium' && (
                <Link href="/pricing">
                  <Button>
                    Upgrade Plan
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1">{session.user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1">{session.user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}