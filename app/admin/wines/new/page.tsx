'use client'

import { WineForm } from '@/components/admin/wine-form'

export default function NewWinePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Wine</h1>
      <WineForm />
    </div>
  )
}
