'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Quote {
  id: string; referenceNumber: string; customerName: string; customerEmail: string;
  status: string; viewed: boolean; createdAt: string; _count?: { items: number };
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    fetch(`/api/admin/quotes?${params}`)
      .then(r => r.json())
      .then(d => { setQuotes(d.quotes || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [statusFilter])

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800', IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    QUOTED: 'bg-green-100 text-green-800', CLOSED: 'bg-gray-100 text-gray-800',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="QUOTED">Quoted</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading...</div>
      ) : quotes.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No quote requests found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Reference</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Items</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.map(q => (
                <tr key={q.id} className={`hover:bg-gray-50 ${!q.viewed ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-6 py-4 text-sm font-mono">{q.referenceNumber}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{q.customerName}</p>
                    <p className="text-xs text-gray-500">{q.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{q._count?.items || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[q.status] || 'bg-gray-100'}`}>{q.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(q.createdAt).toLocaleDateString('en-ZA')}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/quotes/${q.id}`} className="text-[#641B2A] text-sm hover:underline">View</Link>
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
