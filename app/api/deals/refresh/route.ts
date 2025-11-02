import { NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// This endpoint is called by cron jobs or manually from admin to refresh deals
// Vercel Cron: https://vercel.com/docs/cron-jobs

export async function POST(request: Request) {
  try {
    // Verify request is from authorized source (cron or admin)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-here'

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting automated deal refresh...')

    // Fetch fresh deals from all categories
    const categories = ['electronics', 'home', 'fashion', 'sports', 'toys', 'beauty']
    const allDeals = []

    for (const category of categories) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/deals?category=${category}&limit=10`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        allDeals.push(...data.deals)
      }
    }

    console.log(`Fetched ${allDeals.length} deals across ${categories.length} categories`)

    // In a production app, you'd save these to a database (Vercel KV, Postgres, etc.)
    // For now, we'll just return them
    // Example with Vercel KV:
    // await kv.set('deals:latest', JSON.stringify(allDeals))
    // await kv.expire('deals:latest', 1800) // Expire after 30 minutes

    return NextResponse.json({
      success: true,
      message: 'Deals refreshed successfully',
      count: allDeals.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Deal refresh error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET endpoint to check when deals were last refreshed
export async function GET() {
  return NextResponse.json({
    message: 'Deal refresh endpoint',
    usage: 'POST with Authorization header to refresh deals',
    cronSchedule: '*/30 * * * *', // Every 30 minutes
  })
}
