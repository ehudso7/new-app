'use client'

import Link from 'next/link'

export default function SEOContentAgent() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">📝 Content workflow</h2>
        <p className="text-sm text-gray-600">
          DealPulse ships without auto-generated blog posts. Use this checklist to turn the curated deal data into search-friendly content without resorting to placeholder copy.
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-600">
          <li>Create a `/content` directory (MDX or Markdown) and publish one weekly roundup. Link directly to deals using their affiliate URLs.</li>
          <li>Expose metadata in <code className="bg-gray-100 px-1 rounded">app/sitemap.ts</code> once you have written articles so search engines can discover them.</li>
          <li>Record keyword ideas in <code className="bg-gray-100 px-1 rounded">/ADMIN_GUIDE.md</code> alongside source links proving volume/difficulty.</li>
        </ol>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">🔑 Helpful API queries</h3>
        <p className="text-sm text-gray-600">Use these endpoints to pull real data into long-form content or newsletters.</p>
        <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg overflow-x-auto">
curl -s https://your-domain.com/api/deals?category=beauty&amp;limit=5 | jq '[.deals[] | {title, discount, currentPrice, lastVerified}]'</pre>
        <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg overflow-x-auto">
curl -s https://your-domain.com/api/deals?category=electronics&amp;limit=3 | jq -r '.deals[] | "- " + .title + " — " + (.discount|tostring) + "% off"'</pre>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">✍️ Outline template</h3>
        <p className="text-sm text-gray-600">Copy this outline into your CMS or markdown file to keep articles consistent.</p>
        <pre className="bg-gray-50 text-gray-700 text-xs p-4 rounded-lg whitespace-pre-wrap">
# {{primary keyword}} — Updated {{today}}

## Why this matters now
- Mention market trend or seasonal event.
- Cite at least one external data point.

## Deals worth grabbing today
- {{deal 1 title}} — {{deal 1 discount}}% off ({{deal 1 price}})
- {{deal 2 title}} — {{deal 2 discount}}% off ({{deal 2 price}})
- {{deal 3 title}} — {{deal 3 discount}}% off ({{deal 3 price}})

## Tips before you buy
- Shipping/Prime eligibility insights.
- Price history or review count commentary.

## Frequently asked questions
- Add real questions you gather from support or social media.
</pre>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">🔍 Recommended tooling</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
          <li>
            <Link href="https://serper.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Serper.dev
            </Link>{' '}or{' '}
            <Link href="https://developers.google.com/custom-search/v1/overview" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Google Programmable Search API
            </Link>{' '}for validating current SERP titles.
          </li>
          <li>
            <Link href="https://www.semrush.com/analytics/keywordmagic/start" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Keyword Magic Tool (Semrush)
            </Link>{' '}or{' '}
            <Link href="https://app.neilpatel.com/en/ubersuggest/keyword-ideas" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Ubersuggest
            </Link>{' '}to grab search volume snapshots you can cite.
          </li>
          <li>Use <code className="bg-gray-100 px-1 rounded">npm install @11ty/eleventy</code> or Next.js MDX to create static landing pages optimised for long-tail keywords.</li>
        </ul>
      </section>
    </div>
  )
}
