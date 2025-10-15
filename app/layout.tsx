import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { RootProviders } from "./providers"

export const metadata: Metadata = {
  title: "DataCrim - Segurança e Denúncia Inteligente",
  description: "Plataforma de denúncia de crimes e segurança pública com IA",
  generator: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {/* Use o Client Wrapper para envolver toda a app */}
        <RootProviders>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </RootProviders>

        <Analytics />
      </body>
    </html>
  )
}
