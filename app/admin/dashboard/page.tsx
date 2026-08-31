export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Wine, FileText, Users, MapPin, MessageSquare, Building2, AlertCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const [newQuotes, newEnquiries, newDistributors, publishedWines, draftWines, stockists, recentQuotes, recentEnquiries] = await Promise.all([
    prisma.quote.count({ where: { status: 'NEW' } }),
    prisma.enquiry.count({ where: { status: 'NEW' } }),
    prisma.distributorEnquiry.count({ where: { status: 'NEW' } }),
    prisma.wine.count({ where: { status: 'PUBLISHED' } }),
    prisma.wine.count({ where: { status: 'DRAFT' } }),
    prisma.stockist.count({ where: { active: true } }),
    prisma.quote.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, referenceNumber: true, fullName: true, status: true, createdAt: true } }),
    prisma.enquiry.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, referenceNumber: true, fullName: true, type: true, status: true, createdAt: true } }),
  ])

  const statCards = [
    { label: 'New Quote Requests', value: newQuotes, href: '/admin/quotes', icon: FileText, color: 'bg-amber-50 text-amber-700' },
    { label: 'New Enquiries', value: newEnquiries, href: '/admin/enquiries', icon: MessageSquare, color: 'bg-blue-50 text-blue-700' },
    { label: 'Distributor Enquiries', value: newDistributors, href: '/admin/distributor-enquiries', icon: Building2, color: 'bg-purple-50 text-purple-700' },
    { label: 'Published Wines', value: publishedWines, href: '/admin/wines', icon: Wine, color: 'bg-green-50 text-green-700' },
    { label: 'Draft Wines', value: draftWines, href: '/admin/wines', icon: Wine, color: 'bg-gray-50 text-gray-600' },
    { label: 'Active Stockists', value: stockists, href: '/admin/stockists', icon: MapPin, color: 'bg-teal-50 text-teal-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-[#222] mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map(card => (
          <Link key={card.label} href={card.href}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon size={20} />
              </div>
              {card.value > 0 && card.label.includes('New') && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{card.value}</span>
              )}
            </div>
            <div className="text-2xl font-bold text-[#222]">{card.value}</div>
            <div className="text-sm text-gray-500 mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[#222]">Recent Quote Requests</h2>
            <Link href="/admin/quotes" className="text-sm text-[#641B2A] hover:underline">View All</Link>
          </div>
          {recentQuotes.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">No quote requests yet</p>
          ) : (
            <div className="space-y-3">
              {recentQuotes.map(q => (
                <Link key={q.id} href={`/admin/quotes/${q.id}`}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-[#222]">{q.fullName}</div>
                    <div className="text-xs text-gray-400">{q.referenceNumber}</div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${q.status === 'NEW' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                      {q.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[#222]">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm text-[#641B2A] hover:underline">View All</Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">No enquiries yet</p>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map(e => (
                <Link key={e.id} href={`/admin/enquiries/${e.id}`}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-[#222]">{e.fullName}</div>
                    <div className="text-xs text-gray-400">{e.type.replace('_', ' ')}</div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${e.status === 'NEW' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {e.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
