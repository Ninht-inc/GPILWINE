'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

const STATUSES = ['NEW', 'UNDER_REVIEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'APPROVED', 'DECLINED', 'CLOSED']

export default function AdminDistributorDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch(`/api/admin/distributor-enquiries/${id}`)
      .then(r => r.json())
      .then(d => { setItem(d.enquiry); setStatus(d.enquiry?.status || ''); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/admin/distributor-enquiries/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: newNote || undefined }),
      })
      setNewNote(''); load()
    } catch {}
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this distributor enquiry permanently? This cannot be undone.')) return
    await fetch(`/api/admin/distributor-enquiries/${id}`, { method: 'DELETE' })
    router.push('/admin/distributor-enquiries')
  }

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>
  if (!item) return <div className="text-gray-500 py-12 text-center">Not found</div>

  const row = (label: string, value: any) =>
    value ? <div><span className="text-gray-500">{label}:</span> <span className="font-medium">{Array.isArray(value) ? value.join(', ') : value}</span></div> : null

  return (
    <div className="max-w-3xl">
      <button onClick={() => router.push('/admin/distributor-enquiries')} className="text-sm text-gray-500 hover:text-gray-700 mb-4">← Back</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.referenceNumber}</h1>
      <p className="text-gray-500 text-sm mb-8">{item.businessName} · Submitted {new Date(item.createdAt).toLocaleString('en-ZA')}</p>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Details</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {row('Business', item.businessName)}
          {row('Contact', [item.firstName, item.lastName].filter(Boolean).join(' '))}
          {row('Email', item.businessEmail)}
          {row('Phone', item.phone)}
          {row('WhatsApp', item.whatsapp)}
          {row('Business type', item.businessType)}
          {row('Registration no.', item.registrationNumber)}
          {row('Website', item.website)}
          {row('Social media', item.socialMediaUrl)}
          {row('Location', [item.city, item.stateRegion, item.country].filter(Boolean).join(', '))}
          {row('Address', item.businessAddress)}
          {row('Years in business', item.yearsInBusiness)}
          {row('Current brands', item.currentBrands)}
          {row('Areas served', item.areasServed)}
          {row('Monthly requirement', item.monthlyRequirement)}
          {row('Interested products', item.interestedProducts)}
        </div>
        {item.message && <div className="mt-4 text-sm"><span className="text-gray-500">Message:</span> <p className="mt-1 whitespace-pre-wrap">{item.message}</p></div>}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Notes</h2>
        {item.notes?.length > 0 ? (
          <div className="space-y-3 mb-4">
            {item.notes.map((n: any) => (
              <div key={n.id} className="bg-gray-50 rounded p-3">
                <p className="text-sm">{n.content}</p>
                <p className="text-xs text-gray-400 mt-1">{n.author?.name || 'Admin'} • {new Date(n.createdAt).toLocaleString('en-ZA')}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-400 text-sm mb-4">No notes.</p>}
        <textarea rows={3} value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center gap-4">
          <select value={status} onChange={e => setStatus(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <button onClick={handleSave} disabled={saving} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleDelete} className="ml-auto text-red-600 text-sm hover:underline">Delete</button>
        </div>
      </div>
    </div>
  )
}
