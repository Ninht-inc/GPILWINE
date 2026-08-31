'use client'

import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GpilContainer } from '@/components/ui/gpil-container'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  return (
    <GpilContainer size="md">
      <div className="py-20 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="font-display text-[#222] text-3xl md:text-4xl font-bold mb-4">Thank You for Your Enquiry</h1>
        <p className="text-[#222]/70 leading-relaxed max-w-xl mx-auto mb-6">
          Your wine selection has been received successfully. A member of the GPIL Wines team will review your request and contact you regarding availability, quotation details and the next steps.
        </p>
        {ref && (
          <div className="inline-block bg-[#f5f0e8] px-6 py-3 rounded-lg mb-8">
            <p className="text-sm text-[#222]/60">Reference:</p>
            <p className="font-display text-[#641B2A] text-lg font-bold">{ref}</p>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/wines" className="px-8 py-3 bg-[#641B2A] text-[#F4EBDD] text-sm tracking-wider uppercase hover:bg-[#3B101A] transition-colors">
            EXPLORE MORE WINES
          </Link>
          <Link href="/" className="px-8 py-3 border border-[#641B2A] text-[#641B2A] text-sm tracking-wider uppercase hover:bg-[#641B2A] hover:text-[#F4EBDD] transition-all">
            RETURN HOME
          </Link>
        </div>
      </div>
    </GpilContainer>
  )
}

export default function QuoteSuccessPage() {
  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20 min-h-screen bg-[#FAF9F6]">
        <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
