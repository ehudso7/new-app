import { NextResponse } from 'next/server'
import { getDeals, curatedDeals, DealRecord } from '@/utils/dealSources'

interface CategorySummary {
  category: string
  count: number
  averageDiscount: number
  averagePrice: number
  highestDiscount: number
}

export async function GET() {
  try {
    const limit = 100
    const deals = await getDeals('all', limit)

    const allDeals = deals.length ? deals : curatedDeals(process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'dealsplus077-20')

    const categories = buildCategorySummaries(allDeals)

    const savingsTotals = allDeals.reduce(
      (acc, deal) => {
        const savings = deal.originalPrice - deal.currentPrice
        return {
          savings: acc.savings + (savings > 0 ? savings : 0),
          discount: acc.discount + deal.discount,
        }
      },
      { savings: 0, discount: 0 }
    )

    const averageDiscount = allDeals.length ? savingsTotals.discount / allDeals.length : 0

    const lightningDeals = allDeals.filter((deal) => deal.isLightningDeal)

    const maxDiscountDeal = allDeals.reduce((best: DealRecord | null, current) => {
      if (!best) return current
      return current.discount > best.discount ? current : best
    }, null)

    const lowestPriceDeal = allDeals.reduce((lowest: DealRecord | null, current) => {
      if (!lowest) return current
      return current.currentPrice < lowest.currentPrice ? current : lowest
    }, null)

    return NextResponse.json({
      success: true,
      updatedAt: new Date().toISOString(),
      totalDeals: allDeals.length,
      averageDiscount: Number(averageDiscount.toFixed(2)),
      estimatedTotalSavings: Number(savingsTotals.savings.toFixed(2)),
      lightningDealCount: lightningDeals.length,
      categories,
      highlight: {
        bestDiscount: maxDiscountDeal,
        lowestPrice: lowestPriceDeal,
      },
      dataSource: process.env.RAPIDAPI_KEY ? 'rapidapi' : 'curated',
    })
  } catch (error: any) {
    console.error('Admin overview error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

function buildCategorySummaries(deals: DealRecord[]): CategorySummary[] {
  const groups = deals.reduce<Record<string, DealRecord[]>>((acc, deal) => {
    acc[deal.category] = acc[deal.category] || []
    acc[deal.category].push(deal)
    return acc
  }, {})

  return Object.entries(groups).map(([category, items]) => {
    const totalDiscount = items.reduce((acc, item) => acc + item.discount, 0)
    const totalPrice = items.reduce((acc, item) => acc + item.currentPrice, 0)
    const highestDiscount = Math.max(...items.map((item) => item.discount))

    return {
      category,
      count: items.length,
      averageDiscount: Number((totalDiscount / items.length).toFixed(2)),
      averagePrice: Number((totalPrice / items.length).toFixed(2)),
      highestDiscount,
    }
  }).sort((a, b) => b.count - a.count)
}
