import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
      <head>
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </head>
      <body className="bg-gray-50">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
