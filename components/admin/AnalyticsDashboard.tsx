'use client'

import { useEffect, useMemo, useState } from 'react'

interface Deal {
  id: string
  title: string
  currentPrice: number
  originalPrice: number
  discount: number
  category: string
  amazonUrl: string
  reviews?: number
}

export default function AnalyticsDashboard() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadDeals() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/deals?category=all&limit=120')
        if (!res.ok) throw new Error('Unable to load deals for analytics.')
        const body = await res.json()
        if (active) setDeals(body.deals || [])
      } catch (err: any) {
        console.error(err)
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDeals()
    return () => {
      active = false
    }
  }, [])

  const metrics = useMemo(() => {
    if (!deals.length) {
      return {
        totalDeals: 0,
        averageDiscount: 0,
        averagePrice: 0,
        potentialSavings: 0,
        categoryMap: [] as CategoryMetric[],
        topDiscounts: [] as Deal[],
        biggestSavings: [] as Deal[],
      }
    }

    const totalDeals = deals.length
    const discountSum = deals.reduce((acc, deal) => acc + (deal.discount || 0), 0)
    const priceSum = deals.reduce((acc, deal) => acc + (deal.currentPrice || 0), 0)
    const savingsSum = deals.reduce((acc, deal) => {
      const savings = (deal.originalPrice || 0) - (deal.currentPrice || 0)
      return savings > 0 ? acc + savings : acc
    }, 0)

    const categoryGroups = deals.reduce<Record<string, Deal[]>>((acc, deal) => {
      acc[deal.category] = acc[deal.category] || []
      acc[deal.category].push(deal)
      return acc
    }, {})

    const categoryMap: CategoryMetric[] = Object.entries(categoryGroups).map(([name, items]) => {
      const avgDiscount = items.reduce((acc, item) => acc + (item.discount || 0), 0) / items.length
      const avgPrice = items.reduce((acc, item) => acc + (item.currentPrice || 0), 0) / items.length
      const peakDiscount = Math.max(...items.map((item) => item.discount || 0))

      return {
        category: name,
        count: items.length,
        averageDiscount: avgDiscount,
        averagePrice: avgPrice,
        peakDiscount,
      }
    }).sort((a, b) => b.count - a.count)

    const topDiscounts = [...deals]
      .sort((a, b) => (b.discount || 0) - (a.discount || 0))
      .slice(0, 8)

    const biggestSavings = [...deals]
      .sort((a, b) => (
        (b.originalPrice - b.currentPrice) - (a.originalPrice - a.currentPrice)
      ))
      .slice(0, 8)

    return {
      totalDeals,
      averageDiscount: discountSum / totalDeals,
      averagePrice: priceSum / totalDeals,
      potentialSavings: savingsSum,
      categoryMap,
      topDiscounts,
      biggestSavings,
    }
  }, [deals])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📈 Deal analytics</h2>
          <p className="text-sm text-gray-600">Real figures calculated from the currently published deals.</p>
        </div>
        <p className="text-sm text-gray-500">Dataset size: {metrics.totalDeals.toLocaleString()} deals</p>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500 text-sm">
          Loading analytics…
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnalyticsCard
              icon="💰"
              label="Average discount"
              value={`${metrics.averageDiscount.toFixed(1)}%`}
              helper="Across all fetched deals"
            />
            <AnalyticsCard
              icon="🏷️"
              label="Average live price"
              value={`$${metrics.averagePrice.toFixed(2)}`}
              helper="Current Amazon price"
            />
            <AnalyticsCard
              icon="💸"
              label="Potential savings"
              value={`$${metrics.potentialSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              helper="Difference vs. list price"
            />
            <AnalyticsCard
              icon="⚡"
              label="High-discount deals"
              value={metrics.topDiscounts.filter((deal) => deal.discount >= 40).length.toString()}
              helper="40% off or more"
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Category distribution</h3>
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
                  {metrics.categoryMap.map((row) => (
                    <tr key={row.category} className="border-b last:border-0">
                      <td className="py-3 px-3 font-semibold text-gray-800 capitalize">{row.category}</td>
                      <td className="py-3 px-3 text-right">{row.count}</td>
                      <td className="py-3 px-3 text-right text-green-600 font-semibold">{row.averageDiscount.toFixed(1)}%</td>
                      <td className="py-3 px-3 text-right">${row.averagePrice.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right text-primary font-semibold">{row.peakDiscount}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DealsList title="Top discounts" icon="🏆" deals={metrics.topDiscounts} />
            <DealsList title="Biggest savings in dollars" icon="💵" deals={metrics.biggestSavings} type="savings" />
          </div>
        </>
      )}
    </div>
  )
}

interface CategoryMetric {
  category: string
  count: number
  averageDiscount: number
  averagePrice: number
  peakDiscount: number
}

function AnalyticsCard({ icon, label, value, helper }: { icon: string; label: string; value: string; helper: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden>{icon}</span>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{helper}</p>
    </div>
  )
}

function DealsList({ title, icon, deals, type }: { title: string; icon: string; deals: Deal[]; type?: 'savings' }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl" aria-hidden>{icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      {deals.length === 0 ? (
        <p className="text-sm text-gray-600">No deals available.</p>
      ) : (
        <ul className="space-y-3">
          {deals.map((deal) => {
            const savings = (deal.originalPrice || 0) - (deal.currentPrice || 0)
            return (
              <li key={deal.id} className="border border-gray-100 rounded-lg p-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold text-gray-800 line-clamp-2">{deal.title}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">Category: {deal.category}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-primary font-semibold">-{deal.discount}%</p>
                    <p className="text-gray-500">
                      ${deal.currentPrice.toFixed(2)} <span className="line-through text-xs text-gray-400">${deal.originalPrice.toFixed(2)}</span>
                    </p>
                    <p className="text-xs text-green-600 font-semibold">
                      {type === 'savings' ? `Save $${savings.toFixed(2)}` : `${deal.reviews?.toLocaleString() || '—'} reviews`}
                    </p>
                  </div>
                </div>
                <a
                  href={deal.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-green-600"
                >
                  View on Amazon ↗
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
