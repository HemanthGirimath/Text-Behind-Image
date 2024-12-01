'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/UI/input'
import { Label } from '@/components/UI/label'
import { Button } from '@/components/UI/button'
import { signUp } from '../actions/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/UI/card'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { useToast } from "@/components/UI/use-toast"

export default function SignupPage() {
  const router = useRouter()
  const { dispatch } = useUser()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  
    try {
      const result = await signUp(email, password, name)
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error
        })
        return
      }

      if (!result.user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No user data returned"
        })
        return
      }
  
      toast({
        title: "Success",
        description: "Account created successfully! Please log in."
      })
      // After successful signup, redirect to login
      router.push('/login')
    } catch (error) {
      console.error('Signup failed:', error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-4 p-8">
          <CardTitle className="text-4xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center text-lg">
            Sign up for a new account to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-lg">Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-12 h-14 text-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-lg">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-12 h-14 text-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-lg">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-14 text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 p-8">
            <Button 
              type="submit" 
              className="w-full py-8 text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  Sign Up
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </Button>
            <div className="text-center text-base text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}