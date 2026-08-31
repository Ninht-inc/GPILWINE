export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const wines = await prisma.wine.findMany({ orderBy: { displayOrder: 'asc' } })
  return NextResponse.json(wines)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  const wine = await prisma.wine.create({ data })
  await createAuditLog({ adminId: session.user.id, action: 'CREATE', entity: 'Wine', entityId: wine.id, details: wine.name })
  return NextResponse.json(wine)
}
