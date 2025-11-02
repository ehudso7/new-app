export function safeImageUrl(u?: string): string | null {
  if (!u) return null;
  try {
    const parsed = new URL(u);
    if (!/amazon\.com$|m\.media-amazon\.com$|ssl-images-amazon\.com$/.test(parsed.hostname)) {
      return null;
    }
    return `/api/img?src=${encodeURIComponent(parsed.toString())}`;
  } catch { return null; }
}
