export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createAuditLog } from '@/lib/audit'
import { isConfigured, isCloudinaryUrl, uploadToCloudinary } from '@/lib/cloudinary'
import { STATIC_IMAGE_MANIFEST } from '@/lib/image-manifest'

const BATCH = 5
const DONE_KEY = 'cloudinary_migrated_static'

const WINE_IMAGE_FIELDS = ['mainImage', 'transparentImage', 'heroImage', 'cardImage', 'ogImage'] as const

type PendingItem =
  | { kind: 'wine'; wineId: string; slug: string; field: string; index?: number; url: string }
  | { kind: 'static'; publicId: string; url: string }

async function getDoneStatic(): Promise<Set<string>> {
  const row = await prisma.siteSetting.findUnique({ where: { key: DONE_KEY } })
  if (!row) return new Set()
  try {
    return new Set(JSON.parse(row.value) as string[])
  } catch {
    return new Set()
  }
}

async function markStaticDone(publicIds: string[]) {
  if (!publicIds.length) return
  const done = await getDoneStatic()
  publicIds.forEach((id) => done.add(id))
  await prisma.siteSetting.upsert({
    where: { key: DONE_KEY },
    update: { value: JSON.stringify([...done]) },
    create: { key: DONE_KEY, value: JSON.stringify([...done]) },
  })
}

async function collectPending(target: string): Promise<PendingItem[]> {
  const items: PendingItem[] = []

  if (target === 'static' || target === 'all') {
    const done = await getDoneStatic()
    for (const m of STATIC_IMAGE_MANIFEST) {
      if (!done.has(m.publicId)) items.push({ kind: 'static', publicId: m.publicId, url: m.source })
    }
  }

  if (target === 'wines' || target === 'all') {
    const wines = await prisma.wine.findMany({
      select: { id: true, slug: true, mainImage: true, transparentImage: true, heroImage: true, cardImage: true, ogImage: true, videoUrl: true, gallery: true },
    })
    for (const w of wines) {
      for (const field of WINE_IMAGE_FIELDS) {
        const url = (w as any)[field] as string | null
        if (url && !isCloudinaryUrl(url)) items.push({ kind: 'wine', wineId: w.id, slug: w.slug, field, url })
      }
      if (w.videoUrl && !isCloudinaryUrl(w.videoUrl)) {
        items.push({ kind: 'wine', wineId: w.id, slug: w.slug, field: 'videoUrl', url: w.videoUrl })
      }
      w.gallery.forEach((url, i) => {
        if (url && !isCloudinaryUrl(url)) items.push({ kind: 'wine', wineId: w.id, slug: w.slug, field: 'gallery', index: i, url })
      })
    }
  }

  return items
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isConfigured()) {
    return NextResponse.json({ error: 'Cloudinary env vars are not set' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const target = searchParams.get('target') || 'all'

  const pending = await collectPending(target)
  const batch = pending.slice(0, BATCH)

  const migrated: { from: string; to: string; where: string }[] = []
  const failures: { url: string; where: string; error: string }[] = []
  const staticDone: string[] = []

  const winePatches: Record<string, { slug: string; scalars: Record<string, string>; gallery?: { index: number; url: string }[] }> = {}

  for (const item of batch) {
    try {
      const isVideo = item.kind === 'wine' && item.field === 'videoUrl'
      const publicId =
        item.kind === 'static'
          ? item.publicId
          : `gpil/wines/${item.slug}/${item.field}${item.index != null ? `-${item.index}` : ''}`

      const res = await uploadToCloudinary(item.url, {
        publicId,
        overwrite: true,
        resourceType: isVideo ? 'video' : 'image',
      })

      if (item.kind === 'static') {
        staticDone.push(item.publicId)
        migrated.push({ from: item.url, to: res.url, where: item.publicId })
      } else {
        const patch = (winePatches[item.wineId] ??= { slug: item.slug, scalars: {} })
        if (item.field === 'gallery') {
          ;(patch.gallery ??= []).push({ index: item.index!, url: res.url })
        } else {
          patch.scalars[item.field] = res.url
        }
        migrated.push({ from: item.url, to: res.url, where: `${item.slug}.${item.field}` })
      }
    } catch (e) {
      failures.push({
        url: item.url,
        where: item.kind === 'static' ? item.publicId : `${item.slug}.${item.field}`,
        error: e instanceof Error ? e.message : String(e),
      })
    }
  }

  for (const [wineId, patch] of Object.entries(winePatches)) {
    const data: Record<string, unknown> = { ...patch.scalars }
    if (patch.gallery?.length) {
      const wine = await prisma.wine.findUnique({ where: { id: wineId }, select: { gallery: true } })
      const gallery = [...(wine?.gallery ?? [])]
      for (const g of patch.gallery) gallery[g.index] = g.url
      data.gallery = gallery
    }
    if (Object.keys(data).length) {
      await prisma.wine.update({ where: { id: wineId }, data })
    }
  }

  await markStaticDone(staticDone)

  if (migrated.length) {
    await createAuditLog({
      adminId: session.user.id,
      action: 'IMAGE_MIGRATION',
      entity: 'Image',
      details: JSON.stringify(migrated).slice(0, 4000),
    })
  }

  const remaining = await collectPending(target)
  return NextResponse.json({
    done: remaining.length === 0,
    processed: batch.length,
    migrated,
    failures,
    remaining: remaining.length,
  })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const pending = await collectPending('all')
  return NextResponse.json({
    configured: isConfigured(),
    pending: pending.length,
    breakdown: {
      static: pending.filter((p) => p.kind === 'static').length,
      wines: pending.filter((p) => p.kind === 'wine').length,
    },
  })
}
