'use client'

import { useEffect, useState } from 'react'

interface OverviewResponse {
  success: boolean
  updatedAt: string
  categories: Array<{
    category: string
    count: number
    averageDiscount: number
    averagePrice: number
    highestDiscount: number
  }>
  dataSource: 'rapidapi' | 'curated'
}

export default function DealManager() {
  const [overview, setOverview] = useState<OverviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshResult, setRefreshResult] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadOverview() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/overview')
        if (!res.ok) throw new Error('Failed to load category metrics.')
        const body = await res.json()
        if (active) setOverview(body)
      } catch (err: any) {
        console.error(err)
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadOverview()
    return () => {
      active = false
    }
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    setRefreshResult(null)
    setError(null)

    try {
      const storedPassword = localStorage.getItem('adminPassword')
      if (!storedPassword) {
        throw new Error('Admin password not found. Please log out and back in to refresh deals.')
      }

      const res = await fetch('/api/admin/deals/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: storedPassword }),
      })

      const body = await res.json()
      if (!res.ok || !body.success) {
        throw new Error(body.error || 'Refresh failed')
      }

      setRefreshResult(body.message || 'Deals refreshed successfully.')

      // Reload overview to reflect fresh data
      const updated = await fetch('/api/admin/overview')
      if (updated.ok) {
        const overviewBody = await updated.json()
        setOverview(overviewBody)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while refreshing deals.')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">🤖 Deal ingestion</h2>
            <p className="text-sm text-gray-600">
              Current data source: {overview?.dataSource === 'rapidapi' ? 'RapidAPI live feed' : 'curated fallback catalog'}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 disabled:opacity-60"
          >
            {refreshing ? 'Refreshing…' : 'Trigger refresh'}
          </button>
        </div>

        {refreshResult && (
          <p className="text-sm text-green-600 font-semibold mb-2">{refreshResult}</p>
        )}

        {error && (
          <p className="text-sm text-red-600 font-semibold mb-2">{error}</p>
        )}

        <p className="text-sm text-gray-500">
          The refresh action calls the secured `/api/deals/refresh` endpoint using your configured `CRON_SECRET`. Configure
          `RAPIDAPI_KEY` to pull live listings directly from Amazon&apos;s Real-Time Data API. Without it, the system serves the curated catalog above.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Category breakdown</h3>

        {loading ? (
          <div className="text-center py-8 text-gray-500 text-sm">Loading category metrics…</div>
        ) : overview ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 px-3 text-gray-600">Category</th>
                  <th className="py-3 px-3 text-gray-600 text-right">Deals</th>
                  <th className="py-3 px-3 text-gray-600 text-right">Average discount</th>
                  <th className="py-3 px-3 text-gray-600 text-right">Average price</th>
                  <th className="py-3 px-3 text-gray-600 text-right">Peak discount</th>
                </tr>
              </thead>
              <tbody>
                {overview.categories.map((category) => (
                  <tr key={category.category} className="border-b last:border-0">
                    <td className="py-3 px-3 font-semibold text-gray-800 capitalize">{category.category}</td>
                    <td className="py-3 px-3 text-right">{category.count}</td>
                    <td className="py-3 px-3 text-right text-green-600 font-semibold">{category.averageDiscount.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-right">${category.averagePrice.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right text-primary font-semibold">{category.highestDiscount}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-600">No category data available.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔧 Configuration checklist</h3>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
          <li>
            Set <code className="bg-gray-100 px-1 py-0.5 rounded">RAPIDAPI_KEY</code> and <code className="bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG</code> for live data.
          </li>
          <li>
            Define <code className="bg-gray-100 px-1 py-0.5 rounded">CRON_SECRET</code> to enable remote refreshes via this dashboard or Vercel Cron jobs.
          </li>
          <li>
            Optional: integrate a persistent database (Vercel KV, Postgres, Supabase) to store refreshed deal snapshots.
          </li>
          <li>
            Monitor the refresh logs in Vercel or server console to confirm successful ingestion runs.
          </li>
        </ul>
      </div>
    </div>
  )
}
