'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card'
import { Avatar, AvatarFallback } from '@/components/UI/avatar'
import { Button } from '@/components/UI/button'
import Link from 'next/link'
import { Crown, Settings } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{session.user.name}</CardTitle>
              <CardDescription>{session.user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subscription Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Subscription</h3>
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-primary" />
              <span className="capitalize">{session.user.plan} Plan</span>
            </div>
            <Button asChild variant="outline">
              <Link href="/pricing">Manage Subscription</Link>
            </Button>
          </div>

          {/* Account Settings */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <Button asChild variant="outline">
              <Link href="/settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Edit Profile</span>
              </Link>
            </Button>
          </div>

          {/* Usage Stats */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Usage Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Images Created</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Text Layers</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Downloads</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}