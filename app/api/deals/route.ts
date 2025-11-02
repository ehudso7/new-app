import { NextResponse } from 'next/server'

const ALLOWED_IMAGE_HOSTS = new Set([
  'm.media-amazon.com',
  'images-na.ssl-images-amazon.com',
  'images.amazon.com',
])

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
      return await fetchFromRapidAPI(category, limit, rapidApiKey, partnerTag)
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
  })

  if (!response.ok) {
    throw new Error(`RapidAPI error: ${response.status}`)
  }

  const data = await response.json()

  // Transform RapidAPI response
  return (data.data?.products || [])
    .slice(0, limit)
    .map((item: any) => {
      const price = parseFloat(item.product_price?.replace(/[^0-9.]/g, '') || '0')
      const originalPrice = parseFloat(item.product_original_price?.replace(/[^0-9.]/g, '') || price * 1.5)
      const discount =
        originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 30

      const imageUrl = normalizeAmazonImageUrl(item.product_photo)
      if (!imageUrl) {
        if (item.asin) {
          console.warn(`[images] dropping ${item.asin} - invalid or missing image`, item.product_photo)
        }
        return null
      }

      return {
        id: item.asin || `deal-${Date.now()}-${Math.random()}`,
        title: item.product_title || 'Amazon Product',
        originalPrice: originalPrice,
        currentPrice: price,
        discount: discount,
        rating: parseFloat(item.product_star_rating || '4.5'),
        reviews: parseInt(item.product_num_ratings || '100'),
        imageUrl,
        category: detectCategory(item.product_title),
        amazonUrl: `https://www.amazon.com/dp/${item.asin}?tag=${tag}`,
        asin: item.asin,
        isLightningDeal: discount > 50,
        stockStatus: item.is_prime ? 'Prime Eligible' : undefined,
      }
    })
    .filter((deal: any) => deal && deal.imageUrl && deal.discount >= 20)
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
      imageUrl: 'https://m.media-amazon.com/images/I/61f1YfTkTDL._AC_SL1500_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/51TjJOTfslL._AC_SL1000_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/61R7JYKtASL._AC_SL1500_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/61DfTSu1reL._AC_SL1500_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/61uXWal-QKL._AC_SL1500_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/71eVcWFxwNL._AC_SL1500_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/61gWFSe1xaL._AC_SL1500_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/81CRMMg7RQL._AC_SL1500_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/71D0i8by+PL._AC_SL1500_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/81jBzD4KFPL._AC_SL1500_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/71M-W9hs-vL._AC_SL1500_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/81WjJgZ8LnL._AC_SL1500_.jpg',
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
      imageUrl: 'https://m.media-amazon.com/images/I/71J6Y9-n5UL._SL1500_.jpg',
      category: 'beauty',
      amazonUrl: `https://www.amazon.com/dp/B0C1GJQKNC?tag=${tag}`,
      asin: 'B0C1GJQKNC',
      isLightningDeal: false,
    },
  ]

  const curatedDeals = allDeals
    .map((deal) => {
      const imageUrl = normalizeAmazonImageUrl(deal.imageUrl)
      if (!imageUrl) {
        console.warn(`[images] curated ${deal.id} - invalid image host`, deal.imageUrl)
        return null
      }
      return { ...deal, imageUrl }
    })
    .filter((deal): deal is typeof allDeals[number] => Boolean(deal))

  // Filter by category
  let filtered = category === 'all'
    ? curatedDeals
    : curatedDeals.filter(deal => deal.category === category)

  if (filtered.length === 0) {
    return []
  }

  // Duplicate deals to fill the limit if needed
  while (filtered.length < limit) {
    filtered = [...filtered, ...filtered]
  }

  return filtered.slice(0, limit).map((deal, index) => ({
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

function normalizeAmazonImageUrl(url?: string): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url)
    if (!ALLOWED_IMAGE_HOSTS.has(parsed.hostname)) {
      return null
    }

    if (parsed.protocol !== 'https:') {
      parsed.protocol = 'https:'
    }

    return parsed.toString()
  } catch (error) {
    console.warn('[images] failed to parse image url', url, error)
    return null
  }
}
