export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

type Row = Record<string, unknown>

function toCsv(rows: Row[], columns: string[]): string {
  const escape = (v: unknown): string => {
    if (v == null) return ''
    let s: string
    if (Array.isArray(v)) s = v.join('; ')
    else if (v instanceof Date) s = v.toISOString()
    else if (typeof v === 'object') s = JSON.stringify(v)
    else s = String(v)
    if (/[",\r\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`
    return s
  }
  const header = columns.join(',')
  const body = rows.map((r) => columns.map((c) => escape(r[c])).join(',')).join('\r\n')
  // BOM so Excel opens UTF-8 correctly
  return '﻿' + header + '\r\n' + body + (body ? '\r\n' : '')
}

const CONFIG: Record<
  string,
  { columns: string[]; load: () => Promise<Row[]> }
> = {
  enquiries: {
    columns: [
      'referenceNumber', 'type', 'status', 'fullName', 'email', 'phone', 'whatsapp',
      'subject', 'message', 'country', 'state', 'city', 'wineInterest', 'quantity',
      'emailDeliveryStatus', 'adminEmailStatus', 'createdAt',
    ],
    load: () => prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } }) as unknown as Promise<Row[]>,
  },
  quotes: {
    columns: [
      'referenceNumber', 'status', 'fullName', 'email', 'phone', 'whatsapp',
      'preferredContact', 'country', 'state', 'city', 'deliveryLocation', 'fullAddress',
      'occasion', 'requiredDate', 'message', 'items', 'createdAt',
    ],
    load: async () => {
      const quotes = await prisma.quote.findMany({
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      })
      return quotes.map((q) => ({
        ...q,
        items: q.items.map((i) => `${i.quantity}x ${i.wineName}${i.bottleSize ? ` (${i.bottleSize})` : ''}`).join('; '),
      })) as unknown as Row[]
    },
  },
  distributor: {
    columns: [
      'referenceNumber', 'status', 'firstName', 'lastName', 'businessName', 'businessEmail',
      'phone', 'whatsapp', 'businessType', 'registrationNumber', 'website', 'socialMediaUrl',
      'country', 'stateRegion', 'city', 'businessAddress', 'yearsInBusiness', 'currentBrands',
      'areasServed', 'monthlyRequirement', 'interestedProducts', 'message', 'createdAt',
    ],
    load: () =>
      prisma.distributorEnquiry.findMany({ orderBy: { createdAt: 'desc' } }) as unknown as Promise<Row[]>,
  },
  stockists: {
    columns: [
      'businessName', 'country', 'state', 'city', 'address', 'phone', 'whatsapp', 'website',
      'googleMapsUrl', 'productsAvailable', 'openingHours', 'featured', 'active', 'createdAt',
    ],
    load: () => prisma.stockist.findMany({ orderBy: { createdAt: 'desc' } }) as unknown as Promise<Row[]>,
  },
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || ''
  const cfg = CONFIG[type]
  if (!cfg) {
    return NextResponse.json(
      { error: `Unknown export type. Use one of: ${Object.keys(CONFIG).join(', ')}` },
      { status: 400 }
    )
  }

  const rows = await cfg.load()
  const csv = toCsv(rows, cfg.columns)
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="gpil-${type}-${date}.csv"`,
    },
  })
}
