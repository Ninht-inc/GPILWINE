'use client'

import { useState, useEffect } from 'react'

interface Stockist {
  id: string; name: string; type: string; city: string; province: string; active: boolean;
}

export default function AdminStockistsPage() {
  const [stockists, setStockists] = useState<Stockist[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'RETAIL', address: '', city: '', province: '', phone: '', email: '', website: '' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/admin/stockists')
      .then(r => r.json())
      .then(d => { setStockists(d.stockists || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      await fetch('/api/admin/stockists', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setForm({ name: '', type: 'RETAIL', address: '', city: '', province: '', phone: '', email: '', website: '' })
      setShowForm(false); load()
    } catch {}
    finally { setSaving(false) }
  }

  const toggleActive = async (id: string, active: boolean) => {
    await fetch(`/api/admin/stockists/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !active }) })
    load()
  }

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
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"><option value="RETAIL">Retail</option><option value="RESTAURANT">Restaurant</option><option value="ONLINE">Online</option><option value="WHOLESALE">Wholesale</option></select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Address *</label><input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">City *</label><input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Province *</label><input required value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Website</label><input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          </div>
          <button type="submit" disabled={saving} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">{saving ? 'Saving...' : 'Add Stockist'}</button>
        </form>
      )}

      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading...</div>
      ) : stockists.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No stockists added yet.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr><th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Type</th><th className="px-6 py-3 text-left">Location</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stockists.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{s.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.city}, {s.province}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded font-medium ${s.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{s.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-6 py-4 text-right"><button onClick={() => toggleActive(s.id, s.active)} className="text-[#641B2A] text-sm hover:underline">{s.active ? 'Deactivate' : 'Activate'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
