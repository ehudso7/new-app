'use client'

import { useState, useEffect } from 'react'

interface Deal {
  id: string
  title: string
  originalPrice: number
  currentPrice: number
  discount: number
  rating: number
  reviews: number
  image: string
  imageUrl?: string // Support both image and imageUrl for backward compatibility
  category: string
  amazonUrl: string
  isLightningDeal?: boolean
  stockStatus?: string
  asin?: string
}

// Helper function to safely convert Amazon image URLs to proxy URLs
function safeImageUrl(url?: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (!/amazon\.com$|m\.media-amazon\.com$|ssl-images-amazon\.com$/.test(parsed.hostname)) {
      return null
    }
    return `/api/img?src=${encodeURIComponent(parsed.toString())}`
  } catch { return null }
}

interface DealCardProps {
  deal: Deal
}

export default function DealCard({ deal }: DealCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [viewerCount, setViewerCount] = useState(0)
  const savings = deal.originalPrice - deal.currentPrice

  // Check if deal is already saved on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedDeals') || '[]')
    const isAlreadySaved = saved.some((d: any) => d.id === deal.id)
    setIsSaved(isAlreadySaved)
  }, [deal.id])

  // Lightning deal countdown timer (for demo: random time between 1-6 hours)
  useEffect(() => {
    if (deal.isLightningDeal) {
      const randomHours = Math.floor(Math.random() * 6) + 1
      const endTime = Date.now() + randomHours * 60 * 60 * 1000

      const interval = setInterval(() => {
        const remaining = endTime - Date.now()
        if (remaining <= 0) {
          setTimeLeft(0)
          clearInterval(interval)
        } else {
          setTimeLeft(remaining)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [deal.isLightningDeal])

  // Simulated viewer count (viral social proof)
  useEffect(() => {
    // Random number between 15-150 viewers
    const baseViewers = Math.floor(Math.random() * 135) + 15
    setViewerCount(baseViewers)

    // Update viewer count every 10-30 seconds to simulate activity
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 10) - 4 // +/- 4 viewers
        const newCount = Math.max(10, Math.min(200, prev + change))
        return newCount
      })
    }, Math.random() * 20000 + 10000)

    return () => clearInterval(interval)
  }, [])

  // Format countdown timer
  const formatTimeLeft = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

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

  // Stock urgency indicator
  const stockUrgency = deal.discount > 50 ? 'Only a few left!' : deal.discount > 30 ? 'Selling fast!' : null

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative">
      {/* Viewer count - viral social proof */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-semibold z-20 flex items-center gap-1">
        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        {viewerCount} viewing
      </div>

      <div className="relative h-48 bg-gray-100">
        {deal.isLightningDeal && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
            ⚡ Lightning Deal
          </div>
        )}
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold z-10">
          -{deal.discount}%
        </div>

        {/* Countdown timer for lightning deals */}
        {deal.isLightningDeal && timeLeft > 0 && (
          <div className="absolute bottom-2 left-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold text-center z-10">
            ⏰ Ends in: {formatTimeLeft(timeLeft)}
          </div>
        )}

        {/* Real Product Image via Proxy */}
        {(() => {
          const imageUrl = deal.imageUrl || deal.image
          const imgSrc = safeImageUrl(imageUrl)
          
          if (imgSrc && !imageError) {
            return (
              <a href={deal.amazonUrl} target="_blank" rel="nofollow noopener sponsored" onClick={(e) => { e.preventDefault(); handleClick(); }}>
                <img
                  src={imgSrc}
                  alt={deal.title}
                  className="mx-auto h-full w-full object-contain p-4 cursor-pointer hover:scale-105 transition-transform"
                  loading="lazy"
                  width={320}
                  height={160}
                  onError={() => setImageError(true)}
                />
              </a>
            )
          }
          
          return (
            <div
              className="h-48 grid place-items-center text-sm text-gray-500 cursor-pointer"
              onClick={handleClick}
            >
              Image unavailable
            </div>
          )
        })()}
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

        {/* Stock urgency indicator */}
        {stockUrgency && (
          <div className="bg-orange-100 text-orange-700 text-xs px-3 py-2 rounded mb-2 font-semibold flex items-center gap-1">
            <span>🔥</span>
            {stockUrgency}
          </div>
        )}

        <button
          onClick={handleClick}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 transition-transform"
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

