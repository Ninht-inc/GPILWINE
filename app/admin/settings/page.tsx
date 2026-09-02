'use client'

import { useState, useEffect } from 'react'
import { ImageUpload } from '@/components/admin/image-upload'

type Field = { key: string; label: string; type?: 'text' | 'textarea' | 'toggle' | 'image'; hint?: string }

const GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: 'Branding',
    fields: [
      { key: 'site_name', label: 'Site Name' },
      { key: 'site_logo', label: 'Logo', type: 'image', hint: 'Shown in the header and footer. Transparent PNG or SVG works best.' },
      { key: 'site_favicon', label: 'Favicon', type: 'image', hint: 'Browser tab icon. A square PNG (at least 48×48) is ideal.' },
    ],
  },
  {
    title: 'Contact & WhatsApp',
    fields: [
      { key: 'contact_email', label: 'Contact Email' },
      { key: 'contact_phone', label: 'Contact Phone' },
      { key: 'contact_address', label: 'Contact Address' },
      { key: 'whatsapp_number', label: 'WhatsApp Number', hint: 'Full international number, e.g. 2348012345678. Shows a floating chat button on the site.' },
      { key: 'whatsapp_message', label: 'WhatsApp Prefilled Message', hint: 'Optional text that appears in the chat when someone taps the button.' },
    ],
  },
  {
    title: 'Social Links',
    fields: [
      { key: 'social_facebook', label: 'Facebook URL' },
      { key: 'social_instagram', label: 'Instagram URL' },
      { key: 'social_twitter', label: 'Twitter / X URL' },
      { key: 'social_youtube', label: 'YouTube URL' },
    ],
  },
  {
    title: 'Analytics',
    fields: [
      { key: 'ga_measurement_id', label: 'Google Analytics Measurement ID', hint: 'Looks like G-XXXXXXXXXX. Leave blank to disable analytics.' },
    ],
  },
  {
    title: 'Other',
    fields: [
      { key: 'site_description', label: 'Site Description', type: 'textarea' },
      { key: 'quote_email_recipient', label: 'Quote Notification Email' },
      { key: 'age_gate_enabled', label: 'Age Verification Enabled', type: 'toggle' },
    ],
  },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, string> = {}
        ;(d.settings || []).forEach((s: any) => { map[s.key] = s.value })
        setSettings(map)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const set = (key: string, val: string) => setSettings((s) => ({ ...s, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      /* ignore */
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>

  const inputCls = 'w-full border border-gray-300 rounded px-3 py-2 text-sm'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Site Settings</h1>

      <div className="space-y-6">
        {GROUPS.map((group) => (
          <div key={group.title} className="bg-white rounded-lg shadow p-6 md:p-8 space-y-5">
            <h2 className="font-semibold text-gray-900">{group.title}</h2>
            {group.fields.map((f) => (
              <div key={f.key}>
                {f.type === 'image' ? (
                  <ImageUpload
                    label={f.label}
                    value={settings[f.key] || ''}
                    onChange={(v) => set(f.key, v)}
                    folder="gpil/branding"
                    aspect="aspect-video"
                  />
                ) : (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    {f.type === 'toggle' ? (
                      <button
                        type="button"
                        onClick={() => set(f.key, settings[f.key] === 'true' ? 'false' : 'true')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[f.key] === 'true' ? 'bg-[#641B2A]' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[f.key] === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    ) : f.type === 'textarea' ? (
                      <textarea rows={3} value={settings[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} className={`${inputCls} resize-none`} />
                    ) : (
                      <input value={settings[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} className={inputCls} />
                    )}
                  </>
                )}
                {f.hint && <p className="text-xs text-gray-400 mt-1">{f.hint}</p>}
              </div>
            ))}
          </div>
        ))}

        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-green-600 text-sm">Settings saved!</span>}
        </div>
      </div>
    </div>
  )
}
