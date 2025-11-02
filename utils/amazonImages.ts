const AMAZON_IMAGE_HOSTS = new Set([
  'm.media-amazon.com',
  'images-na.ssl-images-amazon.com',
  'images.amazon.com',
])

export function normalizeAmazonImageUrl(u?: string | null): string | null {
  if (!u) return null
  const trimmed = u.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'https:') return null
    if (!AMAZON_IMAGE_HOSTS.has(parsed.hostname.toLowerCase())) return null

    return parsed.toString()
  } catch {
    return null
  }
}

export function safeImageUrl(u?: string | null): string | null {
  const normalized = normalizeAmazonImageUrl(u)
  if (!normalized) return null
  return `/api/img?src=${encodeURIComponent(normalized)}`
}

export function isAmazonImageHost(host?: string | null): boolean {
  if (!host) return false
  return AMAZON_IMAGE_HOSTS.has(host.toLowerCase())
}

export { AMAZON_IMAGE_HOSTS }
