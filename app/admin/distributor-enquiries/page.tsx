'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DE { id: string; referenceNumber: string; companyName: string; contactName: string; email: string; status: string; viewed: boolean; createdAt: string }

export default function AdminDistributorEnquiriesPage() {
  const [items, setItems] = useState<DE[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/distributor-enquiries')
      .then(r => r.json())
      .then(d => { setItems(d.enquiries || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800', REVIEWING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800', REJECTED: 'bg-red-100 text-red-800',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Distributor Enquiries</h1>
      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No distributor enquiries yet.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Reference</th>
                <th className="px-6 py-3 text-left">Company</th>
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
                  <td className="px-6 py-4 text-sm font-medium">{i.companyName}</td>
                  <td className="px-6 py-4"><p className="text-sm">{i.contactName}</p><p className="text-xs text-gray-500">{i.email}</p></td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[i.status] || 'bg-gray-100'}`}>{i.status}</span></td>
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
