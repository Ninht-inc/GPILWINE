export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { guard, SUPER_ONLY } from '@/lib/rbac'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

export async function GET() {
  const gate = await guard(SUPER_ONLY)
  if ('error' in gate) return gate.error
  const session = gate.session as any

  const rows = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } })
  return NextResponse.json({ settings: rows })
}

export async function PUT(request: Request) {
  const gate = await guard(SUPER_ONLY)
  if ('error' in gate) return gate.error
  const session = gate.session as any

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
