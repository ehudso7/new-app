import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    return NextResponse.json({
      success: true,
      configured: false,
      message: 'Mailchimp API credentials are not configured. Add MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID to enable subscriber sync.',
    })
  }

  const datacenter = apiKey.split('-')[1]
  if (!datacenter) {
    return NextResponse.json({
      success: true,
      configured: false,
      message: 'MAILCHIMP_API_KEY is missing the datacenter suffix (e.g. us21).',
    })
  }

  try {
    const response = await fetch(`https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `apikey ${apiKey}`,
      },
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      const detail = errorBody?.detail || 'Unknown error'
      return NextResponse.json({
        success: true,
        configured: false,
        message: `Mailchimp API returned ${response.status}: ${detail}`,
      })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      configured: true,
      listName: data.name,
      memberCount: data.stats?.member_count ?? 0,
      unsubscribeCount: data.stats?.unsubscribe_count ?? 0,
      cleanedCount: data.stats?.cleaned_count ?? 0,
      campaignCount: data.stats?.campaign_count ?? 0,
      lastUpdated: data.date_created,
    })
  } catch (error: any) {
    console.error('Mailchimp stats error:', error)
    return NextResponse.json({
      success: true,
      configured: false,
      message: 'Unable to reach Mailchimp API. Check network connectivity or credentials.',
    })
  }
}
