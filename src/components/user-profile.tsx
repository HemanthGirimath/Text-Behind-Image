'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/card'
import { useUser } from '@/lib/user-context'
import { User } from 'lucide-react'

export function UserProfile() {
  const { state } = useUser()

  if (!state.isAuthenticated || !state.user) {
    return null
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader className="space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          {state.user.name}
        </CardTitle>
        <CardDescription className="text-center text-lg">
          {state.user.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Subscription Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plan Type</span>
              <span className="font-medium capitalize">{state.user.plan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Valid Until</span>
              <span className="font-medium">{formatDate(state.user.subscriptionEndDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium ${state.user.subscriptionEndDate && new Date(state.user.subscriptionEndDate) > new Date() ? 'text-green-600' : 'text-yellow-600'}`}>
                {state.user.subscriptionEndDate && new Date(state.user.subscriptionEndDate) > new Date() ? 'Active' : 'Expired'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}