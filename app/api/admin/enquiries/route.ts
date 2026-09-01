export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (type) where.type = type

  const enquiries = await prisma.enquiry.findMany({
    where: where as any,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ enquiries })
}
