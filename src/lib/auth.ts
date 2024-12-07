import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from './prisma'
import type { UserPlan } from './utils'
import { Adapter } from 'next-auth/adapters'
import { Session } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }): Promise<Session> {
      if (session.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { 
            plan: true, 
            imagesUsed: true,
            subscriptionEndDate: true,
            email: true,
            name: true
          }
        })

        if (!dbUser) {
          const defaultUser = await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'free' as UserPlan,
              imagesUsed: 0,
              subscriptionEndDate: null
            }
          })
          session.user.plan = defaultUser.plan as UserPlan
          session.user.imagesUsed = defaultUser.imagesUsed
          session.user.subscriptionEndDate = defaultUser.subscriptionEndDate
          session.user.email = user.email ?? ''
          session.user.name = user.name
        } else {
          session.user.plan = dbUser.plan as UserPlan
          session.user.imagesUsed = dbUser.imagesUsed
          session.user.subscriptionEndDate = dbUser.subscriptionEndDate
          session.user.email = dbUser.email
          session.user.name = dbUser.name
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database'
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      plan: UserPlan
      imagesUsed: any
      subscriptionEndDate: Date | null
    }
  }
}

import { getServerSession } from "next-auth"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}
