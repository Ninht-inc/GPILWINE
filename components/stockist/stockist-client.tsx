'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GpilContainer } from '@/components/ui/gpil-container'

interface Stockist {
  id: string; name: string; type: string; address: string;
  city: string; province: string; phone?: string; email?: string;
  website?: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
}

export function StockistClient() {
  const [stockists, setStockists] = useState<Stockist[]>([])
  const [loading, setLoading] = useState(true)
  const [province, setProvince] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', province: '', message: '' })
  const [formLoading, setFormLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (province) params.set('province', province)
    fetch(`/api/stockists?${params}`)
      .then(r => r.json())
      .then(d => { setStockists(d.stockists || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [province])

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true); setFormError('')
    try {
      const res = await fetch('/api/stockist-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed') }
      setFormSuccess(true)
    } catch (err: any) { setFormError(err.message) }
    finally { setFormLoading(false) }
  }

  const provinces = ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape']

  return (
    <>
      <section className="bg-[#FAF9F6] py-20 md:py-28">
        <GpilContainer size="lg">
          {/* Filter */}
          <motion.div {...fadeUp} className="mb-12">
            <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-2">Filter by Province</label>
            <select value={province} onChange={e => setProvince(e.target.value)} className="border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors bg-white w-full max-w-xs">
              <option value="">All Provinces</option>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </motion.div>

          {/* Stockist List */}
          {loading ? (
            <div className="text-center py-12 text-[#222]/50">Loading stockists...</div>
          ) : stockists.length === 0 ? (
            <motion.div {...fadeUp} className="text-center py-12">
              <p className="text-[#222]/60 mb-4">No stockists found{province ? ` in ${province}` : ''}. We&apos;re expanding — check back soon!</p>
              <button onClick={() => setShowForm(true)} className="text-[#C6A15B] font-medium hover:underline">Can&apos;t find us near you? Request assistance →</button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stockists.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="bg-white p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-[#222] font-bold">{s.name}</h3>
                    <span className="text-[10px] tracking-wider uppercase text-[#C6A15B] bg-[#C6A15B]/10 px-2 py-1 rounded font-sans">{s.type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-[#222]/60 text-sm mb-1">{s.address}</p>
                  <p className="text-[#222]/60 text-sm mb-3">{s.city}, {s.province}</p>
                  {s.phone && <p className="text-sm"><span suppressHydrationWarning>{s.phone}</span></p>}
                  {s.email && <p className="text-sm"><span suppressHydrationWarning>{s.email}</span></p>}
                  {s.website && <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#C6A15B] hover:underline">Visit Website</a>}
                </motion.div>
              ))}
            </div>
          )}

          {stockists.length > 0 && !showForm && (
            <motion.div {...fadeUp} className="text-center mt-12">
              <button onClick={() => setShowForm(true)} className="text-[#C6A15B] font-medium hover:underline">Can&apos;t find us near you? Request assistance →</button>
            </motion.div>
          )}
        </GpilContainer>
      </section>

      {/* Assistance Form */}
      {showForm && (
        <section className="bg-[#F4EBDD] py-20 md:py-28">
          <GpilContainer size="sm">
            <motion.div {...fadeUp}>
              {formSuccess ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="font-display text-[#222] text-xl font-bold mb-3">Request Received!</h3>
                  <p className="text-[#222]/70">We&apos;ll look into stockist options in your area and get back to you.</p>
                </div>
              ) : (
                <form onSubmit={handleRequest} className="bg-white p-8 md:p-10 space-y-6">
                  <h3 className="font-display text-[#222] text-xl font-bold">Request Stockist Assistance</h3>
                  <p className="text-[#222]/60 text-sm">Tell us where you are and we&apos;ll help you find a convenient place to purchase GPIL Wines.</p>
                  {formError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{formError}</p>}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Name *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Email *</label>
                      <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">City *</label>
                      <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Province *</label>
                      <select required value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors bg-white">
                        <option value="">Select province</option>
                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Additional Info</label>
                    <textarea rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors resize-none" />
                  </div>
                  <button type="submit" disabled={formLoading} className="w-full bg-[#641B2A] text-[#F4EBDD] py-3.5 text-sm font-semibold tracking-wider uppercase hover:bg-[#7a2235] transition-colors disabled:opacity-50">
                    {formLoading ? 'SENDING...' : 'SUBMIT REQUEST'}
                  </button>
                </form>
              )}
            </motion.div>
          </GpilContainer>
        </section>
      )}
    </>
  )
}
