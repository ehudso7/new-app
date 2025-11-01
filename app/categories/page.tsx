'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchDeals } from '@/utils/fetchDeals'
import DealCard from '@/components/DealCard'

export default function CategoriesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '📱', color: 'from-blue-500 to-purple-500' },
    { id: 'home', name: 'Home & Kitchen', icon: '🏠', color: 'from-green-500 to-teal-500' },
    { id: 'fashion', name: 'Fashion', icon: '👔', color: 'from-pink-500 to-rose-500' },
    { id: 'sports', name: 'Sports & Fitness', icon: '⚽', color: 'from-orange-500 to-red-500' },
    { id: 'toys', name: 'Toys & Games', icon: '🧸', color: 'from-yellow-500 to-orange-500' },
    { id: 'beauty', name: 'Beauty & Health', icon: '💄', color: 'from-purple-500 to-pink-500' },
  ]

  const DEFAULT_CATEGORY = 'electronics'

  const getValidCategory = (category: string | null) =>
    categories.some((c) => c.id === category) ? (category as string) : DEFAULT_CATEGORY

  const [selectedCategory, setSelectedCategory] = useState(() => getValidCategory(searchParams.get('category')))
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategoryDeals(selectedCategory)
  }, [selectedCategory])

  useEffect(() => {
    const categoryFromParams = getValidCategory(searchParams.get('category'))
    setSelectedCategory((prev) => (prev === categoryFromParams ? prev : categoryFromParams))
  }, [searchParams])

  const loadCategoryDeals = async (category: string) => {
    setLoading(true)
    const fetchedDeals = await fetchDeals(category, 24)
    setDeals(fetchedDeals)
    setLoading(false)
  }

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId !== selectedCategory) {
      setSelectedCategory(categoryId)
    }

    if (categoryId === DEFAULT_CATEGORY) {
      router.replace('/categories', { scroll: false })
    } else {
      router.replace(`/categories?category=${categoryId}`, { scroll: false })
    }
  }

  const selectedCat = categories.find(c => c.id === selectedCategory)

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏷️ Categories</h1>
          <p className="text-gray-600">Browse deals by category</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`p-6 rounded-xl transition-all ${
                selectedCategory === category.id
                  ? `bg-gradient-to-br ${category.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="font-semibold text-sm">{category.name}</div>
            </button>
          ))}
        </div>

        {/* Selected Category Header */}
        {selectedCat && (
          <div className={`bg-gradient-to-r ${selectedCat.color} text-white p-6 rounded-lg mb-8`}>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{selectedCat.icon}</span>
              <div>
                <h2 className="text-3xl font-bold">{selectedCat.name}</h2>
                <p className="opacity-90">Best deals in {selectedCat.name.toLowerCase()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Deals Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading deals...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No deals found in this category</p>
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
