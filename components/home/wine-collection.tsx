'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { GpilContainer } from '@/components/gpil-container'
import { SectionHeading } from '@/components/section-heading'
import { wineProducts, type WineProduct } from '@/lib/data'
import { ArrowRight } from 'lucide-react'

export function WineCollection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} id="wines" className="py-20 md:py-28 bg-[#FAF9F6]">
      <GpilContainer>
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#C6A15B] mb-3">OUR WINE COLLECTION</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[42px] leading-tight text-[#222222]">Explore Our Wines</h2>
          </div>
          <button
            onClick={() => window.scrollTo?.({ top: 0, behavior: 'smooth' })}
            className="hidden md:flex items-center gap-2 font-sans text-sm text-[#641B2A] hover:text-[#C6A15B] transition-colors duration-300"
          >
            VIEW ALL WINES <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {(wineProducts ?? []).map((wine: WineProduct, i: number) => (
            <motion.div
              key={wine?.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group bg-white rounded-lg border border-[#F4EBDD] hover:border-[#C6A15B]/40 hover:shadow-lg transition-all duration-500 overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[2/3] bg-gradient-to-b from-[#FAF9F6] to-[#F4EBDD] p-4 overflow-hidden">
                <div className="relative w-full h-full">
                  <Image
                    src={wine?.image ?? ''}
                    alt={wine?.name ?? 'Wine bottle'}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-display text-sm md:text-base text-[#222222] mb-1 leading-tight">{wine?.name}</h3>
                <p className="font-sans text-[10px] text-[#222222]/50 mb-2">{wine?.subtitle}</p>

                {(wine?.descriptors?.length ?? 0) > 0 && (
                  <p className="font-sans text-[10px] text-[#641B2A]/70 mb-1">
                    {(wine?.descriptors ?? []).join(' \u2022 ')}
                  </p>
                )}

                {wine?.available && wine?.abv && (
                  <p className="font-sans text-[10px] text-[#222222]/40 mb-3">
                    {wine?.abv} ABV | {wine?.volume}
                  </p>
                )}

                {!wine?.available && (
                  <p className="font-sans text-[10px] text-[#641B2A]/60 italic mb-3">Coming Soon</p>
                )}

                <button
                  onClick={() => {
                    if (wine?.available) {
                      document.getElementById('wines')?.scrollIntoView?.({ behavior: 'smooth' })
                    }
                  }}
                  className={`w-full py-2 text-[10px] tracking-[0.1em] font-sans font-semibold rounded transition-all duration-300 ${
                    wine?.available
                      ? 'bg-[#641B2A] text-[#F4EBDD] hover:bg-[#3B101A] cursor-pointer'
                      : 'bg-[#641B2A] text-[#F4EBDD] opacity-70 cursor-default'
                  }`}
                  disabled={!wine?.available}
                >
                  {wine?.ctaText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </GpilContainer>
    </section>
  )
}
