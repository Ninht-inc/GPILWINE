'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Wine {
  id: string; name: string; slug: string; status: string;
  varietal: string; vintage?: string; imageUrl?: string; displayOrder: number;
}

export default function AdminWinesPage() {
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/wines')
      .then(r => r.json())
      .then(d => { setWines(d.wines || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const statusColors: Record<string, string> = {
    PUBLISHED: 'bg-green-100 text-green-800',
    DRAFT: 'bg-gray-100 text-gray-800',
    COMING_SOON: 'bg-amber-100 text-amber-800',
    ARCHIVED: 'bg-red-100 text-red-800',
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Wine</th>
                <th className="px-6 py-3 text-left">Varietal</th>
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
                      {w.imageUrl && (
                        <div className="relative w-10 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <Image src={w.imageUrl} alt={w.name} fill className="object-contain" unoptimized />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{w.name}</p>
                        <p className="text-xs text-gray-500">{w.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{w.varietal}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[w.status] || 'bg-gray-100 text-gray-800'}`}>{w.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{w.displayOrder}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/wines/${w.id}`} className="text-[#641B2A] text-sm hover:underline">Edit</Link>
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
