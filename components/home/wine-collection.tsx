'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Wine } from '@prisma/client'
import { GpilContainer } from '@/components/gpil-container'

export function WineCollection({ wines = [] }: { wines?: Wine[] }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  if (wines.length === 0) return null

  return (
    <section ref={ref} id="wines" className="py-20 md:py-28 bg-[#FAF9F6]">
      <GpilContainer>
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#C6A15B] mb-3">OUR WINE COLLECTION</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[42px] leading-tight text-[#222222]">Explore Our Wines</h2>
          </div>
          <Link
            href="/wines"
            className="hidden md:flex items-center gap-2 font-sans text-sm text-[#641B2A] hover:text-[#C6A15B] transition-colors duration-300"
          >
            VIEW ALL WINES <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {wines.map((wine, i) => {
            const comingSoon = wine.status === 'COMING_SOON' || wine.comingSoon
            return (
              <motion.div
                key={wine.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="group bg-white rounded-lg border border-[#F4EBDD] hover:border-[#C6A15B]/40 hover:shadow-lg transition-all duration-500 overflow-hidden flex flex-col"
              >
                <Link href={`/wines/${wine.slug}`} className="relative aspect-[2/3] bg-gradient-to-b from-[#FAF9F6] to-[#F4EBDD] p-4 overflow-hidden block">
                  {wine.mainImage ? (
                    <Image
                      src={wine.mainImage}
                      alt={wine.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#C6A15B]/30 font-display text-lg">GPIL</div>
                  )}
                  {comingSoon && (
                    <span className="absolute top-3 right-3 bg-[#641B2A] text-[#F4EBDD] text-[9px] tracking-wider uppercase px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-display text-sm md:text-base text-[#222222] mb-1 leading-tight">{wine.name}</h3>
                  {wine.category && <p className="font-sans text-[10px] text-[#222222]/50 mb-2">{wine.category}</p>}
                  {!comingSoon && wine.alcohol && (
                    <p className="font-sans text-[10px] text-[#222222]/40 mb-3">
                      {wine.alcohol}{wine.bottleSize ? ` | ${wine.bottleSize}` : ''}
                    </p>
                  )}
                  <div className="mt-auto pt-2">
                    {comingSoon ? (
                      <span className="block w-full text-center py-2 text-[10px] tracking-[0.1em] font-sans font-semibold rounded bg-[#641B2A]/70 text-[#F4EBDD]">
                        COMING SOON
                      </span>
                    ) : (
                      <Link
                        href={`/wines/${wine.slug}`}
                        className="block w-full text-center py-2 text-[10px] tracking-[0.1em] font-sans font-semibold rounded bg-[#641B2A] text-[#F4EBDD] hover:bg-[#3B101A] transition-all duration-300"
                      >
                        VIEW WINE
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/wines" className="inline-flex items-center gap-2 font-sans text-sm text-[#641B2A]">
            VIEW ALL WINES <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </GpilContainer>
    </section>
  )
}
