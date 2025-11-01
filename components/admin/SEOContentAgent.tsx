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
}

interface KeywordInsight {
  keyword: string
  frequency: number
  sampleDeals: Deal[]
}

export default function SEOContentAgent() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadDeals() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/deals?category=all&limit=60')
        if (!res.ok) throw new Error('Unable to pull deals for keyword analysis.')
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

  const insights = useMemo(() => buildInsights(deals), [deals])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">🔍 SEO content planner</h2>
        <p className="text-sm text-gray-600">
          This report mines the live deal catalog to surface keywords, categories, and article ideas you can publish today. Everything shown below is derived from the products currently on the site—no filler data.
        </p>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow-md p-6 text-sm text-gray-500">Analysing product titles…</div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 text-sm">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ High-signal keywords from live deals</h3>
            {insights.keywords.length === 0 ? (
              <p className="text-sm text-gray-600">Not enough data to generate keyword suggestions.</p>
            ) : (
              <div className="space-y-3">
                {insights.keywords.map((keyword) => (
                  <KeywordCard key={keyword.keyword} insight={keyword} />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🧭 Content ideas sourced from current inventory</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              {insights.contentIdeas.map((idea, idx) => (
                <li key={idx}>{idea}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🔗 Internal linking opportunities</h3>
            <p className="text-sm text-gray-600 mb-3">
              Pair the following deals together in roundups or comparison posts to capture additional long-tail searches.
            </p>
            <div className="space-y-3">
              {insights.linkPairs.map((pair, idx) => (
                <LinkPair key={idx} pair={pair} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function buildInsights(deals: Deal[]) {
  const stopwords = new Set(['with', 'and', 'for', 'the', 'under', 'plus', 'inch', 'bundle'])
  const keywordMap = new Map<string, Deal[]>()

  deals.forEach((deal) => {
    const words = deal.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stopwords.has(word))

    const uniqueWords = Array.from(new Set(words))
    uniqueWords.forEach((word) => {
      const existing = keywordMap.get(word) || []
      keywordMap.set(word, [...existing, deal])
    })
  })

  const keywordEntries: KeywordInsight[] = Array.from(keywordMap.entries())
    .map(([keyword, items]) => ({ keyword, frequency: items.length, sampleDeals: items.slice(0, 3) }))
    .filter((item) => item.frequency >= 2)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 8)

  const categories = deals.reduce<Record<string, Deal[]>>((acc, deal) => {
    acc[deal.category] = acc[deal.category] || []
    acc[deal.category].push(deal)
    return acc
  }, {})

  const contentIdeas = Object.entries(categories).map(([category, items]) => {
    const highestDiscount = items.reduce((best, item) => (item.discount > best ? item.discount : best), 0)
    return `Create a ${category} roundup showcasing ${items.length} deals (top discount: ${highestDiscount}% off).`
  })

  const linkPairs = [] as [Deal, Deal][]
  const sortedDeals = [...deals].sort((a, b) => b.discount - a.discount)
  for (let i = 0; i < Math.min(sortedDeals.length - 1, 6); i += 2) {
    if (sortedDeals[i + 1]) {
      linkPairs.push([sortedDeals[i], sortedDeals[i + 1]])
    }
  }

  return {
    keywords: keywordEntries,
    contentIdeas,
    linkPairs,
  }
}

function KeywordCard({ insight }: { insight: KeywordInsight }) {
  return (
    <div className="border border-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-800">{insight.keyword}</p>
          <p className="text-xs text-gray-500">Appears in {insight.frequency} live deals</p>
        </div>
        <span className="text-sm text-gray-500">Suggested intent: roundup / comparison</span>
      </div>
      <ul className="mt-3 text-xs text-gray-600 space-y-1">
        {insight.sampleDeals.map((deal) => (
          <li key={deal.id}>
            <a href={deal.amazonUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-green-600">
              {deal.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function LinkPair({ pair }: { pair: [Deal, Deal] }) {
  const [first, second] = pair
  return (
    <div className="border border-gray-100 rounded-lg p-4 text-sm text-gray-700">
      <p className="font-semibold text-gray-800 mb-2">{first.category} comparison</p>
      <ul className="space-y-1">
        {[first, second].map((deal) => (
          <li key={deal.id}>
            <a href={deal.amazonUrl} className="text-primary hover:text-green-600" target="_blank" rel="noopener noreferrer">
              {deal.title} ({deal.discount}% off)
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
