'use server'

import { prisma } from '@/lib/prisma'
import { hash, compare } from 'bcrypt'

interface AuthResponse {
  user?: {
    id: string;
    email: string;
    name: string;
    plan: string;
  };
  error?: string;
}

export async function signUp(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    console.log('Starting signup process for:', email);
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists:', email);
      return { error: 'User already exists' }
    }

    console.log('Hashing password...');
    const hashedPassword = await hash(password, 10)
    
    console.log('Creating new user in database...');
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        plan: 'free'
      }
    })
    
    console.log('User created successfully:', { id: user.id, email: user.email });
    return { user: { id: user.id, email: user.email, name: user.name, plan: user.plan } }
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'Error creating user' }
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    console.log('Starting login process for:', email);
    
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('User not found:', email);
      return { error: 'User not found' }
    }

    console.log('Verifying password...');
    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return { error: 'Invalid password' }
    }

    console.log('Login successful for:', email);
    return { user: { id: user.id, email: user.email, name: user.name, plan: user.plan } }
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Error during login' }
  }
}