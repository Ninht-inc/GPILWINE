'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { GpilContainer } from '@/components/ui/gpil-container'
import { SectionHeading } from '@/components/ui/section-heading'
import { occasions, type Occasion } from '@/lib/data'

export function Occasions() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="py-20 md:py-28 bg-[#FAF9F6]">
      <GpilContainer>
        <SectionHeading eyebrow="FOR EVERY OCCASION" title="There's a GPIL Wine for Every Occasion" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(occasions ?? []).map((occ: Occasion, i: number) => (
            <motion.div
              key={occ?.title}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer"
            >
              <Image
                src={occ?.image ?? ''}
                alt={occ?.title?.replace?.('\n', ' ') ?? 'Occasion'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16.6vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B101A]/80 via-[#3B101A]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-sans text-xs md:text-sm text-[#F4EBDD] font-semibold tracking-wide whitespace-pre-line leading-tight">
                  {occ?.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </GpilContainer>
    </section>
  )
}
