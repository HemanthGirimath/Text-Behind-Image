'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { UserPlan } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function updateUserPlan(plan: UserPlan) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new Error('Unauthorized')
    }

    // Calculate subscription end date (30 days from now)
    const subscriptionEndDate = new Date()
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30)

    // Update user's plan
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        plan,
        subscriptionEndDate,
        imagesUsed: 0, // Reset image count for new subscription
      },
    })

    // Revalidate the profile page to show updated data
    revalidatePath('/profile')

    return {
      success: true,
      user: {
        plan: updatedUser.plan,
        subscriptionEndDate: updatedUser.subscriptionEndDate
      }
    }
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}
