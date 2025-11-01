'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { fetchDeals } from '@/utils/fetchDeals'
import DealCard from '@/components/DealCard'

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '📱', color: 'from-blue-500 to-purple-500' },
    { id: 'home', name: 'Home & Kitchen', icon: '🏠', color: 'from-green-500 to-teal-500' },
    { id: 'fashion', name: 'Fashion', icon: '👔', color: 'from-pink-500 to-rose-500' },
    { id: 'sports', name: 'Sports & Fitness', icon: '⚽', color: 'from-orange-500 to-red-500' },
    { id: 'toys', name: 'Toys & Games', icon: '🧸', color: 'from-yellow-500 to-orange-500' },
    { id: 'beauty', name: 'Beauty & Health', icon: '💄', color: 'from-purple-500 to-pink-500' },
  ]

  const currentCategory = categories.find(c => c.id === categorySlug)

  useEffect(() => {
    loadCategoryDeals()
  }, [categorySlug])

  const loadCategoryDeals = async () => {
    setLoading(true)
    const fetchedDeals = await fetchDeals(categorySlug, 24)
    setDeals(fetchedDeals)
    setLoading(false)
  }

  if (!currentCategory) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <div className="text-9xl font-bold text-primary mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The category you're looking for doesn't exist.
          </p>
          <Link
            href="/categories"
            className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
          >
            Browse All Categories →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>›</span>
          <Link href="/categories" className="hover:text-primary">Categories</Link>
          <span>›</span>
          <span className="text-gray-900 font-semibold">{currentCategory.name}</span>
        </div>

        {/* Category Header */}
        <div className={`bg-gradient-to-r ${currentCategory.color} text-white p-8 rounded-lg mb-8 shadow-lg`}>
          <div className="flex items-center gap-4">
            <span className="text-6xl">{currentCategory.icon}</span>
            <div>
              <h1 className="text-4xl font-bold mb-2">{currentCategory.name}</h1>
              <p className="text-lg opacity-90">
                Discover the best deals in {currentCategory.name.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse Other Categories</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  category.id === categorySlug
                    ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                    : 'bg-white text-gray-700 hover:shadow-md'
                }`}
              >
                <span>{category.icon}</span>
                <span className="font-semibold">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        {!loading && deals.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">{deals.length}</div>
              <div className="text-sm text-gray-600">Total Deals</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">
                {Math.max(...deals.map(d => d.discount))}%
              </div>
              <div className="text-sm text-gray-600">Max Discount</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">
                ${Math.max(...deals.map(d => d.originalPrice - d.currentPrice)).toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Max Savings</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">
                {(deals.reduce((acc, d) => acc + d.discount, 0) / deals.length).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Avg Discount</div>
            </div>
          </div>
        )}

        {/* Deals Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading {currentCategory.name.toLowerCase()} deals...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="text-6xl mb-4">{currentCategory.icon}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No deals available</h3>
            <p className="text-gray-600 mb-6">
              Check back soon for amazing {currentCategory.name.toLowerCase()} deals!
            </p>
            <Link
              href="/categories"
              className="text-primary font-semibold hover:underline"
            >
              ← Browse other categories
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🔥 {currentCategory.name} Deals ({deals.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
