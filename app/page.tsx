'use client'

import { useState, useEffect } from 'react'
import DealCard from '@/components/DealCard'
import { generateDeals } from '@/utils/dealGenerator'

export default function Home() {
  const [deals, setDeals] = useState<any[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Generate deals on client side (in production, this would be from an API)
    setDeals(generateDeals())
  }, [])

  const filteredDeals = filter === 'all'
    ? deals
    : deals.filter(deal => deal.category === filter)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Discover Today's Hottest Amazon Deals
          </h1>
          <p className="text-xl mb-8">
            AI-powered deal finder that saves you money on every purchase
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              View All Deals
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600">
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
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-gray-600 mt-2">Daily Deals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">70%</div>
              <div className="text-gray-600 mt-2">Avg. Discount</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">$2.4M</div>
              <div className="text-gray-600 mt-2">Saved by Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">50K+</div>
              <div className="text-gray-600 mt-2">Happy Shoppers</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Never Miss a Deal Again</h2>
          <p className="text-xl mb-8">
            Get instant notifications when we find amazing deals in your favorite categories
          </p>
          <form className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-sm opacity-80">
            Join 50,000+ smart shoppers. Unsubscribe anytime.
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
            <h3 className="text-xl font-semibold mb-2">AI Scans Millions of Products</h3>
            <p className="text-gray-600">
              Our AI continuously monitors Amazon for price drops and trending deals
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">We Find the Best Deals</h3>
            <p className="text-gray-600">
              Advanced algorithms identify products with the highest discounts and best reviews
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">You Save Money</h3>
            <p className="text-gray-600">
              Click through to Amazon and purchase at the discounted price
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
