'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { WineForm } from '@/components/admin/wine-form'

export default function EditWinePage() {
  const { id } = useParams()
  const [wine, setWine] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/wines/${id}`)
      .then(r => r.json())
      .then(d => { setWine(d.wine); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>
  if (!wine) return <div className="text-gray-500 py-12 text-center">Wine not found</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Wine</h1>
      <WineForm initialData={wine} />
    </div>
  )
}
