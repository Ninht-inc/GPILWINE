export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WineDetailClient } from '@/components/wines/wine-detail-client'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const wine = await prisma.wine.findUnique({ where: { slug: params.slug } })
  if (!wine) return { title: 'Wine Not Found' }
  return {
    title: wine.seoTitle || `${wine.name} | GPIL Wines`,
    description: wine.metaDescription || wine.shortDescription || '',
    openGraph: {
      title: wine.seoTitle || wine.name,
      description: wine.metaDescription || wine.shortDescription || '',
      images: wine.ogImage ? [wine.ogImage] : wine.mainImage ? [wine.mainImage] : [],
    },
  }
}

export default async function WineDetailPage({ params }: { params: { slug: string } }) {
  const wine = await prisma.wine.findUnique({
    where: { slug: params.slug },
  })
  if (!wine || wine.status === 'ARCHIVED' || wine.status === 'DRAFT') notFound()

  const relatedWines = await prisma.wine.findMany({
    where: { status: 'PUBLISHED', id: { not: wine.id } },
    take: 3,
    orderBy: { displayOrder: 'asc' },
  })

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20">
        <WineDetailClient wine={JSON.parse(JSON.stringify(wine))} relatedWines={JSON.parse(JSON.stringify(relatedWines))} />
      </main>
      <Footer />
    </>
  )
}
