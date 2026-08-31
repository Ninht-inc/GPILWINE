'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GpilContainer } from '@/components/ui/gpil-container'
import { brandValues } from '@/lib/data'

function BrandIcon({ type }: { type: string }) {
  const cls = 'w-10 h-10 text-[#641B2A]'
  switch (type) {
    case 'heritage':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2C8 2 4 6 4 10c0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    case 'enjoyment':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 2l4 8h-8l4-8z" />
          <line x1="12" y1="10" x2="12" y2="18" />
          <path d="M8 18h8" />
        </svg>
      )
    case 'celebrate':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l2 4 4.5.7-3.2 3.2.8 4.5L12 12.3 7.9 14.4l.8-4.5-3.2-3.2L10 6z" />
          <path d="M5 18l1.5-1.5M19 18l-1.5-1.5M12 20v2" />
        </svg>
      )
    default:
      return null
  }
}

export function BrandValues() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })

  return (
    <section ref={ref} className="py-16 md:py-20 bg-[#F4EBDD]">
      <GpilContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(brandValues ?? []).map((val: any, i: number) => (
            <motion.div
              key={val?.title}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full border border-[#C6A15B]/30 flex items-center justify-center mb-4 bg-white/50">
                <BrandIcon type={val?.icon ?? ''} />
              </div>
              <h3 className="font-display text-lg text-[#222222] mb-2 font-semibold">{val?.title}</h3>
              <p className="font-sans text-sm text-[#222222]/60 leading-relaxed max-w-xs mx-auto">{val?.description}</p>
            </motion.div>
          ))}
        </div>
      </GpilContainer>
    </section>
  )
}
