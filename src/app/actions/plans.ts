'use server'

import { prisma } from '@/lib/prisma'
import { PlanType } from '@/lib/plans'

interface PlanResponse {
  success: boolean
  error?: string
  plan?: string
}

export async function upgradePlan(userId: string, plan: PlanType): Promise<PlanResponse> {
  try {
    // Calculate plan end date (30 days from now)
    const planEndDate = new Date()
    planEndDate.setDate(planEndDate.getDate() + 30)

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        plan,
        planStartDate: new Date(),
        planEndDate,
      },
    })

    return { success: true, plan: user.plan }
  } catch (error) {
    console.error('Plan upgrade error:', error)
    return { success: false, error: 'Failed to upgrade plan' }
  }
}

export async function checkPlanStatus(userId: string): Promise<PlanResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Check if plan has expired
    if (user.planEndDate && user.planEndDate < new Date()) {
      // Reset to free plan if expired
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: 'free',
          planEndDate: null,
        },
      })
      return { success: true, plan: 'free' }
    }

    return { success: true, plan: user.plan }
  } catch (error) {
    console.error('Plan status check error:', error)
    return { success: false, error: 'Failed to check plan status' }
  }
}

export async function cancelPlan(userId: string): Promise<PlanResponse> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'free',
        planEndDate: null,
      },
    })

    return { success: true, plan: user.plan }
  } catch (error) {
    console.error('Plan cancellation error:', error)
    return { success: false, error: 'Failed to cancel plan' }
  }
}
