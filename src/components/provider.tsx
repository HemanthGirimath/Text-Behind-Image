'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/lib/user-context"
import { Toaster } from "@/components/UI/toaster"
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { SessionSync } from "./session-sync"
import { EditorProvider } from "@/contexts/editor-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <UserProvider>
          <EditorProvider>
            <SessionSync />
            {children}
          </EditorProvider>
        </UserProvider>
      </ThemeProvider>
      <Toaster />
    </SessionProvider>
  )
}