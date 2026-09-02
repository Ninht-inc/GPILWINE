'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Wine {
  id: string; name: string; slug: string; status: string;
  category: string | null; vintage: string | null; mainImage: string | null; displayOrder: number;
}

export default function AdminWinesPage() {
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/wines')
      .then(r => r.json())
      .then(d => { setWines(d.wines || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const statusColors: Record<string, string> = {
    PUBLISHED: 'bg-green-100 text-green-800',
    DRAFT: 'bg-gray-100 text-gray-800',
    COMING_SOON: 'bg-amber-100 text-amber-800',
    ARCHIVED: 'bg-red-100 text-red-800',
  }

  const archive = async (id: string) => {
    if (!confirm('Archive this wine? It will be hidden from the site but kept in the database.')) return
    await fetch(`/api/admin/wines/${id}`, { method: 'DELETE' })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Permanently delete this wine? This cannot be undone.')) return
    const res = await fetch(`/api/admin/wines/${id}?hard=true`, { method: 'DELETE' })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      alert(d.error || 'Could not delete')
    }
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Wines</h1>
        <Link href="/admin/wines/new" className="bg-[#641B2A] text-white px-4 py-2 text-sm font-medium rounded hover:bg-[#7a2235] transition-colors">+ Add Wine</Link>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading...</div>
      ) : wines.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No wines found. Add your first wine above.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Wine</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Order</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {wines.map(w => (
                <tr key={w.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {w.mainImage
                          ? <Image src={w.mainImage} alt={w.name} fill className="object-contain" unoptimized />
                          : <div className="flex items-center justify-center h-full text-[10px] text-gray-300">GPIL</div>}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{w.name}</p>
                        <p className="text-xs text-gray-500">{w.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{w.category || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[w.status] || 'bg-gray-100 text-gray-800'}`}>{w.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{w.displayOrder}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Link href={`/admin/wines/${w.id}`} className="text-[#641B2A] text-sm hover:underline">Edit</Link>
                    {w.status !== 'ARCHIVED' && <button onClick={() => archive(w.id)} className="ml-4 text-gray-500 text-sm hover:underline">Archive</button>}
                    <button onClick={() => remove(w.id)} className="ml-4 text-red-600 text-sm hover:underline">Delete</button>
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
