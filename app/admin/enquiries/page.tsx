'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Enquiry {
  id: string; referenceNumber: string; type: string; fullName: string; email: string;
  subject: string | null; status: string; viewed: boolean; createdAt: string;
}

const STATUSES = ['NEW', 'IN_PROGRESS', 'RESPONDED', 'CLOSED']

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (type) params.set('type', type)
    setLoading(true)
    fetch(`/api/admin/enquiries?${params}`)
      .then(r => r.json())
      .then(d => { setEnquiries(d.enquiries || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [status, type])

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800', IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    RESPONDED: 'bg-green-100 text-green-800', CLOSED: 'bg-gray-100 text-gray-800',
  }

  const types = Array.from(new Set(enquiries.map(e => e.type))).sort()

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contact Enquiries</h1>
        <div className="flex flex-wrap items-center gap-2">
          <select value={type} onChange={e => setType(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
            <option value="">All types</option>
            {types.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <a href="/api/admin/export?type=enquiries" className="bg-[#641B2A] text-white px-4 py-2 text-sm font-medium rounded hover:bg-[#7a2235]">Export CSV</a>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading...</div>
      ) : enquiries.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No enquiries found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Reference</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">From</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enquiries.map(e => (
                <tr key={e.id} className={`hover:bg-gray-50 ${!e.viewed ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-6 py-4 text-sm font-mono">{e.referenceNumber}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{e.type?.replace(/_/g, ' ')}</td>
                  <td className="px-6 py-4"><p className="text-sm font-medium">{e.fullName}</p><p className="text-xs text-gray-500">{e.email}</p></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{e.subject || '—'}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[e.status] || 'bg-gray-100'}`}>{e.status.replace(/_/g, ' ')}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(e.createdAt).toLocaleDateString('en-ZA')}</td>
                  <td className="px-6 py-4 text-right"><Link href={`/admin/enquiries/${e.id}`} className="text-[#641B2A] text-sm hover:underline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
