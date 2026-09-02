'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface AdminUser {
  id: string; name: string | null; email: string; role: string; active: boolean;
  createdAt: string; pendingInvite: boolean
}

const ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'CONTENT_ADMIN', label: 'Content Admin' },
  { value: 'ENQUIRY_MANAGER', label: 'Enquiry Manager' },
]
const roleLabel = (r: string) => ROLES.find((x) => x.value === r)?.label || r

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const meId = (session?.user as any)?.id
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [invite, setInvite] = useState({ email: '', name: '', role: 'ENQUIRY_MANAGER' })
  const [inviting, setInviting] = useState(false)
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/users')
      .then((r) => { if (r.status === 403) { setForbidden(true); return { users: [] } } return r.json() })
      .then((d) => { setUsers(d.users || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(load, [])

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true); setNotice(null)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invite),
      })
      const d = await res.json()
      if (!res.ok) { setNotice({ ok: false, text: d.error || 'Failed' }); return }
      setInvite({ email: '', name: '', role: 'ENQUIRY_MANAGER' })
      setNotice({
        ok: true,
        text: d.emailSent
          ? `Invitation emailed to ${d.user.email}.`
          : `User created, but the email could not be sent (${d.emailError || 'SMTP not configured'}). Share this link: ${d.inviteUrl}`,
      })
      load()
    } finally { setInviting(false) }
  }

  const patch = async (id: string, body: any) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    const d = await res.json().catch(() => ({}))
    if (!res.ok) { setNotice({ ok: false, text: d.error || 'Failed' }); return }
    if (body.resendInvite) {
      setNotice({ ok: true, text: d.emailSent ? 'Invitation resent.' : `Email failed. Link: ${d.inviteUrl}` })
    }
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Remove this user? If they have activity on record they will be deactivated instead of deleted.')) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    const d = await res.json().catch(() => ({}))
    if (!res.ok) setNotice({ ok: false, text: d.error || 'Failed' })
    else if (d.deactivated) setNotice({ ok: true, text: 'User deactivated (they had activity on record).' })
    load()
  }

  if (forbidden) return <div className="text-gray-500 py-12 text-center">Only a Super Admin can manage users.</div>
  if (loading) return <div className="text-gray-500 py-12 text-center">Loading…</div>

  const inputCls = 'w-full border border-gray-300 rounded px-3 py-2 text-sm'

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Users</h1>

      {notice && (
        <div className={`text-sm p-3 rounded mb-6 break-words ${notice.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {notice.text}
        </div>
      )}

      <form onSubmit={sendInvite} className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
        <h2 className="font-semibold text-gray-900">Invite a user</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <input required type="email" placeholder="Email" value={invite.email} onChange={(e) => setInvite((v) => ({ ...v, email: e.target.value }))} className={inputCls} />
          <input placeholder="Name (optional)" value={invite.name} onChange={(e) => setInvite((v) => ({ ...v, name: e.target.value }))} className={inputCls} />
          <select value={invite.role} onChange={(e) => setInvite((v) => ({ ...v, role: e.target.value }))} className={`${inputCls} bg-white`}>
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <button type="submit" disabled={inviting} className="bg-[#641B2A] text-white px-5 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">
          {inviting ? 'Sending…' : 'Send invitation'}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium">{u.name || '—'}{u.id === meId && <span className="text-gray-400"> (you)</span>}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={u.role}
                    disabled={u.id === meId}
                    onChange={(e) => patch(u.id, { role: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-1 text-xs bg-white disabled:opacity-60"
                  >
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4">
                  {u.pendingInvite ? (
                    <span className="text-xs px-2 py-1 rounded font-medium bg-amber-100 text-amber-800">Invite pending</span>
                  ) : u.active ? (
                    <span className="text-xs px-2 py-1 rounded font-medium bg-green-100 text-green-800">Active</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded font-medium bg-gray-100 text-gray-700">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap text-sm">
                  {u.pendingInvite && (
                    <button onClick={() => patch(u.id, { resendInvite: true })} className="text-[#641B2A] hover:underline">Resend</button>
                  )}
                  {u.id !== meId && !u.pendingInvite && (
                    <button onClick={() => patch(u.id, { active: !u.active })} className="ml-4 text-gray-500 hover:underline">
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                  {u.id !== meId && (
                    <button onClick={() => remove(u.id)} className="ml-4 text-red-600 hover:underline">Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Roles — <strong>Super Admin</strong>: everything. <strong>Content Admin</strong>: wines, media, content, FAQs.
        <strong> Enquiry Manager</strong>: quotes, enquiries, distributors, stockists.
      </p>
    </div>
  )
}
