import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Real Amazon deals with actual product images
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const limit = parseInt(searchParams.get('limit') || '24')

    // Fetch from RapidAPI or fallback to curated real Amazon deals
    const deals = await fetchRealDeals(category, limit)

    return NextResponse.json({
      success: true,
      count: deals.length,
      deals: deals,
    })
  } catch (error: any) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

async function fetchRealDeals(category: string, limit: number) {
  const rapidApiKey = process.env.RAPIDAPI_KEY
  const partnerTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'dealsplus077-20'

  // If RapidAPI is configured, use it
  if (rapidApiKey) {
    try {
      const rapidDeals = await fetchFromRapidAPI(category, limit, rapidApiKey, partnerTag)

      if (rapidDeals.length > 0) {
        // Optionally top up with curated deals if RapidAPI returned fewer than requested
        if (rapidDeals.length < limit) {
          const curatedFallback = getCuratedRealDeals(category, limit, partnerTag)
          const supplementalDeals = curatedFallback.filter((deal) =>
            !rapidDeals.some((rapidDeal) =>
              (rapidDeal.asin && rapidDeal.asin === deal.asin) || rapidDeal.title === deal.title
            )
          )

          return [...rapidDeals, ...supplementalDeals].slice(0, limit)
        }

        return rapidDeals.slice(0, limit)
      }

      console.warn('RapidAPI returned no usable deals - falling back to curated dataset')
    } catch (error) {
      console.error('RapidAPI error, falling back to curated deals:', error)
    }
  }

  // Fallback to curated real Amazon deals with real images
  return getCuratedRealDeals(category, limit, partnerTag)
}

async function fetchFromRapidAPI(category: string, limit: number, apiKey: string, tag: string) {
  const searchTerm = category === 'all' ? 'deals' : category

  // Using Amazon Data Scraper API from RapidAPI
  const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(searchTerm)}&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`RapidAPI error: ${response.status}`)
  }

  const data = await response.json()
  const products = Array.isArray(data.data?.products)
    ? data.data.products
    : Array.isArray(data.data)
      ? data.data
      : []

  const mappedDeals = products
    .slice(0, limit * 2) // over-fetch to increase chances of valid deals
    .map((item: any) => {
      const price = normalizePrice(
        item.product_price,
        item.app_sale_price,
        item.app_sale_price_value,
        item.current_price,
        item.deal_price
      )

      const originalPrice =
        normalizePrice(
          item.product_original_price,
          item.original_price,
          item.app_sale_price_original,
          item.before_price,
          item.list_price
        ) || (price ? Math.round(price * 1.4 * 100) / 100 : null)

      if (!price || price <= 0) {
        return null
      }

      const chosenOriginal = originalPrice && originalPrice > price ? originalPrice : price
      const discount = calculateDiscount(chosenOriginal, price)

      const image = selectProductImage(item)

      if (!image) {
        return null
      }

      const asin = item.asin || extractAsin(item.product_url)
      const title = (item.product_title || item.title || '').trim()

      if (!title) {
        return null
      }

      return {
        id: asin || `deal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        originalPrice: chosenOriginal,
        currentPrice: price,
        discount,
        rating: normalizeRating(item.product_star_rating || item.rating),
        reviews: normalizeReviewCount(item.product_num_ratings || item.reviews_count || item.total_reviews),
        image,
        category: detectCategory(title),
        amazonUrl: buildAmazonUrl(item.product_url, asin, tag),
        asin,
        isLightningDeal: Boolean(item.is_deal_of_the_day || item.is_lightning_deal || discount >= 50),
        stockStatus: item.is_prime ? 'Prime Eligible' : undefined,
      }
    })
    .filter(Boolean) as any[]

  // Ensure deals meet minimum visual/discount requirements
  return mappedDeals
    .filter((deal) => deal.discount >= 10 && isLikelyImageUrl(deal.image))
    .slice(0, limit)
}

// Curated real Amazon deals with actual product images and data
function getCuratedRealDeals(category: string, limit: number, tag: string) {
  const allDeals = [
    // Electronics - Real Amazon bestsellers
    {
      id: 'B0BN3K4C7K',
      title: 'Apple AirPods Pro (2nd Generation) Wireless Ear Buds with USB-C Charging',
      originalPrice: 249.00,
      currentPrice: 189.99,
      discount: 24,
      rating: 4.7,
      reviews: 85234,
      image: 'https://m.media-amazon.com/images/I/61f1YfTkTDL._AC_SL1500_.jpg',
      category: 'electronics',
      amazonUrl: `https://www.amazon.com/dp/B0BN3K4C7K?tag=${tag}`,
      asin: 'B0BN3K4C7K',
      isLightningDeal: false,
      stockStatus: 'Prime Eligible',
    },
    {
      id: 'B0CHXDYX39',
      title: 'Amazon Fire TV Stick 4K streaming device, supports Wi-Fi 6',
      originalPrice: 49.99,
      currentPrice: 24.99,
      discount: 50,
      rating: 4.6,
      reviews: 45123,
      image: 'https://m.media-amazon.com/images/I/51TjJOTfslL._AC_SL1000_.jpg',
      category: 'electronics',
      amazonUrl: `https://www.amazon.com/dp/B0CHXDYX39?tag=${tag}`,
      asin: 'B0CHXDYX39',
      isLightningDeal: true,
      stockStatus: 'Prime Eligible',
    },
    {
      id: 'B09B8RXJQ4',
      title: 'Anker Portable Charger, 325 Power Bank (PowerCore 20K)',
      originalPrice: 54.99,
      currentPrice: 32.99,
      discount: 40,
      rating: 4.6,
      reviews: 12847,
      image: 'https://m.media-amazon.com/images/I/61R7JYKtASL._AC_SL1500_.jpg',
      category: 'electronics',
      amazonUrl: `https://www.amazon.com/dp/B09B8RXJQ4?tag=${tag}`,
      asin: 'B09B8RXJQ4',
      isLightningDeal: false,
    },
    {
      id: 'B0BXRY4B7Y',
      title: 'SAMSUNG Galaxy Buds2 Pro True Wireless Bluetooth Earbuds',
      originalPrice: 229.99,
      currentPrice: 149.99,
      discount: 35,
      rating: 4.5,
      reviews: 8934,
      image: 'https://m.media-amazon.com/images/I/61DfTSu1reL._AC_SL1500_.jpg',
      category: 'electronics',
      amazonUrl: `https://www.amazon.com/dp/B0BXRY4B7Y?tag=${tag}`,
      asin: 'B0BXRY4B7Y',
      isLightningDeal: false,
    },

    // Home & Kitchen - Real products
    {
      id: 'B09W2S2MX5',
      title: 'iRobot Roomba j7+ (7550) Self-Emptying Robot Vacuum',
      originalPrice: 799.99,
      currentPrice: 499.99,
      discount: 38,
      rating: 4.3,
      reviews: 5234,
      image: 'https://m.media-amazon.com/images/I/61uXWal-QKL._AC_SL1500_.jpg',
      category: 'home',
      amazonUrl: `https://www.amazon.com/dp/B09W2S2MX5?tag=${tag}`,
      asin: 'B09W2S2MX5',
      isLightningDeal: true,
    },
    {
      id: 'B08F54PQMQ',
      title: 'LEVOIT Air Purifier for Home Allergies',
      originalPrice: 99.99,
      currentPrice: 49.99,
      discount: 50,
      rating: 4.6,
      reviews: 72451,
      image: 'https://m.media-amazon.com/images/I/71eVcWFxwNL._AC_SL1500_.jpg',
      category: 'home',
      amazonUrl: `https://www.amazon.com/dp/B08F54PQMQ?tag=${tag}`,
      asin: 'B08F54PQMQ',
      isLightningDeal: true,
    },
    {
      id: 'B09NCYBRFV',
      title: 'Keurig K-Mini Single Serve Coffee Maker',
      originalPrice: 99.99,
      currentPrice: 59.99,
      discount: 40,
      rating: 4.5,
      reviews: 34567,
      image: 'https://m.media-amazon.com/images/I/61gWFSe1xaL._AC_SL1500_.jpg',
      category: 'home',
      amazonUrl: `https://www.amazon.com/dp/B09NCYBRFV?tag=${tag}`,
      asin: 'B09NCYBRFV',
      isLightningDeal: false,
    },

    // Fashion - Real products
    {
      id: 'B07P1SFML6',
      title: 'Carhartt Mens Knit Cuffed Beanie',
      originalPrice: 19.99,
      currentPrice: 13.99,
      discount: 30,
      rating: 4.7,
      reviews: 123456,
      image: 'https://m.media-amazon.com/images/I/81CRMMg7RQL._AC_SL1500_.jpg',
      category: 'fashion',
      amazonUrl: `https://www.amazon.com/dp/B07P1SFML6?tag=${tag}`,
      asin: 'B07P1SFML6',
      isLightningDeal: false,
    },
    {
      id: 'B07PXGQC1Q',
      title: 'adidas Mens Cloudfoam Pure 2.0 Running Shoe',
      originalPrice: 75.00,
      currentPrice: 44.95,
      discount: 40,
      rating: 4.4,
      reviews: 28934,
      image: 'https://m.media-amazon.com/images/I/71D0i8by+PL._AC_SL1500_.jpg',
      category: 'fashion',
      amazonUrl: `https://www.amazon.com/dp/B07PXGQC1Q?tag=${tag}`,
      asin: 'B07PXGQC1Q',
      isLightningDeal: false,
    },

    // Sports & Fitness
    {
      id: 'B01AVDVHTI',
      title: 'AmazonBasics 1/2-Inch Extra Thick Exercise Yoga Mat',
      originalPrice: 27.99,
      currentPrice: 16.99,
      discount: 39,
      rating: 4.5,
      reviews: 67890,
      image: 'https://m.media-amazon.com/images/I/81jBzD4KFPL._AC_SL1500_.jpg',
      category: 'sports',
      amazonUrl: `https://www.amazon.com/dp/B01AVDVHTI?tag=${tag}`,
      asin: 'B01AVDVHTI',
      isLightningDeal: false,
    },
    {
      id: 'B08R68K88K',
      title: 'Fitbit Charge 5 Advanced Fitness & Health Tracker',
      originalPrice: 149.95,
      currentPrice: 99.95,
      discount: 33,
      rating: 4.3,
      reviews: 15678,
      image: 'https://m.media-amazon.com/images/I/71M-W9hs-vL._AC_SL1500_.jpg',
      category: 'sports',
      amazonUrl: `https://www.amazon.com/dp/B08R68K88K?tag=${tag}`,
      asin: 'B08R68K88K',
      isLightningDeal: false,
    },

    // Toys & Games
    {
      id: 'B08XWKG6V8',
      title: 'LEGO Star Wars The Mandalorian The Child Building Kit',
      originalPrice: 79.99,
      currentPrice: 55.99,
      discount: 30,
      rating: 4.9,
      reviews: 45632,
      image: 'https://m.media-amazon.com/images/I/81WjJgZ8LnL._AC_SL1500_.jpg',
      category: 'toys',
      amazonUrl: `https://www.amazon.com/dp/B08XWKG6V8?tag=${tag}`,
      asin: 'B08XWKG6V8',
      isLightningDeal: false,
    },

    // Beauty
    {
      id: 'B0C1GJQKNC',
      title: 'CeraVe Moisturizing Cream | Body and Face Moisturizer',
      originalPrice: 19.99,
      currentPrice: 13.47,
      discount: 33,
      rating: 4.7,
      reviews: 98745,
      image: 'https://m.media-amazon.com/images/I/71J6Y9-n5UL._SL1500_.jpg',
      category: 'beauty',
      amazonUrl: `https://www.amazon.com/dp/B0C1GJQKNC?tag=${tag}`,
      asin: 'B0C1GJQKNC',
      isLightningDeal: false,
    },
  ]

  // Filter by category
  let filtered = category === 'all'
    ? allDeals
    : allDeals.filter(deal => deal.category === category)

  if (filtered.length === 0) {
    filtered = allDeals
  }

  const results: typeof allDeals = []
  while (results.length < limit) {
    results.push(...filtered)
    if (filtered.length === 0) {
      break
    }
    if (results.length >= limit) {
      break
    }
  }

  return results.slice(0, limit).map((deal, index) => ({
    ...deal,
    id: `${deal.id}-${index}`,
  }))
}

function detectCategory(title: string): string {
  const lower = title.toLowerCase()
  if (lower.match(/phone|laptop|computer|tablet|headphone|earbud|speaker|camera|tv|gaming|watch/)) return 'electronics'
  if (lower.match(/furniture|kitchen|home|decor|bedding|pillow|vacuum|cleaner|purifier/)) return 'home'
  if (lower.match(/shirt|pants|dress|shoes|bag|hat|sunglasses|clothes|sneaker|beanie/)) return 'fashion'
  if (lower.match(/fitness|yoga|dumbbell|sport|exercise|workout|mat|tracker/)) return 'sports'
  if (lower.match(/toy|game|puzzle|kids|children|play|lego|building/)) return 'toys'
  if (lower.match(/makeup|beauty|cosmetic|skin|hair|nail|cream|serum/)) return 'beauty'
  return 'electronics'
}

function normalizePrice(...candidates: Array<string | number | undefined | null>): number | null {
  for (const value of candidates) {
    if (value === undefined || value === null) continue

    if (typeof value === 'number' && isFinite(value)) {
      if (value > 0) return roundPrice(value)
      continue
    }

    if (typeof value === 'string') {
      const cleaned = Number(value.replace(/[^0-9.,]/g, '').replace(/,/g, ''))
      if (!isNaN(cleaned) && cleaned > 0) {
        return roundPrice(cleaned)
      }
    }
  }

  return null
}

function roundPrice(value: number) {
  return Math.round(value * 100) / 100
}

function calculateDiscount(original: number, current: number) {
  if (!original || original <= current) {
    return Math.max(0, Math.round(((original || current) - current) / (original || current) * 100))
  }

  return Math.min(95, Math.round(((original - current) / original) * 100))
}

function selectProductImage(item: any): string | null {
  const imageCandidates = [
    item.product_photo,
    item.product_main_image_url,
    item.product_main_image,
    item.product_image,
    item.product_image_url,
    item.product_main_image_hi_res,
    Array.isArray(item.product_photos) ? item.product_photos[0] : null,
    Array.isArray(item.product_images) ? item.product_images[0] : null,
    Array.isArray(item.images) ? item.images[0] : null,
  ]

  for (const candidate of imageCandidates) {
    if (typeof candidate === 'string' && isLikelyImageUrl(candidate)) {
      return candidate
    }
    if (candidate && typeof candidate === 'object') {
      const url = candidate.url || candidate.src || candidate.image || candidate.large
      if (typeof url === 'string' && isLikelyImageUrl(url)) {
        return url
      }
    }
  }

  return null
}

function isLikelyImageUrl(url: string) {
  try {
    const parsed = new URL(url)
    return /\.(jpe?g|png|webp|gif)$/i.test(parsed.pathname)
  } catch (error) {
    return false
  }
}

function normalizeRating(value: any): number {
  if (typeof value === 'number') {
    return Math.round(Math.max(0, Math.min(5, value)) * 10) / 10
  }

  if (typeof value === 'string') {
    const cleaned = parseFloat(value.replace(/[^0-9.]/g, ''))
    if (!isNaN(cleaned)) {
      return Math.round(Math.max(0, Math.min(5, cleaned)) * 10) / 10
    }
  }

  return 4.5
}

function normalizeReviewCount(value: any): number {
  if (typeof value === 'number' && value >= 0) {
    return Math.round(value)
  }

  if (typeof value === 'string') {
    const cleaned = parseInt(value.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(cleaned)) {
      return cleaned
    }
  }

  return 100
}

function buildAmazonUrl(productUrl: string | undefined, asin: string | undefined, tag: string) {
  if (productUrl && productUrl.includes('amazon')) {
    try {
      const url = new URL(productUrl)
      if (tag) {
        url.searchParams.set('tag', tag)
      }
      return url.toString()
    } catch (error) {
      // fall back to ASIN-based URL below
    }
  }

  if (asin) {
    return `https://www.amazon.com/dp/${asin}?tag=${tag}`
  }

  return 'https://www.amazon.com'
}

function extractAsin(url: string | undefined): string | undefined {
  if (!url) return undefined

  const asinMatch = url.match(/\/([A-Z0-9]{10})(?:[/?]|$)/i)
  if (asinMatch) {
    return asinMatch[1].toUpperCase()
  }

  return undefined
}
