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

export function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
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
            <h2 className="font-display text-[#222] text-2xl font-bold mb-4">Message Sent!</h2>
            <p className="text-[#222]/70 mb-8">Thank you for reaching out. We&apos;ll get back to you as soon as possible.</p>
            <a href="/" className="inline-block bg-[#641B2A] text-[#F4EBDD] py-3 px-8 text-sm font-semibold tracking-wider uppercase hover:bg-[#7a2235] transition-colors">
              BACK TO HOME
            </a>
          </motion.div>
        </GpilContainer>
      </section>
    )
  }

  return (
    <section className="bg-[#FAF9F6] py-20 md:py-28">
      <GpilContainer size="lg">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          {/* Contact Info */}
          <motion.div {...fadeUp} className="md:col-span-2 space-y-8">
            <div>
              <h3 className="font-display text-[#222] text-xl font-bold mb-3">General Enquiries</h3>
              <p className="text-[#222]/60 text-sm leading-relaxed mb-2">For questions about our wines, stockist locations, or anything else:</p>
              <p className="text-[#641B2A] font-medium"><a href="mailto:info@gpilwine.com" className="hover:underline">info@gpilwine.com</a></p>
            </div>
            <div>
              <h3 className="font-display text-[#222] text-xl font-bold mb-3">Business &amp; Distribution</h3>
              <p className="text-[#222]/60 text-sm leading-relaxed mb-2">Interested in stocking GPIL Wines or becoming a distributor?</p>
              <a href="/become-a-distributor" className="text-[#C6A15B] font-medium hover:underline">Distributor Enquiries →</a>
            </div>
            <div>
              <h3 className="font-display text-[#222] text-xl font-bold mb-3">Follow Us</h3>
              <p className="text-[#222]/60 text-sm leading-relaxed">Stay up to date with new releases, events, and more on our social channels.</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 space-y-6">
              <h3 className="font-display text-[#222] text-xl font-bold mb-2">Send Us a Message</h3>
              {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</p>}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Subject *</label>
                  <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors bg-white">
                    <option value="">Select a subject</option>
                    <option value="general">General Enquiry</option>
                    <option value="wines">About Our Wines</option>
                    <option value="stockist">Stockist Information</option>
                    <option value="events">Events &amp; Tastings</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-sans tracking-wider uppercase text-[#222]/50 mb-1">Message *</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full border border-[#222]/10 px-4 py-3 text-sm focus:outline-none focus:border-[#C6A15B] transition-colors resize-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#641B2A] text-[#F4EBDD] py-3.5 text-sm font-semibold tracking-wider uppercase hover:bg-[#7a2235] transition-colors disabled:opacity-50">
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </motion.div>
        </div>
      </GpilContainer>
    </section>
  )
}
