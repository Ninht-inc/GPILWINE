'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Minus, ShoppingBag, MessageSquare } from 'lucide-react'
import { useWineSelection } from '@/lib/wine-selection'
import { GpilContainer } from '@/components/gpil-container'
import { WineCard } from './wine-card'

interface WineData {
  id: string; name: string; slug: string; category: string | null; tagline: string | null;
  shortDescription: string | null; fullDescription: string | null; vintage: string | null;
  alcohol: string | null; bottleSize: string | null; mainImage: string | null;
  colour: string | null; aroma: string | null; palate: string | null; body: string | null;
  sweetness: string | null; acidity: string | null; finish: string | null;
  foodPairings: string[]; servingTemp: string | null; servingInstructions: string | null;
  storageInstructions: string | null; idealOccasions: string[]; gallery: string[];
  status: string; comingSoon: boolean; allowQuoteRequests: boolean;
  country: string | null; region: string | null; wineOrigin: string | null;
  producer: string | null; producerAddress: string | null; madeFor: string | null;
  nigerianImporter: string | null; nafdacRegistration: string | null;
  containsSulphites: string | null; wineDesignation: string | null;
}

export function WineDetailClient({ wine, relatedWines }: { wine: WineData; relatedWines: WineData[] }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useWineSelection()
  const isComingSoon = wine.status === 'COMING_SOON' || wine.comingSoon

  const handleAdd = () => {
    addItem({ wineId: wine.id, wineName: wine.name, bottleSize: wine.bottleSize || '750 ml', image: wine.mainImage || undefined, slug: wine.slug, quantity })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const tastingNotes = [
    { label: 'Colour', value: wine.colour },
    { label: 'Aroma', value: wine.aroma },
    { label: 'Palate', value: wine.palate },
    { label: 'Body', value: wine.body },
    { label: 'Sweetness', value: wine.sweetness },
    { label: 'Acidity', value: wine.acidity },
    { label: 'Finish', value: wine.finish },
  ].filter(n => n.value)

  const specs = [
    { label: 'Country', value: wine.country },
    { label: 'Region', value: wine.region },
    { label: 'Origin', value: wine.wineOrigin },
    { label: 'Bottle Size', value: wine.bottleSize },
    { label: 'Alcohol', value: wine.alcohol },
    { label: 'Vintage', value: wine.vintage },
    { label: 'Producer', value: wine.producer },
    { label: 'NAFDAC', value: wine.nafdacRegistration },
    { label: 'Designation', value: wine.wineDesignation },
  ].filter(s => s.value)

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#FAF9F6] py-12 md:py-20">
        <GpilContainer size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="relative w-full aspect-[3/4] max-w-[400px] mx-auto">
              {wine.mainImage ? (
                <Image src={wine.mainImage} alt={wine.name} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 400px" unoptimized />
              ) : (
                <div className="flex items-center justify-center h-full text-[#C6A15B]/30 font-display text-2xl">GPIL</div>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              {wine.category && <p className="text-[#C6A15B] text-xs tracking-[0.3em] uppercase mb-2">{wine.category}</p>}
              <h1 className="font-display text-[#222] text-3xl md:text-4xl font-bold mb-3">{wine.name}</h1>
              {wine.tagline && <p className="text-[#641B2A] font-display italic text-lg mb-4">{wine.tagline}</p>}
              {wine.shortDescription && <p className="text-[#222]/70 leading-relaxed mb-6">{wine.shortDescription}</p>}
              <div className="flex flex-wrap gap-4 text-sm text-[#222]/60 mb-8">
                {wine.alcohol && <span className="bg-[#f5f0e8] px-3 py-1 rounded">{wine.alcohol}</span>}
                {wine.bottleSize && <span className="bg-[#f5f0e8] px-3 py-1 rounded">{wine.bottleSize}</span>}
                {wine.vintage && <span className="bg-[#f5f0e8] px-3 py-1 rounded">{wine.vintage}</span>}
              </div>

              {!isComingSoon && wine.allowQuoteRequests && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#222]/70">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100"><Minus size={16} /></button>
                      <span className="px-4 py-2 min-w-[48px] text-center font-medium">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-100"><Plus size={16} /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={handleAdd}
                      className={`flex items-center gap-2 px-6 py-3 text-sm tracking-wider uppercase transition-all ${
                        added ? 'bg-green-600 text-white' : 'bg-[#641B2A] text-[#F4EBDD] hover:bg-[#3B101A]'
                      }`}>
                      <ShoppingBag size={16} />
                      {added ? 'ADDED!' : 'ADD TO WINE SELECTION'}
                    </button>
                    <Link href="/contact" className="flex items-center gap-2 px-6 py-3 border border-[#641B2A] text-[#641B2A] text-sm tracking-wider uppercase hover:bg-[#641B2A] hover:text-[#F4EBDD] transition-all">
                      <MessageSquare size={16} /> REQUEST AN ENQUIRY
                    </Link>
                  </div>
                </div>
              )}
              {isComingSoon && (
                <div className="inline-block px-6 py-3 bg-[#222]/5 text-[#222]/50 text-sm tracking-wider uppercase">COMING SOON</div>
              )}
            </motion.div>
          </div>
        </GpilContainer>
      </section>

      {/* Full Description */}
      {wine.fullDescription && (
        <section className="py-16 bg-[#FAF9F6]">
          <GpilContainer size="md">
            <h2 className="font-display text-[#222] text-2xl font-bold mb-6">The Story</h2>
            <p className="text-[#222]/70 leading-relaxed text-lg">{wine.fullDescription}</p>
          </GpilContainer>
        </section>
      )}

      {/* Wine at a Glance */}
      {specs.length > 0 && (
        <section className="py-16 bg-[#f5f0e8]">
          <GpilContainer size="lg">
            <h2 className="font-display text-[#222] text-2xl font-bold mb-8 text-center">Wine at a Glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {specs.map(s => (
                <div key={s.label} className="bg-white/80 rounded-lg p-4">
                  <p className="text-[#C6A15B] text-[10px] tracking-[0.2em] uppercase mb-1">{s.label}</p>
                  <p className="text-[#222] text-sm font-medium">{s.value}</p>
                </div>
              ))}
            </div>
          </GpilContainer>
        </section>
      )}

      {/* Tasting Experience */}
      {tastingNotes.length > 0 && (
        <section className="py-16 bg-[#FAF9F6]">
          <GpilContainer size="lg">
            <h2 className="font-display text-[#222] text-2xl font-bold mb-8 text-center">Tasting Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {tastingNotes.map(n => (
                <div key={n.label} className="border-l-2 border-[#C6A15B] pl-4">
                  <p className="text-[#C6A15B] text-xs tracking-[0.2em] uppercase mb-1">{n.label}</p>
                  <p className="text-[#222]/80 text-sm leading-relaxed">{n.value}</p>
                </div>
              ))}
            </div>
          </GpilContainer>
        </section>
      )}

      {/* Food Pairings */}
      {wine.foodPairings.length > 0 && (
        <section className="py-16 bg-[#f5f0e8]">
          <GpilContainer size="lg">
            <h2 className="font-display text-[#222] text-2xl font-bold mb-8 text-center">Perfect Pairings</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {wine.foodPairings.map(p => (
                <span key={p} className="bg-white px-4 py-2 rounded-full text-sm text-[#222]/70 shadow-sm">{p}</span>
              ))}
            </div>
          </GpilContainer>
        </section>
      )}

      {/* Serving & Storage */}
      {(wine.servingTemp || wine.servingInstructions || wine.storageInstructions) && (
        <section className="py-16 bg-[#FAF9F6]">
          <GpilContainer size="md">
            <h2 className="font-display text-[#222] text-2xl font-bold mb-8 text-center">Serving & Storage</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wine.servingTemp && (
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <p className="text-[#C6A15B] text-2xl font-display font-bold mb-2">{wine.servingTemp}</p>
                  <p className="text-[#222]/50 text-xs uppercase tracking-wider">Serving Temperature</p>
                </div>
              )}
              {wine.servingInstructions && (
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <p className="text-[#222]/70 text-sm leading-relaxed">{wine.servingInstructions}</p>
                </div>
              )}
              {wine.storageInstructions && (
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <p className="text-[#222]/70 text-sm leading-relaxed">{wine.storageInstructions}</p>
                </div>
              )}
            </div>
          </GpilContainer>
        </section>
      )}

      {/* Occasions */}
      {wine.idealOccasions.length > 0 && (
        <section className="py-16 bg-[#f5f0e8]">
          <GpilContainer size="lg">
            <h2 className="font-display text-[#222] text-2xl font-bold mb-8 text-center">Perfect For</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {wine.idealOccasions.map(o => (
                <span key={o} className="bg-[#641B2A] text-[#F4EBDD] px-5 py-2 rounded-full text-sm">{o}</span>
              ))}
            </div>
          </GpilContainer>
        </section>
      )}

      {/* Related Wines */}
      {relatedWines.length > 0 && (
        <section className="py-16 bg-[#FAF9F6]">
          <GpilContainer size="lg">
            <h2 className="font-display text-[#222] text-2xl font-bold mb-8 text-center">Explore More Wines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedWines.map(w => <WineCard key={w.id} wine={w as any} />)}
            </div>
          </GpilContainer>
        </section>
      )}

      {/* Closing CTA */}
      <section className="py-20 bg-[#3B101A] text-center">
        <GpilContainer size="md">
          <h2 className="font-display text-[#F4EBDD] text-2xl md:text-3xl font-bold mb-4">Make It Part of Your Next Occasion</h2>
          <p className="text-[#F4EBDD]/70 leading-relaxed mb-8 max-w-xl mx-auto">
            Choose your preferred quantity and send GPIL Wines a quotation request. Our team will contact you with availability and the next steps.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!isComingSoon && wine.allowQuoteRequests && (
              <button onClick={handleAdd}
                className="px-8 py-3 bg-[#C6A15B] text-[#3B101A] text-sm tracking-wider uppercase font-semibold hover:bg-[#d4b36c] transition-colors">
                ADD TO WINE SELECTION
              </button>
            )}
            <Link href="/contact"
              className="px-8 py-3 border border-[#C6A15B] text-[#C6A15B] text-sm tracking-wider uppercase hover:bg-[#C6A15B] hover:text-[#3B101A] transition-all">
              CONTACT GPIL
            </Link>
          </div>
        </GpilContainer>
      </section>
    </div>
  )
}
