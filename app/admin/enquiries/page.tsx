'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Enquiry {
  id: string; referenceNumber: string; name: string; email: string;
  subject: string; status: string; viewed: boolean; createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/enquiries')
      .then(r => r.json())
      .then(d => { setEnquiries(d.enquiries || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800', IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800', CLOSED: 'bg-gray-100 text-gray-800',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Contact Enquiries</h1>
      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading...</div>
      ) : enquiries.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No enquiries yet.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Reference</th>
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
                  <td className="px-6 py-4"><p className="text-sm font-medium">{e.name}</p><p className="text-xs text-gray-500">{e.email}</p></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{e.subject}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[e.status] || 'bg-gray-100'}`}>{e.status.replace('_', ' ')}</span></td>
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
