import 'next-auth'
import { UserPlan } from '@/lib/utils'

declare module 'next-auth' {
  interface Session {
    user: User
  }

  interface User {
    id: string
    name: string | null
    email: string
    plan: UserPlan
    imagesUsed: number
    subscriptionEndDate: Date | null
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser extends User {}
}

declare module 'next-auth/adapters' {
  interface AdapterUser extends User {}
}
