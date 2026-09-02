'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface MediaItem {
  id: string; fileName: string; url: string | null; contentType: string; size: number;
  altText: string | null; createdAt: string
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/media')
      .then(r => r.json())
      .then(d => { setItems(d.media || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(load, [])

  const uploadMany = async (files: FileList) => {
    setUploading(true); setError('')
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('folder', 'gpil/library')
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const d = await res.json()
        if (!res.ok) throw new Error(d.error || 'Upload failed')
      }
      load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this image from Cloudinary and the library? Anything still using its URL will break.')) return
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
    load()
  }

  const copy = (url: string) => {
    navigator.clipboard?.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/media/migrate" className="text-sm text-[#641B2A] hover:underline">Migrate existing images →</Link>
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            className="bg-[#641B2A] text-white px-4 py-2 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">
            {uploading ? 'Uploading…' : 'Upload images'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 text-center py-12">No images yet. Upload some above.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map(m => (
            <div key={m.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                {m.url && <Image src={m.url} alt={m.altText || m.fileName} fill className="object-contain" unoptimized />}
              </div>
              <div className="p-2 space-y-1">
                <p className="text-xs text-gray-700 truncate" title={m.fileName}>{m.fileName}</p>
                <div className="flex items-center justify-between">
                  <button onClick={() => m.url && copy(m.url)} className="text-[11px] text-[#641B2A] hover:underline">
                    {copied === m.url ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button onClick={() => remove(m.id)} className="text-[11px] text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" multiple hidden
        onChange={e => { if (e.target.files?.length) uploadMany(e.target.files); e.target.value = '' }} />
    </div>
  )
}
