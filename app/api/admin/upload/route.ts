export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isConfigured, uploadToCloudinary, UPLOAD_FOLDER } from '@/lib/cloudinary'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!isConfigured()) {
    return NextResponse.json({ error: 'Cloudinary is not configured (missing env vars)' }, { status: 500 })
  }

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  const folder = (form?.get('folder') as string) || `${UPLOAD_FOLDER}/uploads`
  const altText = (form?.get('altText') as string) || null

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File is larger than 10 MB' }, { status: 400 })
  }
  const type = (file as File).type || ''
  if (type && !ALLOWED.includes(type)) {
    return NextResponse.json({ error: `Unsupported file type: ${type}` }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const dataUri = `data:${type || 'image/jpeg'};base64,${buffer.toString('base64')}`

  try {
    const result = await uploadToCloudinary(dataUri, { folder, resourceType: 'image' })

    // Record it in the Media library (best-effort)
    try {
      await prisma.media.create({
        data: {
          fileName: (file as File).name || result.publicId,
          cloudStoragePath: result.publicId,
          contentType: type || `image/${result.format || 'jpeg'}`,
          size: result.bytes ?? file.size,
          altText,
          isPublic: true,
          url: result.url,
        },
      })
    } catch (e) {
      console.error('Media record failed:', e)
    }

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    })
  } catch (error) {
    console.error('Cloudinary upload failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
