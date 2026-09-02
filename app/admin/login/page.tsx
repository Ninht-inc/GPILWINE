'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email, password, redirect: false,
      })
      if (result?.ok) {
        // Full navigation so the /admin server layout re-renders with the new
        // session and shows the sidebar (a soft router push keeps the cached
        // shell-less layout until a manual refresh).
        window.location.assign('/admin/dashboard')
      } else {
        setError('Invalid email or password')
        setLoading(false)
      }
    } catch {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#3B101A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-[#C6A15B] text-4xl font-bold tracking-wider">GPIL</h1>
          <p className="text-[#C6A15B]/70 text-xs tracking-[0.3em] uppercase mt-1">Wines Administration</p>
        </div>
        <div className="bg-[#FAF9F6] rounded-lg p-8 shadow-2xl">
          <h2 className="font-display text-[#222] text-xl mb-6 text-center">Admin Login</h2>
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#222] mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent outline-none text-[#222]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#222] mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent outline-none text-[#222]" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#641B2A] text-[#F4EBDD] py-3 rounded-md font-medium hover:bg-[#3B101A] transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="text-center">
              <a href="/admin/forgot-password" className="text-[#641B2A] text-sm hover:underline">Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
