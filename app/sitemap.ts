import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'
import { headers } from 'next/headers'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || ''
  const protocol = headersList.get('x-forwarded-proto') || 'https'
  const siteUrl = host ? `${protocol}://${host}` : (process.env.NEXTAUTH_URL || 'https://gpilwines.co.za')

  const wines = await prisma.wine.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  })

  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${siteUrl}/wines`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${siteUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${siteUrl}/find-a-stockist`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${siteUrl}/become-a-distributor`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${siteUrl}/request-a-quote`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
  ]

  const winePages = wines.map(w => ({
    url: `${siteUrl}/wines/${w.slug}`,
    lastModified: w.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...winePages]
}
