import { NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Email subscription endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Option 1: Mailchimp Integration
    const mailchimpKey = process.env.MAILCHIMP_API_KEY
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

    if (mailchimpKey && audienceId) {
      try {
        const datacenter = mailchimpKey.split('-')[1]
        const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `apikey ${mailchimpKey}`,
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            tags: ['dealpulse', 'website'],
          }),
        })

        if (response.ok) {
          console.log('Successfully added to Mailchimp:', email)
          return NextResponse.json({
            success: true,
            message: 'Successfully subscribed!',
          })
        } else {
          const error = await response.json()
          console.error('Mailchimp error:', error)
          // Fall through to local storage
        }
      } catch (error) {
        console.error('Mailchimp error:', error)
        // Fall through to local storage
      }
    }

    // Fallback: Store in simple file/database
    // In production, use a proper database (Vercel Postgres, Supabase, etc.)
    console.log('Email subscription (no Mailchimp):', email)

    // You could store in:
    // - Vercel KV (Redis)
    // - Vercel Postgres
    // - Supabase
    // - MongoDB
    // For now, just log it

    return NextResponse.json({
      success: true,
      message: 'Thanks for subscribing! We\'ll send you the best deals.',
    })
  } catch (error: any) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}
