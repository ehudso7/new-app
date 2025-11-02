import { NextRequest, NextResponse } from 'next/server'

const AFF_TAG =
  process.env.AMAZON_ASSOC_TAG ||
  process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ||
  'dealsplus077-20'

const isASIN = (value: string) => /^[A-Z0-9]{10}$/.test(value)

export async function GET(
  _req: NextRequest,
  { params }: { params: { asin: string } }
) {
  let asin = (params.asin || '').toUpperCase()

  if (!isASIN(asin)) {
    return NextResponse.redirect('https://www.amazon.com/', 302)
  }

  try {
    const isReachable = await verifyAsinIsReachable(asin)
    if (!isReachable) {
      const fallback = await findParentOrSiblingAsin(asin)
      if (fallback && isASIN(fallback)) {
        asin = fallback
      }
    }
  } catch (error) {
    console.error('ASIN verification failed:', error)
    // Fail open to preserve user experience if verification pipeline is unavailable
  }

  const url = new URL(`https://www.amazon.com/dp/${asin}`)
  url.searchParams.set('tag', AFF_TAG)
  url.searchParams.set('linkCode', 'ogi')
  url.searchParams.set('language', 'en_US')
  url.searchParams.set('th', '1')
  url.searchParams.set('psc', '1')

  return NextResponse.redirect(url.toString(), 302)
}

// ---- stub implementations to be replaced with real PA-API / Keepa checks
async function verifyAsinIsReachable(_asin: string): Promise<boolean> {
  return true
}

async function findParentOrSiblingAsin(_asin: string): Promise<string | null> {
  return null
}
