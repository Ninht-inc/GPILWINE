'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GpilContainer } from '@/components/ui/gpil-container'
import { useWineSelection } from '@/lib/wine-selection'
import { useRouter } from 'next/navigation'
import { Plus, Minus, Trash2 } from 'lucide-react'

const occasions = ['Personal', 'Event', 'Wedding', 'Corporate', 'Restaurant', 'Retail', 'Gift', 'Other']
const contactMethods = ['Phone', 'WhatsApp', 'Email']

export default function RequestQuotePage() {
  const { items, updateQuantity, removeItem, clearSelection } = useWineSelection()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', whatsapp: '', preferredContact: 'Email',
    country: '', state: '', city: '', deliveryLocation: '', fullAddress: '',
    occasion: '', requiredDate: '', message: '', consent: false,
  })

  const update = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) { setError('Please add wines to your selection first.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({ wineId: i.wineId, wineName: i.wineName, bottleSize: i.bottleSize, quantity: i.quantity })),
        }),
      })
      const data = await res.json()
      if (data.success) {
        clearSelection()
        router.push(`/request-a-quote/success?ref=${data.referenceNumber}`)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20 min-h-screen bg-[#FAF9F6]">
        <div className="bg-[#3B101A] py-12 md:py-16">
          <GpilContainer size="lg">
            <p className="text-[#C6A15B] text-xs tracking-[0.3em] uppercase mb-3">YOUR WINE SELECTION</p>
            <h1 className="font-display text-[#F4EBDD] text-3xl md:text-4xl font-bold mb-4">Request a Quote</h1>
            <p className="text-[#F4EBDD]/70 max-w-2xl">
              Tell us where you are and how we can reach you. The GPIL Wines team will review your selection and contact you with availability, quotation details and the next steps.
            </p>
          </GpilContainer>
        </div>

        <GpilContainer size="lg">
          <form onSubmit={handleSubmit} className="py-12 max-w-3xl mx-auto space-y-8">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{error}</div>}

            {/* Wine Selection Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="font-display text-[#222] text-lg font-semibold mb-4">Your Wine Selection</h2>
              {items.length === 0 ? (
                <p className="text-[#222]/50 text-sm">No wines selected. <a href="/wines" className="text-[#641B2A] underline">Browse wines</a></p>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.wineId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div><p className="font-medium text-sm">{item.wineName}</p><p className="text-xs text-[#222]/50">{item.bottleSize}</p></div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-200 rounded text-sm">
                          <button type="button" onClick={() => updateQuantity(item.wineId, item.quantity - 1)} className="px-2 py-1"><Minus size={12} /></button>
                          <span className="px-2">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.wineId, item.quantity + 1)} className="px-2 py-1"><Plus size={12} /></button>
                        </div>
                        <button type="button" onClick={() => removeItem(item.wineId)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <h2 className="font-display text-[#222] text-lg font-semibold">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Full Name" required value={form.fullName} onChange={v => update('fullName', v)} />
                <FormField label="Email Address" type="email" required value={form.email} onChange={v => update('email', v)} />
                <FormField label="Phone Number" type="tel" required value={form.phone} onChange={v => update('phone', v)} />
                <FormField label="WhatsApp Number" type="tel" value={form.whatsapp} onChange={v => update('whatsapp', v)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#222] mb-1">Preferred Contact Method *</label>
                <div className="flex gap-4">
                  {contactMethods.map(m => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="preferredContact" value={m} checked={form.preferredContact === m}
                        onChange={() => update('preferredContact', m)} className="accent-[#641B2A]" />
                      <span className="text-sm">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <h2 className="font-display text-[#222] text-lg font-semibold">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Country" required value={form.country} onChange={v => update('country', v)} />
                <FormField label="State" required value={form.state} onChange={v => update('state', v)} />
                <FormField label="City" value={form.city} onChange={v => update('city', v)} />
                <FormField label="Delivery / Collection Location" value={form.deliveryLocation} onChange={v => update('deliveryLocation', v)} />
              </div>
              <FormField label="Full Address" value={form.fullAddress} onChange={v => update('fullAddress', v)} />
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <h2 className="font-display text-[#222] text-lg font-semibold">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#222] mb-1">Occasion / Purpose</label>
                  <select value={form.occasion} onChange={e => update('occasion', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C6A15B] outline-none text-sm">
                    <option value="">Select...</option>
                    {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <FormField label="Required Date" type="date" value={form.requiredDate} onChange={v => update('requiredDate', v)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#222] mb-1">Additional Message</label>
                <textarea value={form.message} onChange={e => update('message', e.target.value)} rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C6A15B] outline-none text-sm" />
              </div>
            </div>

            {/* Consent & Submit */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.consent} onChange={e => update('consent', e.target.checked)}
                  className="mt-1 accent-[#641B2A]" required />
                <span className="text-sm text-[#222]/70">I consent to GPIL Wines contacting me regarding this enquiry.</span>
              </label>
              <button type="submit" disabled={loading || items.length === 0}
                className="w-full py-4 bg-[#C6A15B] text-[#3B101A] text-sm tracking-wider uppercase font-bold hover:bg-[#d4b36c] transition-colors disabled:opacity-50">
                {loading ? 'SUBMITTING...' : 'SUBMIT QUOTE REQUEST'}
              </button>
            </div>
          </form>
        </GpilContainer>
      </main>
      <Footer />
    </>
  )
}

function FormField({ label, type = 'text', required = false, value, onChange }: {
  label: string; type?: string; required?: boolean; value: string; onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#222] mb-1">{label}{required && ' *'}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C6A15B] focus:border-transparent outline-none text-sm" />
    </div>
  )
}
