export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const stockists = await prisma.stockist.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ stockists })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  const stockist = await prisma.stockist.create({ data })
  await createAuditLog({ adminId: session.user.id, action: 'CREATE', entity: 'Stockist', entityId: stockist.id, details: stockist.businessName })
  return NextResponse.json(stockist)
}
