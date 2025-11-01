import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">About DealPulse</h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            DealPulse was created with one goal in mind: to help you save money on every Amazon purchase.
            We scan thousands of products daily to bring you the best deals, trending items, and exclusive discounts.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our AI-powered system identifies genuine savings opportunities, filters out fake deals, and presents
            only the most valuable offers. We believe smart shopping shouldn't require hours of research - that's
            why we do the heavy lifting for you.
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Why DealPulse?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-bold mb-2">Curated Quality</h3>
              <p className="text-sm opacity-90">
                Only the best deals make it to our platform. We verify discounts and filter low-quality products.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="font-bold mb-2">Real-Time Updates</h3>
              <p className="text-sm opacity-90">
                Our system refreshes every 30 minutes to catch lightning deals and flash sales before they expire.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">💰</div>
              <h3 className="font-bold mb-2">Guaranteed Savings</h3>
              <p className="text-sm opacity-90">
                We only show deals with verified price drops, ensuring you always get genuine discounts.
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">🔒</div>
              <h3 className="font-bold mb-2">Privacy First</h3>
              <p className="text-sm opacity-90">
                We don't track your purchases or sell your data. Your shopping privacy is our priority.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900">We Scan Amazon 24/7</h3>
                <p className="text-gray-600">
                  Our automated systems monitor millions of products across all categories to identify price drops.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900">AI Filters the Best Deals</h3>
                <p className="text-gray-600">
                  Our AI analyzes ratings, reviews, price history, and discount percentages to surface only quality deals.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900">You Save Money</h3>
                <p className="text-gray-600">
                  Browse curated deals, save your favorites, and shop with confidence knowing you're getting the best price.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Thousands of Smart Shoppers</h2>
          <p className="text-gray-700 mb-6">
            Start saving money today with DealPulse's curated Amazon deals
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
          >
            Browse Today's Deals →
          </Link>
        </div>
      </div>
    </main>
  )
}
