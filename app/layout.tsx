import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "DataCrim - Segurança e Denúncia Inteligente",
  description: "Plataforma de denúncia de crimes e segurança pública com IA",
  icon: {
    icon: "/icon-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ErrorBoundary>
          <ThemeProvider>
            <SettingsProvider>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </SettingsProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
