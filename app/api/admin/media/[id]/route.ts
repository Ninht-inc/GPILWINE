export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const media = await prisma.media.findUnique({ where: { id: params.id } })
  if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (media.cloudStoragePath) {
    try {
      await deleteFromCloudinary(media.cloudStoragePath)
    } catch (e) {
      console.error('Cloudinary destroy failed:', e)
    }
  }
  await prisma.media.delete({ where: { id: params.id } })
  await createAuditLog({ adminId: session.user.id, action: 'DELETE', entity: 'Media', entityId: params.id, details: media.fileName })
  return NextResponse.json({ success: true })
}
