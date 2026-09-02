export const dynamic = 'force-dynamic'

import { PublicLayout } from '@/components/public-layout'
import { PageHero } from '@/components/page-hero'
import { StockistClient } from '@/components/stockist/stockist-client'

export const metadata = {
  title: 'Find a Stockist | GPIL Wines',
  description: 'Find GPIL Wines near you. Browse our list of authorised stockists and retailers across South Africa.',
}

export default function StockistPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="FIND US NEAR YOU"
        title="Find a Stockist"
        description="Discover where to buy GPIL Wines near you. Can't find a stockist in your area? Let us know and we'll help."
        backgroundImage="https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/heroes/find-a-stockist"
      />
      <StockistClient />
    </PublicLayout>
  )
}
