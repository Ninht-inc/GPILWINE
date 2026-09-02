'use client'

import { useState } from 'react'
import Link from 'next/link'

export function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#3B101A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-[#C6A15B] text-4xl font-bold tracking-wider">GPIL</h1>
          <p className="text-[#C6A15B]/70 text-xs tracking-[0.3em] uppercase mt-1">Wines Administration</p>
        </div>
        <div className="bg-[#FAF9F6] rounded-lg p-8 shadow-2xl">
          <h2 className="font-display text-[#222] text-xl mb-6 text-center">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}

export function SetPasswordForm({
  submitLabel,
  onSubmit,
  successMessage,
}: {
  submitLabel: string
  onSubmit: (password: string) => Promise<{ error?: string }>
  successMessage: string
}) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Passwords do not match')
    if (password.length < 8) return setError('Password must be at least 8 characters')
    setLoading(true)
    const res = await onSubmit(password)
    setLoading(false)
    if (res.error) setError(res.error)
    else setDone(true)
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <p className="text-green-700 text-sm">{successMessage}</p>
        <Link href="/admin/login" className="inline-block bg-[#641B2A] text-[#F4EBDD] px-6 py-2.5 rounded-md text-sm font-medium">
          Go to login
        </Link>
      </div>
    )
  }

  const field = 'w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent outline-none text-[#222]'

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-[#222] mb-1">New password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" className={field} />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#222] mb-1">Confirm password</label>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" className={field} />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-[#641B2A] text-[#F4EBDD] py-3 rounded-md font-medium hover:bg-[#3B101A] transition-colors disabled:opacity-50">
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
