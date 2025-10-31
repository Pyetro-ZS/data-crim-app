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
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("datacrim-settings")
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          setSettings({ ...defaultSettings, ...parsed })
        } catch (error) {
          console.error("Failed to parse settings:", error)
        }
      }
    }

    // Mark initial load as complete after a short delay
    setTimeout(() => {
      isInitialLoad.current = false
    }, 100)
  }, [])

  useEffect(() => {
    if (!isInitialLoad.current && typeof window !== "undefined") {
      const currentSaved = localStorage.getItem("datacrim-settings")
      const newSettings = JSON.stringify(settings)

      if (currentSaved !== newSettings) {
        localStorage.setItem("datacrim-settings", newSettings)
      }
    }
  }, [settings])

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
