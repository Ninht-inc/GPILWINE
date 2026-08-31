'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GpilContainer } from '@/components/ui/gpil-container'

interface Faq { id: string; question: string; answer: string; category?: string }

export function FaqClient({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="bg-[#FAF9F6] py-20 md:py-28">
      <GpilContainer size="md">
        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map(faq => (
            <motion.div key={faq.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }} className="bg-white">
              <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className="w-full flex items-center justify-between p-6 text-left">
                <span className="font-display text-[#222] font-semibold pr-4">{faq.question}</span>
                <svg className={`w-5 h-5 text-[#C6A15B] flex-shrink-0 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="px-6 pb-6 text-[#222]/60 text-sm leading-relaxed">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-[#222]/60 mb-4">Still have questions?</p>
          <a href="/contact" className="inline-block bg-[#641B2A] text-[#F4EBDD] py-3 px-8 text-sm font-semibold tracking-wider uppercase hover:bg-[#7a2235] transition-colors">CONTACT US</a>
        </div>
      </GpilContainer>
    </section>
  )
}
