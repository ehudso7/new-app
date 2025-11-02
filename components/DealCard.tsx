'use client'

import { useEffect, useState, type MouseEvent } from 'react'

import { safeImageUrl } from '@/utils/amazonImages'

interface Deal {
  id: string
  title: string
  originalPrice: number
  currentPrice: number
  discount: number
  rating: number
  reviews: number
  imageUrl?: string | null
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
  const [timeLeft, setTimeLeft] = useState(0)
  const [viewerCount, setViewerCount] = useState(0)

  const savings = deal.originalPrice - deal.currentPrice
  const ratingValue = Number.isFinite(deal.rating) ? deal.rating : 4.5
  const ratingDisplay = ratingValue.toFixed(1)
  const reviewsDisplay = Number.isFinite(deal.reviews) ? deal.reviews : 0

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedDeals') || '[]')
    const isAlreadySaved = saved.some((d: any) => d.id === deal.id)
    setIsSaved(isAlreadySaved)
  }, [deal.id])

  useEffect(() => {
    setImageError(false)
  }, [deal.imageUrl])

  useEffect(() => {
    if (!deal.isLightningDeal) return

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
  }, [deal.isLightningDeal])

  useEffect(() => {
    const baseViewers = Math.floor(Math.random() * 135) + 15
    setViewerCount(baseViewers)

    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 10) - 4
        const newCount = Math.max(10, Math.min(200, prev + change))
        return newCount
      })
    }, Math.random() * 20000 + 10000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeLeft = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const trackDealClick = () => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'deal_click',
        dealId: deal.id,
        category: deal.category,
        price: deal.currentPrice,
      }),
    }).catch((error) => {
      console.error('Analytics error:', error)
    })
  }

  const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    const saved = JSON.parse(localStorage.getItem('savedDeals') || '[]')
    const dealIndex = saved.findIndex((d: any) => d.id === deal.id)
    const nextSaved = dealIndex === -1

    if (nextSaved) {
      saved.push(deal)
      setIsSaved(true)
    } else {
      saved.splice(dealIndex, 1)
      setIsSaved(false)
    }

    localStorage.setItem('savedDeals', JSON.stringify(saved))

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: nextSaved ? 'deal_saved' : 'deal_unsaved',
        dealId: deal.id,
      }),
    }).catch((error) => console.error('Analytics error:', error))
  }

  const handleShare = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    const shareData = {
      title: deal.title,
      text: `${deal.discount}% off! Was $${deal.originalPrice}, now $${deal.currentPrice}`,
      url: deal.amazonUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(deal.amazonUrl)
        alert('Link copied to clipboard.')
      }

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

  const stockUrgency = deal.discount > 50 ? 'Only a few left' : deal.discount > 30 ? 'Selling fast' : null
  const proxiedImage = safeImageUrl(deal.imageUrl)
  const showImage = Boolean(proxiedImage) && !imageError

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative">
      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-semibold z-20 flex items-center gap-1">
        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></span>
        {viewerCount} viewing
      </div>

      <div className="relative h-48 bg-gray-100">
        {deal.isLightningDeal && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
            Lightning deal
          </div>
        )}
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold z-10">
          -{deal.discount}%
        </div>

        {deal.isLightningDeal && timeLeft > 0 && (
          <div className="absolute bottom-2 left-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold text-center z-10">
            Ends in: {formatTimeLeft(timeLeft)}
          </div>
        )}

        <a
          href={deal.amazonUrl}
          target="_blank"
          rel="nofollow noopener sponsored"
          onClick={trackDealClick}
          className="flex h-full w-full items-center justify-center"
        >
          {showImage ? (
            <img
              src={proxiedImage!}
              alt={deal.title}
              className="mx-auto h-40 w-full object-contain p-4 transition-transform duration-150 ease-in-out hover:scale-105"
              loading="lazy"
              width={320}
              height={160}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="grid h-40 w-full place-items-center text-sm text-gray-500">
              Image unavailable
            </div>
          )}
        </a>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
          <a
            href={deal.amazonUrl}
            target="_blank"
            rel="nofollow noopener sponsored"
            onClick={trackDealClick}
            className="block h-12 hover:text-primary"
          >
            {deal.title}
          </a>
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <StarIcon />
            <span className="text-sm font-semibold ml-1">{ratingDisplay}</span>
          </div>
          <span className="text-gray-400 text-sm">({reviewsDisplay.toLocaleString()})</span>
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

        {stockUrgency && (
          <div className="bg-orange-100 text-orange-700 text-xs px-3 py-2 rounded mb-2 font-semibold">
            {stockUrgency}
          </div>
        )}

        <a
          href={deal.amazonUrl}
          target="_blank"
          rel="nofollow noopener sponsored"
          onClick={trackDealClick}
          className="w-full inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg hover:scale-105"
        >
          View on Amazon
        </a>

        <div className="mt-2 flex gap-2">
          <button
            onClick={handleSave}
            className={`flex-1 text-sm py-2 rounded transition-colors ${
              isSaved
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
            }`}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 text-gray-600 text-sm py-2 hover:text-primary hover:bg-gray-50 rounded transition-colors"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 text-yellow-400"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.402 8.175L12 18.896 4.664 23.168l1.402-8.175L0 9.211l8.332-1.193z"
      />
    </svg>
  )
}
