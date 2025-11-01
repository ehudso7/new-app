'use client'

import { useEffect, useState } from 'react'

interface SystemStatus {
  success: boolean
  hasRapidApiKey: boolean
  hasCronSecret: boolean
  hasMailchimpKey: boolean
  hasResendKey: boolean
  hasAmazonTag: boolean
  siteUrl: string | null
}

export default function AutomationSettings() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadStatus() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/admin/system/status')
        if (!res.ok) throw new Error('Unable to retrieve system status.')
        const body = await res.json()
        if (active) setStatus(body)
      } catch (err: any) {
        console.error(err)
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadStatus()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">⚙️ Automation checklist</h2>
        <p className="text-sm text-gray-600">
          Review the configuration signals below to ensure cron jobs, API integrations, and transactional emails are pointing to real services.
        </p>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow-md p-6 text-sm text-gray-500">Fetching environment status…</div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 text-sm">{error}</div>
      )}

      {status && !loading && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <EnvStatusRow
            label="RapidAPI key"
            description="Needed to fetch live Amazon product data"
            ok={status.hasRapidApiKey}
            remediation="Set RAPIDAPI_KEY in your environment or rely on the curated fallback catalog."
          />
          <EnvStatusRow
            label="Cron secret"
            description="Required for secure calls to /api/deals/refresh"
            ok={status.hasCronSecret}
            remediation="Set CRON_SECRET and update any Vercel Cron jobs or serverless schedules."
          />
          <EnvStatusRow
            label="Amazon Associates tag"
            description="Used to attribute affiliate revenue"
            ok={status.hasAmazonTag}
            remediation="Set NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG. Amazon may reject traffic without it."
          />
          <EnvStatusRow
            label="Mailchimp credentials"
            description="Required for syncing newsletter subscribers"
            ok={status.hasMailchimpKey}
            remediation="Provide MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID to enable email automation."
          />
          <EnvStatusRow
            label="Resend API key"
            description="Controls transactional emails from the contact form"
            ok={status.hasResendKey}
            remediation="Set RESEND_API_KEY to forward contact submissions to your inbox."
          />
          <EnvStatusRow
            label="Public site URL"
            description="Used when server-side jobs call internal endpoints"
            ok={Boolean(status.siteUrl)}
            remediation="Set NEXT_PUBLIC_SITE_URL (e.g. https://dealpulse.com) so cron refreshes hit production."
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">🗓️ Suggested automation cadence</h3>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
          <li>Deals refresh: every 30 minutes via Vercel Cron hitting <code className="bg-gray-100 px-1 py-0.5 rounded">/api/admin/deals/refresh</code>.</li>
          <li>Email digest: daily at 09:00 local time once Mailchimp is configured.</li>
          <li>Social scheduling: queue top 5 discounts each morning using the Social Media toolkit.</li>
          <li>Content review: publish at least one roundup per category each week based on SEO recommendations.</li>
        </ul>
      </div>
    </div>
  )
}

function EnvStatusRow({ label, description, ok, remediation }: { label: string; description: string; ok: boolean; remediation: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-100 rounded-lg p-4">
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex flex-col items-start md:items-end gap-2">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
          {ok ? 'Configured' : 'Missing'}
        </span>
        {!ok && <p className="text-xs text-gray-600 max-w-sm text-left md:text-right">{remediation}</p>}
      </div>
    </div>
  )
}
