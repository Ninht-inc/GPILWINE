'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { heroSlides, type HeroSlide } from '@/lib/data'

const SLIDE_DURATION = 5000

const kenBurnsVariants = [
  { scale: [1, 1.12], x: ['0%', '-3%'], y: ['0%', '-2%'] },
  { scale: [1.08, 1], x: ['-2%', '2%'], y: ['-1%', '1%'] },
  { scale: [1, 1.1], x: ['0%', '2%'], y: ['0%', '-1%'] },
  { scale: [1.06, 1.14], x: ['1%', '-2%'], y: ['-2%', '0%'] },
  { scale: [1.1, 1.02], x: ['-1%', '1%'], y: ['0%', '-2%'] },
]

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartRef = useRef(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const slides = heroSlides ?? []

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Auto-play — restarts the 5s timer whenever the slide changes
  useEffect(() => {
    if (isPaused) return
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(next, SLIDE_DURATION)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [current, next, isPaused])

  // Keyboard arrows
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  // Preload next
  const nextIndex = (current + 1) % slides.length
  const nextSlide = slides[nextIndex]

  const slide = slides[current] as HeroSlide | undefined
  if (!slide) return null

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden bg-[#1a0a10]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => { touchStartRef.current = e?.touches?.[0]?.clientX ?? 0 }}
      onTouchEnd={(e) => {
        const diff = (touchStartRef.current ?? 0) - (e?.changedTouches?.[0]?.clientX ?? 0)
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
      }}
      role="region"
      aria-label="Featured wines carousel"
      aria-roledescription="carousel"
    >
      {nextSlide && (
        <link rel="preload" as="image" href={nextSlide.backgroundImage} />
      )}

      {/* ===== LAYER 1: Background images crossfade ===== */}
      {slides.map((s: HeroSlide, i: number) => {
        const kb = kenBurnsVariants[i % kenBurnsVariants.length]
        return (
          <motion.div
            key={s.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === current ? 1 : 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
            style={{ zIndex: i === current ? 1 : 0 }}
          >
            <motion.div
              className="absolute inset-0 will-change-transform"
              animate={
                i === current
                  ? { scale: kb.scale, x: kb.x, y: kb.y }
                  : { scale: 1, x: '0%', y: '0%' }
              }
              transition={{
                duration: i === current ? SLIDE_DURATION / 1000 + 1.5 : 0.1,
                ease: 'linear',
              }}
            >
              <Image
                src={s.backgroundImage}
                alt={`${s.productName} vineyard atmosphere`}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
                quality={85}
              />
            </motion.div>
          </motion.div>
        )
      })}

      {/* ===== LAYER 2: Cinematic overlays ===== */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a10]/95 via-[#2a0f18]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a10]/70 via-transparent to-[#1a0a10]/30" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(26,10,16,0.4) 100%)' }} />
      </div>

      {/* ===== LAYER 3: Content ===== */}
      <div className="absolute inset-0 z-[3]">
        <div className="h-full max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + '-text'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="z-10 pt-16 lg:pt-0"
              >
                <p className="font-display text-[#C6A15B] text-lg md:text-xl italic mb-3 tracking-wide">
                  {slide.eyebrow}
                </p>
                <h1 className="font-display text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 whitespace-pre-line drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="font-sans text-white text-sm md:text-base leading-relaxed mb-8 whitespace-pre-line max-w-md">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/wines"
                    className="group px-7 py-3.5 bg-[#C6A15B] text-[#1a0a10] text-xs tracking-[0.14em] font-sans font-bold rounded-sm hover:bg-[#D4B76A] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#C6A15B]/20"
                  >
                    {slide.primaryCta}
                  </Link>
                  <Link
                    href="/wines"
                    className="px-7 py-3.5 border-2 border-white/40 text-white text-xs tracking-[0.14em] font-sans font-bold rounded-sm hover:bg-white/10 hover:border-white/70 transition-all duration-300 backdrop-blur-sm"
                  >
                    {slide.secondaryCta}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + '-bottle'}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="pointer-events-none absolute right-1 bottom-0 z-[1] flex items-end justify-center
                           lg:pointer-events-auto lg:relative lg:right-auto lg:bottom-auto lg:z-auto lg:h-[550px]"
              >
                <div
                  className="hidden lg:block absolute bottom-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full blur-[80px] opacity-30"
                  style={{ backgroundColor: slide.accentColor }}
                />
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative w-[120px] h-[300px] opacity-90 sm:w-[160px] sm:h-[380px] lg:w-[260px] lg:h-[520px] lg:opacity-100 z-10"
                >
                  <Image
                    src={slide.bottleImage}
                    alt={`${slide.productName} wine bottle`}
                    fill
                    className="object-contain object-bottom"
                    style={{ filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))' }}
                    priority={current === 0}
                    sizes="(max-width: 1024px) 160px, 260px"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ===== Slide indicators ===== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-[#C6A15B]' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
