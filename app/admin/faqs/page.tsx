'use client'

import { useState, useEffect } from 'react'

interface FAQ { id: string; question: string; answer: string; published: boolean; displayOrder: number }

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [isNew, setIsNew] = useState(false)

  const load = () => {
    fetch('/api/admin/faqs')
      .then(r => r.json())
      .then(d => { setFaqs(d.faqs || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!editing) return
    const method = isNew ? 'POST' : 'PUT'
    const url = isNew ? '/api/admin/faqs' : `/api/admin/faqs/${editing.id}`
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
    setEditing(null); setIsNew(false); load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return
    await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
    load()
  }

  const startNew = () => {
    setEditing({ id: '', question: '', answer: '', published: true, displayOrder: (faqs.length + 1) * 10 })
    setIsNew(true)
  }

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>

  if (editing) {
    return (
      <div className="max-w-2xl">
        <button onClick={() => { setEditing(null); setIsNew(false) }} className="text-sm text-gray-500 hover:text-gray-700 mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{isNew ? 'Add FAQ' : 'Edit FAQ'}</h1>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Question</label><input value={editing.question} onChange={e => setEditing({ ...editing, question: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Answer</label><textarea rows={5} value={editing.answer} onChange={e => setEditing({ ...editing, answer: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Order</label><input type="number" value={editing.displayOrder} onChange={e => setEditing({ ...editing, displayOrder: Number(e.target.value) })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Published</label><select value={editing.published ? 'true' : 'false'} onChange={e => setEditing({ ...editing, published: e.target.value === 'true' })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"><option value="true">Yes</option><option value="false">No</option></select></div>
          </div>
          <button onClick={handleSave} className="bg-[#641B2A] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235]">{isNew ? 'Create FAQ' : 'Update FAQ'}</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
        <button onClick={startNew} className="bg-[#641B2A] text-white px-4 py-2 text-sm font-medium rounded hover:bg-[#7a2235]">+ Add FAQ</button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr><th className="px-6 py-3 text-left">Question</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {faqs.map(f => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{f.question}</td>
                <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded font-medium ${f.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{f.published ? 'Published' : 'Draft'}</span></td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => { setEditing(f); setIsNew(false) }} className="text-[#641B2A] text-sm hover:underline">Edit</button>
                  <button onClick={() => handleDelete(f.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
