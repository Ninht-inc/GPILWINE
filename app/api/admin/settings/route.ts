export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } })
  return NextResponse.json({ settings: rows })
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const data: Record<string, unknown> = body?.settings ?? body ?? {}

  for (const [key, value] of Object.entries(data)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })
  }
  await createAuditLog({ adminId: session.user.id, action: 'UPDATE', entity: 'SiteSettings', details: `Updated ${Object.keys(data).length} settings` })
  return NextResponse.json({ success: true })
}
