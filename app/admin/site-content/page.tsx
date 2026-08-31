'use client'

import { useState, useEffect } from 'react'

interface Content { id: string; slug: string; title: string; updatedAt: string }

export default function AdminSiteContentPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/site-content')
      .then(r => r.json())
      .then(d => { setContents(d.contents || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const loadContent = async (slug: string) => {
    const res = await fetch(`/api/admin/site-content/${slug}`)
    const d = await res.json()
    setEditing(d.content)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true); setSaved(false)
    try {
      await fetch(`/api/admin/site-content/${editing.slug}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editing.title, content: editing.content }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {}
    finally { setSaving(false) }
  }

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>

  if (editing) {
    return (
      <div className="max-w-3xl">
        <button onClick={() => { setEditing(null); setSaved(false) }} className="text-sm text-gray-500 hover:text-gray-700 mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit: {editing.title}</h1>
        <div className="bg-white rounded-lg shadow p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
            <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
            <textarea rows={20} value={editing.content || ''} onChange={e => setEditing({ ...editing, content: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono resize-none" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50">{saving ? 'Saving...' : 'Save Content'}</button>
            {saved && <span className="text-green-600 text-sm">Saved!</span>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Site Content</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr><th className="px-6 py-3 text-left">Page</th><th className="px-6 py-3 text-left">Last Updated</th><th className="px-6 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contents.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><p className="text-sm font-medium">{c.title}</p><p className="text-xs text-gray-500">/{c.slug}</p></td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(c.updatedAt).toLocaleDateString('en-ZA')}</td>
                <td className="px-6 py-4 text-right"><button onClick={() => loadContent(c.slug)} className="text-[#641B2A] text-sm hover:underline">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
