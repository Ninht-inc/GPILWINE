export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { guard, SUPER_ONLY } from '@/lib/rbac'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'

const KEYS = [
  'smtp_host',
  'smtp_port',
  'smtp_secure',
  'smtp_user',
  'smtp_from_email',
  'smtp_from_name',
  'smtp_enabled',
  'mail_admin_recipient',
] as const

// Password is stored but never sent back to the browser.
const PASSWORD_KEY = 'smtp_password'

export async function GET() {
  const gate = await guard(SUPER_ONLY)
  if ('error' in gate) return gate.error
  const session = gate.session as any

  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: [...KEYS, PASSWORD_KEY] } },
  })
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))

  const settings: Record<string, string> = {}
  for (const key of KEYS) settings[key] = map[key] ?? ''

  return NextResponse.json({
    settings,
    hasPassword: Boolean(map[PASSWORD_KEY]),
  })
}

export async function PUT(request: Request) {
  const gate = await guard(SUPER_ONLY)
  if ('error' in gate) return gate.error
  const session = gate.session as any

  const body = await request.json()
  const incoming: Record<string, unknown> = body?.settings ?? body ?? {}

  const updates: { key: string; value: string }[] = []
  for (const key of KEYS) {
    if (key in incoming && incoming[key] != null) {
      updates.push({ key, value: String(incoming[key]) })
    }
  }
  // Only touch the password when a new, non-empty value is supplied.
  if (typeof incoming[PASSWORD_KEY] === 'string' && incoming[PASSWORD_KEY].length > 0) {
    updates.push({ key: PASSWORD_KEY, value: incoming[PASSWORD_KEY] })
  }

  for (const { key, value } of updates) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  await createAuditLog({
    adminId: session.user.id,
    action: 'UPDATE',
    entity: 'EmailSettings',
    details: `Updated ${updates.map((u) => u.key).join(', ')}`,
  })

  return NextResponse.json({ success: true })
}
