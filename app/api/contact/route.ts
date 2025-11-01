import { NextResponse } from 'next/server'

const DEFAULT_SUPPORT_EMAIL = 'support@dealpulse.com'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      )
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString()
    const supportEmail = process.env.SUPPORT_INBOX || DEFAULT_SUPPORT_EMAIL

    const payload = {
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
      timestamp,
    }

    console.log('New contact message received', payload)

    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: `DealPulse Contact <onboarding@resend.dev>`,
            to: [supportEmail],
            reply_to: [payload.email],
            subject: `[DealPulse] ${payload.subject}`,
            text: `New contact form submission\n\nName: ${payload.name}\nEmail: ${payload.email}\nSubmitted: ${timestamp}\n\nMessage:\n${payload.message}`,
          }),
        })

        if (!response.ok) {
          const errorBody = await response.text()
          console.error('Resend API error:', errorBody)
          throw new Error('Email provider rejected the request')
        }
      } catch (error) {
        console.error('Failed to forward message via Resend:', error)
        return NextResponse.json(
          {
            success: true,
            message: 'Message logged locally. Email forwarding failed—please verify RESEND configuration.',
          },
          { status: 200 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Thanks for reaching out! Your message has been sent to the support team.',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Message received. Configure RESEND_API_KEY to enable email forwarding.',
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'We were unable to submit your message. Please try again.' },
      { status: 500 }
    )
  }
}
