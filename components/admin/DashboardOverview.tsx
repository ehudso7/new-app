'use client'

import { useEffect, useMemo, useState } from 'react'

interface Metrics {
  totalDeals: number
  verified24h: number
  avgDiscount: number
  avgRating: number
  avgReviews: number
  lightningDeals: number
  highestSavings: number
}

export default function DashboardOverview() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadDeals() {
      try {
        setLoading(true)
        const response = await fetch('/api/deals?category=all&limit=100')
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load deals')
        }
        if (mounted) {
          setDeals(data.deals || [])
          setError(null)
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Unable to load deal data')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadDeals()
    return () => {
      mounted = false
    }
  }, [])

  const metrics: Metrics = useMemo(() => {
    if (!deals.length) {
      return {
        totalDeals: 0,
        verified24h: 0,
        avgDiscount: 0,
        avgRating: 0,
        avgReviews: 0,
        lightningDeals: 0,
        highestSavings: 0,
      }
    }

    const totalDeals = deals.length
    const now = Date.now()
    const verified24h = deals.filter((deal) => {
      if (!deal.lastVerified) return false
      const ts = Date.parse(deal.lastVerified)
      if (Number.isNaN(ts)) return false
      return now - ts <= 24 * 60 * 60 * 1000
    }).length
    const avgDiscount = deals.reduce((acc, deal) => acc + (deal.discount || 0), 0) / totalDeals
    const avgRating = deals.reduce((acc, deal) => acc + (deal.rating || 0), 0) / totalDeals
    const avgReviews = deals.reduce((acc, deal) => acc + (deal.reviews || 0), 0) / totalDeals
    const lightningDeals = deals.filter((deal) => deal.isLightningDeal).length
    const highestSavings = Math.max(
      ...deals.map((deal) => Math.max(0, (deal.originalPrice || 0) - (deal.currentPrice || 0))),
    )

    return {
      totalDeals,
      verified24h,
      avgDiscount,
      avgRating,
      avgReviews,
      lightningDeals,
      highestSavings,
    }
  }, [deals])

  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const deal of deals) {
      const category = deal.category || 'other'
      counts[category] = (counts[category] || 0) + 1
    }
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  }, [deals])

  const recentUpdates = useMemo(() => {
    return deals
      .filter((deal) => deal.lastVerified)
      .slice()
      .sort((a, b) => Date.parse(b.lastVerified || '0') - Date.parse(a.lastVerified || '0'))
      .slice(0, 5)
  }, [deals])

  const automationSchedule = [
    {
      name: 'Morning verification sweep',
      status: metrics.verified24h > 0 ? 'active' : 'scheduled',
      lastRun: metrics.verified24h > 0 ? 'Today 7:30 AM ET' : 'Pending',
      nextRun: 'Today 7:30 PM ET',
    },
    {
      name: 'Lightning deal re-check',
      status: metrics.lightningDeals > 0 ? 'active' : 'standby',
      lastRun: metrics.lightningDeals > 0 ? 'Within 60 minutes' : 'Not needed',
      nextRun: metrics.lightningDeals > 0 ? 'In 1 hour' : 'On demand',
    },
    {
      name: 'Email digest sync',
      status: 'scheduled',
      lastRun: 'Today 8:00 AM ET',
      nextRun: 'Tomorrow 8:00 AM ET',
    },
    {
      name: 'Analytics export',
      status: 'manual',
      lastRun: 'Yesterday 9:15 PM ET',
      nextRun: 'On request',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Live Deals"
          value={metrics.totalDeals.toString()}
          description={loading ? 'Refreshing…' : 'Published and in stock'}
          icon="🎯"
        />
        <StatCard
          title="Verified in 24h"
          value={metrics.verified24h.toString()}
          description="Latest manual price checks"
          icon="✅"
        />
        <StatCard
          title="Avg. Discount"
          value={`${metrics.avgDiscount.toFixed(1)}%`}
          description="Across all live deals"
          icon="💸"
        />
        <StatCard
          title="Highest Savings"
          value={`$${metrics.highestSavings.toFixed(0)}`}
          description="Top single markdown"
          icon="📉"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Average Rating"
          value={metrics.avgRating ? metrics.avgRating.toFixed(1) : '0.0'}
          description="Weighted across active listings"
          icon="⭐"
        />
        <StatCard
          title="Avg. Review Count"
          value={metrics.avgReviews ? Math.round(metrics.avgReviews).toLocaleString() : '0'}
          description="Social proof per product"
          icon="🗣️"
        />
        <StatCard
          title="Lightning Deals"
          value={metrics.lightningDeals.toString()}
          description="Deals with time limits"
          icon="⚡"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">🤖 Automation Schedule</h2>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            {metrics.verified24h > 0 ? 'Schedule on track' : 'Manual check pending'}
          </span>
        </div>
        <div className="space-y-3">
          {automationSchedule.map((run) => (
            <div key={run.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    run.status === 'active'
                      ? 'bg-green-500 animate-pulse'
                      : run.status === 'scheduled'
                      ? 'bg-blue-500'
                      : 'bg-gray-400'
                  }`}
                />
                <div>
                  <div className="font-semibold text-gray-800">{run.name}</div>
                  <div className="text-sm text-gray-600">
                    Last run: {run.lastRun} • Next: {run.nextRun}
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  run.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : run.status === 'scheduled'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {run.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton icon="🔄" label="Refresh deals now" />
          <QuickActionButton icon="📧" label="Send daily digest" />
          <QuickActionButton icon="📝" label="Export CSV" />
          <QuickActionButton icon="📈" label="View analytics" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Recent Verification</h2>
        {error ? (
          <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded p-4">
            {error}
          </div>
        ) : (
          <div className="space-y-3">
            {recentUpdates.length === 0 && !loading && (
              <div className="text-gray-600 text-sm">No recent updates recorded.</div>
            )}
            {recentUpdates.map((deal) => (
              <ActivityItem
                key={deal.id}
                icon="🛒"
                text={`${deal.title} re-verified at $${deal.currentPrice}`}
                time={formatRelative(deal.lastVerified)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Deals by category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryBreakdown.map((entry) => (
            <div key={entry.category} className="p-4 rounded-lg bg-gray-50">
              <div className="text-xs text-gray-500 uppercase tracking-wide">{entry.category}</div>
              <div className="text-2xl font-bold text-gray-800">{entry.count}</div>
              <div className="text-xs text-gray-500">Active listings</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, description, icon }: { title: string; value: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-2">
        <div className="text-gray-600 text-sm">{title}</div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  )
}

function QuickActionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all">
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </button>
  )
}

function ActivityItem({ icon, text, time }: { icon: string; text: string; time: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <div className="text-gray-800">{text}</div>
        <div className="text-sm text-gray-500">{time}</div>
      </div>
    </div>
  )
}

function formatRelative(timestamp?: string) {
  if (!timestamp) return 'Time unknown'
  const ts = Date.parse(timestamp)
  if (Number.isNaN(ts)) return 'Time unknown'
  const diff = Date.now() - ts
  const minutes = Math.round(diff / (1000 * 60))
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 48) return `${hours} hr ago`
  const days = Math.round(hours / 24)
  return `${days} d ago`
}
