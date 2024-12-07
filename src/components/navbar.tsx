'use client'

import Link from 'next/link'
import { Button } from './UI/button'
import { useUser } from '@/lib/user-context'
import { signOut } from 'next-auth/react'
import { LogOut, User, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/UI/sheet'
import { useState } from 'react'

export function Navbar() {
  const { state } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const NavItems = () => (
    <>
      <Link href="/editor" className="transition-colors hover:text-foreground/80 text-foreground">
        Editor
      </Link>
      <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground">
        Pricing
      </Link>
    </>
  )

  const AuthButtons = () => (
    <>
      {state.user ? (
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      )}
    </>
  )

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">TextBehindImage</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6">
              <NavItems />
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex">
            <AuthButtons />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <AuthButtons />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-4">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      <div className="h-14" /> {/* Spacer for fixed navbar */}
    </>
  )
}