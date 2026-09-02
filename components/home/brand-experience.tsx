'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Grape, Wine, Sparkles, Award, type LucideIcon } from 'lucide-react'
import { GpilContainer } from '@/components/gpil-container'
import { experienceValues } from '@/lib/data'

const ICONS: Record<string, LucideIcon> = {
  heritage: Grape,
  enjoyment: Wine,
  celebrate: Sparkles,
  quality: Award,
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
            <Link
              href="/about"
              className="inline-block px-6 py-3 bg-[#641B2A] text-[#F4EBDD] text-xs tracking-[0.12em] font-sans font-semibold rounded hover:bg-[#3B101A] transition-colors duration-300"
            >
              LEARN MORE ABOUT GPIL
            </Link>
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
                {(() => {
                  const Icon = ICONS[val?.icon] ?? Wine
                  return (
                    <div className="w-12 h-12 rounded-full bg-[#641B2A] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#C6A15B]" strokeWidth={1.75} />
                    </div>
                  )
                })()}
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
