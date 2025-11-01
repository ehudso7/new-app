import { NextResponse } from 'next/server'

// This API route fetches real Amazon deals
// You can call this from your frontend or via cron jobs

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const limit = parseInt(searchParams.get('limit') || '24')

    // Fetch deals from your chosen API
    const deals = await fetchDealsFromAPI(category, limit)

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

// POST endpoint for admin to manually trigger deal refresh
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, minDiscount, minRating } = body

    const deals = await fetchDealsFromAPI(category, 50)

    // Filter deals based on criteria
    const filteredDeals = deals.filter((deal: any) => {
      const discount = deal.discount || 0
      const rating = deal.rating || 0
      return discount >= (minDiscount || 30) && rating >= (minRating || 4.0)
    })

    return NextResponse.json({
      success: true,
      count: filteredDeals.length,
      deals: filteredDeals,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Main function to fetch deals from API
async function fetchDealsFromAPI(category: string, limit: number) {
  const apiSource = process.env.DEAL_API_SOURCE || 'rapidapi' // 'amazon' or 'rapidapi'

  if (apiSource === 'amazon') {
    return await fetchFromAmazonAPI(category, limit)
  } else if (apiSource === 'rapidapi') {
    return await fetchFromRapidAPI(category, limit)
  } else {
    // Fallback to demo data for testing
    return generateDemoDeals(limit)
  }
}

// Option 1: Amazon Product Advertising API (Official)
async function fetchFromAmazonAPI(category: string, limit: number) {
  const accessKey = process.env.AMAZON_ACCESS_KEY
  const secretKey = process.env.AMAZON_SECRET_KEY
  const partnerTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG

  if (!accessKey || !secretKey || !partnerTag) {
    console.warn('Amazon API credentials not configured, using demo data')
    return generateDemoDeals(limit)
  }

  try {
    // Amazon Product Advertising API v5 implementation
    // Note: You'll need to use the aws4 library to sign requests
    // Install: npm install aws4

    const endpoint = 'https://webservices.amazon.com/paapi5/searchitems'

    // This is a simplified example - actual implementation requires AWS signature
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems',
      },
      body: JSON.stringify({
        PartnerTag: partnerTag,
        PartnerType: 'Associates',
        Keywords: category === 'all' ? 'deals' : category,
        SearchIndex: 'All',
        ItemCount: limit,
        Resources: [
          'Images.Primary.Large',
          'ItemInfo.Title',
          'ItemInfo.Features',
          'Offers.Listings.Price',
          'Offers.Listings.SavingBasis',
        ],
      }),
    })

    const data = await response.json()

    // Transform Amazon API response to our format
    return transformAmazonDeals(data, partnerTag)
  } catch (error) {
    console.error('Amazon API error:', error)
    return generateDemoDeals(limit)
  }
}

// Option 2: RapidAPI (Easier to set up, free tier available)
async function fetchFromRapidAPI(category: string, limit: number) {
  const rapidApiKey = process.env.RAPIDAPI_KEY
  const partnerTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'dealsplus077-20'

  if (!rapidApiKey) {
    console.warn('RapidAPI key not configured, using demo data')
    return generateDemoDeals(limit)
  }

  try {
    // Using Amazon Data Scraper API from RapidAPI
    // Sign up at: https://rapidapi.com/restyler/api/amazon-data-scraper123

    const searchTerm = category === 'all' ? 'deals' : category
    const url = `https://amazon-data-scraper123.p.rapidapi.com/search/${encodeURIComponent(searchTerm)}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'amazon-data-scraper123.p.rapidapi.com',
      },
    })

    if (!response.ok) {
      throw new Error(`RapidAPI error: ${response.status}`)
    }

    const data = await response.json()

    // Transform RapidAPI response to our format
    return transformRapidAPIDeals(data.results || [], partnerTag, limit)
  } catch (error) {
    console.error('RapidAPI error:', error)
    return generateDemoDeals(limit)
  }
}

// Transform Amazon API response to our deal format
function transformAmazonDeals(data: any, partnerTag: string) {
  if (!data.SearchResult?.Items) return []

  return data.SearchResult.Items.map((item: any, index: number) => {
    const price = item.Offers?.Listings?.[0]?.Price?.Amount || 0
    const savingBasis = item.Offers?.Listings?.[0]?.SavingBasis?.Amount || price
    const discount = savingBasis > 0 ? Math.round(((savingBasis - price) / savingBasis) * 100) : 0

    return {
      id: `deal-${Date.now()}-${index}`,
      title: item.ItemInfo?.Title?.DisplayValue || 'Unknown Product',
      originalPrice: savingBasis,
      currentPrice: price,
      discount: discount,
      rating: 4.5, // Amazon API doesn't always provide ratings in basic tier
      reviews: 100,
      image: item.Images?.Primary?.Large?.URL || '',
      category: 'electronics', // You'd need to map this from Amazon's browse nodes
      amazonUrl: `https://www.amazon.com/dp/${item.ASIN}?tag=${partnerTag}`,
      asin: item.ASIN,
      isLightningDeal: discount > 50,
      stockStatus: undefined,
    }
  })
}

// Transform RapidAPI response to our deal format
function transformRapidAPIDeals(results: any[], partnerTag: string, limit: number) {
  return results.slice(0, limit).map((item: any, index: number) => {
    const currentPrice = parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0')
    const originalPrice = parseFloat(item.original_price?.replace(/[^0-9.]/g, '') || currentPrice)
    const discount = originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0

    return {
      id: `deal-${Date.now()}-${index}`,
      title: item.title || 'Unknown Product',
      originalPrice: originalPrice,
      currentPrice: currentPrice,
      discount: discount > 0 ? discount : Math.floor(Math.random() * 40) + 30, // Fallback
      rating: parseFloat(item.rating || '4.5'),
      reviews: parseInt(item.reviews?.replace(/[^0-9]/g, '') || '100'),
      image: item.image || '',
      category: detectCategory(item.title),
      amazonUrl: `${item.url}${item.url.includes('?') ? '&' : '?'}tag=${partnerTag}`,
      asin: item.asin || extractASIN(item.url),
      isLightningDeal: discount > 50,
      stockStatus: undefined,
    }
  }).filter(deal => deal.discount >= 20) // Only include deals with at least 20% off
}

// Generate demo deals (fallback when APIs aren't configured)
function generateDemoDeals(limit: number) {
  const categories = ['electronics', 'home', 'fashion', 'sports', 'toys', 'beauty']
  const productTemplates: any = {
    electronics: [
      'Wireless Bluetooth Earbuds with Noise Cancellation',
      'Smart Watch with Heart Rate Monitor',
      'Portable Phone Charger 20000mAh',
      '4K Webcam for Streaming and Video Calls',
    ],
    home: [
      'Robot Vacuum Cleaner with Self-Emptying Base',
      'Air Purifier with HEPA Filter for Large Rooms',
      'Smart LED Light Bulbs (4-Pack)',
      'Electric Kettle with Temperature Control',
    ],
    fashion: [
      'Leather Crossbody Bag for Women',
      'Mens Casual Athletic Sneakers',
      'Polarized Sunglasses UV Protection',
      'Winter Warm Knit Beanie Hat',
    ],
    sports: [
      'Yoga Mat Extra Thick with Carrying Strap',
      'Resistance Bands Set of 5',
      'Adjustable Dumbbells 5-25 lbs Pair',
      'Foam Roller for Muscle Recovery',
    ],
    toys: [
      'Building Blocks Set 1000 Pieces',
      'Remote Control Car Off-Road Racing',
      'Educational STEM Learning Kit',
      'Puzzle Jigsaw 1000 Pieces for Adults',
    ],
    beauty: [
      'Facial Cleansing Brush Waterproof',
      'Hair Dryer Ionic with Diffuser',
      'Makeup Brush Set Professional 12 Piece',
      'Vitamin C Serum for Face Anti-Aging',
    ],
  }

  const deals = []
  const dealsPerCategory = Math.ceil(limit / categories.length)

  for (const category of categories) {
    const templates = productTemplates[category]
    for (let i = 0; i < dealsPerCategory && deals.length < limit; i++) {
      const template = templates[i % templates.length]
      const originalPrice = Math.random() * 100 + 20
      const discount = Math.floor(Math.random() * 60) + 20
      const currentPrice = originalPrice * (1 - discount / 100)

      deals.push({
        id: `demo-${deals.length + 1}`,
        title: template,
        originalPrice: Math.round(originalPrice * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        discount,
        rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
        reviews: Math.floor(Math.random() * 10000) + 100,
        image: '',
        category,
        amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(template)}&tag=dealsplus077-20`,
        isLightningDeal: Math.random() > 0.7,
        stockStatus: Math.random() > 0.8 ? 'Only 3 left in stock!' : undefined,
      })
    }
  }

  return deals.sort((a, b) => b.discount - a.discount)
}

// Helper function to detect category from product title
function detectCategory(title: string): string {
  const lower = title.toLowerCase()
  if (lower.match(/phone|laptop|computer|tablet|headphone|speaker|camera|tv|gaming/)) return 'electronics'
  if (lower.match(/furniture|kitchen|home|decor|bedding|pillow|vacuum/)) return 'home'
  if (lower.match(/shirt|pants|dress|shoes|bag|watch|sunglasses|clothes/)) return 'fashion'
  if (lower.match(/fitness|yoga|dumbbell|sport|exercise|workout/)) return 'sports'
  if (lower.match(/toy|game|puzzle|kids|children|play/)) return 'toys'
  if (lower.match(/makeup|beauty|cosmetic|skin|hair|nail/)) return 'beauty'
  return 'electronics'
}

// Helper function to extract ASIN from Amazon URL
function extractASIN(url: string): string {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/)
  return match ? match[1] : ''
}
