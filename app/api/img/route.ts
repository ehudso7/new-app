import { NextRequest, NextResponse } from "next/server";

const ALLOWED = [
  "m.media-amazon.com",
  "images-na.ssl-images-amazon.com",
  "images.amazon.com",
];

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src");
  
  if (!src) {
    return NextResponse.json({ error: "missing src" }, { status: 400 });
  }

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return NextResponse.json({ error: "bad url" }, { status: 400 });
  }

  if (!ALLOWED.includes(url.hostname)) {
    return NextResponse.json({ error: "host not allowed" }, { status: 403 });
  }

  try {
    const resp = await fetch(url.toString(), { redirect: "follow" });
    
    if (!resp.ok) {
      return NextResponse.json(
        { error: `upstream ${resp.status}` },
        { status: 502 }
      );
    }

    const headers = new Headers();
    
    // Copy content-type from upstream
    const contentType = resp.headers.get("content-type");
    if (contentType) {
      headers.set("Content-Type", contentType);
    }
    
    // Set cache control (24h max per Amazon Associates policy)
    headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    
    // Remove any cookies
    headers.delete("set-cookie");

    return new NextResponse(resp.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      { error: "failed to fetch image" },
      { status: 502 }
    );
  }
}
