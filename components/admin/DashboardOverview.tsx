'use client'

import { useState, useEffect } from 'react'

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    todayVisitors: 0,
    todayClicks: 0,
    todayEarnings: 0,
    monthlyEarnings: 0,
    emailSubscribers: 0,
    activeDeals: 0,
    conversionRate: 0,
    automationStatus: 'active'
  })

  const [agents, setAgents] = useState([
    { name: 'Deal Fetcher', status: 'running', lastRun: '2 min ago', nextRun: '28 min' },
    { name: 'Social Media Bot', status: 'running', lastRun: '15 min ago', nextRun: '45 min' },
    { name: 'Email Sender', status: 'idle', lastRun: '2 hours ago', nextRun: '22 hours' },
    { name: 'SEO Generator', status: 'running', lastRun: '1 hour ago', nextRun: '23 hours' },
    { name: 'Analytics Tracker', status: 'running', lastRun: '1 min ago', nextRun: '4 min' },
  ])

  useEffect(() => {
    // Simulate real-time stats (in production, fetch from your API)
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        todayVisitors: Math.floor(Math.random() * 50) + 150,
        todayClicks: Math.floor(Math.random() * 20) + 40,
        todayEarnings: (Math.random() * 50 + 25).toFixed(2),
        monthlyEarnings: (Math.random() * 500 + 1200).toFixed(2),
        emailSubscribers: Math.floor(Math.random() * 10) + 245,
        activeDeals: 24,
        conversionRate: (Math.random() * 2 + 4).toFixed(1),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Visitors"
          value={stats.todayVisitors}
          change="+12%"
          icon="👥"
          trend="up"
        />
        <StatCard
          title="Today's Clicks"
          value={stats.todayClicks}
          change="+8%"
          icon="🖱️"
          trend="up"
        />
        <StatCard
          title="Today's Earnings"
          value={`$${stats.todayEarnings}`}
          change="+15%"
          icon="💰"
          trend="up"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyEarnings}`}
          change="+24%"
          icon="📈"
          trend="up"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Email Subscribers"
          value={stats.emailSubscribers}
          change="+5 today"
          icon="📧"
          trend="up"
        />
        <StatCard
          title="Active Deals"
          value={stats.activeDeals}
          change="Updated 2m ago"
          icon="🎯"
          trend="neutral"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change="+0.3%"
          icon="🎯"
          trend="up"
        />
      </div>

      {/* Automation Agents Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">🤖 Automation Agents</h2>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            All Systems Active
          </span>
        </div>

        <div className="space-y-3">
          {agents.map((agent, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  agent.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`} />
                <div>
                  <div className="font-semibold text-gray-800">{agent.name}</div>
                  <div className="text-sm text-gray-600">
                    Last run: {agent.lastRun} • Next: {agent.nextRun}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                agent.status === 'running'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {agent.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton icon="🔄" label="Refresh Deals" />
          <QuickActionButton icon="📧" label="Send Email" />
          <QuickActionButton icon="🐦" label="Post Tweet" />
          <QuickActionButton icon="📊" label="View Report" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Recent Activity</h2>
        <div className="space-y-3">
          <ActivityItem
            icon="🎯"
            text="24 new deals added automatically"
            time="5 min ago"
            type="success"
          />
          <ActivityItem
            icon="📧"
            text="Daily email sent to 245 subscribers"
            time="2 hours ago"
            type="info"
          />
          <ActivityItem
            icon="🐦"
            text="Posted 5 deals on Twitter"
            time="3 hours ago"
            type="info"
          />
          <ActivityItem
            icon="💰"
            text="$12.50 commission earned"
            time="4 hours ago"
            type="success"
          />
          <ActivityItem
            icon="🔍"
            text="SEO content generated for 'Best Amazon Deals'"
            time="5 hours ago"
            type="info"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon, trend }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-2">
        <div className="text-gray-600 text-sm">{title}</div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
      <div className={`text-sm font-semibold ${
        trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
      }`}>
        {change}
      </div>
    </div>
  )
}

function QuickActionButton({ icon, label }: any) {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all">
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </button>
  )
}

function ActivityItem({ icon, text, time, type }: any) {
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
