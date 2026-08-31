'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { GpilContainer } from '@/components/ui/gpil-container'

export function PageHero({
  eyebrow,
  title,
  description,
  ctaText,
  ctaHref,
  backgroundImage,
}: {
  eyebrow?: string
  title: string
  description?: string
  ctaText?: string
  ctaHref?: string
  backgroundImage?: string
}) {
  return (
    <section className="relative bg-[#3B101A] py-20 md:py-28 overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover opacity-30"
            unoptimized
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3B101A]/60 via-[#3B101A]/40 to-[#3B101A]/80" />
      <GpilContainer size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl"
        >
          {eyebrow && (
            <p className="text-[#C6A15B] text-xs tracking-[0.3em] uppercase mb-4 font-sans">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-[#F4EBDD] text-3xl md:text-5xl font-bold leading-tight mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-[#F4EBDD]/80 text-lg leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
          {ctaText && ctaHref && (
            <a href={ctaHref}
              className="inline-block mt-8 bg-[#C6A15B] text-[#3B101A] py-3 px-8 text-sm font-semibold tracking-wider uppercase hover:bg-[#d4b36c] transition-colors">
              {ctaText}
            </a>
          )}
        </motion.div>
      </GpilContainer>
    </section>
  )
}
