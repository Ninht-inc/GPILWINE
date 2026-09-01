'use client'

import { useState, useEffect } from 'react'

interface Stockist {
  id: string; businessName: string; country: string; state: string; city: string | null;
  phone: string | null; website: string | null; featured: boolean; active: boolean;
}

const EMPTY = {
  businessName: '', country: 'Nigeria', state: '', city: '', address: '',
  phone: '', whatsapp: '', website: '', googleMapsUrl: '', openingHours: '',
  productsAvailable: '', featured: false,
}

export default function AdminStockistsPage() {
  const [stockists, setStockists] = useState<Stockist[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/admin/stockists')
      .then(r => r.json())
      .then(d => { setStockists(d.stockists || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const set = (k: keyof typeof EMPTY, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = {
        businessName: form.businessName,
        country: form.country,
        state: form.state,
        city: form.city || null,
        address: form.address || null,
        phone: form.phone || null,
        whatsapp: form.whatsapp || null,
        website: form.website || null,
        googleMapsUrl: form.googleMapsUrl || null,
        openingHours: form.openingHours || null,
        productsAvailable: form.productsAvailable.split(',').map(s => s.trim()).filter(Boolean),
        featured: form.featured,
      }
      await fetch('/api/admin/stockists', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      setForm({ ...EMPTY }); setShowForm(false); load()
    } catch {}
    finally { setSaving(false) }
  }

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/stockists/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !active }) })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this stockist permanently?')) return
    await fetch(`/api/admin/stockists/${id}?hard=true`, { method: 'DELETE' })
    load()
  }

  const field = 'w-full border border-gray-300 rounded px-3 py-2 text-sm'
  const label = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Stockists</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#641B2A] text-white px-4 py-2 text-sm font-medium rounded hover:bg-[#7a2235]">
          {showForm ? 'Cancel' : '+ Add Stockist'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={label}>Business Name *</label><input required value={form.businessName} onChange={e => set('businessName', e.target.value)} className={field} /></div>
            <div><label className={label}>Website</label><input value={form.website} onChange={e => set('website', e.target.value)} className={field} /></div>
          </div>
          <div><label className={label}>Address</label><input value={form.address} onChange={e => set('address', e.target.value)} className={field} /></div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className={label}>City</label><input value={form.city} onChange={e => set('city', e.target.value)} className={field} /></div>
            <div><label className={label}>State / Region *</label><input required value={form.state} onChange={e => set('state', e.target.value)} className={field} /></div>
            <div><label className={label}>Country *</label><input required value={form.country} onChange={e => set('country', e.target.value)} className={field} /></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className={label}>Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} className={field} /></div>
            <div><label className={label}>WhatsApp</label><input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} className={field} /></div>
            <div><label className={label}>Google Maps URL</label><input value={form.googleMapsUrl} onChange={e => set('googleMapsUrl', e.target.value)} className={field} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={label}>Opening Hours</label><input value={form.openingHours} onChange={e => set('openingHours', e.target.value)} className={field} /></div>
            <div><label className={label}>Products Available (comma-separated)</label><input value={form.productsAvailable} onChange={e => set('productsAvailable', e.target.value)} className={field} /></div>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="h-4 w-4" /> Featured</label>
          <button type="submit" disabled={saving} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">{saving ? 'Saving...' : 'Add Stockist'}</button>
        </form>
      )}

      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading...</div>
      ) : stockists.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No stockists added yet.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr><th className="px-6 py-3 text-left">Business</th><th className="px-6 py-3 text-left">Location</th><th className="px-6 py-3 text-left">Contact</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stockists.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{s.businessName}{s.featured && <span className="ml-2 text-xs text-amber-600">★</span>}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{[s.city, s.state, s.country].filter(Boolean).join(', ')}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.phone || '—'}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded font-medium ${s.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{s.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => toggleActive(s.id, s.active)} className="text-[#641B2A] text-sm hover:underline">{s.active ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={() => remove(s.id)} className="ml-4 text-red-600 text-sm hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
