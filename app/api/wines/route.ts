export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const wines = await prisma.wine.findMany({
    where: { status: { in: ['PUBLISHED', 'COMING_SOON'] } },
    orderBy: { displayOrder: 'asc' },
  })
  return NextResponse.json(wines)
}
