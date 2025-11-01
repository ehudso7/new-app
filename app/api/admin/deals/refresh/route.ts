import { NextResponse } from 'next/server'

const DEFAULT_ADMIN_PASSWORD = 'dealpulse2025'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const password = body?.password

    const adminPassword = process.env.ADMIN_PANEL_PASSWORD || DEFAULT_ADMIN_PASSWORD
    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const cronSecret = process.env.CRON_SECRET
    if (!cronSecret) {
      return NextResponse.json({
        success: true,
        message: 'Cron secret is not configured. Set CRON_SECRET to enable remote refresh.',
        count: 0,
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/deals/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to refresh deals.' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'Deals refreshed successfully.',
      count: data.count ?? 0,
      timestamp: data.timestamp,
    })
  } catch (error: any) {
    console.error('Admin refresh error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Unexpected error refreshing deals.' },
      { status: 500 }
    )
  }
}
