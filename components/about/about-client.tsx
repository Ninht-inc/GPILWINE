'use client'

import { motion } from 'framer-motion'
import { GpilContainer } from '@/components/ui/gpil-container'
import Image from 'next/image'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
}

export function AboutClient({ content }: { content: string }) {
  return (
    <>
      {/* Mission Section */}
      <section className="bg-[#FAF9F6] py-20 md:py-28">
        <GpilContainer size="lg">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div {...fadeUp}>
              <p className="text-[#C6A15B] text-xs tracking-[0.3em] uppercase mb-4 font-sans">OUR MISSION</p>
              <h2 className="font-display text-[#222] text-2xl md:text-4xl font-bold mb-6">Crafting Quality Wines for Every Occasion</h2>
              <div className="space-y-4 text-[#222]/70 leading-relaxed">
                <p>At GPIL Wines, we believe great wine should be accessible without compromising on quality. Our collection is crafted to complement life&apos;s everyday moments — from relaxed evenings at home to shared meals with loved ones.</p>
                <p>As a proudly South African brand, we draw inspiration from the rich winemaking heritage of our country, combining traditional craftsmanship with modern techniques to create wines that are both approachable and distinctive.</p>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="relative aspect-[4/3] bg-[#3B101A]/5 rounded-sm overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80"
                  alt="South African vineyard landscape at sunset"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </motion.div>
          </div>
        </GpilContainer>
      </section>

      {/* Values Section */}
      <section className="bg-[#F4EBDD] py-20 md:py-28">
        <GpilContainer size="lg">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-[#C6A15B] text-xs tracking-[0.3em] uppercase mb-4 font-sans">WHAT WE STAND FOR</p>
            <h2 className="font-display text-[#222] text-2xl md:text-4xl font-bold">Our Values</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Quality First', desc: 'Every bottle reflects our commitment to excellence — from the vineyard to your glass.' },
              { title: 'Proudly South African', desc: 'We celebrate our roots, our terroir, and the vibrant culture of South African winemaking.' },
              { title: 'Accessible Luxury', desc: 'Premium wine experiences that don\'t require a premium price tag.' },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-white p-8 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-[#641B2A]/10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#C6A15B]" />
                </div>
                <h3 className="font-display text-[#222] text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-[#222]/60 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </GpilContainer>
      </section>

      {/* CMS Content */}
      {content && (
        <section className="bg-[#FAF9F6] py-20 md:py-28">
          <GpilContainer size="md">
            <motion.div {...fadeUp} className="prose prose-lg max-w-none text-[#222]/70" dangerouslySetInnerHTML={{ __html: content }} />
          </GpilContainer>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#3B101A] py-20 md:py-28 text-center">
        <GpilContainer size="md">
          <motion.div {...fadeUp}>
            <p className="text-[#C6A15B] text-xs tracking-[0.3em] uppercase mb-4 font-sans">EXPLORE OUR COLLECTION</p>
            <h2 className="font-display text-[#F4EBDD] text-2xl md:text-4xl font-bold mb-6">Ready to Discover Your New Favourite Wine?</h2>
            <a href="/wines" className="inline-block bg-[#C6A15B] text-[#3B101A] py-3 px-8 text-sm font-semibold tracking-wider uppercase hover:bg-[#d4b36c] transition-colors">
              VIEW OUR WINES
            </a>
          </motion.div>
        </GpilContainer>
      </section>
    </>
  )
}
