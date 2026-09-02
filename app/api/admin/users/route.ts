export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/db'
import { guard, SUPER_ONLY, ALL_ROLES } from '@/lib/rbac'
import { createAuditLog } from '@/lib/audit'
import { createAuthToken, sendInviteEmail } from '@/lib/auth-tokens'

export async function GET() {
  const gate = await guard(SUPER_ONLY)
  if ('error' in gate) return gate.error

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  })
  // which users still have a pending invite (never logged in / no real password set)
  const pending = await prisma.authToken.findMany({
    where: { purpose: 'invite', usedAt: null, expiresAt: { gt: new Date() } },
    select: { userId: true },
  })
  const pendingIds = new Set(pending.map((p) => p.userId))
  return NextResponse.json({ users: users.map((u) => ({ ...u, pendingInvite: pendingIds.has(u.id) })) })
}

export async function POST(request: Request) {
  const gate = await guard(SUPER_ONLY)
  if ('error' in gate) return gate.error

  const { email, name, role } = await request.json()
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
  }
  const finalRole = ALL_ROLES.includes(role) ? role : 'ENQUIRY_MANAGER'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'A user with that email already exists' }, { status: 409 })
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: name || null,
      role: finalRole,
      active: false,
      password: await bcrypt.hash(randomBytes(24).toString('hex'), 12), // placeholder until they accept
    },
  })

  const token = await createAuthToken(user.id, 'invite')
  const mail = await sendInviteEmail({
    email,
    name,
    token,
    inviterName: (gate.session as any).user?.name,
  })

  await createAuditLog({
    adminId: (gate.session as any).user.id,
    action: 'INVITE',
    entity: 'User',
    entityId: user.id,
    details: `${email} as ${finalRole}`,
  })

  return NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role },
    emailSent: mail.success,
    emailError: mail.error,
    // surfaced so the admin can copy the link if email isn't set up yet
    inviteUrl: `${(process.env.NEXTAUTH_URL || '').replace(/\/$/, '')}/admin/accept-invite?token=${token}`,
  })
}
