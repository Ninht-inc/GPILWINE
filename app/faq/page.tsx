export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { PublicLayout } from '@/components/public-layout'
import { PageHero } from '@/components/page-hero'
import { FaqClient } from '@/components/faq/faq-client'

export const metadata = {
  title: 'FAQ | GPIL Wines',
  description: 'Frequently asked questions about GPIL Wines — ordering, delivery, distribution, and more.',
}

export default async function FaqPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { published: true },
    orderBy: { displayOrder: 'asc' },
  })

  return (
    <PublicLayout>
      <PageHero
        eyebrow="HELP & SUPPORT"
        title="Frequently Asked Questions"
        description="Find answers to common questions about our wines, ordering process, delivery, and more."
        backgroundImage="https://images.pexels.com/photos/10923023/pexels-photo-10923023.jpeg?cs=srgb&dl=pexels-gonzalo-acuna-166058093-10923023.jpg&fm=jpg"
      />
      <FaqClient faqs={faqs.map(f => ({ id: f.id, question: f.question, answer: f.answer, category: 'General' }))} />
    </PublicLayout>
  )
}
