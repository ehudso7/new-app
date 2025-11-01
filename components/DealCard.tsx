'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Deal {
  id: string
  title: string
  originalPrice: number
  currentPrice: number
  discount: number
  rating: number
  reviews: number
  image: string
  category: string
  amazonUrl: string
  isLightningDeal?: boolean
  stockStatus?: string
  asin?: string
}

interface DealCardProps {
  deal: Deal
}

export default function DealCard({ deal }: DealCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [imageError, setImageError] = useState(false)
  const savings = deal.originalPrice - deal.currentPrice

  const handleClick = async () => {
    // Track click event for analytics
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'deal_click',
          dealId: deal.id,
          category: deal.category,
          price: deal.currentPrice,
        }),
      })
    } catch (error) {
      console.error('Analytics error:', error)
    }

    // Open Amazon link in new tab
    window.open(deal.amazonUrl, '_blank')
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('savedDeals') || '[]')
    const dealIndex = saved.findIndex((d: any) => d.id === deal.id)

    if (dealIndex > -1) {
      // Remove from saved
      saved.splice(dealIndex, 1)
      setIsSaved(false)
    } else {
      // Add to saved
      saved.push(deal)
      setIsSaved(true)
    }

    localStorage.setItem('savedDeals', JSON.stringify(saved))

    // Track save event
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: isSaved ? 'deal_unsaved' : 'deal_saved',
        dealId: deal.id,
      }),
    }).catch(console.error)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()

    const shareData = {
      title: deal.title,
      text: `${deal.discount}% off! Was $${deal.originalPrice}, now $${deal.currentPrice}`,
      url: deal.amazonUrl,
    }

    try {
      // Use Web Share API if available (mobile)
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(deal.amazonUrl)
        alert('Link copied to clipboard!')
      }

      // Track share event
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'deal_shared',
          dealId: deal.id,
        }),
      })
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {deal.isLightningDeal && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
            ⚡ Lightning Deal
          </div>
        )}
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold z-10">
          -{deal.discount}%
        </div>

        {/* Real Product Image */}
        {deal.image && !imageError ? (
          <Image
            src={deal.image}
            alt={deal.title}
            fill
            className="object-contain p-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={handleClick}
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-6xl cursor-pointer"
            onClick={handleClick}
          >
            {getCategoryEmoji(deal.category)}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-gray-800 line-clamp-2 h-12 mb-2 cursor-pointer hover:text-primary"
          onClick={handleClick}
        >
          {deal.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-semibold ml-1">{deal.rating}</span>
          </div>
          <span className="text-gray-400 text-sm">({deal.reviews.toLocaleString()})</span>
        </div>

        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ${deal.currentPrice.toFixed(2)}
            </span>
            <span className="text-gray-400 line-through text-sm">
              ${deal.originalPrice.toFixed(2)}
            </span>
          </div>
          <div className="text-green-600 text-sm font-semibold">
            Save ${savings.toFixed(2)}
          </div>
        </div>

        {deal.stockStatus && (
          <div className="text-orange-600 text-xs mb-2 font-semibold">
            {deal.stockStatus}
          </div>
        )}

        <button
          onClick={handleClick}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
        >
          View on Amazon →
        </button>

        <div className="mt-2 flex gap-2">
          <button
            onClick={handleSave}
            className={`flex-1 text-sm py-2 rounded transition-colors ${
              isSaved
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
            }`}
          >
            {isSaved ? '❤️ Saved' : '🤍 Save'}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 text-gray-600 text-sm py-2 hover:text-primary hover:bg-gray-50 rounded transition-colors"
          >
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  )
}

function getCategoryEmoji(category: string): string {
  const emojis: { [key: string]: string } = {
    electronics: '📱',
    home: '🏠',
    fashion: '👔',
    sports: '⚽',
    toys: '🧸',
    beauty: '💄',
  }
  return emojis[category] || '🎁'
}
