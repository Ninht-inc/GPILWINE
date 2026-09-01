'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DE {
  id: string; referenceNumber: string; businessName: string; firstName: string; lastName: string;
  businessEmail: string; status: string; viewed: boolean; createdAt: string;
}

const STATUSES = ['NEW', 'UNDER_REVIEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'APPROVED', 'DECLINED', 'CLOSED']

export default function AdminDistributorEnquiriesPage() {
  const [items, setItems] = useState<DE[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    setLoading(true)
    fetch(`/api/admin/distributor-enquiries?${params}`)
      .then(r => r.json())
      .then(d => { setItems(d.enquiries || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [status])

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800', UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
    CONTACTED: 'bg-indigo-100 text-indigo-800', QUALIFIED: 'bg-teal-100 text-teal-800',
    FOLLOW_UP: 'bg-amber-100 text-amber-800', APPROVED: 'bg-green-100 text-green-800',
    DECLINED: 'bg-red-100 text-red-800', CLOSED: 'bg-gray-100 text-gray-800',
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Distributor Enquiries</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select value={status} onChange={e => setStatus(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <a href="/api/admin/export?type=distributor" className="bg-[#641B2A] text-white px-4 py-2 text-sm font-medium rounded hover:bg-[#7a2235]">Export CSV</a>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No distributor enquiries found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Reference</th>
                <th className="px-6 py-3 text-left">Business</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(i => (
                <tr key={i.id} className={`hover:bg-gray-50 ${!i.viewed ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-6 py-4 text-sm font-mono">{i.referenceNumber}</td>
                  <td className="px-6 py-4 text-sm font-medium">{i.businessName}</td>
                  <td className="px-6 py-4"><p className="text-sm">{[i.firstName, i.lastName].filter(Boolean).join(' ')}</p><p className="text-xs text-gray-500">{i.businessEmail}</p></td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[i.status] || 'bg-gray-100'}`}>{i.status.replace(/_/g, ' ')}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(i.createdAt).toLocaleDateString('en-ZA')}</td>
                  <td className="px-6 py-4 text-right"><Link href={`/admin/distributor-enquiries/${i.id}`} className="text-[#641B2A] text-sm hover:underline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
