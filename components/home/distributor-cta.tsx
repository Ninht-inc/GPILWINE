'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GpilContainer } from '@/components/gpil-container'

export function DistributorCTA() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section ref={ref} id="distributor" className="py-16 md:py-20 bg-[#3B101A]">
      <GpilContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left: Distributor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#C6A15B]/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full border border-[#C6A15B]/40 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#C6A15B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                  <path d="M16 7V5a4 4 0 00-8 0v2" />
                </svg>
              </div>
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-[#F4EBDD] mb-3">
              Bring GPIL Wines<br />to Your Customers
            </h3>
            <p className="font-sans text-sm text-[#F4EBDD]/60 leading-relaxed mb-6">
              Interested in stocking or distributing GPIL Wines? Partner with us and grow your business with quality wines your customers will love.
            </p>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView?.({ behavior: 'smooth' })}
              className="px-6 py-3 border border-[#C6A15B] text-[#C6A15B] text-xs tracking-[0.12em] font-sans font-semibold rounded hover:bg-[#C6A15B] hover:text-[#3B101A] transition-all duration-300"
            >
              BECOME A DISTRIBUTOR
            </button>
          </motion.div>

          {/* Right: Stockist */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="p-8 md:p-12"
            id="stockist"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full border border-[#C6A15B]/40 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#C6A15B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="10" r="8" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 18v4" />
                </svg>
              </div>
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-[#F4EBDD] mb-3">
              Find GPIL Wines<br />Near You
            </h3>
            <p className="font-sans text-sm text-[#F4EBDD]/60 leading-relaxed mb-6">
              Looking for GPIL Wines? Contact us and we'll help you find your nearest available stockist.
            </p>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView?.({ behavior: 'smooth' })}
              className="px-6 py-3 border border-[#C6A15B] text-[#C6A15B] text-xs tracking-[0.12em] font-sans font-semibold rounded hover:bg-[#C6A15B] hover:text-[#3B101A] transition-all duration-300"
            >
              FIND A STOCKIST
            </button>
          </motion.div>
        </div>
      </GpilContainer>
    </section>
  )
}
