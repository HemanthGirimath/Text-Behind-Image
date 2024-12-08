import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export type UserPlan = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  plan: UserPlan;
  name?: string;
}

export interface UserState {
  isAuthenticated: boolean;
  user: User | null;
}
