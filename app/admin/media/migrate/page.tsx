'use client'

import { useEffect, useState } from 'react'

type Line = { from: string; to?: string; where: string; error?: string }

export default function MigrateImagesPage() {
  const [status, setStatus] = useState<{ configured: boolean; pending: number; breakdown: { static: number; wines: number } } | null>(null)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState({ processed: 0, remaining: 0 })
  const [migrated, setMigrated] = useState<Line[]>([])
  const [failures, setFailures] = useState<Line[]>([])

  const loadStatus = () => {
    fetch('/api/admin/migrate-images')
      .then(r => r.json())
      .then(setStatus)
      .catch(() => {})
  }
  useEffect(loadStatus, [])

  const run = async () => {
    setRunning(true); setDone(false); setMigrated([]); setFailures([])
    let processed = 0
    let consecutiveNoProgress = 0
    try {
      // Each call handles a small batch so it never times out. Stop when the
      // server reports nothing left, or when two calls in a row make no progress.
      for (let i = 0; i < 60; i++) {
        const res = await fetch('/api/admin/migrate-images?target=all', { method: 'POST' })
        const d = await res.json()
        if (!res.ok) { setFailures(f => [...f, { from: '', where: 'request', error: d.error || 'failed' }]); break }
        processed += d.processed || 0
        setProgress({ processed, remaining: d.remaining ?? 0 })
        setMigrated(m => [...m, ...(d.migrated || [])])
        setFailures(f => [...f, ...(d.failures || [])])
        if (d.done || d.processed === 0) break
        if (!d.migrated?.length) { consecutiveNoProgress++; if (consecutiveNoProgress >= 2) break }
        else consecutiveNoProgress = 0
      }
      setDone(true)
    } finally {
      setRunning(false)
      loadStatus()
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Migrate images to Cloudinary</h1>
      <p className="text-gray-500 text-sm mb-8">
        Copies existing wine images and the homepage images off their current hosts into your
        Cloudinary account, and repoints the database. Safe to run more than once — already-migrated
        images are skipped.
      </p>

      {!status?.configured && (
        <div className="bg-amber-50 text-amber-800 text-sm p-3 rounded mb-6">
          Cloudinary environment variables are not set on this deployment. Add
          <code className="mx-1">CLOUDINARY_CLOUD_NAME</code>,
          <code className="mx-1">CLOUDINARY_API_KEY</code> and
          <code className="mx-1">CLOUDINARY_API_SECRET</code> in Vercel, then redeploy.
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {status ? (
              <>
                <span className="font-medium">{status.pending}</span> image(s) still to migrate
                {status.pending > 0 && <> — {status.breakdown.wines} wine, {status.breakdown.static} site</>}
              </>
            ) : 'Checking…'}
          </div>
          <button
            onClick={run}
            disabled={running || !status?.configured || status?.pending === 0}
            className="bg-[#641B2A] text-white px-5 py-2.5 text-sm font-medium rounded hover:bg-[#7a2235] disabled:opacity-50"
          >
            {running ? `Migrating… ${progress.processed} done, ${progress.remaining} left` : status?.pending === 0 ? 'Nothing to migrate' : 'Run migration'}
          </button>
        </div>
      </div>

      {done && (
        <p className="text-green-600 text-sm mb-4">
          Migration complete — {migrated.length} migrated{failures.length ? `, ${failures.length} failed` : ''}.
        </p>
      )}

      {failures.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-semibold text-red-700 mb-3">Failed ({failures.length})</h2>
          <p className="text-xs text-gray-500 mb-3">
            These hosts blocked the copy. Download each image yourself and re-upload it in the Media Library
            (or on the wine), then this list clears.
          </p>
          <ul className="space-y-2 text-xs">
            {failures.map((f, i) => (
              <li key={i} className="border-b border-gray-100 pb-2">
                <span className="font-mono text-gray-700">{f.where}</span> — {f.error}
                <br /><span className="text-gray-400 break-all">{f.from}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {migrated.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Migrated ({migrated.length})</h2>
          <ul className="space-y-1 text-xs">
            {migrated.map((m, i) => (
              <li key={i} className="text-gray-600"><span className="font-mono">{m.where}</span> → <span className="text-green-700 break-all">{m.to}</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
