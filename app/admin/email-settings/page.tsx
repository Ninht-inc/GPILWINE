'use client'

import { useEffect, useState } from 'react'

type Settings = {
  smtp_host: string
  smtp_port: string
  smtp_secure: string
  smtp_user: string
  smtp_from_email: string
  smtp_from_name: string
  smtp_enabled: string
  mail_admin_recipient: string
}

const EMPTY: Settings = {
  smtp_host: '',
  smtp_port: '465',
  smtp_secure: 'true',
  smtp_user: '',
  smtp_from_email: '',
  smtp_from_name: 'GPIL Wines',
  smtp_enabled: 'false',
  mail_admin_recipient: '',
}

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<Settings>(EMPTY)
  const [password, setPassword] = useState('')
  const [hasPassword, setHasPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/email-settings')
      .then((r) => r.json())
      .then((d) => {
        setSettings({ ...EMPTY, ...(d.settings || {}) })
        setHasPassword(Boolean(d.hasPassword))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const set = (k: keyof Settings, v: string) => setSettings((s) => ({ ...s, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const payload: Record<string, string> = { ...settings }
      if (password) payload.smtp_password = password
      await fetch('/api/admin/email-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
      })
      if (password) {
        setHasPassword(true)
        setPassword('')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      /* ignore */
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/admin/email-settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail || undefined }),
      })
      const d = await res.json()
      setTestResult(
        d.success
          ? { ok: true, msg: `Test email sent to ${d.to}` }
          : { ok: false, msg: `${d.stage === 'connect' ? 'Connection failed' : 'Send failed'}: ${d.error}` }
      )
    } catch (e) {
      setTestResult({ ok: false, msg: String(e) })
    } finally {
      setTesting(false)
    }
  }

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>

  const field = 'w-full border border-gray-300 rounded px-3 py-2 text-sm'
  const label = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Settings</h1>
      <p className="text-gray-500 text-sm mb-8">
        Outgoing email for contact forms, quote requests and notifications. Use the SMTP details from
        your cPanel webmail account (Email Accounts → Connect Devices).
      </p>

      <div className="bg-white rounded-lg shadow p-6 md:p-8 space-y-5">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.smtp_enabled === 'true'}
            onChange={(e) => set('smtp_enabled', e.target.checked ? 'true' : 'false')}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium text-gray-700">Send email via SMTP</span>
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>SMTP Host</label>
            <input value={settings.smtp_host} onChange={(e) => set('smtp_host', e.target.value)} placeholder="mail.yourdomain.com" className={field} />
          </div>
          <div>
            <label className={label}>Port</label>
            <select
              value={settings.smtp_port}
              onChange={(e) => {
                const p = e.target.value
                set('smtp_port', p)
                set('smtp_secure', p === '465' ? 'true' : 'false')
              }}
              className={`${field} bg-white`}
            >
              <option value="465">465 (SSL / TLS)</option>
              <option value="587">587 (STARTTLS)</option>
              <option value="25">25</option>
              <option value="2525">2525</option>
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Username</label>
            <input value={settings.smtp_user} onChange={(e) => set('smtp_user', e.target.value)} placeholder="noreply@yourdomain.com" className={field} />
          </div>
          <div>
            <label className={label}>Password {hasPassword && <span className="text-gray-400 font-normal">(saved — leave blank to keep)</span>}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={hasPassword ? '••••••••' : ''} className={field} autoComplete="new-password" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>From Email</label>
            <input value={settings.smtp_from_email} onChange={(e) => set('smtp_from_email', e.target.value)} placeholder="noreply@yourdomain.com" className={field} />
          </div>
          <div>
            <label className={label}>From Name</label>
            <input value={settings.smtp_from_name} onChange={(e) => set('smtp_from_name', e.target.value)} className={field} />
          </div>
        </div>

        <div>
          <label className={label}>Admin notification recipient</label>
          <input value={settings.mail_admin_recipient} onChange={(e) => set('mail_admin_recipient', e.target.value)} placeholder="orders@yourdomain.com" className={field} />
          <p className="text-xs text-gray-400 mt-1">Where new contact / quote / distributor submissions are emailed.</p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button onClick={handleSave} disabled={saving} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-green-600 text-sm">Saved!</span>}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 md:p-8 mt-6">
        <h2 className="font-semibold text-gray-900 mb-1">Send a test email</h2>
        <p className="text-gray-500 text-sm mb-4">Save your settings first, then verify the connection works.</p>
        <div className="flex flex-wrap items-center gap-3">
          <input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="recipient@example.com (optional)" className={`${field} max-w-xs`} />
          <button onClick={handleTest} disabled={testing} className="bg-gray-800 text-white px-5 py-2.5 text-sm font-medium rounded hover:bg-gray-700 disabled:opacity-50">
            {testing ? 'Sending...' : 'Send Test'}
          </button>
        </div>
        {testResult && (
          <p className={`mt-3 text-sm ${testResult.ok ? 'text-green-600' : 'text-red-600'}`}>{testResult.msg}</p>
        )}
      </div>
    </div>
  )
}
