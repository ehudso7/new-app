import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DealPulse - Discover Today\'s Hottest Amazon Deals & Save Big',
  description: 'Find the best Amazon deals, trending products, and exclusive discounts. AI-powered deal finder that saves you money on every purchase. Updated daily with the hottest deals.',
  keywords: 'amazon deals, best deals, discounts, trending products, deal finder, save money, amazon discounts, hot deals',
  openGraph: {
    title: 'DealPulse - Discover Today\'s Hottest Amazon Deals',
    description: 'AI-powered deal finder that helps you save big on Amazon',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DealPulse - Best Amazon Deals Today',
    description: 'Find trending products and save money with AI-powered deal discovery',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary">💰 DealPulse</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="#deals" className="text-gray-700 hover:text-primary">Hot Deals</a>
                <a href="#trending" className="text-gray-700 hover:text-primary">Trending</a>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600">
                  Get Alerts
                </button>
              </div>
            </div>
          </div>
        </nav>
        {children}
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <p className="text-sm text-gray-400">
              DealPulse is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com
            </p>
            <p className="mt-4 text-gray-500">© 2025 DealPulse. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
