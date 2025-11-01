'use client'

import { useEffect, useMemo, useState } from 'react'

interface Deal {
  id: string
  title: string
  currentPrice: number
  originalPrice: number
  discount: number
  amazonUrl: string
  category: string
}

export default function SocialMediaAgent() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadDeals() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/deals?category=all&limit=20')
        if (!res.ok) throw new Error('Unable to retrieve deals for social sharing.')
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

  const topDeals = useMemo(() => {
    return [...deals]
      .sort((a, b) => (b.discount || 0) - (a.discount || 0))
      .slice(0, 6)
  }, [deals])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">🚀 Social sharing toolkit</h2>
        <p className="text-sm text-gray-600">
          Automatically generate post-ready copy using real deals. Configure your scheduler (Buffer, Hypefury, Typefully, etc.) to pull this feed or copy the snippets below.
        </p>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow-md p-6 text-sm text-gray-500">Loading suggested posts…</div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 text-sm">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📌 Ready-to-share posts</h3>
            {topDeals.length === 0 ? (
              <p className="text-sm text-gray-600">No deals available right now.</p>
            ) : (
              <div className="space-y-3">
                {topDeals.map((deal) => (
                  <ShareSnippet key={deal.id} deal={deal} />
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🔑 Platform configuration tips</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Set <code className="bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_X_HANDLE</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_FACEBOOK_PAGE</code>, etc. to surface official handles in the UI.</li>
              <li>Use Buffer or Zapier webhooks to call <code className="bg-gray-100 px-1 py-0.5 rounded">/api/deals?category=all&amp;limit=10</code> and schedule posts automatically.</li>
              <li>For affiliate compliance, always disclose Amazon partnership using hashtags such as <code className="bg-gray-100 px-1 py-0.5 rounded">#AmazonAffiliate</code> or text like “As an Amazon Associate I earn from qualifying purchases.”</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

function ShareSnippet({ deal }: { deal: Deal }) {
  const [copied, setCopied] = useState(false)

  const text = `🔥 ${deal.title} is ${deal.discount}% off right now! \nWas $${deal.originalPrice.toFixed(2)} → Now $${deal.currentPrice.toFixed(2)}\n${deal.amazonUrl}\n#AmazonDeals #DealAlert #${deal.category}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      console.error('Failed to copy share text', error)
    }
  }

  return (
    <div className="border border-gray-100 rounded-lg p-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="font-semibold text-gray-800 line-clamp-2">{deal.title}</p>
          <p className="text-sm text-primary font-semibold">-{deal.discount}% • ${deal.currentPrice.toFixed(2)}</p>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs bg-primary text-white px-3 py-1 rounded-full hover:bg-green-600"
        >
          {copied ? 'Copied!' : 'Copy text'}
        </button>
      </div>
      <pre className="text-xs bg-gray-50 border border-gray-100 rounded-lg p-3 whitespace-pre-wrap text-gray-700">{text}</pre>
    </div>
  )
}
