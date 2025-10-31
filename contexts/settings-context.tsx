"use client"

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react"

export type Language = "pt-BR" | "en" | "es"

interface NotificationSettings {
  securityAlerts: boolean
  bulletinUpdates: boolean
  pushNotifications: boolean
}

interface PrivacySettings {
  anonymousByDefault: boolean
  shareLocation: boolean
}

interface Settings {
  notifications: NotificationSettings
  privacy: PrivacySettings
  language: Language
}

interface SettingsContextType {
  settings: Settings
  updateNotifications: (notifications: Partial<NotificationSettings>) => void
  updatePrivacy: (privacy: Partial<PrivacySettings>) => void
  setLanguage: (language: Language) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  notifications: {
    securityAlerts: true,
    bulletinUpdates: true,
    pushNotifications: false,
  },
  privacy: {
    anonymousByDefault: true,
    shareLocation: true,
  },
  language: "pt-BR",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [mounted, setMounted] = useState(false)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    setMounted(true)

    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("datacrim-settings")
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          setSettings({ ...defaultSettings, ...parsed })
        } catch (error) {
          console.error("[v0] Failed to parse settings:", error)
        }
      }
    }

    setTimeout(() => {
      isInitialLoad.current = false
    }, 100)
  }, [])

  useEffect(() => {
    if (mounted && !isInitialLoad.current && typeof window !== "undefined") {
      const currentSaved = localStorage.getItem("datacrim-settings")
      const newSettings = JSON.stringify(settings)

      if (currentSaved !== newSettings) {
        localStorage.setItem("datacrim-settings", newSettings)
        console.log("[v0] Settings saved:", settings)
      }
    }
  }, [settings, mounted])

  const updateNotifications = (notifications: Partial<NotificationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...notifications },
    }))
  }

  const updatePrivacy = (privacy: Partial<PrivacySettings>) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, ...privacy },
    }))
  }

  const setLanguage = (language: Language) => {
    setSettings((prev) => ({ ...prev, language }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    if (typeof window !== "undefined") {
      localStorage.removeItem("datacrim-settings")
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateNotifications,
        updatePrivacy,
        setLanguage,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
