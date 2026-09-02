import { prisma } from '@/lib/db'

const settingsCache: Record<string, { value: string; timestamp: number }> = {}
const CACHE_TTL = 60000 // 1 minute

/** Settings that are safe to expose to the public site. */
export const PUBLIC_SETTING_KEYS = [
  'site_name',
  'site_logo',
  'site_favicon',
  'whatsapp_number',
  'whatsapp_message',
  'ga_measurement_id',
  'social_facebook',
  'social_instagram',
  'social_twitter',
  'social_youtube',
] as const

export type PublicSettings = Record<(typeof PUBLIC_SETTING_KEYS)[number], string>

export async function getPublicSettings(): Promise<PublicSettings> {
  const out = {} as PublicSettings
  for (const key of PUBLIC_SETTING_KEYS) out[key] = ''
  try {
    const values = await getSettings([...PUBLIC_SETTING_KEYS])
    for (const key of PUBLIC_SETTING_KEYS) out[key] = values[key] ?? ''
  } catch {
    // DB unavailable (e.g. during build) — return empty settings
  }
  return out
}

export async function getSetting(key: string): Promise<string | null> {
  const cached = settingsCache[key]
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value
  }
  const setting = await prisma.siteSetting.findUnique({ where: { key } })
  if (setting) {
    settingsCache[key] = { value: setting.value, timestamp: Date.now() }
  }
  return setting?.value ?? null
}

export async function getSettings(keys: string[]): Promise<Record<string, string | null>> {
  const result: Record<string, string | null> = {}
  const uncached: string[] = []
  
  for (const key of keys) {
    const cached = settingsCache[key]
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      result[key] = cached.value
    } else {
      uncached.push(key)
    }
  }
  
  if (uncached.length > 0) {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: uncached } },
    })
    for (const s of settings) {
      settingsCache[s.key] = { value: s.value, timestamp: Date.now() }
      result[s.key] = s.value
    }
    for (const key of uncached) {
      if (!(key in result)) result[key] = null
    }
  }
  return result
}

export async function setSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  })
  settingsCache[key] = { value, timestamp: Date.now() }
}
