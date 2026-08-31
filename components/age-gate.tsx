'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function AgeGate() {
  const [show, setShow] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    try {
      const confirmed = localStorage.getItem('gpil-age-confirmed')
      if (!confirmed) setShow(true)
    } catch {
      setShow(true)
    }
  }, [])

  const handleConfirm = useCallback(() => {
    try {
      localStorage.setItem('gpil-age-confirmed', Date.now().toString())
    } catch {}
    setShow(false)
  }, [])

  const handleExit = useCallback(() => {
    setExiting(true)
  }, [])

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3B101A] p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Age verification"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          {exiting ? (
            <div>
              <h2 className="font-display text-[#F4EBDD] text-2xl mb-4">Thank you for visiting</h2>
              <p className="text-[#F4EBDD]/70 text-sm">You must be 18 or older to access this website.</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-display text-[#C6A15B] text-4xl font-bold tracking-wider">GPIL</h1>
                <p className="text-[#C6A15B]/70 text-xs tracking-[0.3em] uppercase mt-1">Wines</p>
              </div>

              <h2 className="font-display text-[#F4EBDD] text-xl tracking-wide mb-4">
                WELCOME TO GPIL WINES
              </h2>

              <div className="w-12 h-px bg-[#C6A15B] mx-auto mb-6" />

              <h3 className="font-display text-[#F4EBDD] text-lg mb-4">Are you 18 or older?</h3>

              <p className="text-[#F4EBDD]/70 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                GPIL Wines is intended for adults of legal drinking age. Please confirm that you are at least 18 years old to enter.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleConfirm}
                  className="w-full max-w-xs mx-auto block bg-[#C6A15B] text-[#3B101A] py-3 px-8 text-sm font-semibold tracking-wider uppercase hover:bg-[#d4b36c] transition-colors"
                >
                  YES, I AM 18+
                </button>
                <button
                  onClick={handleExit}
                  className="w-full max-w-xs mx-auto block border border-[#F4EBDD]/30 text-[#F4EBDD]/70 py-3 px-8 text-sm tracking-wider uppercase hover:border-[#F4EBDD]/60 hover:text-[#F4EBDD] transition-colors"
                >
                  NO, EXIT SITE
                </button>
              </div>

              <p className="text-[#C6A15B]/50 text-xs mt-8 tracking-wide">
                Please enjoy responsibly.
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
