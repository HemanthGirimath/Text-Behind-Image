import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type UserPlan = 'free' | 'pro' | 'enterprise';

export interface User {
  email: string;
  plan: UserPlan;
  name?: string;
}

export interface UserState {
  isAuthenticated: boolean;
  user: User | null;
}
