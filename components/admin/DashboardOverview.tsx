'use client'

import { useEffect, useState } from 'react'

interface OverviewStats {
  success: boolean
  updatedAt: string
  totalDeals: number
  averageDiscount: number
  estimatedTotalSavings: number
  lightningDealCount: number
  categories: Array<{
    category: string
    count: number
    averageDiscount: number
    averagePrice: number
    highestDiscount: number
  }>
  highlight: {
    bestDiscount: DealSummary | null
    lowestPrice: DealSummary | null
  }
  dataSource: 'rapidapi' | 'curated'
}

interface DealSummary {
  id: string
  title: string
  currentPrice: number
  originalPrice: number
  discount: number
  amazonUrl: string
  category: string
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadStats() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/admin/overview')
        if (!response.ok) {
          throw new Error('Failed to load overview metrics')
        }
        const data = await response.json()
        if (isMounted) {
          setStats(data)
        }
      } catch (err: any) {
        console.error('Load overview error', err)
        if (isMounted) {
          setError(err.message || 'Unable to load overview data')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadStats()

    const refresh = setInterval(loadStats, 5 * 60 * 1000)

    return () => {
      isMounted = false
      clearInterval(refresh)
    }
  }, [])

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Marketplace Snapshot</h2>
          <p className="text-sm text-gray-600">
            Live metrics sourced from {stats?.dataSource === 'rapidapi' ? 'RapidAPI Amazon data feed' : 'the curated catalog fallback'}
          </p>
        </div>
        {stats?.updatedAt && (
          <p className="text-sm text-gray-500">
            Last updated {new Date(stats.updatedAt).toLocaleString()}
          </p>
        )}
      </header>

      {loading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Fetching current deal performance…</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Unable to load marketplace data</h3>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true)
              setError(null)
              setStats(null)
              fetch('/api/admin/overview').then(async (res) => {
                if (!res.ok) throw new Error('Request failed')
                const body = await res.json()
                setStats(body)
                setLoading(false)
              }).catch((err) => {
                setError(err.message)
                setLoading(false)
              })
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {stats && !loading && !error && (
        <>
          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              label="Active deals"
              value={stats.totalDeals.toLocaleString()}
              sublabel="currently displayed"
              icon="🛒"
            />
            <MetricCard
              label="Average discount"
              value={`${stats.averageDiscount.toFixed(1)}%`}
              sublabel="across live listings"
              icon="💸"
            />
            <MetricCard
              label="Potential customer savings"
              value={`$${stats.estimatedTotalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              sublabel="versus list price"
              icon="🏦"
            />
            <MetricCard
              label="Lightning deals"
              value={stats.lightningDealCount.toLocaleString()}
              sublabel="with steep limited-time cuts"
              icon="⚡"
            />
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HighlightCard
              title="Deepest discount right now"
              icon="🏆"
              deal={stats.highlight.bestDiscount}
            />
            <HighlightCard
              title="Most affordable pick"
              icon="💡"
              deal={stats.highlight.lowestPrice}
            />
          </div>

          {/* Category breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h3 className="text-xl font-bold text-gray-800">Category performance</h3>
              <p className="text-sm text-gray-500">Sorted by number of active deals</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-3 px-3 text-gray-600">Category</th>
                    <th className="py-3 px-3 text-gray-600 text-right">Deals</th>
                    <th className="py-3 px-3 text-gray-600 text-right">Average discount</th>
                    <th className="py-3 px-3 text-gray-600 text-right">Average price</th>
                    <th className="py-3 px-3 text-gray-600 text-right">Top discount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.categories.map((category) => (
                    <tr key={category.category} className="border-b last:border-0">
                      <td className="py-3 px-3 font-semibold text-gray-800 capitalize">{category.category}</td>
                      <td className="py-3 px-3 text-right text-gray-700">{category.count}</td>
                      <td className="py-3 px-3 text-right text-green-600 font-semibold">{category.averageDiscount.toFixed(1)}%</td>
                      <td className="py-3 px-3 text-right text-gray-700">${category.averagePrice.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right text-primary font-semibold">{category.highestDiscount}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function MetricCard({ label, value, sublabel, icon }: { label: string; value: string; sublabel: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <span className="text-3xl" aria-hidden>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{sublabel}</p>
    </div>
  )
}

function HighlightCard({ title, icon, deal }: { title: string; icon: string; deal: DealSummary | null }) {
  if (!deal) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl" aria-hidden>{icon}</span>
          <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
        </div>
        <p className="text-sm text-gray-600">No qualifying deal found right now.</p>
      </div>
    )
  }

  const savings = deal.originalPrice - deal.currentPrice

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl" aria-hidden>{icon}</span>
        <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      </div>
      <p className="font-semibold text-gray-900 mb-2 line-clamp-2">{deal.title}</p>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-2xl text-primary font-bold">${deal.currentPrice.toFixed(2)}</span>
        <span className="text-sm text-gray-400 line-through">${deal.originalPrice.toFixed(2)}</span>
        <span className="text-sm text-green-600 font-semibold">-{deal.discount}%</span>
      </div>
      <p className="text-sm text-gray-500 mb-4">Savings: ${savings.toFixed(2)} • Category: {deal.category}</p>
      <a
        href={deal.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-green-600"
      >
        View listing on Amazon <span aria-hidden>↗</span>
      </a>
    </div>
  )
}
