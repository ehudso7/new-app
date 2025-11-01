'use client'

import Link from 'next/link'

const checklist = [
  {
    title: 'Prepare one-click share links',
    body: 'Use the Share button on deal cards (already implemented) and add UTM parameters in /components/DealCard.tsx if you want analytics by channel.',
  },
  {
    title: 'Automate with Zapier or Make',
    body: 'Trigger a workflow when you publish a new deal (e.g. Supabase insert, Git push, or manual button) and post to X, Facebook, Pinterest, or Reddit using their official connectors.',
  },
  {
    title: 'Respect platform policies',
    body: 'Always include your Amazon affiliate tag in outbound links. Some communities (e.g. Reddit) forbid direct affiliate links, so use a short landing page instead.',
  },
]

export default function SocialMediaAgent() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">📣 Social distribution playbook</h2>
        <p className="text-sm text-gray-600">
          DealPulse does not auto-post to social platforms out of the box. Instead, use the guidance below to wire the live deals API into the channels that matter most for your brand.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
          {checklist.map((item) => (
            <li key={item.title}>
              <span className="font-semibold text-gray-800">{item.title}:</span> {item.body}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">🔗 API endpoints to post</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
          <ApiCard
            title="Fetch top discounts"
            method="GET"
            endpoint="/api/deals?category=all&limit=10"
            note="Use in Zapier or a scheduled script to pull the latest curated deals."
          />
          <ApiCard
            title="Fetch category deals"
            method="GET"
            endpoint="/api/deals?category=electronics&limit=6"
            note="Create channel-specific posts (tech, fashion, home, etc.)."
          />
        </div>
        <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg overflow-x-auto">
curl -s https://your-domain.com/api/deals?category=electronics&amp;limit=3 | jq '.deals[] | "📦 " + .title + " — " + (.discount|tostring) + "% off → " + .amazonUrl'</pre>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">📑 Caption templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
          <CaptionCard
            title="Lightning deal"
            caption={`⚡ {{title}}
{{discount}}% OFF until {{expiresAt}}
👉 {{amazonUrl}}`}
          />
          <CaptionCard
            title="Evergreen discount"
            caption={`🔥 {{title}}
Now ${{currentPrice}} (was ${{originalPrice}})
⭐️ {{rating}} stars from {{reviews}} shoppers
🔗 {{amazonUrl}}`}
          />
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">🛠️ Recommended tooling</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
          <li>
            <Link href="https://zapier.com/apps/webhooks/integrations/twitter" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Zapier Webhooks → Twitter/X
            </Link>{' '}for automatically tweeting the daily top 3 discounts.
          </li>
          <li>
            <Link href="https://developers.facebook.com/docs/graph-api/overview" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Meta Graph API
            </Link>{' '}to schedule Facebook Page and Instagram posts from the same payload.
          </li>
          <li>
            <Link href="https://www.pabbly.com/connect/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Pabbly Connect
            </Link>{' '}or{' '}
            <Link href="https://www.make.com/en" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Make.com
            </Link>{' '}for low-cost multi-channel automation.
          </li>
        </ul>
      </section>
    </div>
  )
}

function ApiCard({ title, method, endpoint, note }: { title: string; method: string; endpoint: string; note: string }) {
  return (
    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
      <div className="text-sm text-gray-500 uppercase tracking-wide">{method}</div>
      <div className="font-semibold text-gray-800">{title}</div>
      <code className="block text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded mt-1">{endpoint}</code>
      <p className="text-xs text-gray-500 mt-2">{note}</p>
    </div>
  )
}

function CaptionCard({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
      <div className="font-semibold text-gray-800 mb-1">{title}</div>
      <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">{caption}</pre>
    </div>
  )
}
