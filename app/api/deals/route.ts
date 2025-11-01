import { NextResponse } from 'next/server'
import { getDeals } from '@/utils/dealSources'

// Real Amazon deals with actual product images
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '24'))

    const deals = await getDeals(category, limit)

    return NextResponse.json({
      success: true,
      count: deals.length,
      deals,
    })
  } catch (error: any) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
