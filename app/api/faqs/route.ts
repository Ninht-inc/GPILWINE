export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const faqs = await prisma.fAQ.findMany({ where: { published: true }, orderBy: { displayOrder: 'asc' } })
  return NextResponse.json(faqs)
}
