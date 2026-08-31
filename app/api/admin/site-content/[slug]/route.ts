export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const content = await prisma.siteContent.findUnique({ where: { slug: params.slug } })
  if (!content) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ content })
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const content = await prisma.siteContent.update({
    where: { slug: params.slug },
    data: {
      title: body.title,
      content: body.content,
    },
  })

  return NextResponse.json({ content })
}
