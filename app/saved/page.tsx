'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DealCard from '@/components/DealCard'

export default function SavedDealsPage() {
  const [savedDeals, setSavedDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load saved deals from localStorage
    const saved = JSON.parse(localStorage.getItem('savedDeals') || '[]')
    setSavedDeals(saved)
    setLoading(false)
  }, [])

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all saved deals?')) {
      localStorage.setItem('savedDeals', '[]')
      setSavedDeals([])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading saved deals...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">❤️ Saved Deals</h1>
          <p className="text-gray-600">Your favorite deals in one place</p>
        </div>

        {savedDeals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Saved Deals Yet</h2>
            <p className="text-gray-600 mb-6">Start saving deals to see them here!</p>
            <Link
              href="/"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Browse Deals
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-700">
                <span className="font-bold">{savedDeals.length}</span> saved {savedDeals.length === 1 ? 'deal' : 'deals'}
              </p>
              <button
                onClick={clearAll}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
