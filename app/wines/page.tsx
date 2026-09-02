export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/page-hero'
import { WineCard } from '@/components/wines/wine-card'

export const metadata = {
  title: 'Our Wines | GPIL Wines',
  description: 'From smooth, fruit-forward favourites to distinctive South African expressions, explore wines created for relaxed evenings, shared meals, celebrations and memorable occasions.',
}

export default async function WinesPage() {
  const wines = await prisma.wine.findMany({
    where: { status: { in: ['PUBLISHED', 'COMING_SOON'] } },
    orderBy: { displayOrder: 'asc' },
  })

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20">
        <PageHero
          eyebrow="OUR COLLECTION"
          title="Discover GPIL Wines"
          description="From smooth, fruit-forward favourites to distinctive South African expressions, explore wines created for relaxed evenings, shared meals, celebrations and memorable occasions."
          ctaText="SELECT YOUR WINES"
          ctaHref="#collection"
          backgroundImage="https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/heroes/wines"
        />
        <section id="collection" className="py-16 md:py-24 bg-[#FAF9F6]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {wines.map(wine => (
                <WineCard key={wine.id} wine={wine} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
