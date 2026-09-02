'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/** Floating "scroll to top" button — appears once you've scrolled down the page. */
export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full
        bg-[#3B101A] text-[#C6A15B] shadow-lg border border-[#C6A15B]/30
        transition-all duration-300 hover:bg-[#641B2A]
        ${show ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-3'}`}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2} />
    </button>
  )
}
