'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { GpilContainer } from '@/components/ui/gpil-container'
import { SectionHeading } from '@/components/ui/section-heading'
import { foodPairings, type FoodPairing } from '@/lib/data'

export function FoodPairings() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="py-20 md:py-28 bg-[#FAF9F6]">
      <GpilContainer>
        <SectionHeading eyebrow="WINE MEETS FOOD" title="Perfect Pairings for Every Taste" />

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
          {(foodPairings ?? []).map((food: FoodPairing, i: number) => (
            <motion.div
              key={food?.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group text-center"
            >
              <div className="relative aspect-square rounded-full overflow-hidden mb-3 border-2 border-[#F4EBDD] group-hover:border-[#C6A15B] transition-colors duration-300 bg-[#F4EBDD]">
                <Image
                  src={food?.image ?? ''}
                  alt={food?.name ?? 'Food pairing'}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 25vw, 12.5vw"
                />
              </div>
              <p className="font-sans text-[10px] md:text-xs text-[#222222]/80 font-medium">{food?.name}</p>
            </motion.div>
          ))}
        </div>
      </GpilContainer>
    </section>
  )
}
