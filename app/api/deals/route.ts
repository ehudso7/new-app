import { NextResponse } from 'next/server'
import { curatedDeals, dealCategories, type CuratedDeal } from '@/data/curatedDeals'

interface DealQuery {
  category: string
  limit: number
  search?: string | null
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query: DealQuery = {
      category: searchParams.get('category') || 'all',
      limit: Math.max(1, Math.min(parseInt(searchParams.get('limit') || '24', 10), 100)),
      search: searchParams.get('q') || searchParams.get('search'),
    }

    const deals = await fetchRealDeals(query)

    return NextResponse.json({
      success: true,
      count: deals.length,
      deals,
      categories: dealCategories,
    })
  } catch (error: any) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
}

async function fetchRealDeals(query: DealQuery) {
  const rapidApiKey = process.env.RAPIDAPI_KEY
  const partnerTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'dealsplus077-20'

  if (rapidApiKey) {
    try {
      return await fetchFromRapidAPI(query, rapidApiKey, partnerTag)
    } catch (error) {
      console.error('RapidAPI error, falling back to curated deals:', error)
    }
  }

  return getCuratedRealDeals(query, partnerTag)
}

async function fetchFromRapidAPI(query: DealQuery, apiKey: string, tag: string) {
  const searchTerm = query.search?.trim() || (query.category === 'all' ? 'deals' : query.category)
  const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(searchTerm)}&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
    },
  })

  if (!response.ok) {
    throw new Error(`RapidAPI error: ${response.status}`)
  }

  const data = await response.json()

  return (data.data?.products || [])
    .map((item: any, index: number) => {
      const price = parseFloat(item.product_price?.replace(/[^0-9.]/g, '') || '0')
      const originalPrice = parseFloat(item.product_original_price?.replace(/[^0-9.]/g, '') || price * 1.5)
      const asin = item.asin || `deal-${Date.now()}-${index}`
      const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

      return {
        id: asin,
        asin,
        title: item.product_title?.trim() || 'Amazon Product',
        originalPrice: Math.round(originalPrice * 100) / 100,
        currentPrice: Math.round(price * 100) / 100,
        discount: Math.max(0, discount),
        rating: parseFloat(item.product_star_rating || '0'),
        reviews: parseInt(item.product_num_ratings || '0', 10),
        image: item.product_photo || '',
        category: detectCategory(item.product_title || ''),
        amazonUrl: `https://www.amazon.com/dp/${asin}?tag=${tag}`,
        isLightningDeal: !!item.is_prime && discount >= 40,
        stockStatus: item.is_prime ? 'Prime Eligible' : undefined,
        lastVerified: new Date().toISOString(),
        tags: [detectCategory(item.product_title || '')],
      }
    })
    .filter((deal: any) => deal.image && deal.discount >= 15)
    .slice(0, query.limit)
}

function getCuratedRealDeals(query: DealQuery, partnerTag: string) {
  const normalizedCategory = query.category.toLowerCase()
  const normalizedSearch = query.search?.trim().toLowerCase()

  let filtered: CuratedDeal[] = curatedDeals

  if (normalizedCategory !== 'all') {
    filtered = filtered.filter((deal) => deal.category === normalizedCategory)
  }

  if (normalizedSearch) {
    filtered = filtered.filter((deal) => {
      const haystack = [deal.title, deal.description, deal.category, ...deal.tags]
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalizedSearch)
    })
  }

  const sorted = filtered
    .slice()
    .sort((a, b) => {
      const discountDiff = computeDiscount(b) - computeDiscount(a)
      if (discountDiff !== 0) return discountDiff
      return new Date(b.lastVerified).getTime() - new Date(a.lastVerified).getTime()
    })

  return sorted.slice(0, query.limit).map((deal, index) => buildDealPayload(deal, partnerTag, index))
}

function buildDealPayload(deal: CuratedDeal, tag: string, index: number) {
  const asin = deal.asin || `curated-${index}`
  const discount = computeDiscount(deal)

  return {
    id: asin,
    asin,
    title: deal.title,
    originalPrice: Math.round(deal.originalPrice * 100) / 100,
    currentPrice: Math.round(deal.currentPrice * 100) / 100,
    discount,
    rating: Math.round(deal.rating * 10) / 10,
    reviews: deal.reviews,
    category: deal.category,
    description: deal.description,
    tags: deal.tags,
    lastVerified: deal.lastVerified,
    amazonUrl: `https://www.amazon.com/dp/${asin}?tag=${tag}`,
    image: `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=${asin}&format=_SL400_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=${tag}`,
    isLightningDeal: deal.isLightningDeal ?? false,
    stockStatus: deal.stockStatus,
    dealEndsAt: deal.dealEndsAt,
  }
}

function computeDiscount(deal: CuratedDeal) {
  if (!deal.originalPrice) return 0
  const ratio = 1 - deal.currentPrice / deal.originalPrice
  return Math.max(0, Math.round(ratio * 100))
}

function detectCategory(title: string) {
  const lower = title.toLowerCase()
  if (lower.match(/phone|laptop|computer|tablet|headphone|earbud|speaker|camera|tv|gaming|watch/)) return 'electronics'
  if (lower.match(/furniture|kitchen|home|decor|bedding|pillow|vacuum|cleaner|purifier|coffee/)) return 'home'
  if (lower.match(/shirt|pants|dress|shoe|bag|hat|sunglass|clothes|sneaker|beanie|jacket/)) return 'fashion'
  if (lower.match(/fitness|yoga|dumbbell|sport|exercise|workout|mat|tracker|bottle/)) return 'sports'
  if (lower.match(/toy|game|puzzle|kids|children|play|lego|building|card/)) return 'toys'
  if (lower.match(/makeup|beauty|cosmetic|skin|hair|nail|cream|serum|tooth/)) return 'beauty'
  return 'electronics'
}
