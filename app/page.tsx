import { prisma } from '@/lib/db'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/home/hero'
import { BrandExperience } from '@/components/home/brand-experience'
import { WineCollection } from '@/components/home/wine-collection'
import { FeaturedWine } from '@/components/home/featured-wine'
import { FoodPairings } from '@/components/home/food-pairings'
import { BrandValues } from '@/components/home/brand-values'
import { Occasions } from '@/components/home/occasions'
import { DistributorCTA } from '@/components/home/distributor-cta'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const wines = await prisma.wine.findMany({
    where: { status: { in: ['PUBLISHED', 'COMING_SOON'] } },
    orderBy: { displayOrder: 'asc' },
  })

  return (
    <>
      <Header />
      <main>
        <Hero />
        <BrandExperience />
        <WineCollection wines={JSON.parse(JSON.stringify(wines))} />
        <FeaturedWine />
        <FoodPairings />
        <BrandValues />
        <Occasions />
        <DistributorCTA />
      </main>
      <Footer />
    </>
  )
}
