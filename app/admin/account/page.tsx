'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AdminAccountPage() {
  const { data: session } = useSession()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (next !== confirm) {
      setMsg({ ok: false, text: 'New passwords do not match' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      })
      const d = await res.json()
      if (res.ok) {
        setMsg({ ok: true, text: 'Password updated.' })
        setCurrent(''); setNext(''); setConfirm('')
      } else {
        setMsg({ ok: false, text: d.error || 'Failed to update password' })
      }
    } catch (err) {
      setMsg({ ok: false, text: String(err) })
    } finally {
      setSaving(false)
    }
  }

  const field = 'w-full border border-gray-300 rounded px-3 py-2 text-sm'
  const label = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Account</h1>
      <p className="text-gray-500 text-sm mb-8">
        Signed in as {session?.user?.email}
      </p>

      <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 md:p-8 space-y-5">
        <h2 className="font-semibold text-gray-900">Change Password</h2>

        <div>
          <label className={label}>Current password</label>
          <input type="password" value={current} onChange={e => setCurrent(e.target.value)} required autoComplete="current-password" className={field} />
        </div>
        <div>
          <label className={label}>New password</label>
          <input type="password" value={next} onChange={e => setNext(e.target.value)} required minLength={8} autoComplete="new-password" className={field} />
          <p className="text-xs text-gray-400 mt-1">At least 8 characters.</p>
        </div>
        <div>
          <label className={label}>Confirm new password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" className={field} />
        </div>

        {msg && <p className={`text-sm ${msg.ok ? 'text-green-600' : 'text-red-600'}`}>{msg.text}</p>}

        <button type="submit" disabled={saving} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
