export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { guard, SUPER_ONLY, ALL_ROLES } from '@/lib/rbac'
import { createAuditLog } from '@/lib/audit'
import { createAuthToken, sendInviteEmail } from '@/lib/auth-tokens'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const gate = await guard(SUPER_ONLY)
  if ('error' in gate) return gate.error
  const me = (gate.session as any).user.id

  const body = await request.json()
  const data: Record<string, unknown> = {}
  if (typeof body.active === 'boolean') data.active = body.active
  if (body.role && ALL_ROLES.includes(body.role)) data.role = body.role
  if (typeof body.name === 'string') data.name = body.name || null

  if (params.id === me && data.active === false) {
    return NextResponse.json({ error: 'You cannot deactivate your own account' }, { status: 400 })
  }
  if (params.id === me && data.role && data.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'You cannot lower your own role' }, { status: 400 })
  }

  // resend invite
  if (body.resendInvite) {
    const user = await prisma.user.findUnique({ where: { id: params.id } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const token = await createAuthToken(user.id, 'invite')
    const mail = await sendInviteEmail({ email: user.email, name: user.name, token, inviterName: (gate.session as any).user?.name })
    return NextResponse.json({
      emailSent: mail.success,
      emailError: mail.error,
      inviteUrl: `${(process.env.NEXTAUTH_URL || '').replace(/\/$/, '')}/admin/accept-invite?token=${token}`,
    })
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, role: true, active: true },
  })
  await createAuditLog({ adminId: me, action: 'UPDATE', entity: 'User', entityId: params.id, details: JSON.stringify(data) })
  return NextResponse.json({ user })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const gate = await guard(SUPER_ONLY)
  if ('error' in gate) return gate.error
  const me = (gate.session as any).user.id

  if (params.id === me) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
  }

  const superCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN', active: true } })
  const target = await prisma.user.findUnique({ where: { id: params.id } })
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (target.role === 'SUPER_ADMIN' && superCount <= 1) {
    return NextResponse.json({ error: 'Cannot remove the last active super admin' }, { status: 400 })
  }

  await prisma.authToken.deleteMany({ where: { userId: params.id } })
  try {
    await prisma.user.delete({ where: { id: params.id } })
    await createAuditLog({ adminId: me, action: 'DELETE', entity: 'User', entityId: params.id, details: target.email })
    return NextResponse.json({ success: true, deleted: true })
  } catch {
    // User has authored notes / audit logs — deactivate instead of hard delete.
    await prisma.user.update({ where: { id: params.id }, data: { active: false } })
    await createAuditLog({ adminId: me, action: 'DEACTIVATE', entity: 'User', entityId: params.id, details: target.email })
    return NextResponse.json({ success: true, deleted: false, deactivated: true })
  }
}
