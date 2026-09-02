'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

/**
 * Uploads an image to Cloudinary via /api/admin/upload and returns the URL.
 * Also accepts a pasted URL as a fallback. Existing values are always kept
 * unless the user explicitly replaces or clears them.
 */
export function ImageUpload({
  value,
  onChange,
  folder,
  label,
  aspect = 'aspect-[3/4]',
}: {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  aspect?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const upload = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (folder) fd.append('folder', folder)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Upload failed')
      onChange(d.url)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex items-start gap-4">
        <div className={`relative w-24 ${aspect} bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200`}>
          {value ? (
            <Image src={value} alt="" fill className="object-contain" unoptimized />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 text-xs">none</div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="bg-gray-800 text-white px-3 py-1.5 text-xs font-medium rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-red-600 text-xs hover:underline px-2"
              >
                Remove
              </button>
            )}
          </div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste an image URL"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs"
          />
          {error && <p className="text-red-600 text-xs">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) upload(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}

/** Multi-image variant for galleries. */
export function GalleryUpload({
  value,
  onChange,
  folder,
}: {
  value: string[]
  onChange: (urls: string[]) => void
  folder?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const uploadMany = async (files: FileList) => {
    setUploading(true)
    setError('')
    const added: string[] = []
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        if (folder) fd.append('folder', folder)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const d = await res.json()
        if (!res.ok) throw new Error(d.error || 'Upload failed')
        added.push(d.url)
      }
      onChange([...value, ...added])
    } catch (e: any) {
      setError(e.message)
      if (added.length) onChange([...value, ...added])
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="bg-gray-800 text-white px-3 py-1.5 text-xs font-medium rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Add images'}
        </button>
        {error && <span className="text-red-600 text-xs">{error}</span>}
      </div>
      {value.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {value.map((url, i) => (
            <div key={url + i} className="relative group aspect-square bg-gray-100 rounded overflow-hidden border border-gray-200">
              <Image src={url} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute top-0.5 right-0.5 bg-black/60 text-white text-xs w-5 h-5 rounded opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) uploadMany(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
