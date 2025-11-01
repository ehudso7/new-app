'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import DealCard from '@/components/DealCard'
import { fetchDeals } from '@/utils/fetchDeals'

const categoryMeta: Record<string, { name: string; description: string; icon: string; gradient: string }> = {
  electronics: {
    name: 'Electronics & Gadgets',
    description: 'Noise-cancelling headphones, streaming gear, chargers, and smart devices with verified discounts.',
    icon: '📱',
    gradient: 'from-blue-500 to-purple-500',
  },
  home: {
    name: 'Home & Kitchen',
    description: 'Robot vacuums, small appliances, and cozy essentials to upgrade every room in the house.',
    icon: '🏠',
    gradient: 'from-green-500 to-teal-500',
  },
  fashion: {
    name: 'Fashion & Apparel',
    description: 'Best-selling clothing, footwear, and accessories with strong ratings and real savings.',
    icon: '👔',
    gradient: 'from-pink-500 to-rose-500',
  },
  sports: {
    name: 'Sports & Fitness',
    description: 'Workout equipment, wearables, and recovery tools sourced from Amazon’s top-rated listings.',
    icon: '⚽',
    gradient: 'from-orange-500 to-red-500',
  },
  toys: {
    name: 'Toys & Games',
    description: 'Family game night staples, STEM kits, and the season’s top toys with verified price drops.',
    icon: '🧸',
    gradient: 'from-yellow-500 to-orange-500',
  },
  beauty: {
    name: 'Beauty & Personal Care',
    description: 'Derm-approved skincare, hair tools, and oral care favorites trusted by thousands of reviewers.',
    icon: '💄',
    gradient: 'from-purple-500 to-pink-500',
  },
}

interface CategoryPageProps {
  slug: string
}

export default function CategoryPage({ slug }: CategoryPageProps) {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const meta = categoryMeta[slug]
  const affiliateTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'dealsplus077-20'

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      const fetchedDeals = await fetchDeals(slug, 48)
      if (mounted) {
        setDeals(fetchedDeals)
        setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [slug])

  const metrics = useMemo(() => {
    if (!deals.length) {
      return {
        count: 0,
        averageDiscount: 0,
        maxSavings: 0,
        lightningDeals: 0,
      }
    }

    const count = deals.length
    const averageDiscount =
      deals.reduce((acc: number, deal: any) => acc + (deal.discount || 0), 0) / count
    const maxSavings = Math.max(
      ...deals.map((deal: any) => Math.max(0, (deal.originalPrice || 0) - (deal.currentPrice || 0))),
    )
    const lightningDeals = deals.filter((deal: any) => deal.isLightningDeal).length

    return {
      count,
      averageDiscount,
      maxSavings,
      lightningDeals,
    }
  }, [deals])

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">{meta?.icon}</span>
            {meta?.name || slug}
          </h1>
          <Link href="/categories" className="text-primary font-semibold hover:underline">
            ← All Categories
          </Link>
        </div>

        {meta?.description && (
          <p className="text-gray-600 mb-6 max-w-3xl">{meta.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Live Deals" value={metrics.count.toString()} accent="from-blue-500 to-purple-500" />
          <StatCard
            label="Average Discount"
            value={metrics.averageDiscount ? `${metrics.averageDiscount.toFixed(1)}%` : '0%'}
            accent="from-green-500 to-teal-500"
          />
          <StatCard
            label="Top Savings"
            value={`$${metrics.maxSavings.toFixed(0)}`}
            accent="from-orange-500 to-red-500"
          />
          <StatCard
            label="Lightning Deals"
            value={metrics.lightningDeals.toString()}
            accent="from-yellow-500 to-orange-500"
          />
        </div>

        <div className={`bg-gradient-to-r ${meta?.gradient || 'from-gray-200 to-gray-400'} text-white p-6 rounded-lg mb-8`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Curated Amazon Deals</h2>
              <p className="opacity-90 text-sm md:text-base">
                All listings are verified for price accuracy, review quality, and in-stock status before we publish them.
              </p>
            </div>
            <a
              href={`https://www.amazon.com/s?k=${encodeURIComponent(meta?.name || slug)}&tag=${affiliateTag}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              View on Amazon
              <span>↗</span>
            </a>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading verified deals...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No deals right now</h2>
            <p className="text-gray-600 mb-6">Check back soon—we refresh every few hours.</p>
            <Link href="/" className="text-primary font-semibold hover:underline">
              Browse all live deals
            </Link>
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

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`bg-gradient-to-br ${accent} text-white p-6 rounded-lg`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  )
}
