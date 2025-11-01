'use client'

import { useMemo } from 'react'

const MAILCHIMP_DOCS = 'https://mailchimp.com/help/about-api-keys/'
const SENDGRID_DOCS = 'https://docs.sendgrid.com/api-reference/'

export default function EmailManager() {
  const hasMailchimpKeys = useMemo(() => {
    return Boolean(process.env.NEXT_PUBLIC_MAILCHIMP_STATUS === 'connected')
  }, [])

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-800">📧 Email workflow</h2>
        <p className="text-sm text-gray-600">
          DealPulse does not ship with a mailing list, but the API already exposes a <code className="bg-gray-100 px-1 rounded">POST /api/subscribe</code> endpoint. Use the steps below to connect Mailchimp (recommended) or another ESP so real subscribers receive your verified deal digest.
        </p>
        <ul className="list-decimal pl-6 space-y-2 text-sm text-gray-600">
          <li>Add <code className="bg-gray-100 px-1 rounded">MAILCHIMP_API_KEY</code> and <code className="bg-gray-100 px-1 rounded">MAILCHIMP_AUDIENCE_ID</code> to your environment variables.</li>
          <li>Set <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_MAILCHIMP_STATUS=connected</code> once your keys are present so this dashboard reflects the integration.</li>
          <li>Optional: Replace Mailchimp with SendGrid, ConvertKit, or AWS SES by editing <code className="bg-gray-100 px-1 rounded">app/api/subscribe/route.ts</code>.</li>
        </ul>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">🔌 Integrations</h3>
        <IntegrationRow
          name="Mailchimp"
          status={hasMailchimpKeys ? 'Connected' : 'Not configured'}
          docs={MAILCHIMP_DOCS}
          notes="Supports tagged lists, automations, and daily digests. Free tier covers up to 500 contacts."
        />
        <IntegrationRow
          name="SendGrid"
          status="Optional"
          docs={SENDGRID_DOCS}
          notes="Use for transactional deal alerts if you need higher throughput or detailed event webhooks."
        />
        <IntegrationRow
          name="CSV Export"
          status="Manual"
          notes="Call GET /api/deals and push the result into your email builder (Beehiiv, Substack, etc.)."
        />
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">📝 Recommended campaign cadence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
          <CadenceCard
            title="Daily digest"
            when="Send at 8:00 AM ET"
            content="Top 10 discounts + 3 lightning deals."
          />
          <CadenceCard
            title="Weekend roundup"
            when="Saturday 9:00 AM ET"
            content="Highlight fresh electronics and home drops verified in the last 48 hours."
          />
          <CadenceCard
            title="Flash alert"
            when="Triggered manually"
            content="Use for any lightning deal above 40% off. Link directly to the product page."
          />
          <CadenceCard
            title="Monthly best sellers"
            when="First business day"
            content="Share most-clicked items + total savings figures from analytics dashboard."
          />
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">📤 Manual send helper</h3>
        <p className="text-sm text-gray-600">
          Until you connect an ESP, copy the JSON payload below into your tool of choice. It is generated from live API data—run this script locally or via a scheduled workflow.
        </p>
        <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg overflow-x-auto">
curl -s https://your-domain.com/api/deals?category=all&amp;limit=12 | jq '[.deals[] | {title, discount, currentPrice, amazonUrl}]'</pre>
      </section>
    </div>
  )
}

function IntegrationRow({ name, status, notes, docs }: { name: string; status: string; notes: string; docs?: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-gray-50 rounded-lg">
      <div>
        <div className="font-semibold text-gray-800">{name}</div>
        <p className="text-sm text-gray-600">{notes}</p>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-medium">{status}</span>
        {docs ? (
          <a href={docs} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
            View docs ↗
          </a>
        ) : null}
      </div>
    </div>
  )
}

function CadenceCard({ title, when, content }: { title: string; when: string; content: string }) {
  return (
    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
      <div className="font-semibold text-gray-800">{title}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wide">{when}</div>
      <p className="text-sm text-gray-600 mt-1">{content}</p>
    </div>
  )
}
