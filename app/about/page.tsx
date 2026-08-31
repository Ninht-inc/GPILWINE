export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { PublicLayout } from '@/components/public-layout'
import { PageHero } from '@/components/page-hero'
import { GpilContainer } from '@/components/ui/gpil-container'
import { AboutClient } from '@/components/about/about-client'

export const metadata = {
  title: 'About Us | GPIL Wines',
  description: 'Learn about GPIL Wines — a proudly South African wine brand crafting quality wines for everyday moments and special celebrations.',
}

export default async function AboutPage() {
  const content = await prisma.siteContent.findUnique({ where: { slug: 'about' } })

  return (
    <PublicLayout>
      <PageHero
        eyebrow="OUR STORY"
        title="About GPIL Wines"
        description="Proudly South African. Passionately crafted. Made for every moment worth sharing."
        backgroundImage="https://external-cdn.morphic.com/website-production/assets/seo/images/seo/16-07-c/wine-images/wine-images-16x9-04.webp"
      />
      <AboutClient content={content?.content || ''} />
    </PublicLayout>
  )
}
