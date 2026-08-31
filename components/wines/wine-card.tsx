'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Wine } from '@prisma/client'

export function WineCard({ wine }: { wine: Wine }) {
  const isComingSoon = wine.status === 'COMING_SOON' || wine.comingSoon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
    >
      <div className="relative aspect-[3/4] bg-gradient-to-b from-[#f5f0e8] to-[#ede5d8] flex items-center justify-center overflow-hidden">
        {wine.mainImage ? (
          <Image
            src={wine.mainImage}
            alt={wine.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
        ) : (
          <div className="text-[#C6A15B]/30 font-display text-lg">GPIL</div>
        )}
        {isComingSoon && (
          <div className="absolute top-4 right-4 bg-[#641B2A] text-[#F4EBDD] text-[10px] tracking-wider uppercase px-3 py-1 rounded-full">
            Coming Soon
          </div>
        )}
      </div>
      <div className="p-5">
        {wine.category && (
          <p className="text-[#C6A15B] text-[10px] tracking-[0.2em] uppercase mb-1 font-sans">{wine.category}</p>
        )}
        <h3 className="font-display text-[#222] text-lg font-semibold mb-2">{wine.name}</h3>
        {wine.shortDescription && (
          <p className="text-[#222]/60 text-sm leading-relaxed line-clamp-2 mb-3">{wine.shortDescription}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-[#222]/50 mb-4">
          {wine.alcohol && <span>{wine.alcohol}</span>}
          {wine.bottleSize && <span>• {wine.bottleSize}</span>}
          {wine.vintage && <span>• {wine.vintage}</span>}
        </div>
        {isComingSoon ? (
          <span className="inline-block w-full text-center py-2.5 bg-[#222]/5 text-[#222]/40 text-sm tracking-wider uppercase rounded">
            COMING SOON
          </span>
        ) : (
          <Link
            href={`/wines/${wine.slug}`}
            className="inline-block w-full text-center py-2.5 bg-[#641B2A] text-[#F4EBDD] text-sm tracking-wider uppercase rounded hover:bg-[#3B101A] transition-colors"
          >
            VIEW & SELECT
          </Link>
        )}
      </div>
    </motion.div>
  )
}
