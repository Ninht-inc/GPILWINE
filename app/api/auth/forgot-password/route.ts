export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { createAuthToken, verifyAuthToken, consumeAuthToken, sendResetEmail } from '@/lib/auth-tokens'

// Request a reset link
export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({}))
  if (email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user && user.active) {
      const token = await createAuthToken(user.id, 'reset')
      await sendResetEmail({ email: user.email, name: user.name, token })
    }
  }
  // Always report success so the endpoint can't be used to probe for accounts.
  return NextResponse.json({ success: true })
}

// Validate a reset token
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') || ''
  const userId = await verifyAuthToken(token, 'reset')
  return NextResponse.json({ valid: Boolean(userId) })
}

// Complete the reset
export async function PUT(request: Request) {
  const { token, password } = await request.json()
  if (!password || String(password).length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }
  const userId = await consumeAuthToken(token, 'reset')
  if (!userId) return NextResponse.json({ error: 'This reset link is invalid or has expired' }, { status: 400 })

  await prisma.user.update({
    where: { id: userId },
    data: { password: await bcrypt.hash(String(password), 12) },
  })
  return NextResponse.json({ success: true })
}
