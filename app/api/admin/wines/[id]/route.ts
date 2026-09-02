export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { sanitizeWineInput } from '@/lib/wine-fields'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const wine = await prisma.wine.findUnique({ where: { id: params.id } })
  if (!wine) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ wine })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const data = sanitizeWineInput(body)

  try {
    const wine = await prisma.wine.update({ where: { id: params.id }, data: data as any })
    await createAuditLog({ adminId: session.user.id, action: 'UPDATE', entity: 'Wine', entityId: wine.id, details: wine.name })
    return NextResponse.json({ wine })
  } catch (e: any) {
    if (e?.code === 'P2002') return NextResponse.json({ error: 'A wine with that slug already exists' }, { status: 409 })
    throw e
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const wine = await prisma.wine.findUnique({ where: { id: params.id }, include: { _count: { select: { quoteItems: true } } } })
  if (!wine) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Hard delete only when the wine isn't referenced by any quote request.
  if (searchParams.get('hard') === 'true') {
    if (wine._count.quoteItems > 0) {
      return NextResponse.json(
        { error: `This wine appears in ${wine._count.quoteItems} quote request(s). Archive it instead.` },
        { status: 409 }
      )
    }
    await prisma.wine.delete({ where: { id: params.id } })
    await createAuditLog({ adminId: session.user.id, action: 'DELETE', entity: 'Wine', entityId: params.id, details: wine.name })
    return NextResponse.json({ success: true, deleted: true })
  }

  await prisma.wine.update({ where: { id: params.id }, data: { status: 'ARCHIVED' } })
  await createAuditLog({ adminId: session.user.id, action: 'ARCHIVE', entity: 'Wine', entityId: params.id, details: wine.name })
  return NextResponse.json({ success: true, archived: true })
}
