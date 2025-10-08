"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DataCrimLogo } from "@/components/datacrim-logo"

export default function SplashScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      router.push("/home")
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0b1a]">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <DataCrimLogo size="large" />
        {isLoading && (
          <div className="w-12 h-12 border-4 border-[#4aa3ff] border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  )
}
