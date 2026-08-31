'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('gpil_cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('gpil_cookie_consent', 'accepted')
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem('gpil_cookie_consent', 'declined')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-0 left-0 right-0 z-[9998] p-4"
        >
          <div className="max-w-4xl mx-auto bg-[#3B101A] text-[#F4EBDD] rounded-lg shadow-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm leading-relaxed">
                We use cookies to enhance your browsing experience. By continuing to use this site, you agree to our use of cookies. See our{' '}
                <a href="/privacy-policy" className="text-[#C6A15B] hover:underline">Privacy Policy</a> for details.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button onClick={decline} className="text-[#F4EBDD]/70 text-sm hover:text-[#F4EBDD] transition-colors px-4 py-2">Decline</button>
              <button onClick={accept} className="bg-[#C6A15B] text-[#3B101A] text-sm font-semibold px-6 py-2 rounded hover:bg-[#d4b36c] transition-colors">Accept</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
