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
}

interface DealCardProps {
  deal: Deal
}

export default function DealCard({ deal }: DealCardProps) {
  const savings = deal.originalPrice - deal.currentPrice

  const handleClick = () => {
    // Track click event (in production, send to analytics)
    console.log('Deal clicked:', deal.id)
    // Redirect to Amazon affiliate link
    window.open(deal.amazonUrl, '_blank')
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div className="relative">
        {deal.isLightningDeal && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            ⚡ Lightning Deal
          </div>
        )}
        <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
          -{deal.discount}%
        </div>
        <div className="bg-gray-100 h-48 flex items-center justify-center">
          <div className="text-6xl">{getCategoryEmoji(deal.category)}</div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 h-12 mb-2">
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
          <div className="text-orange-600 text-xs mb-2">
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
          <button className="flex-1 text-gray-600 text-sm py-2 hover:text-primary">
            ❤️ Save
          </button>
          <button className="flex-1 text-gray-600 text-sm py-2 hover:text-primary">
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
