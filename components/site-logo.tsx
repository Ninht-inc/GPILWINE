'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSiteSettings } from '@/components/site-settings-provider'

/**
 * Site logo. Renders the uploaded logo image if one is set in
 * /admin/settings, otherwise falls back to the "GPIL Wines" wordmark.
 */
export function SiteLogo({
  variant = 'header',
  href = '/',
}: {
  variant?: 'header' | 'footer'
  href?: string | null
}) {
  const { site_logo, site_name } = useSiteSettings()
  const name = site_name || 'GPIL Wines'

  const inner = site_logo ? (
    <span className={`relative block ${variant === 'header' ? 'h-9 w-32 md:h-11 md:w-40' : 'h-10 w-36'}`}>
      <Image src={site_logo} alt={name} fill className="object-contain object-left" unoptimized priority={variant === 'header'} />
    </span>
  ) : (
    <span className={`flex flex-col leading-none ${variant === 'header' ? 'items-center' : 'items-start'}`}>
      <span className={`font-display text-[#C6A15B] font-bold tracking-wider ${variant === 'header' ? 'text-xl md:text-2xl' : 'text-2xl'}`}>
        {name.split(' ')[0] || 'GPIL'}
      </span>
      {name.split(' ').slice(1).length > 0 && (
        <span className="font-sans text-[#C6A15B]/80 text-[9px] md:text-[10px] tracking-[0.25em] uppercase">
          {name.split(' ').slice(1).join(' ')}
        </span>
      )}
    </span>
  )

  if (href === null) return inner
  return (
    <Link href={href} className="flex-shrink-0">
      {inner}
    </Link>
  )
}
