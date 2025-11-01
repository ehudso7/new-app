'use client'

import { useState, useEffect, useMemo } from 'react'
import DealCard from '@/components/DealCard'
import { fetchDeals } from '@/utils/fetchDeals'

export default function Home() {
  const [deals, setDeals] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribeLoading, setSubscribeLoading] = useState(false)
  const [subscribeMessage, setSubscribeMessage] = useState('')

  useEffect(() => {
    // Fetch real deals from API
    async function loadDeals() {
      setLoading(true)
      const fetchedDeals = await fetchDeals('all', 24)
      setDeals(fetchedDeals)
      setLoading(false)
    }
    loadDeals()
  }, [])

  const metrics = useMemo(() => {
    if (!deals.length) {
      return {
        totalDeals: 0,
        averageDiscount: 0,
        maxSavings: 0,
        verifiedToday: 0,
      }
    }

    const totalDeals = deals.length
    const averageDiscount =
      deals.reduce((acc, deal) => acc + (deal.discount || 0), 0) / totalDeals
    const maxSavings = Math.max(
      ...deals.map((deal) => Math.max(0, (deal.originalPrice || 0) - (deal.currentPrice || 0))),
    )

    const verifiedToday = deals.filter((deal) => {
      if (!deal.lastVerified) return false
      const verifiedTime = Date.parse(deal.lastVerified)
      if (Number.isNaN(verifiedTime)) return false
      return Date.now() - verifiedTime <= 24 * 60 * 60 * 1000
    }).length

    return {
      totalDeals,
      averageDiscount,
      maxSavings,
      verifiedToday,
    }
  }, [deals])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setSubscribeMessage('Please enter a valid email')
      return
    }

    setSubscribeLoading(true)
    setSubscribeMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setSubscribeMessage('🎉 Success! Check your email for your first deal alert.')
        setEmail('')
      } else {
        setSubscribeMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubscribeMessage('Failed to subscribe. Please try again.')
    } finally {
      setSubscribeLoading(false)
    }
  }

  const scrollToDeals = () => {
    document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredDeals = filter === 'all'
    ? deals
    : deals.filter(deal => deal.category === filter)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Real Amazon Deals, Verified This Week
          </h1>
          <p className="text-xl mb-8">
            Curated price drops across electronics, home, beauty, toys, and more—no fillers, just real savings
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={scrollToDeals}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              View All Deals
            </button>
            <button
              onClick={scrollToDeals}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all"
            >
              Get Deal Alerts
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">{metrics.totalDeals}</div>
              <div className="text-gray-600 mt-2">Deals Live Right Now</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">
                {metrics.averageDiscount ? `${metrics.averageDiscount.toFixed(1)}%` : '0%'}
              </div>
              <div className="text-gray-600 mt-2">Average Discount</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">
                ${metrics.maxSavings ? metrics.maxSavings.toFixed(0) : '0'}
              </div>
              <div className="text-gray-600 mt-2">Top Single Deal Savings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">{metrics.verifiedToday}</div>
              <div className="text-gray-600 mt-2">Deals Verified in 24h</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {['all', 'electronics', 'home', 'fashion', 'sports', 'toys', 'beauty'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full whitespace-nowrap ${
                filter === category
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Deals Grid */}
      <section id="deals" className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">🔥 Hot Deals Right Now</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Loading amazing deals...</p>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No deals found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Never Miss a Deal Again</h2>
          <p className="text-xl mb-8">
            Get email alerts when we verify new Amazon discounts in the categories you care about
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                required
              />
              <button
                type="submit"
                disabled={subscribeLoading}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {subscribeLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {subscribeMessage && (
              <p className={`mt-4 text-sm ${subscribeMessage.includes('Success') ? 'text-green-100' : 'text-red-100'}`}>
                {subscribeMessage}
              </p>
            )}
          </form>
          <p className="mt-4 text-sm opacity-80">
            We send a single curated email per day. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How DealPulse Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">We Track Amazon Price Drops</h3>
            <p className="text-gray-600">
              We monitor Amazon best-seller lists, daily deals, and trusted price trackers to spot real discounts.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">We Verify Each Listing</h3>
            <p className="text-gray-600">
              Every deal is checked for in-stock status, discount size, review quality, and up-to-date pricing.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">You Click & Save</h3>
            <p className="text-gray-600">
              Jump straight to the Amazon product page, take advantage of the discount, and enjoy the savings.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
