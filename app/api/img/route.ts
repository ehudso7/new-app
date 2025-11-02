import { NextRequest, NextResponse } from 'next/server'

import { AMAZON_IMAGE_HOSTS } from '@/utils/amazonImages'

const ALLOWED_HOSTS = new Set(AMAZON_IMAGE_HOSTS)

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get('src')
  if (!src) return NextResponse.json({ error: 'missing src' }, { status: 400 })

  let url: URL
  try {
    url = new URL(src)
  } catch {
    return NextResponse.json({ error: 'bad url' }, { status: 400 })
  }

  if (!ALLOWED_HOSTS.has(url.hostname)) {
    return NextResponse.json({ error: 'host not allowed' }, { status: 403 })
  }

  const upstream = await fetch(url.toString(), {
    redirect: 'follow',
    headers: {
      'user-agent':
        'Mozilla/5.0 (compatible; DealPlusBot/1.0; +https://dealplus.example)',
      accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.9',
    },
  })

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: `upstream ${upstream.status}` },
      { status: 502 },
    )
  }

  const headers = new Headers()
  headers.set('Content-Type', upstream.headers.get('content-type') ?? 'image/jpeg')
  headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  headers.set('CDN-Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  headers.set('Vercel-CDN-Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  headers.set('X-DealPlus-Img-Source', url.hostname)

  return new NextResponse(upstream.body, { status: 200, headers })
}
