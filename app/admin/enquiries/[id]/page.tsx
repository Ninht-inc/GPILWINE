'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

const STATUSES = ['NEW', 'IN_PROGRESS', 'RESPONDED', 'CLOSED']

export default function AdminEnquiryDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [enquiry, setEnquiry] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch(`/api/admin/enquiries/${id}`)
      .then(r => r.json())
      .then(d => { setEnquiry(d.enquiry); setStatus(d.enquiry?.status || ''); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: newNote || undefined }),
      })
      setNewNote(''); load()
    } catch {}
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this enquiry permanently? This cannot be undone.')) return
    await fetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' })
    router.push('/admin/enquiries')
  }

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>
  if (!enquiry) return <div className="text-gray-500 py-12 text-center">Enquiry not found</div>

  const hasLocation = enquiry.country || enquiry.state || enquiry.city

  return (
    <div className="max-w-3xl">
      <button onClick={() => router.push('/admin/enquiries')} className="text-sm text-gray-500 hover:text-gray-700 mb-4">← Back</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{enquiry.referenceNumber}</h1>
      <p className="text-gray-500 text-sm mb-8">{enquiry.type?.replace(/_/g, ' ')} · Submitted {new Date(enquiry.createdAt).toLocaleString('en-ZA')}</p>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Contact Details</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Name:</span> <span className="font-medium">{enquiry.fullName}</span></div>
          <div><span className="text-gray-500">Email:</span> <span className="font-medium">{enquiry.email}</span></div>
          <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{enquiry.phone || '—'}</span></div>
          <div><span className="text-gray-500">WhatsApp:</span> <span className="font-medium">{enquiry.whatsapp || '—'}</span></div>
          <div><span className="text-gray-500">Subject:</span> <span className="font-medium">{enquiry.subject || '—'}</span></div>
          {hasLocation && <div><span className="text-gray-500">Location:</span> <span className="font-medium">{[enquiry.city, enquiry.state, enquiry.country].filter(Boolean).join(', ')}</span></div>}
          {enquiry.wineInterest && <div><span className="text-gray-500">Wine interest:</span> <span className="font-medium">{enquiry.wineInterest}</span></div>}
          {enquiry.quantity && <div><span className="text-gray-500">Quantity:</span> <span className="font-medium">{enquiry.quantity}</span></div>}
        </div>
        {enquiry.message && <div className="mt-4"><span className="text-gray-500 text-sm">Message:</span><p className="mt-1 text-gray-700 text-sm whitespace-pre-wrap">{enquiry.message}</p></div>}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Notes</h2>
        {enquiry.notes?.length > 0 ? (
          <div className="space-y-3 mb-4">
            {enquiry.notes.map((n: any) => (
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
