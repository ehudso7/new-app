'use client'

import { useState, useEffect } from 'react'
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
  updatedAt?: string
}

interface DealCardProps {
  deal: Deal
}

export default function DealCard({ deal }: DealCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [imageError, setImageError] = useState(false)
  const savings = deal.originalPrice - deal.currentPrice

  // Check if deal is already saved on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedDeals') || '[]')
    const isAlreadySaved = saved.some((d: any) => d.id === deal.id)
    setIsSaved(isAlreadySaved)
  }, [deal.id])


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

    // Open Amazon link through our redirect route (ensures proper affiliate tracking)
    const amazonLink = deal.asin 
      ? `/api/out/amazon/${deal.asin}`
      : deal.amazonUrl
    window.open(amazonLink, '_blank')
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

    // Use the proper redirect URL for sharing
    const shareUrl = deal.asin
      ? `${window.location.origin}/api/out/amazon/${deal.asin}`
      : deal.amazonUrl

    const shareData = {
      title: deal.title,
      text: `${deal.discount}% off! Was $${deal.originalPrice}, now $${deal.currentPrice}`,
      url: shareUrl,
    }

    try {
      // Use Web Share API if available (mobile)
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl)
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative">
      <div className="relative h-48 bg-gray-100">
        {deal.isLightningDeal && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
            ⚡ Lightning Deal
          </div>
        )}
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold z-10">
          -{deal.discount}%
        </div>

        {/* Real Product Image */}
        {deal.image && !imageError ? (
          <Image
            src={`/api/img?src=${encodeURIComponent(deal.image)}`}
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
          <div className="text-blue-600 text-xs mb-2 font-semibold">
            {deal.stockStatus}
          </div>
        )}

        <button
          onClick={handleClick}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 transition-transform"
        >
          View on Amazon →
        </button>

        {deal.updatedAt && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            Updated {formatTimeAgo(deal.updatedAt)}
            {deal.asin && ` • ASIN: ${deal.asin}`}
          </div>
        )}

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

function formatTimeAgo(timestamp: string): string {
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diffMs = now - then
  
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
