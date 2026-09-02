export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { PublicLayout } from '@/components/public-layout'
import { PageHero } from '@/components/page-hero'
import { GpilContainer } from '@/components/ui/gpil-container'

const ALLOWED_SLUGS = ['privacy-policy', 'terms-and-conditions', 'delivery-policy', 'returns-policy', 'responsible-drinking']

export async function generateMetadata({ params }: { params: { slug: string } }) {
  if (!ALLOWED_SLUGS.includes(params.slug)) return {}
  const content = await prisma.siteContent.findUnique({ where: { slug: params.slug } })
  if (!content) return {}
  return { title: `${content.title} | GPIL Wines` }
}

export default async function PolicyPage({ params }: { params: { slug: string } }) {
  if (!ALLOWED_SLUGS.includes(params.slug)) notFound()

  const content = await prisma.siteContent.findUnique({ where: { slug: params.slug } })
  if (!content) notFound()

  return (
    <PublicLayout>
      <PageHero title={content.title} backgroundImage="https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/heroes/policy-pages" />
      <section className="bg-[#FAF9F6] py-16 md:py-24">
        <GpilContainer size="md">
          <div className="prose prose-lg max-w-none text-[#222]/70
            prose-headings:font-display prose-headings:text-[#222]
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-a:text-[#641B2A] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#222]"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
          <div className="mt-12 pt-8 border-t border-[#222]/10">
            <p className="text-[#222]/40 text-sm">Last updated: {new Date(content.updatedAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </GpilContainer>
      </section>
    </PublicLayout>
  )
}
