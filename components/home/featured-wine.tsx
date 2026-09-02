'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import Image from 'next/image'
import { GpilContainer } from '@/components/gpil-container'

export function FeaturedWine() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })

  return (
    <section ref={ref} className="py-20 md:py-28 bg-[#641B2A] relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3B101A] via-[#641B2A] to-[#3B101A]" />

      <GpilContainer className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#C6A15B] mb-3">FEATURED WINE</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#F4EBDD] leading-tight mb-4">
              GPIL Natural<br />Sweet Red
            </h2>
            <p className="font-display text-lg md:text-xl text-[#C6A15B] italic mb-6">
              Smooth. Fruity. Naturally Enjoyable.
            </p>
            <p className="font-sans text-[#F4EBDD]/70 leading-relaxed mb-8 max-w-md">
              A smooth, fruity and approachable South African sweet red wine, crafted for easy enjoyment. Perfect for relaxed evenings, celebrations and sharing good times with family and friends.
            </p>
            <Link
              href="/wines/gpil-natural-sweet-red"
              className="inline-block px-6 py-3 border border-[#C6A15B] text-[#C6A15B] text-xs tracking-[0.12em] font-sans font-semibold rounded hover:bg-[#C6A15B] hover:text-[#3B101A] transition-all duration-300"
            >
              EXPLORE THIS WINE
            </Link>
          </motion.div>

          {/* Wine Composition */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-lg aspect-video">
              <Image
                src="https://res.cloudinary.com/xgunwvcm/image/upload/f_auto,q_auto/gpil/home/featured-wine"
                alt="GPIL Natural Sweet Red wine bottle with glass, grapes and berries"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </div>
      </GpilContainer>
    </section>
  )
}
