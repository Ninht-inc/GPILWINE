'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Grape, Wine, Sparkles, Award, type LucideIcon } from 'lucide-react'
import { GpilContainer } from '@/components/gpil-container'
import { brandValues } from '@/lib/data'

const ICONS: Record<string, LucideIcon> = {
  heritage: Grape,
  enjoyment: Wine,
  celebrate: Sparkles,
  quality: Award,
}

export function BrandValues() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })

  return (
    <section ref={ref} className="py-16 md:py-20 bg-[#F4EBDD]">
      <GpilContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(brandValues ?? []).map((val: any, i: number) => {
            const Icon = ICONS[val?.icon] ?? Wine
            return (
              <motion.div
                key={val?.title}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-[#641B2A] flex items-center justify-center mb-4 shadow-sm">
                  <Icon className="w-7 h-7 text-[#C6A15B]" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg text-[#222222] mb-2 font-semibold">{val?.title}</h3>
                <p className="font-sans text-sm text-[#222222]/60 leading-relaxed max-w-xs mx-auto">{val?.description}</p>
              </motion.div>
            )
          })}
        </div>
      </GpilContainer>
    </section>
  )
}
