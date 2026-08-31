export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const wine = await prisma.wine.findUnique({ where: { id: params.id } })
  if (!wine) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(wine)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  const wine = await prisma.wine.update({ where: { id: params.id }, data })
  await createAuditLog({ adminId: session.user.id, action: 'UPDATE', entity: 'Wine', entityId: wine.id, details: wine.name })
  return NextResponse.json(wine)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const wine = await prisma.wine.update({ where: { id: params.id }, data: { status: 'ARCHIVED' } })
  await createAuditLog({ adminId: session.user.id, action: 'ARCHIVE', entity: 'Wine', entityId: wine.id, details: wine.name })
  return NextResponse.json(wine)
}
