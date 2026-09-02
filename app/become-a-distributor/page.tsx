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
        backgroundImage="https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/heroes/become-a-distributor"
      />
      <DistributorClient />
    </PublicLayout>
  )
}
