export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  const stockist = await prisma.stockist.update({ where: { id: params.id }, data })
  await createAuditLog({ adminId: session.user.id, action: 'UPDATE', entity: 'Stockist', entityId: stockist.id, details: stockist.businessName })
  return NextResponse.json(stockist)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.stockist.update({ where: { id: params.id }, data: { active: false } })
  await createAuditLog({ adminId: session.user.id, action: 'ARCHIVE', entity: 'Stockist', entityId: params.id })
  return NextResponse.json({ success: true })
}
