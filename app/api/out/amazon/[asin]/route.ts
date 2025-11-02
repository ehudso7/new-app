import { NextRequest, NextResponse } from "next/server";

const AFF_TAG = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? "dealsplus077-20";

const isASIN = (s: string) => /^[A-Z0-9]{10}$/.test(s);

export async function GET(
  req: NextRequest,
  { params }: { params: { asin: string } }
) {
  let asin = (params.asin || "").toUpperCase().trim();

  // Validate ASIN format
  if (!isASIN(asin)) {
    // If invalid ASIN, redirect to Amazon homepage as fallback
    return NextResponse.redirect("https://www.amazon.com/", 302);
  }

  // OPTIONAL: verify ASIN is live; fallback to a parent/related ASIN if needed.
  // Example: call your server util that wraps PA-API / Keepa
  try {
    const ok = await verifyAsinIsReachable(asin); // return boolean
    if (!ok) {
      const parent = await findParentOrSiblingAsin(asin); // return ASIN or null
      if (parent && isASIN(parent)) {
        asin = parent;
      }
    }
  } catch (error) {
    // On verification failure, proceed with original asin (fail-open for UX)
    console.error(`ASIN verification error for ${asin}:`, error);
  }

  // Build canonical Amazon URL with proper parameters
  const url = new URL(`https://www.amazon.com/dp/${asin}`);
  url.searchParams.set("tag", AFF_TAG);
  url.searchParams.set("linkCode", "ogi");
  url.searchParams.set("language", "en_US");
  url.searchParams.set("th", "1");
  url.searchParams.set("psc", "1");

  return NextResponse.redirect(url.toString(), 302);
}

// ---- stub implementations you should replace with your real PA-API/Keepa checks
async function verifyAsinIsReachable(_asin: string): Promise<boolean> {
  // TODO: Implement actual verification using PA-API or Keepa
  // For now, return true to proceed with redirect (fail-open)
  return true;
}

async function findParentOrSiblingAsin(_asin: string): Promise<string | null> {
  // TODO: Implement parent ASIN lookup using PA-API VariationSummary or Keepa
  // This helps when a variant-specific ASIN is unavailable but the parent exists
  return null;
}