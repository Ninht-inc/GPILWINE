export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.siteSetting.findMany()
  const map: Record<string, string> = {}
  settings.forEach(s => { map[s.key] = s.value })
  return NextResponse.json(map)
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
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
