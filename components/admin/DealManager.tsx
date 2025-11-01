'use client'

import { useEffect, useState } from 'react'

const DEFAULT_CRON_NOTE = 'Set NEXT_PUBLIC_CRON_SECRET to test manual refresh from the dashboard.'

export default function DealManager() {
  const [manualRefreshState, setManualRefreshState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [manualMessage, setManualMessage] = useState<string>('')
  const [cronNote, setCronNote] = useState(DEFAULT_CRON_NOTE)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CRON_SECRET && process.env.NEXT_PUBLIC_CRON_SECRET !== 'your-secret-here') {
      setCronNote('Using NEXT_PUBLIC_CRON_SECRET from your environment to authenticate refresh requests.')
    }
  }, [])

  const triggerManualRefresh = async () => {
    setManualRefreshState('loading')
    setManualMessage('')

    try {
      const secret = process.env.NEXT_PUBLIC_CRON_SECRET
      if (!secret || secret === 'your-secret-here') {
        throw new Error('Add NEXT_PUBLIC_CRON_SECRET to trigger refresh from the dashboard.')
      }

      const response = await fetch('/api/deals/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Refresh failed (${response.status})`)
      }

      setManualRefreshState('success')
      setManualMessage(`Refreshed ${data.count || 0} deals at ${new Date(data.timestamp).toLocaleString()}.`)
    } catch (error: any) {
      setManualRefreshState('error')
      setManualMessage(error.message || 'Refresh failed')
    }
  }

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">🤖 Deal refresh controls</h2>
            <p className="text-sm text-gray-600">
              DealPulse refreshes the curated dataset at 7:30 AM and 7:30 PM Eastern Time. Use the button to trigger an on-demand refresh when you publish new products or need to verify lightning deals immediately.
            </p>
          </div>
          <button
            onClick={triggerManualRefresh}
            disabled={manualRefreshState === 'loading'}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
          >
            {manualRefreshState === 'loading' ? 'Refreshing…' : '🔄 Refresh deals now'}
          </button>
        </div>

        <p className="text-xs text-gray-500">{cronNote}</p>

        {manualRefreshState === 'success' && (
          <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded p-3">{manualMessage}</p>
        )}
        {manualRefreshState === 'error' && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded p-3">{manualMessage}</p>
        )}
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">📡 Data sources</h2>
        <p className="text-sm text-gray-600">
          Configure at least one automated source. The curated dataset bundled with the app is always available and can be supplemented with live APIs.
        </p>
        <div className="space-y-3">
          <SourceRow
            name="Curated dataset"
            status="active"
            description="Local, version-controlled list of verified Amazon products."
            action="Edit /data/curatedDeals.ts"
          />
          <SourceRow
            name="RapidAPI real-time Amazon data"
            status={process.env.NEXT_PUBLIC_HAS_RAPID_API === 'true' ? 'connected' : 'not configured'}
            description="Optional live search via real-time-amazon-data API. Requires RAPIDAPI_KEY on the server."
            action="Set RAPIDAPI_KEY and NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG"
          />
          <SourceRow
            name="Manual CSV import"
            status="manual"
            description="Upload affiliate deal CSVs from partners or affiliate networks."
            action="Build /admin/upload endpoint or use Supabase storage"
          />
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">🎯 Filter defaults</h2>
        <p className="text-sm text-gray-600">
          These filters mirror the criteria used by the curated dataset. Update them when you connect a live data source so the front-end stays consistent.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FilterCard label="Minimum discount" value="20%" helper="Deals below this are dropped." />
          <FilterCard label="Minimum rating" value="4.0 ★" helper="Lower-rated items are hidden." />
          <FilterCard label="Minimum reviews" value="500" helper="Ensures social proof." />
          <FilterCard label="Lightning deal buffer" value="60 min" helper="Re-verify within an hour of expiry." />
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">🗓️ Automate with Vercel Cron</h2>
        <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-600">
          <li>Create a cron job at <code className="bg-gray-100 px-1 rounded">https://vercel.com/&lt;project&gt;/settings/cron</code> with <strong>0 11 * * *</strong> and <strong>0 23 * * *</strong> (7:00 AM / 7:00 PM ET).</li>
          <li>Set the request URL to <code className="bg-gray-100 px-1 rounded">https://your-domain.com/api/deals/refresh</code>.</li>
          <li>Add the header <code className="bg-gray-100 px-1 rounded">Authorization: Bearer &lt;CRON_SECRET&gt;</code> and define the same value as <code>CRON_SECRET</code> and <code>NEXT_PUBLIC_CRON_SECRET</code> in your environment.</li>
        </ol>
      </section>
    </div>
  )
}

function SourceRow({ name, status, description, action }: { name: string; status: 'active' | 'connected' | 'manual' | 'not configured'; description: string; action: string }) {
  const statusBadge = {
    active: 'bg-green-100 text-green-700',
    connected: 'bg-blue-100 text-blue-700',
    manual: 'bg-yellow-100 text-yellow-700',
    'not configured': 'bg-gray-100 text-gray-600',
  }[status]

  const statusLabel = {
    active: 'Active',
    connected: 'Connected',
    manual: 'Manual',
    'not configured': 'Not configured',
  }[status]

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-gray-50 rounded-lg">
      <div>
        <div className="font-semibold text-gray-800">{name}</div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex flex-col md:items-end gap-2 text-sm">
        <span className={`inline-flex items-center px-3 py-1 rounded-full font-medium ${statusBadge}`}>{statusLabel}</span>
        <span className="text-gray-500">{action}</span>
      </div>
    </div>
  )
}

function FilterCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="text-sm text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{helper}</div>
    </div>
  )
}
