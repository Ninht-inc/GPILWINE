'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthShell, SetPasswordForm } from '@/components/admin/set-password-form'

function ResetPassword() {
  const token = useSearchParams().get('token') || ''
  const [state, setState] = useState<{ loading: boolean; valid?: boolean }>({ loading: true })

  useEffect(() => {
    fetch(`/api/auth/forgot-password?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => setState({ loading: false, valid: d.valid }))
      .catch(() => setState({ loading: false, valid: false }))
  }, [token])

  if (state.loading) return <AuthShell title="Reset password"><p className="text-center text-gray-500 text-sm">Checking your link…</p></AuthShell>
  if (!state.valid) return <AuthShell title="Reset password"><p className="text-center text-red-600 text-sm">This reset link is invalid or has expired.</p></AuthShell>

  return (
    <AuthShell title="Choose a new password">
      <SetPasswordForm
        submitLabel="Update password"
        successMessage="Your password has been updated."
        onSubmit={async (password) => {
          const res = await fetch('/api/auth/forgot-password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password }),
          })
          const d = await res.json()
          return res.ok ? {} : { error: d.error || 'Failed' }
        }}
      />
    </AuthShell>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<AuthShell title="Reset password"><p className="text-center text-gray-500 text-sm">Loading…</p></AuthShell>}>
      <ResetPassword />
    </Suspense>
  )
}
