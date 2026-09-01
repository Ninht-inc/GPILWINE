'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

const STATUSES = ['NEW', 'REVIEWING', 'CONTACTED', 'QUOTE_SENT', 'FOLLOW_UP', 'COMPLETED', 'CANCELLED', 'CLOSED']

export default function AdminQuoteDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch(`/api/admin/quotes/${id}`)
      .then(r => r.json())
      .then(d => { setQuote(d.quote); setStatus(d.quote?.status || ''); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/admin/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: newNote || undefined }),
      })
      setNewNote('')
      load()
    } catch {}
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this quote request permanently? This cannot be undone.')) return
    await fetch(`/api/admin/quotes/${id}`, { method: 'DELETE' })
    router.push('/admin/quotes')
  }

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>
  if (!quote) return <div className="text-gray-500 py-12 text-center">Quote not found</div>

  return (
    <div className="max-w-4xl">
      <button onClick={() => router.push('/admin/quotes')} className="text-sm text-gray-500 hover:text-gray-700 mb-4">← Back to Quotes</button>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{quote.referenceNumber}</h1>
          <p className="text-gray-500 text-sm">Submitted {new Date(quote.createdAt).toLocaleString('en-ZA')}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Customer Details</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="font-medium">{quote.fullName}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="font-medium">{quote.email}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{quote.phone || '—'}</span></div>
              <div><span className="text-gray-500">WhatsApp:</span> <span className="font-medium">{quote.whatsapp || '—'}</span></div>
              <div><span className="text-gray-500">Preferred contact:</span> <span className="font-medium">{quote.preferredContact || '—'}</span></div>
              <div><span className="text-gray-500">Location:</span> <span className="font-medium">{[quote.city, quote.state, quote.country].filter(Boolean).join(', ') || '—'}</span></div>
              {quote.occasion && <div><span className="text-gray-500">Occasion:</span> <span className="font-medium">{quote.occasion}</span></div>}
              {quote.requiredDate && <div><span className="text-gray-500">Required date:</span> <span className="font-medium">{quote.requiredDate}</span></div>}
            </div>
            {(quote.fullAddress || quote.deliveryLocation) && (
              <div className="mt-4 text-sm"><span className="text-gray-500">Delivery:</span> <span className="font-medium">{[quote.deliveryLocation, quote.fullAddress].filter(Boolean).join(' — ')}</span></div>
            )}
            {quote.message && <div className="mt-4 text-sm"><span className="text-gray-500">Message:</span><p className="mt-1 text-gray-700 whitespace-pre-wrap">{quote.message}</p></div>}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Requested Items</h2>
            <div className="space-y-3">
              {quote.items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{item.wineName}</p>
                    <p className="text-xs text-gray-500">{item.bottleSize || ''}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#641B2A]">Qty: {item.quantity}</span>
                </div>
              ))}
              {(!quote.items || quote.items.length === 0) && <p className="text-gray-400 text-sm">No items.</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Internal Notes</h2>
            {quote.notes?.length > 0 ? (
              <div className="space-y-3 mb-4">
                {quote.notes.map((n: any) => (
                  <div key={n.id} className="bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-700">{n.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.author?.name || 'Admin'} • {new Date(n.createdAt).toLocaleString('en-ZA')}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400 text-sm mb-4">No notes yet.</p>}
            <textarea rows={3} value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none mb-3" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Status</h2>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white mb-4">
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
            <button onClick={handleSave} disabled={saving} className="w-full bg-[#641B2A] text-white py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={handleDelete} className="w-full mt-2 text-red-600 text-sm hover:underline">Delete request</button>
          </div>
        </div>
      </div>
    </div>
  )
}
