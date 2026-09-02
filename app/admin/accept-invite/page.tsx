'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthShell, SetPasswordForm } from '@/components/admin/set-password-form'

function AcceptInvite() {
  const token = useSearchParams().get('token') || ''
  const [state, setState] = useState<{ loading: boolean; email?: string; error?: string }>({ loading: true })

  useEffect(() => {
    fetch(`/api/auth/accept-invite?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => setState({ loading: false, email: d.email, error: d.error }))
      .catch(() => setState({ loading: false, error: 'Something went wrong' }))
  }, [token])

  if (state.loading) return <AuthShell title="Accept invitation"><p className="text-center text-gray-500 text-sm">Checking your invitation…</p></AuthShell>
  if (state.error) return <AuthShell title="Accept invitation"><p className="text-center text-red-600 text-sm">{state.error}</p></AuthShell>

  return (
    <AuthShell title="Set your password">
      <p className="text-center text-sm text-gray-500 mb-4">{state.email}</p>
      <SetPasswordForm
        submitLabel="Activate account"
        successMessage="Your account is ready. You can now sign in."
        onSubmit={async (password) => {
          const res = await fetch('/api/auth/accept-invite', {
            method: 'POST',
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
    <Suspense fallback={<AuthShell title="Accept invitation"><p className="text-center text-gray-500 text-sm">Loading…</p></AuthShell>}>
      <AcceptInvite />
    </Suspense>
  )
}
