'use client'

import { useEffect, useMemo, useState } from 'react'

export default function AnalyticsDashboard() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadDeals() {
      try {
        setLoading(true)
        const response = await fetch('/api/deals?category=all&limit=100')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load analytics data')
        }
        if (mounted) {
          setDeals(data.deals || [])
          setError(null)
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Unable to load analytics data')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadDeals()
    return () => {
      mounted = false
    }
  }, [])

  const summary = useMemo(() => {
    if (!deals.length) {
      return {
        highestDiscount: 0,
        averageDiscount: 0,
        medianPrice: 0,
        averageRating: 0,
        totalReviews: 0,
      }
    }

    const sortedByDiscount = [...deals].sort((a, b) => (b.discount || 0) - (a.discount || 0))
    const prices = [...deals]
      .map((deal) => deal.currentPrice || 0)
      .sort((a, b) => a - b)
    const middle = Math.floor(prices.length / 2)
    const medianPrice = prices.length % 2 === 0 ? (prices[middle - 1] + prices[middle]) / 2 : prices[middle]

    return {
      highestDiscount: sortedByDiscount[0]?.discount || 0,
      averageDiscount: deals.reduce((sum, deal) => sum + (deal.discount || 0), 0) / deals.length,
      medianPrice,
      averageRating: deals.reduce((sum, deal) => sum + (deal.rating || 0), 0) / deals.length,
      totalReviews: deals.reduce((sum, deal) => sum + (deal.reviews || 0), 0),
    }
  }, [deals])

  const topDiscounts = useMemo(() => {
    return [...deals]
      .sort((a, b) => (b.discount || 0) - (a.discount || 0))
      .slice(0, 8)
  }, [deals])

  const topReviewed = useMemo(() => {
    return [...deals]
      .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
      .slice(0, 5)
  }, [deals])

  const categoryInsights = useMemo(() => {
    const aggregates: Record<string, { totalDiscount: number; count: number; totalRating: number }> = {}

    for (const deal of deals) {
      const key = deal.category || 'other'
      if (!aggregates[key]) {
        aggregates[key] = { totalDiscount: 0, count: 0, totalRating: 0 }
      }
      aggregates[key].totalDiscount += deal.discount || 0
      aggregates[key].count += 1
      aggregates[key].totalRating += deal.rating || 0
    }

    return Object.entries(aggregates)
      .map(([category, stats]) => ({
        category,
        averageDiscount: stats.count ? stats.totalDiscount / stats.count : 0,
        averageRating: stats.count ? stats.totalRating / stats.count : 0,
        listings: stats.count,
      }))
      .sort((a, b) => b.averageDiscount - a.averageDiscount)
  }, [deals])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📈 Deal Insights</h2>
            <p className="text-gray-600">Live analytics computed from the current curated dataset</p>
          </div>
          <span className="text-sm text-gray-500">Updated automatically with every deal refresh</span>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg p-4">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard label="Highest Discount" value={`${summary.highestDiscount.toFixed(0)}%`} helper="Best markdown currently live" />
        <MetricCard label="Average Discount" value={`${summary.averageDiscount.toFixed(1)}%`} helper="All active deals" />
        <MetricCard label="Median Deal Price" value={`$${summary.medianPrice.toFixed(2)}`} helper="Current selling price" />
        <MetricCard label="Average Rating" value={summary.averageRating.toFixed(1)} helper="Weighted by listings" />
        <MetricCard label="Total Reviews" value={summary.totalReviews.toLocaleString()} helper="Social proof across catalogue" />
      </div>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">🔥 Top Discounts</h3>
          <span className="text-sm text-gray-500">Sorted by highest % off</span>
        </div>
        {loading ? (
          <LoadingState message="Crunching discount data…" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-right py-3 px-4">Discount</th>
                  <th className="text-right py-3 px-4">Current Price</th>
                  <th className="text-right py-3 px-4">Original Price</th>
                  <th className="text-right py-3 px-4">Rating</th>
                  <th className="text-right py-3 px-4">Reviews</th>
                </tr>
              </thead>
              <tbody>
                {topDiscounts.map((deal) => (
                  <tr key={deal.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800">{deal.title}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-semibold">-{deal.discount}%</td>
                    <td className="py-3 px-4 text-right">${deal.currentPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-gray-500">${deal.originalPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">{deal.rating.toFixed(1)}</td>
                    <td className="py-3 px-4 text-right">{deal.reviews.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">⭐ Reviewer Favorites</h3>
          <span className="text-sm text-gray-500">Highest review count</span>
        </div>
        {loading ? (
          <LoadingState message="Ranking products by review volume…" />
        ) : (
          <ul className="space-y-3">
            {topReviewed.map((deal) => (
              <li key={deal.id} className="p-4 rounded-lg bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-800">{deal.title}</p>
                  <p className="text-sm text-gray-500">Category: {deal.category}</p>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>Reviews: {deal.reviews.toLocaleString()}</span>
                  <span>Rating: {deal.rating.toFixed(1)}</span>
                  <span>Discount: {deal.discount}%</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Category Insights</h3>
        {loading ? (
          <LoadingState message="Summarising category performance…" />
        ) : (
          <div className="space-y-4">
            {categoryInsights.map((category) => (
              <div key={category.category} className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-800 capitalize">{category.category}</div>
                  <div className="text-sm text-gray-500">{category.listings} listings</div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Average discount: {category.averageDiscount.toFixed(1)}%</span>
                  <span>Average rating: {category.averageRating.toFixed(1)}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-200">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                    style={{ width: `${Math.min(100, category.averageDiscount)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">🛠️ Next integrations</h3>
        <p className="text-sm text-gray-600 mb-4">
          Connect Amazon Associates or Google Analytics to replace these on-site insights with affiliate revenue, clicks, and sourced traffic. Use the notes below as a checklist.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
          <li>Amazon Associates: enable <code className="bg-gray-100 px-1 rounded">Tracking IDs</code> and ingest daily reports via the Reporting API.</li>
          <li>Google Analytics 4: track outbound click events to <code className="bg-gray-100 px-1 rounded">amazon.com</code> and stitch to deal IDs.</li>
          <li>Optional: PostHog or Mixpanel for funnel analytics when you add user accounts.</li>
        </ul>
      </section>
    </div>
  )
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-gray-600 text-sm mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{helper}</div>
    </div>
  )
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      <span className="inline-block h-3 w-3 rounded-full border-2 border-gray-300 border-t-primary animate-spin"></span>
      {message}
    </div>
  )
}
