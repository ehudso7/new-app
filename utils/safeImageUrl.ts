const ALLOWED_IMAGE_HOSTS = new Set([
  'm.media-amazon.com',
  'images-na.ssl-images-amazon.com',
  'images.amazon.com',
])

export function safeImageUrl(u?: string): string | null {
  if (!u) return null

  try {
    const parsed = new URL(u)
    if (!ALLOWED_IMAGE_HOSTS.has(parsed.hostname)) {
      return null
    }

    if (parsed.protocol !== 'https:') {
      parsed.protocol = 'https:'
    }

    return `/api/img?src=${encodeURIComponent(parsed.toString())}`
  } catch {
    return null
  }
}
