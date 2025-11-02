import { NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Analytics tracking endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event, dealId, category, price } = body

    // Log the event (in production, send to Google Analytics, Mixpanel, etc.)
    console.log('Analytics Event:', {
      event,
      dealId,
      category,
      price,
      timestamp: new Date().toISOString(),
    })

    // You can integrate with:
    // - Google Analytics 4
    // - Mixpanel
    // - Segment
    // - PostHog
    // - Custom database

    // Example: Google Analytics 4 (if you have NEXT_PUBLIC_GA_ID)
    const gaId = process.env.NEXT_PUBLIC_GA_ID
    if (gaId && typeof window !== 'undefined') {
      // Client-side GA tracking happens in the component
      // Server-side tracking can use Measurement Protocol
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
