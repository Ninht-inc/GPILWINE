export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const faqs = await prisma.fAQ.findMany({ orderBy: { displayOrder: 'asc' } })
  return NextResponse.json({ faqs })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const faq = await prisma.fAQ.create({
    data: {
      question: body.question,
      answer: body.answer,
      published: body.published ?? true,
      displayOrder: body.displayOrder || 0,
    },
  })
  return NextResponse.json({ faq }, { status: 201 })
}
