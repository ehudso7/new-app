'use client'

import { useState, useEffect } from 'react'
import { fetchDeals } from '@/utils/fetchDeals'
import DealCard from '@/components/DealCard'

export default function TrendingPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('today')

  useEffect(() => {
    loadTrendingDeals()
  }, [])

  const loadTrendingDeals = async () => {
    setLoading(true)
    const allDeals = await fetchDeals('all', 48)
    // Sort by discount percentage (trending = best deals)
    const sorted = allDeals.sort((a: any, b: any) => b.discount - a.discount)
    setDeals(sorted)
    setLoading(false)
  }

  const timeFilters = [
    { id: 'today', name: 'Today', icon: '🔥' },
    { id: 'week', name: 'This Week', icon: '📈' },
    { id: 'month', name: 'This Month', icon: '⭐' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔥 Trending Deals
          </h1>
          <p className="text-gray-600">The hottest deals right now</p>
        </div>

        {/* Time Filters */}
        <div className="flex gap-3 mb-8">
          {timeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setTimeFilter(filter.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                timeFilter === filter.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              {filter.icon} {filter.name}
            </button>
          ))}
        </div>

        {/* Trending Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white p-6 rounded-lg">
            <div className="text-3xl font-bold">{deals.length}</div>
            <div className="text-sm opacity-90">Hot Deals</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-6 rounded-lg">
            <div className="text-3xl font-bold">
              {deals.length > 0 ? Math.max(...deals.map(d => d.discount)) : 0}%
            </div>
            <div className="text-sm opacity-90">Max Discount</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-6 rounded-lg">
            <div className="text-3xl font-bold">
              ${deals.length > 0 ? Math.max(...deals.map(d => d.originalPrice - d.currentPrice)).toFixed(0) : 0}
            </div>
            <div className="text-sm opacity-90">Max Savings</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-lg">
            <div className="text-3xl font-bold">
              {deals.filter(d => d.isLightningDeal).length}
            </div>
            <div className="text-sm opacity-90">Lightning Deals</div>
          </div>
        </div>

        {/* Deals Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading trending deals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
