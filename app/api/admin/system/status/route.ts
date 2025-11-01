import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      hasRapidApiKey: Boolean(process.env.RAPIDAPI_KEY),
      hasCronSecret: Boolean(process.env.CRON_SECRET),
      hasMailchimpKey: Boolean(process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID),
      hasResendKey: Boolean(process.env.RESEND_API_KEY),
      hasAmazonTag: Boolean(process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG),
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
    })
  } catch (error: any) {
    console.error('System status error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
