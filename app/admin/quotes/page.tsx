'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Quote {
  id: string; referenceNumber: string; fullName: string; email: string;
  status: string; viewed: boolean; createdAt: string; _count?: { items: number };
}

const STATUSES = ['NEW', 'REVIEWING', 'CONTACTED', 'QUOTE_SENT', 'FOLLOW_UP', 'COMPLETED', 'CANCELLED', 'CLOSED']

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    setLoading(true)
    fetch(`/api/admin/quotes?${params}`)
      .then(r => r.json())
      .then(d => { setQuotes(d.quotes || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [statusFilter])

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800', REVIEWING: 'bg-yellow-100 text-yellow-800',
    CONTACTED: 'bg-indigo-100 text-indigo-800', QUOTE_SENT: 'bg-green-100 text-green-800',
    FOLLOW_UP: 'bg-amber-100 text-amber-800', COMPLETED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-red-100 text-red-800', CLOSED: 'bg-gray-100 text-gray-800',
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Quote Requests</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <a href="/api/admin/export?type=quotes" className="bg-[#641B2A] text-white px-4 py-2 text-sm font-medium rounded hover:bg-[#7a2235]">Export CSV</a>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading...</div>
      ) : quotes.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No quote requests found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
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
                    <p className="text-sm font-medium text-gray-900">{q.fullName}</p>
                    <p className="text-xs text-gray-500">{q.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{q._count?.items ?? 0}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[q.status] || 'bg-gray-100'}`}>{q.status.replace(/_/g, ' ')}</span>
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
