'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GpilContainer } from '@/components/gpil-container'
import { experienceValues } from '@/lib/data'

function ExperienceIcon({ type }: { type: string }) {
  const iconClass = 'w-8 h-8 text-[#641B2A]'
  switch (type) {
    case 'heritage':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="10" r="4" />
          <path d="M12 14c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z" />
          <path d="M8 6c0-2 1.5-4 4-4s4 2 4 4" />
        </svg>
      )
    case 'enjoyment':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 2l4 8h-8l4-8z" />
          <line x1="12" y1="10" x2="12" y2="18" />
          <path d="M8 18h8" />
          <path d="M17 2l-1 4M19 5l-3 1" />
        </svg>
      )
    case 'celebrate':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l2 4 4.5.7-3.2 3.2.8 4.5L12 12.3 7.9 14.4l.8-4.5-3.2-3.2L10 6z" />
          <path d="M5 18l1.5-1.5M19 18l-1.5-1.5M12 20v2" />
        </svg>
      )
    case 'quality':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 14.8l-4.9 2.4.9-5.5-4-3.9 5.5-.8z" />
          <path d="M9 22h6" />
          <path d="M12 18v4" />
        </svg>
      )
    default:
      return null
  }
}

export function BrandExperience() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })

  return (
    <section ref={ref} id="about" className="py-20 md:py-28 bg-[#F4EBDD]">
      <GpilContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#C6A15B] mb-3">THE GPIL EXPERIENCE</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[42px] leading-tight text-[#222222] mb-6">
              Wine for Every Moment Worth Celebrating
            </h2>
            <p className="font-sans text-[#222222]/70 leading-relaxed mb-8">
              GPIL Wines brings together the rich winemaking heritage of South Africa and the vibrant spirit of modern Africa. Our carefully crafted wines are smooth, approachable and made to elevate the moments that matter most.
            </p>
            <button
              onClick={() => document.getElementById('wines')?.scrollIntoView?.({ behavior: 'smooth' })}
              className="px-6 py-3 bg-[#641B2A] text-[#F4EBDD] text-xs tracking-[0.12em] font-sans font-semibold rounded hover:bg-[#3B101A] transition-colors duration-300"
            >
              LEARN MORE ABOUT GPIL
            </button>
          </motion.div>

          {/* Right: Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(experienceValues ?? []).map((val: any, i: number) => (
              <motion.div
                key={val?.title}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                className="bg-white/70 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-[#F4EBDD] flex items-center justify-center mb-4">
                  <ExperienceIcon type={val?.icon ?? ''} />
                </div>
                <h3 className="font-display text-lg text-[#222222] mb-2">{val?.title}</h3>
                <p className="font-sans text-sm text-[#222222]/60 leading-relaxed">{val?.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </GpilContainer>
    </section>
  )
}
