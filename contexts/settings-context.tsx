"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

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

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("datacrim-settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("[v0] Failed to parse settings:", error)
      }
    }
    setMounted(true)
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("datacrim-settings", JSON.stringify(settings))
      console.log("[v0] Settings saved:", settings)
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
    localStorage.removeItem("datacrim-settings")
  }

  if (!mounted) {
    return <>{children}</>
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
