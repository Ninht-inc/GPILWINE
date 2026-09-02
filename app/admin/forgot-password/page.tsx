'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthShell } from '@/components/admin/set-password-form'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => {})
    setLoading(false)
    setSent(true)
  }

  return (
    <AuthShell title="Forgot password">
      {sent ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            If an account exists for <strong>{email}</strong>, a reset link is on its way. It expires in 1 hour.
          </p>
          <Link href="/admin/login" className="inline-block text-[#641B2A] text-sm hover:underline">Back to login</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-gray-500">Enter your admin email and we&apos;ll send you a link to reset your password.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent outline-none text-[#222]"
          />
          <button type="submit" disabled={loading} className="w-full bg-[#641B2A] text-[#F4EBDD] py-3 rounded-md font-medium hover:bg-[#3B101A] disabled:opacity-50">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
          <div className="text-center">
            <Link href="/admin/login" className="text-[#641B2A] text-sm hover:underline">Back to login</Link>
          </div>
        </form>
      )}
    </AuthShell>
  )
}
