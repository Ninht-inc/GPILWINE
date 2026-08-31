export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const wine = await prisma.wine.findUnique({
    where: { slug: params.slug, status: { in: ['PUBLISHED', 'COMING_SOON'] } },
  })
  if (!wine) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(wine)
}
