'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './UI/button'
import { ThemeToggle } from './theme-toggle'
import { usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/drop-down"
import { Avatar, AvatarFallback } from "@/components/UI/avatar"
import { User, Settings, LogOut } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">TextBehindImage</span>
          </Link>

          <div className="flex flex-1 items-center justify-end space-x-2">
            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {session ? (
                <>
                  <Button
                    variant={pathname === '/editor' ? 'secondary' : 'ghost'}
                    asChild
                    className="hidden sm:inline-flex"
                  >
                    <Link href="/editor">Editor</Link>
                  </Button>
                  <Button
                    variant={pathname === '/pricing' ? 'secondary' : 'ghost'}
                    asChild
                    className="hidden sm:inline-flex"
                  >
                    <Link href="/pricing">Pricing</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={pathname === '/pricing' ? 'secondary' : 'ghost'}
                    asChild
                    className="hidden sm:inline-flex"
                  >
                    <Link href="/pricing">Pricing</Link>
                  </Button>
                  <Button
                    variant={pathname === '/login' ? 'secondary' : 'ghost'}
                    asChild
                    className="hidden sm:inline-flex"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    variant={pathname === '/register' ? 'secondary' : 'ghost'}
                    asChild
                    className="hidden sm:inline-flex"
                  >
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}

              {/* Mobile Menu */}
              <div className="sm:hidden flex items-center space-x-2">
                {session ? (
                  <>
                    <Button
                      variant={pathname === '/editor' ? 'secondary' : 'ghost'}
                      size="sm"
                      asChild
                    >
                      <Link href="/editor">Editor</Link>
                    </Button>
                    <Button
                      variant={pathname === '/pricing' ? 'secondary' : 'ghost'}
                      size="sm"
                      asChild
                    >
                      <Link href="/pricing">Pricing</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={pathname === '/pricing' ? 'secondary' : 'ghost'}
                      size="sm"
                      asChild
                    >
                      <Link href="/pricing">Pricing</Link>
                    </Button>
                    <Button
                      variant={pathname === '/login' ? 'secondary' : 'ghost'}
                      size="sm"
                      asChild
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Profile Menu */}
              {session && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}