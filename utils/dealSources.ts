export interface DealRecord {
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
  asin?: string
  isLightningDeal?: boolean
  stockStatus?: string
}

export async function getDeals(category: string, limit: number) {
  const rapidApiKey = process.env.RAPIDAPI_KEY
  const partnerTag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'dealsplus077-20'

  if (rapidApiKey) {
    try {
      const items = await fetchFromRapidAPI(category, limit, rapidApiKey, partnerTag)

      if (items.length) {
        return items
      }
    } catch (error) {
      console.error('RapidAPI error, falling back to curated deals:', error)
    }
  }

  return getCuratedRealDeals(category, limit, partnerTag)
}

async function fetchFromRapidAPI(category: string, limit: number, apiKey: string, tag: string) {
  const searchTerm = category === 'all' ? 'best amazon deals' : category

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

  const products: DealRecord[] = (data.data?.products || []).map((item: any) => {
    const price = parseFloat(item.product_price?.replace(/[^0-9.]/g, '') || '0')
    const originalPrice = parseFloat(item.product_original_price?.replace(/[^0-9.]/g, '') || (price > 0 ? (price * 1.35).toFixed(2) : '0'))
    const appliedOriginalPrice = originalPrice > 0 ? originalPrice : price
    const discount = appliedOriginalPrice > 0 && price > 0
      ? Math.round(((appliedOriginalPrice - price) / appliedOriginalPrice) * 100)
      : 0

    return {
      id: item.asin || `deal-${Date.now()}-${Math.random()}`,
      title: item.product_title || 'Amazon Product',
      originalPrice: appliedOriginalPrice,
      currentPrice: price,
      discount: discount,
      rating: parseFloat(item.product_star_rating || '4.5'),
      reviews: parseInt(item.product_num_ratings || '100'),
      image: item.product_photo || '',
      category: detectCategory(item.product_title),
      amazonUrl: item.asin ? `https://www.amazon.com/dp/${item.asin}?tag=${tag}` : item.product_url,
      asin: item.asin,
      isLightningDeal: discount >= 50,
      stockStatus: item.is_prime ? 'Prime Eligible' : undefined,
    } as DealRecord
  }).filter((deal: DealRecord) => deal.image && deal.currentPrice > 0)

  const filtered = products
    .filter((deal) => deal.discount >= 10)
    .slice(0, limit)

  return filtered
}

export function getCuratedRealDeals(category: string, limit: number, tag: string) {
  const allDeals: DealRecord[] = curatedDeals(tag)

  const filtered = category === 'all'
    ? allDeals
    : allDeals.filter((deal) => deal.category === category)

  return filtered.slice(0, limit)
}

export function curatedDeals(tag: string) {
  const deals: DealRecord[] = [
    {
      id: 'B0BN3K4C7K',
      title: 'Apple AirPods Pro (2nd Generation) with USB-C Charging Case',
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
      title: 'Amazon Fire TV Stick 4K streaming device with Wi-Fi 6 support (2023 release)',
      originalPrice: 49.99,
      currentPrice: 29.99,
      discount: 40,
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
      title: 'Anker 325 Power Bank (PowerCore 20K) Portable Charger',
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
      title: 'Samsung Galaxy Buds2 Pro True Wireless Bluetooth Earbuds',
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
      title: 'LEVOIT Core 300 Air Purifier for Home Allergies Pets Hair Smoker',
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
    {
      id: 'B0B7HS3D1H',
      title: 'Ninja DZ201 Foodi 6-in-1 2-Basket Air Fryer with DualZone Technology',
      originalPrice: 199.99,
      currentPrice: 149.99,
      discount: 25,
      rating: 4.8,
      reviews: 19754,
      image: 'https://m.media-amazon.com/images/I/71kkd7I68mL._AC_SL1500_.jpg',
      category: 'home',
      amazonUrl: `https://www.amazon.com/dp/B0B7HS3D1H?tag=${tag}`,
      asin: 'B0B7HS3D1H',
      isLightningDeal: false,
    },
    {
      id: 'B07P1SFML6',
      title: 'Carhartt Men\'s Knit Cuffed Beanie',
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
      title: 'adidas Women\'s Cloudfoam Pure 2.0 Running Shoe',
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
    {
      id: 'B09G6N2N4B',
      title: 'Levi\'s Women\'s Classic Straight Jeans',
      originalPrice: 69.50,
      currentPrice: 39.99,
      discount: 42,
      rating: 4.5,
      reviews: 11045,
      image: 'https://m.media-amazon.com/images/I/81H3gZYbn-L._AC_SL1500_.jpg',
      category: 'fashion',
      amazonUrl: `https://www.amazon.com/dp/B09G6N2N4B?tag=${tag}`,
      asin: 'B09G6N2N4B',
      isLightningDeal: false,
    },
    {
      id: 'B01AVDVHTI',
      title: 'Amazon Basics 1/2-Inch Extra Thick Exercise Yoga Mat',
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
      title: 'Fitbit Charge 5 Advanced Fitness & Health Tracker with Built-in GPS',
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
    {
      id: 'B0BQLKJT4N',
      title: 'Hydro Flask Stainless Steel Standard Mouth Water Bottle with Flex Cap',
      originalPrice: 37.95,
      currentPrice: 29.95,
      discount: 21,
      rating: 4.8,
      reviews: 21543,
      image: 'https://m.media-amazon.com/images/I/51jvZ3GJyDL._AC_SL1500_.jpg',
      category: 'sports',
      amazonUrl: `https://www.amazon.com/dp/B0BQLKJT4N?tag=${tag}`,
      asin: 'B0BQLKJT4N',
      isLightningDeal: false,
    },
    {
      id: 'B08XWKG6V8',
      title: 'LEGO Star Wars The Mandalorian The Child Building Kit (1,073 Pieces)',
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
    {
      id: 'B0BDJ6MQ5Z',
      title: 'Osmo - Little Genius Starter Kit for iPad',
      originalPrice: 99.99,
      currentPrice: 69.99,
      discount: 30,
      rating: 4.7,
      reviews: 9456,
      image: 'https://m.media-amazon.com/images/I/81xiZSn48lL._AC_SL1500_.jpg',
      category: 'toys',
      amazonUrl: `https://www.amazon.com/dp/B0BDJ6MQ5Z?tag=${tag}`,
      asin: 'B0BDJ6MQ5Z',
      isLightningDeal: false,
    },
    {
      id: 'B0C1GJQKNC',
      title: 'CeraVe Moisturizing Cream for Body and Face with Hyaluronic Acid',
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
    {
      id: 'B0B43F2FHN',
      title: 'COSRX Snail Mucin 96% Power Repairing Essence',
      originalPrice: 25.00,
      currentPrice: 16.00,
      discount: 36,
      rating: 4.6,
      reviews: 34215,
      image: 'https://m.media-amazon.com/images/I/61VzKpIgfLL._SL1500_.jpg',
      category: 'beauty',
      amazonUrl: `https://www.amazon.com/dp/B0B43F2FHN?tag=${tag}`,
      asin: 'B0B43F2FHN',
      isLightningDeal: false,
    },
    {
      id: 'B0BHZP6W6Z',
      title: 'Revlon One-Step Volumizer PLUS 2.0 Hair Dryer and Hot Air Brush',
      originalPrice: 69.99,
      currentPrice: 44.99,
      discount: 36,
      rating: 4.6,
      reviews: 116543,
      image: 'https://m.media-amazon.com/images/I/81o5f7PkmXL._SL1500_.jpg',
      category: 'beauty',
      amazonUrl: `https://www.amazon.com/dp/B0BHZP6W6Z?tag=${tag}`,
      asin: 'B0BHZP6W6Z',
      isLightningDeal: false,
    },
    {
      id: 'B089KV4YYX',
      title: 'Ring Video Doorbell Wired bundle with Echo Pop',
      originalPrice: 99.98,
      currentPrice: 64.99,
      discount: 35,
      rating: 4.6,
      reviews: 28543,
      image: 'https://m.media-amazon.com/images/I/61x0z9NJ5wL._AC_SL1500_.jpg',
      category: 'electronics',
      amazonUrl: `https://www.amazon.com/dp/B089KV4YYX?tag=${tag}`,
      asin: 'B089KV4YYX',
      isLightningDeal: false,
    },
    {
      id: 'B0BQL86H96',
      title: 'Kindle Paperwhite (16 GB) – Now with adjustable warm light',
      originalPrice: 159.99,
      currentPrice: 129.99,
      discount: 19,
      rating: 4.7,
      reviews: 221345,
      image: 'https://m.media-amazon.com/images/I/61kDPbyqhML._AC_SL1000_.jpg',
      category: 'electronics',
      amazonUrl: `https://www.amazon.com/dp/B0BQL86H96?tag=${tag}`,
      asin: 'B0BQL86H96',
      isLightningDeal: false,
    },
    {
      id: 'B0BPYZ6GVG',
      title: 'Instant Pot Duo Crisp 11-in-1 Electric Pressure Cooker with Air Fryer',
      originalPrice: 199.99,
      currentPrice: 129.95,
      discount: 35,
      rating: 4.7,
      reviews: 34578,
      image: 'https://m.media-amazon.com/images/I/81GLchy4bkL._AC_SL1500_.jpg',
      category: 'home',
      amazonUrl: `https://www.amazon.com/dp/B0BPYZ6GVG?tag=${tag}`,
      asin: 'B0BPYZ6GVG',
      isLightningDeal: false,
    },
    {
      id: 'B07WVFC5YH',
      title: 'Furinno Turn-N-Tube 5 Tier Corner Display Rack',
      originalPrice: 56.99,
      currentPrice: 35.99,
      discount: 37,
      rating: 4.5,
      reviews: 25780,
      image: 'https://m.media-amazon.com/images/I/81P4P9gK1+L._AC_SL1500_.jpg',
      category: 'home',
      amazonUrl: `https://www.amazon.com/dp/B07WVFC5YH?tag=${tag}`,
      asin: 'B07WVFC5YH',
      isLightningDeal: false,
    },
    {
      id: 'B085M64XC3',
      title: 'Logitech G502 HERO High Performance Wired Gaming Mouse',
      originalPrice: 79.99,
      currentPrice: 49.99,
      discount: 38,
      rating: 4.8,
      reviews: 57345,
      image: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg',
      category: 'electronics',
      amazonUrl: `https://www.amazon.com/dp/B085M64XC3?tag=${tag}`,
      asin: 'B085M64XC3',
      isLightningDeal: false,
    },
  ]

  return deals
}

export function detectCategory(title: string): string {
  const lower = title.toLowerCase()
  if (lower.match(/phone|laptop|computer|tablet|headphone|earbud|speaker|camera|tv|gaming|watch|kindle|ring/)) return 'electronics'
  if (lower.match(/furniture|kitchen|home|decor|bedding|pillow|vacuum|cleaner|purifier|coffee|instant pot|air fryer|rack/)) return 'home'
  if (lower.match(/shirt|pants|dress|shoes|bag|hat|sunglasses|clothes|sneaker|beanie|jeans/)) return 'fashion'
  if (lower.match(/fitness|yoga|dumbbell|sport|exercise|workout|mat|tracker|water bottle/)) return 'sports'
  if (lower.match(/toy|game|puzzle|kids|children|play|lego|building|osmo/)) return 'toys'
  if (lower.match(/makeup|beauty|cosmetic|skin|hair|nail|cream|serum|dryer/)) return 'beauty'
  return 'electronics'
}

