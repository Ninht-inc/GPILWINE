export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const enquiry = await prisma.distributorEnquiry.findUnique({
    where: { id: params.id },
    include: { notes: { include: { author: { select: { name: true } } }, orderBy: { createdAt: 'desc' } } },
  })
  if (!enquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (!enquiry.viewed) {
    await prisma.distributorEnquiry.update({ where: { id: params.id }, data: { viewed: true } })
  }
  return NextResponse.json({ enquiry })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  if (data.note) {
    await prisma.distributorNote.create({ data: { distributorId: params.id, content: data.note, authorId: session.user.id } })
  }
  if (data.status) {
    await prisma.distributorEnquiry.update({ where: { id: params.id }, data: { status: data.status } })
    await createAuditLog({ adminId: session.user.id, action: 'STATUS_CHANGE', entity: 'DistributorEnquiry', entityId: params.id, details: `Status changed to ${data.status}` })
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.distributorNote.deleteMany({ where: { distributorId: params.id } })
  await prisma.distributorEnquiry.delete({ where: { id: params.id } })
  await createAuditLog({ adminId: session.user.id, action: 'DELETE', entity: 'DistributorEnquiry', entityId: params.id })
  return NextResponse.json({ success: true })
}
