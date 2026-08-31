'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface WineData {
  id?: string; name: string; slug: string; tagline: string; shortDescription: string;
  description: string; varietal: string; vintage: string; region: string; alcohol: string;
  volume: string; tastingNotes: string; servingTemp: string; foodPairings: string;
  imageUrl: string; galleryImages: string; status: string; displayOrder: number;
}

const defaults: WineData = {
  name: '', slug: '', tagline: '', shortDescription: '', description: '',
  varietal: '', vintage: '', region: 'Western Cape, South Africa', alcohol: '', volume: '750ml',
  tastingNotes: '', servingTemp: '', foodPairings: '', imageUrl: '', galleryImages: '',
  status: 'DRAFT', displayOrder: 10,
}

export function WineForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const isEdit = !!initialData?.id

  const [form, setForm] = useState<WineData>(() => {
    if (!initialData) return defaults
    return {
      id: initialData.id,
      name: initialData.name || '',
      slug: initialData.slug || '',
      tagline: initialData.tagline || '',
      shortDescription: initialData.shortDescription || '',
      description: initialData.description || '',
      varietal: initialData.varietal || '',
      vintage: initialData.vintage || '',
      region: initialData.region || '',
      alcohol: initialData.alcohol || '',
      volume: initialData.volume || '750ml',
      tastingNotes: initialData.tastingNotes || '',
      servingTemp: initialData.servingTemp || '',
      foodPairings: Array.isArray(initialData.foodPairings) ? initialData.foodPairings.join(', ') : (initialData.foodPairings || ''),
      imageUrl: initialData.imageUrl || '',
      galleryImages: Array.isArray(initialData.galleryImages) ? initialData.galleryImages.join('\n') : (initialData.galleryImages || ''),
      status: initialData.status || 'DRAFT',
      displayOrder: initialData.displayOrder || 10,
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const payload = {
        ...form,
        foodPairings: form.foodPairings.split(',').map(s => s.trim()).filter(Boolean),
        galleryImages: form.galleryImages.split('\n').map(s => s.trim()).filter(Boolean),
        displayOrder: Number(form.displayOrder),
      }
      const url = isEdit ? `/api/admin/wines/${form.id}` : '/api/admin/wines'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed') }
      router.push('/admin/wines')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const set = (key: keyof WineData, val: any) => setForm(f => ({ ...f, [key]: val }))

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 md:p-8 space-y-6 max-w-3xl">
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded">{error}</div>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wine Name *</label>
          <input required value={form.name} onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', generateSlug(e.target.value)) }} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#641B2A] focus:border-[#641B2A]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input required value={form.slug} onChange={e => set('slug', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#641B2A] focus:border-[#641B2A]" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
        <input value={form.tagline} onChange={e => set('tagline', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="e.g. A wine for every celebration" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
        <textarea required rows={2} value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
        <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none" />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Varietal *</label>
          <input required value={form.varietal} onChange={e => set('varietal', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vintage</label>
          <input value={form.vintage} onChange={e => set('vintage', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="e.g. 2025" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <input value={form.region} onChange={e => set('region', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alcohol %</label>
          <input value={form.alcohol} onChange={e => set('alcohol', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="e.g. 12.5%" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
          <input value={form.volume} onChange={e => set('volume', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Serving Temp</label>
          <input value={form.servingTemp} onChange={e => set('servingTemp', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="e.g. 16-18°C" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tasting Notes</label>
        <textarea rows={3} value={form.tastingNotes} onChange={e => set('tastingNotes', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Food Pairings (comma-separated)</label>
        <input value={form.foodPairings} onChange={e => set('foodPairings', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="e.g. Grilled meats, Pasta, Cheese" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
        <input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
        {form.imageUrl && (
          <div className="mt-2 relative w-20 h-28 bg-gray-100 rounded overflow-hidden">
            <Image src={form.imageUrl} alt="Preview" fill className="object-contain" unoptimized />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images (one URL per line)</label>
        <textarea rows={3} value={form.galleryImages} onChange={e => set('galleryImages', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="COMING_SOON">Coming Soon</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
          <input type="number" value={form.displayOrder} onChange={e => set('displayOrder', Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : isEdit ? 'Update Wine' : 'Create Wine'}
        </button>
        <button type="button" onClick={() => router.push('/admin/wines')} className="bg-gray-100 text-gray-700 px-6 py-2.5 text-sm font-medium rounded hover:bg-gray-200 transition-colors">Cancel</button>
      </div>
    </form>
  )
}
