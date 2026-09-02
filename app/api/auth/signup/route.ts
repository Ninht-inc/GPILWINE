export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { guard, SUPER_ONLY } from '@/lib/rbac'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createAuditLog } from '@/lib/audit'

/** Create an admin user. Requires an existing signed-in admin. */
export async function POST(request: NextRequest) {
  const gate = await guard(SUPER_ONLY)
  if ('error' in gate) return gate.error
  const session = gate.session as any

  try {
    const { email, password, name, role } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    if (String(password).length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 12),
        name: name || email.split('@')[0],
        role: role === 'CONTENT_ADMIN' || role === 'ENQUIRY_MANAGER' ? role : 'SUPER_ADMIN',
      },
    })
    await createAuditLog({ adminId: session.user.id, action: 'CREATE', entity: 'User', entityId: user.id, details: user.email })
    return NextResponse.json({ id: user.id, email: user.email })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
