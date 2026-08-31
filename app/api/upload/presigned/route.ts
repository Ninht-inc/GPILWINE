export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generatePresignedUploadUrl } from '@/lib/s3'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fileName, contentType, isPublic = true } = await request.json()
  if (!fileName || !contentType) {
    return NextResponse.json({ error: 'fileName and contentType required' }, { status: 400 })
  }

  const result = await generatePresignedUploadUrl(fileName, contentType, isPublic)
  return NextResponse.json(result)
}
