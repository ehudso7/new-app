'use client'

import { useState } from 'react'
import { fetchDeals } from '@/utils/fetchDeals'
import DealCard from '@/components/DealCard'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setSearched(true)

    // Fetch all deals and filter by search query
    const allDeals = await fetchDeals('all', 100)
    const filtered = allDeals.filter((deal: any) =>
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setResults(filtered)
    setLoading(false)
  }

  const popularSearches = [
    { term: 'wireless headphones', icon: '🎧' },
    { term: 'smart home', icon: '🏠' },
    { term: 'fitness tracker', icon: '⌚' },
    { term: 'kitchen appliances', icon: '🍳' },
    { term: 'gaming accessories', icon: '🎮' },
    { term: 'beauty products', icon: '💄' },
  ]

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term)
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) form.requestSubmit()
    }, 100)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          🔍 Search Deals
        </h1>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch}>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, categories, or brands..."
                className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-primary focus:outline-none text-lg"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Popular Searches */}
        {!searched && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Searches</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularSearches.map((search) => (
                <button
                  key={search.term}
                  onClick={() => handlePopularSearch(search.term)}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-3xl mb-2">{search.icon}</div>
                  <div className="text-sm font-semibold text-gray-700">{search.term}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Searching deals...</p>
          </div>
        ) : searched ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {results.length} {results.length === 1 ? 'result' : 'results'} for "{searchQuery}"
              </h2>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No deals found</h3>
                <p className="text-gray-600 mb-6">Try a different search term or browse our categories</p>
                <button
                  onClick={() => setSearched(false)}
                  className="text-primary font-semibold hover:underline"
                >
                  ← Back to popular searches
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  )
}
