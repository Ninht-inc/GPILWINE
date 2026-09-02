export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { verifyAuthToken, consumeAuthToken } from '@/lib/auth-tokens'

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') || ''
  const userId = await verifyAuthToken(token, 'invite')
  if (!userId) return NextResponse.json({ error: 'This invitation link is invalid or has expired' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } })
  return NextResponse.json({ email: user?.email, name: user?.name })
}

export async function POST(request: Request) {
  const { token, password } = await request.json()
  if (!password || String(password).length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }
  const userId = await consumeAuthToken(token, 'invite')
  if (!userId) return NextResponse.json({ error: 'This invitation link is invalid or has expired' }, { status: 400 })

  await prisma.user.update({
    where: { id: userId },
    data: { password: await bcrypt.hash(String(password), 12), active: true },
  })
  return NextResponse.json({ success: true })
}
