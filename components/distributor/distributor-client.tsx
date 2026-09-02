'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GpilContainer } from '@/components/gpil-container'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
}

export function DistributorClient() {
  const [form, setForm] = useState({
    companyName: '', contactName: '', email: '', phone: '',
    website: '', region: '', existingPortfolio: '', message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/distributor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit')
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section className="bg-[#FAF9F6] py-20 md:py-28">
        <GpilContainer size="sm">
          <motion.div {...fadeUp} className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="font-display text-[#222] text-2xl font-bold mb-4">Application Received!</h2>
            <p className="text-[#222]/70 mb-8">Thank you for your interest in partnering with GPIL Wines. Our team will review your application and be in touch within 5 business days.</p>
            <a href="/" className="inline-block bg-[#641B2A] text-[#F4EBDD] py-3 px-8 text-sm font-semibold tracking-wider uppercase hover:bg-[#7a2235] transition-colors">BACK TO HOME</a>
          </motion.div>
        </GpilContainer>
      </section>
    )
  }

  return (
    <>
      {/* Benefits */}
      <section className="bg-[#FAF9F6] py-20 md:py-28">
        <GpilContainer size="lg">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-[#C6A15B] text-xs tracking-[0.3em] uppercase mb-4 font-sans">WHY PARTNER WITH US</p>
            <h2 className="font-display text-[#222] text-2xl md:text-3xl font-bold">Distribution Benefits</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Growing Brand', desc: 'Join a brand on the rise — our wines are gaining recognition across South Africa and beyond.' },
              { title: 'Marketing Support', desc: 'We provide promotional materials, point-of-sale assets, and co-branded marketing support.' },
              { title: 'Dedicated Account Team', desc: 'Receive hands-on support from our sales team with regular check-ins and stock management assistance.' },
            ].map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} className="bg-white p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-[#641B2A]/10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#C6A15B]" />
                </div>
                <h3 className="font-display text-[#222] text-lg font-bold mb-3">{b.title}</h3>
                <p className="text-[#222]/60 text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </GpilContainer>
      </section>

      {/* Form */}
      <section className="bg-[#F4EBDD] py-20 md:py-28">
        <GpilContainer size="md">
          <motion.div {...fadeUp}>
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 space-y-6">
              <h3 className="font-display text-[#222] text-xl font-bold mb-2">Distributor Application</h3>
              <p className="text-[#222]/60 text-sm mb-4">Please fill in the form below and our partnerships team will get back to you.</p>
              {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Company Name *</label>
                  <input required value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Contact Person *</label>
                  <input required value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Phone *</label>
                  <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Company Website</label>
                  <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" placeholder="https://" />
                </div>
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Region / Territory *</label>
                  <input required value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" placeholder="e.g. Gauteng, Western Cape" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Existing Portfolio</label>
                <input value={form.existingPortfolio} onChange={e => setForm(f => ({ ...f, existingPortfolio: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" placeholder="Other brands you currently distribute" />
              </div>
              <div>
                <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Additional Information</label>
                <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors resize-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#641B2A] text-[#F4EBDD] py-3.5 text-sm font-semibold tracking-wider uppercase hover:bg-[#7a2235] transition-colors disabled:opacity-50">
                {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
              </button>
            </form>
          </motion.div>
        </GpilContainer>
      </section>
    </>
  )
}
