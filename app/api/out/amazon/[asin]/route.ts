import { NextRequest, NextResponse } from "next/server";

const AFF_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || "dealsplus077-20";

const isASIN = (s: string) => /^[A-Z0-9]{10}$/.test(s);

export async function GET(
  req: NextRequest,
  { params }: { params: { asin: string } }
) {
  let asin = (params.asin || "").toUpperCase();

  if (!isASIN(asin)) {
    // Invalid ASIN, redirect to Amazon homepage
    return NextResponse.redirect("https://www.amazon.com/", 302);
  }

  // OPTIONAL: verify ASIN is live; fallback to a parent/related ASIN if needed.
  // For now, we'll proceed with the ASIN as-is (fail-open for UX)
  // TODO: Add PA-API or Keepa verification here when available
  try {
    const ok = await verifyAsinIsReachable(asin);
    if (!ok) {
      const parent = await findParentOrSiblingAsin(asin);
      if (parent && isASIN(parent)) asin = parent;
    }
  } catch {
    // On verification failure, proceed with original asin (fail-open for UX)
  }

  // Build canonical Amazon URL with affiliate tag and proper parameters
  const url = new URL(`https://www.amazon.com/dp/${asin}`);
  url.searchParams.set("tag", AFF_TAG);
  url.searchParams.set("linkCode", "ogi");
  url.searchParams.set("language", "en_US");
  url.searchParams.set("th", "1");
  url.searchParams.set("psc", "1");

  return NextResponse.redirect(url.toString(), 302);
}

// ---- Stub implementations - replace with real PA-API/Keepa checks when available
async function verifyAsinIsReachable(_: string): Promise<boolean> {
  // TODO: Implement actual verification using PA-API or Keepa
  // For now, assume all ASINs are reachable
  return true;
}

async function findParentOrSiblingAsin(_: string): Promise<string | null> {
  // TODO: Implement parent/sibling ASIN lookup using PA-API or Keepa
  return null;
}
