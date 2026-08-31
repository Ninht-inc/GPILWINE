import { Playfair_Display, Montserrat } from 'next/font/google'
import './globals.css'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import { Providers } from '@/components/providers'
import { AgeGate } from '@/components/age-gate'
import { WineSelectionProvider } from '@/lib/wine-selection'
import { CookieConsent } from '@/components/cookie-consent'

export const dynamic = 'force-dynamic'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'GPIL Wines — Premium South African Wines for the Modern African Lifestyle',
  description: 'Discover GPIL Wines. Premium South African wines crafted for the modern African lifestyle. Smooth, versatile, and enjoyable.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'GPIL Wines — Premium South African Wines',
    description: 'Premium South African wines crafted for the modern African lifestyle.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
      </head>
      <body className={`${playfair.variable} ${montserrat.variable} font-sans bg-[#FAF9F6] text-[#222222]`}>
        <Providers>
          <WineSelectionProvider>
            <AgeGate />
            {children}
            <CookieConsent />
          </WineSelectionProvider>
        </Providers>
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}
