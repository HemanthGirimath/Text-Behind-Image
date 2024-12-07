import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type UserPlan = 'free' | 'basic' | 'premium';

export const USER_PLANS: UserPlan[] = ['free', 'basic', 'premium']

export const PLAN_LIMITS: Record<UserPlan, { imagesPerMonth: number; maxQuality: string }> = {
  free: {
    imagesPerMonth: 3,
    maxQuality: 'standard'
  },
  basic: {
    imagesPerMonth: 50,
    maxQuality: 'high'
  },
  premium: {
    imagesPerMonth: 200,
    maxQuality: 'ultra'
  }
} as const;

export interface User {
  id?: string;
  email: string;
  name: string | null;
  plan: UserPlan;
  subscriptionEndDate: Date | null;
  imagesUsed: number;
}

export interface UserState {
  isAuthenticated: boolean;
  user: User | null;
}

// Define plan limits

export interface SubscriptionStatus {
  canUseService: boolean;
  imagesRemaining: number;
  error?: string;
}

export function checkSubscriptionStatus(user: User | null): SubscriptionStatus {
  if (!user) {
    return {
      canUseService: false,
      imagesRemaining: 0,
      error: 'User not authenticated'
    };
  }

  // Check if subscription has expired for paid plans
  if (user.plan !== 'free' && user.subscriptionEndDate) {
    const now = new Date();
    if (now > user.subscriptionEndDate) {
      return {
        canUseService: false,
        imagesRemaining: 0,
        error: 'Subscription has expired'
      };
    }
  }

  // Get plan limits
  const planLimits = PLAN_LIMITS[user.plan];
  const imagesRemaining = planLimits.imagesPerMonth - (user.imagesUsed || 0);

  return {
    canUseService: imagesRemaining > 0,
    imagesRemaining,
    error: imagesRemaining <= 0 ? 'Monthly image limit reached' : undefined
  };
}

// Helper to increment image usage
export async function incrementImageUsage(prisma: any, userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, imagesUsed: true }
    });

    if (!user) return false;

    const status = checkSubscriptionStatus(user as User);
    if (!status.canUseService) return false;

    await prisma.user.update({
      where: { id: userId },
      data: { imagesUsed: (user.imagesUsed || 0) + 1 }
    });

    return true;
  } catch (error) {
    console.error('Error incrementing image usage:', error);
    return false;
  }
}
