import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Montserrat } from 'next/font/google'
import './globals.css'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import { Providers } from '@/components/providers'
import { AgeGate } from '@/components/age-gate'
import { WineSelectionProvider } from '@/lib/wine-selection'
import { CookieConsent } from '@/components/cookie-consent'
import { SiteSettingsProvider } from '@/components/site-settings-provider'
import { Analytics } from '@/components/analytics'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { getPublicSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const s = await getPublicSettings()
  const name = s.site_name || 'GPIL Wines'
  const favicon = s.site_favicon || '/favicon.svg'

  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
    title: `${name} — Premium South African Wines for the Modern African Lifestyle`,
    description:
      'Discover GPIL Wines. Premium South African wines crafted for the modern African lifestyle. Smooth, versatile, and enjoyable.',
    icons: { icon: favicon, shortcut: favicon, apple: favicon },
    openGraph: {
      title: `${name} — Premium South African Wines`,
      description: 'Premium South African wines crafted for the modern African lifestyle.',
      images: ['/og-image.png'],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getPublicSettings()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${montserrat.variable} font-sans bg-[#FAF9F6] text-[#222222]`}>
        <SiteSettingsProvider settings={settings}>
          <Providers>
            <WineSelectionProvider>
              <AgeGate />
              {children}
              <CookieConsent />
              <WhatsAppButton />
            </WineSelectionProvider>
          </Providers>
          <Analytics />
        </SiteSettingsProvider>
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}
