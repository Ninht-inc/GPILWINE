'use client'

import { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        const map: Record<string, string> = {}
        ;(d.settings || []).forEach((s: any) => { map[s.key] = s.value })
        setSettings(map)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true); setSaved(false)
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {}
    finally { setSaving(false) }
  }

  const set = (key: string, val: string) => setSettings(s => ({ ...s, [key]: val }))

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>

  const fields = [
    { key: 'site_name', label: 'Site Name' },
    { key: 'site_description', label: 'Site Description', textarea: true },
    { key: 'contact_email', label: 'Contact Email' },
    { key: 'contact_phone', label: 'Contact Phone' },
    { key: 'contact_address', label: 'Contact Address' },
    { key: 'social_facebook', label: 'Facebook URL' },
    { key: 'social_instagram', label: 'Instagram URL' },
    { key: 'social_twitter', label: 'Twitter / X URL' },
    { key: 'quote_email_recipient', label: 'Quote Notification Email' },
    { key: 'age_gate_enabled', label: 'Age Verification Enabled', type: 'toggle' },
  ]

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Site Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 md:p-8 space-y-6">
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            {f.type === 'toggle' ? (
              <button type="button" onClick={() => set(f.key, settings[f.key] === 'true' ? 'false' : 'true')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[f.key] === 'true' ? 'bg-[#641B2A]' : 'bg-gray-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[f.key] === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            ) : f.textarea ? (
              <textarea rows={3} value={settings[f.key] || ''} onChange={e => set(f.key, e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none" />
            ) : (
              <input value={settings[f.key] || ''} onChange={e => set(f.key, e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            )}
          </div>
        ))}
        <div className="flex items-center gap-4 pt-4">
          <button onClick={handleSave} disabled={saving} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-green-600 text-sm">Settings saved!</span>}
        </div>
      </div>
    </div>
  )
}
