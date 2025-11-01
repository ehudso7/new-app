'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { fetchDeals } from '@/utils/fetchDeals'
import DealCard from '@/components/DealCard'

const validCategories = ['electronics', 'home', 'fashion', 'sports', 'toys', 'beauty']

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const category = (params?.category as string) || ''
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!category || !validCategories.includes(category)) {
      router.push('/categories')
      return
    }
    loadCategoryDeals(category)
  }, [category, router])

  const loadCategoryDeals = async (cat: string) => {
    setLoading(true)
    const fetchedDeals = await fetchDeals(cat, 48)
    setDeals(fetchedDeals)
    setLoading(false)
  }

  const categoryInfo: { [key: string]: { name: string; icon: string; color: string } } = {
    electronics: { name: 'Electronics', icon: '📱', color: 'from-blue-500 to-purple-500' },
    home: { name: 'Home & Kitchen', icon: '🏠', color: 'from-green-500 to-teal-500' },
    fashion: { name: 'Fashion', icon: '👔', color: 'from-pink-500 to-rose-500' },
    sports: { name: 'Sports & Fitness', icon: '⚽', color: 'from-orange-500 to-red-500' },
    toys: { name: 'Toys & Games', icon: '🧸', color: 'from-yellow-500 to-orange-500' },
    beauty: { name: 'Beauty & Health', icon: '💄', color: 'from-purple-500 to-pink-500' },
  }

  const catInfo = categoryInfo[category]

  if (!catInfo) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className={`bg-gradient-to-r ${catInfo.color} text-white p-6 rounded-lg mb-8`}>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{catInfo.icon}</span>
            <div>
              <h1 className="text-4xl font-bold">{catInfo.name}</h1>
              <p className="opacity-90">Best deals in {catInfo.name.toLowerCase()}</p>
            </div>
          </div>
        </div>

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
          <>
            <div className="mb-6">
              <p className="text-gray-700">
                Found <span className="font-bold">{deals.length}</span> {deals.length === 1 ? 'deal' : 'deals'} in {catInfo.name}
              </p>
            </div>
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
