import Link from 'next/link'
import { GpilContainer } from '@/components/ui/gpil-container'

const exploreLinks = [
  { label: 'Our Wines', href: '/wines' },
  { label: 'About GPIL', href: '/about' },
  { label: 'Find a Stockist', href: '/find-a-stockist' },
]

const businessLinks = [
  { label: 'Become a Distributor', href: '/become-a-distributor' },
  { label: 'Contact Us', href: '/contact' },
]

const helpLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Responsible Drinking', href: '/responsible-drinking' },
]

export function Footer() {
  return (
    <footer id="contact" className="bg-[#3B101A] text-[#F4EBDD]">
      <GpilContainer size="lg">
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <div className="flex flex-col items-start leading-none">
                  <span className="font-display text-[#C6A15B] text-2xl font-bold tracking-wider">GPIL</span>
                  <span className="font-sans text-[#C6A15B]/80 text-[9px] tracking-[0.25em] uppercase">Wines</span>
                </div>
              </div>
              <p className="text-sm text-[#F4EBDD]/70 leading-relaxed mb-6">
                Premium South African wines crafted for the modern African lifestyle.<br />
                <em className="text-[#C6A15B]/70">Smooth. Versatile. Enjoyable.</em>
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {['facebook', 'instagram', 'twitter', 'youtube'].map((platform: string) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-8 h-8 rounded-full border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B]/70 hover:bg-[#C6A15B] hover:text-[#3B101A] transition-all duration-300"
                    aria-label={platform}
                  >
                    <SocialIcon name={platform} />
                  </a>
                ))}
              </div>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-sans text-xs tracking-[0.15em] uppercase text-[#C6A15B] mb-4 font-semibold">Explore</h4>
              <ul className="space-y-2.5">
                {(exploreLinks ?? []).map((link: any) => (
                  <li key={link?.label}>
                    <Link href={link?.href ?? '#'} className="text-sm text-[#F4EBDD]/70 hover:text-[#C6A15B] transition-colors duration-300">
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business */}
            <div>
              <h4 className="font-sans text-xs tracking-[0.15em] uppercase text-[#C6A15B] mb-4 font-semibold">Business</h4>
              <ul className="space-y-2.5">
                {(businessLinks ?? []).map((link: any) => (
                  <li key={link?.label}>
                    <Link href={link?.href ?? '#'} className="text-sm text-[#F4EBDD]/70 hover:text-[#C6A15B] transition-colors duration-300">
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help & Info */}
            <div>
              <h4 className="font-sans text-xs tracking-[0.15em] uppercase text-[#C6A15B] mb-4 font-semibold">Help & Info</h4>
              <ul className="space-y-2.5">
                {(helpLinks ?? []).map((link: any) => (
                  <li key={link?.label}>
                    <Link href={link?.href ?? '#'} className="text-sm text-[#F4EBDD]/70 hover:text-[#C6A15B] transition-colors duration-300">
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-sans text-xs tracking-[0.15em] uppercase text-[#C6A15B] mb-4 font-semibold">Contact Us</h4>
              <div className="space-y-3 text-sm text-[#F4EBDD]/70">
                <p suppressHydrationWarning>+234 000 000 0000</p>
                <p suppressHydrationWarning>info@gpilwines.com</p>
                <p className="leading-relaxed">Global Partners Investment Limited<br />Lagos, Nigeria</p>
                <Link
                  href="/contact"
                  className="inline-block mt-3 px-5 py-2.5 border border-[#C6A15B] text-[#C6A15B] text-[11px] tracking-[0.12em] font-sans font-semibold rounded hover:bg-[#C6A15B] hover:text-[#3B101A] transition-all duration-300"
                >
                  ENQUIRE NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </GpilContainer>

      {/* Bottom Bar */}
      <div className="border-t border-[#C6A15B]/15">
        <GpilContainer size="lg">
          <div className="py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#F4EBDD]/50">
            <p>© 2025 GPIL Wines. All Rights Reserved.</p>
            <p className="italic">Drink Responsibly. Not for Sale to Persons Under the Age of 18.</p>
          </div>
        </GpilContainer>
      </div>
    </footer>
  )
}

function SocialIcon({ name }: { name: string }) {
  switch (name) {
    case 'facebook':
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      )
    case 'instagram':
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
      )
    case 'twitter':
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      )
    case 'youtube':
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      )
    default:
      return null
  }
}
