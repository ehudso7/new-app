import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="text-9xl font-bold text-primary mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. Maybe it was moved, or you mistyped the URL.
        </p>
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Here's what you can do:</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3">
              <span className="text-2xl">🏠</span>
              <div>
                <Link href="/" className="text-primary font-semibold hover:underline">
                  Go to Homepage
                </Link>
                <p className="text-gray-600 text-sm">Browse today's hottest deals</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🏷️</span>
              <div>
                <Link href="/categories" className="text-primary font-semibold hover:underline">
                  Browse Categories
                </Link>
                <p className="text-gray-600 text-sm">Find deals by category</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <Link href="/trending" className="text-primary font-semibold hover:underline">
                  View Trending Deals
                </Link>
                <p className="text-gray-600 text-sm">See what's popular right now</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <Link href="/search" className="text-primary font-semibold hover:underline">
                  Search for Deals
                </Link>
                <p className="text-gray-600 text-sm">Find exactly what you're looking for</p>
              </div>
            </li>
          </ul>
        </div>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
        >
          Take Me Home →
        </Link>
      </div>
    </main>
  )
}
