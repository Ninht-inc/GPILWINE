'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GpilContainer } from '@/components/ui/gpil-container'
import { useWineSelection } from '@/lib/wine-selection'
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function WineSelectionPage() {
  const { items, updateQuantity, removeItem, clearSelection, totalItems } = useWineSelection()

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20 min-h-screen bg-[#FAF9F6]">
        <div className="bg-[#3B101A] py-12 md:py-16">
          <GpilContainer size="lg">
            <p className="text-[#C6A15B] text-xs tracking-[0.3em] uppercase mb-3">YOUR WINE SELECTION</p>
            <h1 className="font-display text-[#F4EBDD] text-3xl md:text-4xl font-bold">Your Wine Selection</h1>
          </GpilContainer>
        </div>

        <GpilContainer size="lg">
          <div className="py-12">
            {items.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <ShoppingBag className="w-16 h-16 text-[#222]/20 mx-auto mb-4" />
                <h2 className="font-display text-[#222] text-xl mb-3">Your selection is empty</h2>
                <p className="text-[#222]/60 mb-8">Browse our wines and add them to your selection.</p>
                <Link href="/wines" className="inline-block px-8 py-3 bg-[#641B2A] text-[#F4EBDD] text-sm tracking-wider uppercase hover:bg-[#3B101A] transition-colors">
                  EXPLORE OUR WINES
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <motion.div key={item.wineId} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg p-4 md:p-6 shadow-sm flex items-center gap-4 md:gap-6">
                    {item.image && (
                      <div className="relative w-16 h-20 flex-shrink-0">
                        <Image src={item.image} alt={item.wineName} fill className="object-contain" unoptimized />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-[#222] font-semibold truncate">{item.wineName}</h3>
                      <p className="text-[#222]/50 text-sm">{item.bottleSize}</p>
                    </div>
                    <div className="flex items-center border border-gray-200 rounded">
                      <button onClick={() => updateQuantity(item.wineId, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-100"><Minus size={14} /></button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[36px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.wineId, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item.wineId)} className="p-2 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                  </motion.div>
                ))}

                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4">
                  <button onClick={clearSelection} className="text-sm text-[#222]/50 hover:text-red-500 transition-colors">Clear Selection</button>
                  <div className="flex gap-3">
                    <Link href="/wines" className="px-6 py-3 border border-[#641B2A] text-[#641B2A] text-sm tracking-wider uppercase hover:bg-[#641B2A] hover:text-[#F4EBDD] transition-all">
                      CONTINUE BROWSING
                    </Link>
                    <Link href="/request-a-quote" className="px-6 py-3 bg-[#C6A15B] text-[#3B101A] text-sm tracking-wider uppercase font-semibold hover:bg-[#d4b36c] transition-colors">
                      REQUEST A QUOTE
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </GpilContainer>
      </main>
      <Footer />
    </>
  )
}
