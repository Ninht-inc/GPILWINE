export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const faq = await prisma.fAQ.update({
    where: { id: params.id },
    data: {
      question: body.question,
      answer: body.answer,
      published: body.published,
      displayOrder: body.displayOrder,
    },
  })
  return NextResponse.json({ faq })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.fAQ.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
