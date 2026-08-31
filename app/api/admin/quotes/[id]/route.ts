export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
    include: { items: true, notes: { include: { author: { select: { name: true } } }, orderBy: { createdAt: 'desc' } } },
  })
  if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  
  if (!quote.viewed) {
    await prisma.quote.update({ where: { id: params.id }, data: { viewed: true } })
  }
  return NextResponse.json(quote)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  
  if (data.note) {
    await prisma.quoteNote.create({
      data: { quoteId: params.id, content: data.note, authorId: session.user.id },
    })
    delete data.note
  }
  
  if (data.status) {
    const quote = await prisma.quote.update({ where: { id: params.id }, data: { status: data.status } })
    await createAuditLog({ adminId: session.user.id, action: 'STATUS_CHANGE', entity: 'Quote', entityId: params.id, details: `Status changed to ${data.status}` })
    return NextResponse.json(quote)
  }
  
  return NextResponse.json({ success: true })
}
