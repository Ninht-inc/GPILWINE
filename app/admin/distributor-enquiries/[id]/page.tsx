'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

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

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>
  if (!item) return <div className="text-gray-500 py-12 text-center">Not found</div>

  return (
    <div className="max-w-3xl">
      <button onClick={() => router.push('/admin/distributor-enquiries')} className="text-sm text-gray-500 hover:text-gray-700 mb-4">← Back</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.referenceNumber}</h1>
      <p className="text-gray-500 text-sm mb-8">{item.companyName}</p>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Details</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Company:</span> <span className="font-medium">{item.companyName}</span></div>
          <div><span className="text-gray-500">Contact:</span> <span className="font-medium">{item.contactName}</span></div>
          <div><span className="text-gray-500">Email:</span> <span className="font-medium">{item.email}</span></div>
          <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{item.phone}</span></div>
          <div><span className="text-gray-500">Region:</span> <span className="font-medium">{item.region || '—'}</span></div>
          <div><span className="text-gray-500">Website:</span> <span className="font-medium">{item.website || '—'}</span></div>
        </div>
        {item.existingPortfolio && <div className="mt-4 text-sm"><span className="text-gray-500">Portfolio:</span> <p className="mt-1">{item.existingPortfolio}</p></div>}
        {item.message && <div className="mt-4 text-sm"><span className="text-gray-500">Message:</span> <p className="mt-1 whitespace-pre-wrap">{item.message}</p></div>}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Notes</h2>
        {item.notes?.length > 0 ? (
          <div className="space-y-3 mb-4">
            {item.notes.map((n: any) => (
              <div key={n.id} className="bg-gray-50 rounded p-3">
                <p className="text-sm">{n.content}</p>
                <p className="text-xs text-gray-400 mt-1">{n.author} • {new Date(n.createdAt).toLocaleString('en-ZA')}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-400 text-sm mb-4">No notes.</p>}
        <textarea rows={3} value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <select value={status} onChange={e => setStatus(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
            <option value="NEW">New</option>
            <option value="REVIEWING">Reviewing</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button onClick={handleSave} disabled={saving} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
