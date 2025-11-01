'use client'

import { useEffect, useState } from 'react'

interface MailchimpStats {
  success: boolean
  configured: boolean
  message?: string
  listName?: string
  memberCount?: number
  unsubscribeCount?: number
  cleanedCount?: number
  campaignCount?: number
  lastUpdated?: string
}

export default function EmailManager() {
  const [stats, setStats] = useState<MailchimpStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadStats() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/admin/email/stats')
        if (!res.ok) throw new Error('Unable to retrieve Mailchimp status.')
        const body = await res.json()
        if (active) setStats(body)
      } catch (err: any) {
        console.error(err)
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadStats()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">📧 Email list status</h2>
        <p className="text-sm text-gray-600 mb-4">
          Connect Mailchimp (or another ESP) to deliver curated deal alerts. This panel reads live configuration data; no demo values here.
        </p>

        {loading && (
          <p className="text-sm text-gray-500">Checking Mailchimp credentials…</p>
        )}

        {error && (
          <p className="text-sm text-red-600 font-semibold">{error}</p>
        )}

        {stats && !loading && (
          stats.configured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatusCard label="Audience" value={stats.listName || '—'} icon="🗂️" />
              <StatusCard label="Subscribers" value={stats.memberCount?.toLocaleString() ?? '0'} icon="👥" />
              <StatusCard label="Unsubscribed" value={stats.unsubscribeCount?.toLocaleString() ?? '0'} icon="🚪" subtle />
              <StatusCard label="Cleaned" value={stats.cleanedCount?.toLocaleString() ?? '0'} icon="🧹" subtle />
              <StatusCard label="Campaigns sent" value={stats.campaignCount?.toLocaleString() ?? '0'} icon="🗞️" />
              <StatusCard label="List created" value={stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : '—'} icon="📅" />
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4 text-sm">
              {stats.message || 'Mailchimp credentials are missing. Add MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID to .env to enable automated emails.'}
            </div>
          )
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">🔧 Setup checklist</h3>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
          <li>Generate a Mailchimp API key under <em>Account → Extras → API keys</em>.</li>
          <li>Copy your Audience ID from <em>Audience → Settings → Audience name and defaults</em>.</li>
          <li>Add the environment variables <code className="bg-gray-100 px-1 py-0.5 rounded">MAILCHIMP_API_KEY</code> and <code className="bg-gray-100 px-1 py-0.5 rounded">MAILCHIMP_AUDIENCE_ID</code>.</li>
          <li>Optional: set <code className="bg-gray-100 px-1 py-0.5 rounded">SUPPORT_INBOX</code> to route contact form submissions.</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">✉️ Test subscription</h3>
        <SubscriptionTester />
      </div>
    </div>
  )
}

function StatusCard({ label, value, icon, subtle }: { label: string; value: string; icon: string; subtle?: boolean }) {
  return (
    <div className={`rounded-lg border ${subtle ? 'border-gray-200 bg-gray-50' : 'border-gray-100 bg-gradient-to-br from-blue-50 to-green-50'} p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl" aria-hidden>{icon}</span>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
      </div>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function SubscriptionTester() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const body = await res.json()
      if (!res.ok || !body.success) {
        throw new Error(body.error || 'Subscription failed')
      }
      setResult(body.message || 'Subscription succeeded. Check your ESP dashboard to confirm delivery.')
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Unable to subscribe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="test-email" className="block text-sm font-semibold text-gray-700 mb-2">
          Test email (uses the live /api/subscribe endpoint)
        </label>
        <input
          id="test-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-60"
      >
        {loading ? 'Submitting…' : 'Submit test subscription'}
      </button>
      {result && <p className="text-sm text-green-600">{result}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
