export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get('country')
  const state = searchParams.get('state')
  const city = searchParams.get('city')

  const where: Record<string, unknown> = { active: true }
  if (country) where.country = country
  if (state) where.state = state
  if (city) where.city = { contains: city, mode: 'insensitive' }

  const stockists = await prisma.stockist.findMany({ where: where as any, orderBy: { featured: 'desc' } })
  return NextResponse.json(stockists)
}
