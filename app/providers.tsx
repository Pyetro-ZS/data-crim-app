"use client" 

import { SettingsProvider } from "@/contexts/settings-context"
import { ThemeProvider } from "@/contexts/theme-context"
import React from "react"

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        {children}
      </SettingsProvider>
    </ThemeProvider>
  )
}
