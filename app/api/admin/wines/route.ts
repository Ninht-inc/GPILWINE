export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { sanitizeWineInput } from '@/lib/wine-fields'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const wines = await prisma.wine.findMany({ orderBy: { displayOrder: 'asc' } })
  return NextResponse.json({ wines })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const data = sanitizeWineInput(body)

  if (!data.name || !data.slug) {
    return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
  }

  try {
    const wine = await prisma.wine.create({ data: data as any })
    await createAuditLog({ adminId: session.user.id, action: 'CREATE', entity: 'Wine', entityId: wine.id, details: wine.name })
    return NextResponse.json({ wine })
  } catch (e: any) {
    if (e?.code === 'P2002') return NextResponse.json({ error: 'A wine with that slug already exists' }, { status: 409 })
    throw e
  }
}
