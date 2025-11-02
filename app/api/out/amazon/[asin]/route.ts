import { NextRequest, NextResponse } from "next/server";

const AFF_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || "dealsplus077-20";

const isASIN = (s: string) => /^[A-Z0-9]{10}$/.test(s);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ asin: string }> }
) {
  const { asin: asinParam } = await params;
  let asin = (asinParam || "").toUpperCase().trim();

  if (!isASIN(asin)) {
    // Invalid ASIN format - redirect to Amazon homepage
    return NextResponse.redirect("https://www.amazon.com/", 302);
  }

  // OPTIONAL: verify ASIN is live; fallback to a parent/related ASIN if needed.
  // Example: call your server util that wraps PA-API / Keepa
  // For now, we'll proceed with the ASIN (fail-open for UX)
  // TODO: Implement verifyAsinIsReachable and findParentOrSiblingAsin when PA-API/Keepa integration is available
  try {
    // Future: const ok = await verifyAsinIsReachable(asin);
    // Future: if (!ok) { const parent = await findParentOrSiblingAsin(asin); if (parent && isASIN(parent)) asin = parent; }
  } catch {
    // On verification failure, proceed with original asin (fail-open for UX)
  }

  // Build canonical Amazon URL with required parameters
  const url = new URL(`https://www.amazon.com/dp/${asin}`);
  url.searchParams.set("tag", AFF_TAG);
  url.searchParams.set("linkCode", "ogi");
  url.searchParams.set("language", "en_US");
  url.searchParams.set("th", "1");
  url.searchParams.set("psc", "1");

  return NextResponse.redirect(url.toString(), 302);
}

// ---- stub implementations - replace with real PA-API/Keepa checks when available
// async function verifyAsinIsReachable(_: string) { return true; }
// async function findParentOrSiblingAsin(_: string) { return null; }
