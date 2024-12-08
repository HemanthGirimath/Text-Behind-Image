'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/lib/user-context"
import { AuthSync } from './auth-sync'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthSync />
          {children}
        </ThemeProvider>
      </UserProvider>
    </SessionProvider>
  )
}
