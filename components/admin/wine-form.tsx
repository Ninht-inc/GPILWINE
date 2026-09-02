'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload, GalleryUpload } from '@/components/admin/image-upload'

type Form = Record<string, any>

const TEXT = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#641B2A] focus:border-[#641B2A]'
const LABEL = 'block text-sm font-medium text-gray-700 mb-1'
const SECTION = 'bg-white rounded-lg shadow p-6 space-y-4'

function Field({ label, value, onChange, required, type = 'text', step }: {
  label: string; value: any; onChange: (v: string) => void; required?: boolean; type?: string; step?: string
}) {
  return (
    <div>
      <label className={LABEL}>{label} {required && '*'}</label>
      <input type={type} step={step} required={required} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={TEXT} />
    </div>
  )
}

function AreaField({ label, value, onChange, rows = 3 }: {
  label: string; value: any; onChange: (v: string) => void; rows?: number
}) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${TEXT} resize-none`} />
    </div>
  )
}

const STRING_FIELDS = [
  'name', 'slug', 'category', 'subtitle', 'tagline', 'vintage',
  'shortDescription', 'fullDescription',
  'country', 'region', 'wineOrigin', 'bottleSize', 'alcohol', 'producer',
  'producerAddress', 'madeFor', 'nigerianImporter', 'nafdacRegistration',
  'containsSulphites', 'wineDesignation',
  'colour', 'aroma', 'palate', 'body', 'sweetness', 'acidity', 'finish',
  'servingTemp', 'servingInstructions', 'storageInstructions', 'idealCustomer',
  'mainImage', 'transparentImage', 'heroImage', 'cardImage', 'ogImage', 'videoUrl',
  'seoTitle', 'metaDescription', 'canonicalUrl', 'currency',
]
const ARRAY_FIELDS = ['foodPairings', 'idealOccasions', 'seoKeywords', 'gallery']
const BOOL_FIELDS = ['featured', 'allowQuoteRequests', 'comingSoon']

function hydrate(initial?: any): Form {
  const f: Form = {}
  for (const k of STRING_FIELDS) f[k] = initial?.[k] ?? ''
  for (const k of ARRAY_FIELDS) f[k] = Array.isArray(initial?.[k]) ? initial[k] : []
  for (const k of BOOL_FIELDS) f[k] = initial?.[k] ?? (k === 'allowQuoteRequests')
  f.displayOrder = initial?.displayOrder ?? 10
  f.minimumQuantity = initial?.minimumQuantity ?? 1
  f.price = initial?.price ?? ''
  f.status = initial?.status ?? 'DRAFT'
  return f
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function WineForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const isEdit = !!initialData?.id
  const [form, setForm] = useState<Form>(() => hydrate(initialData))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))
  const csv = (k: string) => (form[k] as string[]).join(', ')
  const setCsv = (k: string, v: string) => set(k, v.split(',').map((s) => s.trim()).filter(Boolean))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload: Form = { status: form.status }
      for (const k of STRING_FIELDS) payload[k] = form[k] === '' ? null : form[k]
      for (const k of ARRAY_FIELDS) payload[k] = form[k]
      for (const k of BOOL_FIELDS) payload[k] = Boolean(form[k])
      payload.displayOrder = Number(form.displayOrder) || 0
      payload.minimumQuantity = form.minimumQuantity === '' ? null : Number(form.minimumQuantity)
      payload.price = form.price === '' || form.price == null ? null : Number(form.price)
      payload.name = form.name
      payload.slug = form.slug

      const url = isEdit ? `/api/admin/wines/${initialData.id}` : '/api/admin/wines'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Save failed')
      }
      router.push('/admin/wines')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const folder = `gpil/wines/${form.slug || 'misc'}`

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded">{error}</div>}

      <div className={SECTION}>
        <h2 className="font-semibold text-gray-900">Basics</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Wine Name *</label>
            <input required value={form.name} onChange={(e) => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }} className={TEXT} />
          </div>
          <Field label="Slug" required value={form.slug} onChange={(v) => set('slug', v)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category" value={form.category} onChange={(v) => set('category', v)} />
          <Field label="Subtitle" value={form.subtitle} onChange={(v) => set('subtitle', v)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Tagline" value={form.tagline} onChange={(v) => set('tagline', v)} />
          <Field label="Vintage" value={form.vintage} onChange={(v) => set('vintage', v)} />
        </div>
        <AreaField label="Short Description" rows={2} value={form.shortDescription} onChange={(v) => set('shortDescription', v)} />
        <AreaField label="Full Description" rows={5} value={form.fullDescription} onChange={(v) => set('fullDescription', v)} />
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={LABEL}>Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={`${TEXT} bg-white`}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="COMING_SOON">Coming Soon</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <Field label="Display Order" type="number" value={form.displayOrder} onChange={(v) => set('displayOrder', v)} />
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4" /> Featured
          </label>
        </div>
      </div>

      <div className={SECTION}>
        <h2 className="font-semibold text-gray-900">Images</h2>
        <ImageUpload label="Main image" value={form.mainImage} onChange={(v) => set('mainImage', v)} folder={folder} />
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUpload label="Transparent bottle" value={form.transparentImage} onChange={(v) => set('transparentImage', v)} folder={folder} />
          <ImageUpload label="Hero image" value={form.heroImage} onChange={(v) => set('heroImage', v)} folder={folder} aspect="aspect-video" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUpload label="Card image" value={form.cardImage} onChange={(v) => set('cardImage', v)} folder={folder} />
          <ImageUpload label="Social share (OG) image" value={form.ogImage} onChange={(v) => set('ogImage', v)} folder={folder} aspect="aspect-video" />
        </div>
        <div>
          <label className={LABEL}>Gallery</label>
          <GalleryUpload value={form.gallery} onChange={(v) => set('gallery', v)} folder={folder} />
        </div>
        <Field label="Video URL" value={form.videoUrl} onChange={(v) => set('videoUrl', v)} />
      </div>

      <div className={SECTION}>
        <h2 className="font-semibold text-gray-900">Origin &amp; Technical</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Country" value={form.country} onChange={(v) => set('country', v)} />
          <Field label="Region" value={form.region} onChange={(v) => set('region', v)} />
          <Field label="Wine Origin" value={form.wineOrigin} onChange={(v) => set('wineOrigin', v)} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Bottle Size" value={form.bottleSize} onChange={(v) => set('bottleSize', v)} />
          <Field label="Alcohol" value={form.alcohol} onChange={(v) => set('alcohol', v)} />
          <Field label="Designation" value={form.wineDesignation} onChange={(v) => set('wineDesignation', v)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Producer" value={form.producer} onChange={(v) => set('producer', v)} />
          <Field label="Producer Address" value={form.producerAddress} onChange={(v) => set('producerAddress', v)} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Made For" value={form.madeFor} onChange={(v) => set('madeFor', v)} />
          <Field label="Importer" value={form.nigerianImporter} onChange={(v) => set('nigerianImporter', v)} />
          <Field label="NAFDAC Reg." value={form.nafdacRegistration} onChange={(v) => set('nafdacRegistration', v)} />
        </div>
        <Field label="Contains Sulphites" value={form.containsSulphites} onChange={(v) => set('containsSulphites', v)} />
      </div>

      <div className={SECTION}>
        <h2 className="font-semibold text-gray-900">Tasting Notes</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Colour" value={form.colour} onChange={(v) => set('colour', v)} />
          <Field label="Aroma" value={form.aroma} onChange={(v) => set('aroma', v)} />
          <Field label="Palate" value={form.palate} onChange={(v) => set('palate', v)} />
          <Field label="Body" value={form.body} onChange={(v) => set('body', v)} />
          <Field label="Sweetness" value={form.sweetness} onChange={(v) => set('sweetness', v)} />
          <Field label="Acidity" value={form.acidity} onChange={(v) => set('acidity', v)} />
        </div>
        <Field label="Finish" value={form.finish} onChange={(v) => set('finish', v)} />
      </div>

      <div className={SECTION}>
        <h2 className="font-semibold text-gray-900">Lifestyle</h2>
        <div>
          <label className={LABEL}>Food Pairings (comma-separated)</label>
          <input value={csv('foodPairings')} onChange={(e) => setCsv('foodPairings', e.target.value)} className={TEXT} />
        </div>
        <div>
          <label className={LABEL}>Ideal Occasions (comma-separated)</label>
          <input value={csv('idealOccasions')} onChange={(e) => setCsv('idealOccasions', e.target.value)} className={TEXT} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Serving Temperature" value={form.servingTemp} onChange={(v) => set('servingTemp', v)} />
          <Field label="Ideal Customer" value={form.idealCustomer} onChange={(v) => set('idealCustomer', v)} />
        </div>
        <AreaField label="Serving Instructions" rows={2} value={form.servingInstructions} onChange={(v) => set('servingInstructions', v)} />
        <AreaField label="Storage Instructions" rows={2} value={form.storageInstructions} onChange={(v) => set('storageInstructions', v)} />
      </div>

      <div className={SECTION}>
        <h2 className="font-semibold text-gray-900">Enquiry &amp; Pricing</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.allowQuoteRequests} onChange={(e) => set('allowQuoteRequests', e.target.checked)} className="h-4 w-4" /> Allow quote requests
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.comingSoon} onChange={(e) => set('comingSoon', e.target.checked)} className="h-4 w-4" /> Coming soon
          </label>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Minimum Quantity" type="number" value={form.minimumQuantity} onChange={(v) => set('minimumQuantity', v)} />
          <Field label="Price (optional)" type="number" step="0.01" value={form.price} onChange={(v) => set('price', v)} />
          <Field label="Currency" value={form.currency} onChange={(v) => set('currency', v)} />
        </div>
      </div>

      <div className={SECTION}>
        <h2 className="font-semibold text-gray-900">SEO</h2>
        <Field label="SEO Title" value={form.seoTitle} onChange={(v) => set('seoTitle', v)} />
        <AreaField label="Meta Description" rows={2} value={form.metaDescription} onChange={(v) => set('metaDescription', v)} />
        <div>
          <label className={LABEL}>SEO Keywords (comma-separated)</label>
          <input value={csv('seoKeywords')} onChange={(e) => setCsv('seoKeywords', e.target.value)} className={TEXT} />
        </div>
        <Field label="Canonical URL" value={form.canonicalUrl} onChange={(v) => set('canonicalUrl', v)} />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">
          {loading ? 'Saving…' : isEdit ? 'Update Wine' : 'Create Wine'}
        </button>
        <button type="button" onClick={() => router.push('/admin/wines')} className="bg-gray-100 text-gray-700 px-6 py-2.5 text-sm font-medium rounded hover:bg-gray-200">
          Cancel
        </button>
      </div>
    </form>
  )
}
