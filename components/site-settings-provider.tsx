'use client'

import { createContext, useContext } from 'react'
import type { PublicSettings } from '@/lib/settings'

const SettingsContext = createContext<PublicSettings | null>(null)

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: PublicSettings
  children: React.ReactNode
}) {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}

export function useSiteSettings(): PublicSettings {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    // Safe empty fallback so components never crash outside the provider.
    return {
      site_name: '', site_logo: '', site_favicon: '', whatsapp_number: '', whatsapp_message: '',
      ga_measurement_id: '', social_facebook: '', social_instagram: '', social_twitter: '', social_youtube: '',
    }
  }
  return ctx
}
