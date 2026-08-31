export const dynamic = 'force-dynamic'

import { PublicLayout } from '@/components/public-layout'
import { PageHero } from '@/components/page-hero'
import { DistributorClient } from '@/components/distributor/distributor-client'

export const metadata = {
  title: 'Become a Distributor | GPIL Wines',
  description: 'Partner with GPIL Wines as an authorised distributor. Help us bring quality South African wines to more people across the continent.',
}

export default function DistributorPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="PARTNER WITH US"
        title="Become a Distributor"
        description="We're expanding our footprint across South Africa and beyond. If you're passionate about premium wines and have an established distribution network, we'd love to explore a partnership."
        backgroundImage="https://www.virginwines.co.uk/hub/wp-content/uploads/2023/03/Wine-Basics-Topic-How-To-Pour-Wine-18.jpg"
      />
      <DistributorClient />
    </PublicLayout>
  )
}
