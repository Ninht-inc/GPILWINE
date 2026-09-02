'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useWineSelection } from '@/lib/wine-selection'
import { SiteLogo } from '@/components/site-logo'

const navItems = [
  { label: 'HOME', href: '/' },
  {
    label: 'OUR WINES',
    href: '/wines',
    children: [
      { label: 'GPIL Natural Sweet Red', href: '/wines/gpil-natural-sweet-red' },
      { label: 'GPIL Pinotage 2025', href: '/wines/gpil-pinotage-2025' },
      { label: 'View All Wines', href: '/wines' },
    ],
  },
  { label: 'ABOUT GPIL', href: '/about' },
  { label: 'BECOME A DISTRIBUTOR', href: '/become-a-distributor' },
  { label: 'CONTACT', href: '/contact' },
]

function CartIcon() {
  const { totalItems } = useWineSelection()
  return (
    <Link href="/wine-selection" className="relative p-2 text-[#F4EBDD] hover:text-[#C6A15B] transition-colors">
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-[#C6A15B] text-[#3B101A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </Link>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#3B101A] ${
        scrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <SiteLogo variant="header" />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {(navItems ?? []).map((item: any) => (
              <div key={item?.label} className="relative group">
                {item?.children ? (
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-[11px] tracking-[0.12em] font-sans text-[#F4EBDD]/90 hover:text-[#C6A15B] transition-colors duration-300"
                    onClick={() => document.getElementById('wines')?.scrollIntoView?.({ behavior: 'smooth' })}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    {item?.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                ) : (
                  <Link
                    href={item?.href ?? '/'}
                    className="px-3 py-2 text-[11px] tracking-[0.12em] font-sans text-[#F4EBDD]/90 hover:text-[#C6A15B] transition-colors duration-300"
                  >
                    {item?.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item?.children && (
                  <div
                    className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="bg-[#3B101A] border border-[#C6A15B]/20 rounded-md shadow-xl min-w-[220px] py-2">
                      {(item?.children ?? []).map((child: any) => (
                        <Link
                          key={child?.label}
                          href={child?.href ?? '/'}
                          className="block px-4 py-2.5 text-[11px] tracking-wider font-sans text-[#F4EBDD]/80 hover:text-[#C6A15B] hover:bg-[#641B2A]/50 transition-colors duration-200"
                        >
                          {child?.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA + Cart + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <CartIcon />
            <Link
              href="/wines"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-[#C6A15B] text-[#3B101A] text-[11px] tracking-[0.12em] font-sans font-semibold rounded hover:bg-[#D4B76A] transition-colors duration-300"
            >
              OUR WINES
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#F4EBDD]"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#3B101A] border-t border-[#C6A15B]/20 overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-1">
              {(navItems ?? []).map((item: any) => (
                <div key={item?.label}>
                  <Link
                    href={item?.href ?? '/'}
                    onClick={closeMobile}
                    className="block py-3 text-sm tracking-[0.1em] font-sans text-[#F4EBDD]/90 hover:text-[#C6A15B] transition-colors border-b border-[#C6A15B]/10"
                  >
                    {item?.label}
                  </Link>
                  {item?.children && (
                    <div className="pl-4">
                      {(item?.children ?? []).map((child: any) => (
                        <Link
                          key={child?.label}
                          href={child?.href ?? '/'}
                          onClick={closeMobile}
                          className="block py-2 text-xs tracking-wider font-sans text-[#F4EBDD]/60 hover:text-[#C6A15B] transition-colors"
                        >
                          {child?.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/wines"
                onClick={closeMobile}
                className="block mt-4 text-center py-3 bg-[#C6A15B] text-[#3B101A] text-sm tracking-[0.1em] font-sans font-semibold rounded"
              >
                OUR WINES
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
