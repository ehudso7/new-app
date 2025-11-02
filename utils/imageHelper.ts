/**
 * Safely validates and converts an Amazon image URL to use our proxy
 * Returns null if the URL is invalid or not from an allowed Amazon domain
 */
export function safeImageUrl(u?: string): string | null {
  if (!u) return null;
  try {
    const parsed = new URL(u);
    if (!/amazon\.com$|m\.media-amazon\.com$|ssl-images-amazon\.com$/.test(parsed.hostname)) {
      return null;
    }
    return `/api/img?src=${encodeURIComponent(parsed.toString())}`;
  } catch { 
    return null; 
  }
}

/**
 * Audits a list of products for missing images (dev/logging helper)
 */
export function auditImages(products: { asin?: string; title: string; image?: string }[]) {
  const bad = products.filter(p => !p.image);
  if (bad.length) {
    console.warn(`[images] missing for ${bad.length} items:`, bad.slice(0, 10).map(b => `${b.asin || 'no-asin'} ${b.title}`));
  }
}
