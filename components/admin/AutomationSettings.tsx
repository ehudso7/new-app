'use client'

import { useState } from 'react'

export default function AutomationSettings() {
  const [masterSwitch, setMasterSwitch] = useState(true)

  return (
    <div className="space-y-6">
      {/* Master Control */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">🤖 Master Automation Control</h2>
            <p className="text-blue-100">Control all automated agents from one place</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={masterSwitch}
              onChange={(e) => setMasterSwitch(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-blue-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white"></div>
          </label>
        </div>
        <div className="mt-4 text-sm">
          {masterSwitch ? '✅ All agents are ACTIVE and running' : '⚠️ All agents are PAUSED'}
        </div>
      </div>

      {/* Individual Agent Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Agent Controls</h3>

        <div className="space-y-4">
          <AgentControl
            name="Deal Fetcher Agent"
            description="Automatically discovers and adds trending Amazon deals"
            icon="🎯"
            enabled={true}
            interval="Every 30 minutes"
            lastRun="5 min ago"
            nextRun="25 min"
          />

          <AgentControl
            name="Email Marketing Agent"
            description="Sends automated emails to subscribers"
            icon="📧"
            enabled={true}
            interval="Daily at 9:00 AM"
            lastRun="2 hours ago"
            nextRun="22 hours"
          />

          <AgentControl
            name="Social Media Agent"
            description="Posts deals to Twitter, Facebook, Pinterest"
            icon="🚀"
            enabled={true}
            interval="Every 3 hours (4x/day)"
            lastRun="1 hour ago"
            nextRun="2 hours"
          />

          <AgentControl
            name="SEO Content Generator"
            description="Creates SEO-optimized blog posts and articles"
            icon="🔍"
            enabled={true}
            interval="Daily at 6:00 AM"
            lastRun="6 hours ago"
            nextRun="18 hours"
          />

          <AgentControl
            name="Analytics Tracker"
            description="Tracks visitors, clicks, and revenue"
            icon="📊"
            enabled={true}
            interval="Every 5 minutes"
            lastRun="2 min ago"
            nextRun="3 min"
          />

          <AgentControl
            name="Deal Quality Filter"
            description="Removes expired or low-quality deals"
            icon="🧹"
            enabled={true}
            interval="Every 1 hour"
            lastRun="45 min ago"
            nextRun="15 min"
          />
        </div>
      </div>

      {/* Scheduling */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⏰ Global Schedule Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Timezone
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>UTC (Coordinated Universal Time)</option>
              <option>EST (Eastern Standard Time)</option>
              <option>PST (Pacific Standard Time)</option>
              <option>CST (Central Standard Time)</option>
              <option>MST (Mountain Standard Time)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quiet Hours (Pause All Agents)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Start Time</label>
                <input
                  type="time"
                  defaultValue="23:00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">End Time</label>
                <input
                  type="time"
                  defaultValue="06:00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Agents will pause during these hours (useful for reducing API costs)
            </p>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            💾 Save Schedule Settings
          </button>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🚦 Rate Limits & Quotas</h3>

        <div className="space-y-4">
          <RateLimitCard
            service="Amazon Product API"
            current={1245}
            limit={5000}
            resetTime="Resets in 12 hours"
          />
          <RateLimitCard
            service="OpenAI API (GPT-4)"
            current={42}
            limit={100}
            resetTime="Resets monthly"
          />
          <RateLimitCard
            service="Twitter API"
            current={89}
            limit={200}
            resetTime="Resets daily"
          />
          <RateLimitCard
            service="Mailchimp Emails"
            current={1245}
            limit={10000}
            resetTime="Resets monthly"
          />
        </div>
      </div>

      {/* Error Handling */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🛡️ Error Handling</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-700">Auto-Retry on Failure</div>
              <div className="text-sm text-gray-600">Retry failed operations automatically</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Retry Attempts
            </label>
            <input
              type="number"
              defaultValue={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="10"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-700">Email Alerts on Critical Errors</div>
              <div className="text-sm text-gray-600">Get notified when agents fail</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alert Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Performance Optimization */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Performance Optimization</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-700">Batch Processing</div>
              <div className="text-sm text-gray-600">Process multiple items at once (faster, fewer API calls)</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Batch Size
            </label>
            <input
              type="number"
              defaultValue={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-700">Cache Results</div>
              <div className="text-sm text-gray-600">Store frequently accessed data to reduce API calls</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cache Duration (minutes)
            </label>
            <input
              type="number"
              defaultValue={30}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="5"
              max="1440"
            />
          </div>
        </div>
      </div>

      {/* Backup & Export */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💾 Backup & Export</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-700">Auto-Backup Configuration</div>
              <div className="text-sm text-gray-600">Automatically backup all settings daily</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
              📥 Export Settings
            </button>
            <button className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              📤 Import Settings
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="font-semibold text-yellow-800 mb-2">💡 Pro Tip</div>
            <p className="text-sm text-yellow-700">
              Export your configuration to easily replicate this setup for other deal sites or share with team members!
            </p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔧 System Status</h3>

        <div className="space-y-3">
          <StatusRow label="Server Health" status="Excellent" color="green" value="99.9% uptime" />
          <StatusRow label="Database" status="Connected" color="green" value="42ms latency" />
          <StatusRow label="API Endpoints" status="All Operational" color="green" value="5/5 active" />
          <StatusRow label="Disk Space" status="Healthy" color="green" value="2.4GB / 10GB" />
          <StatusRow label="Memory Usage" status="Normal" color="green" value="342MB / 1GB" />
        </div>

        <button className="mt-4 w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700">
          🔄 Refresh Status
        </button>
      </div>
    </div>
  )
}

function AgentControl({ name, description, icon, enabled, interval, lastRun, nextRun }: any) {
  const [isEnabled, setIsEnabled] = useState(enabled)

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-3xl">{icon}</span>
          <div>
            <div className="font-semibold text-gray-800">{name}</div>
            <div className="text-sm text-gray-600 mb-2">{description}</div>
            <div className="text-xs text-gray-500">
              {interval} • Last run: {lastRun} • Next: {nextRun}
            </div>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer ml-4">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>
    </div>
  )
}

function RateLimitCard({ service, current, limit, resetTime }: any) {
  const percentage = (current / limit) * 100

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-gray-800">{service}</div>
        <div className="text-sm text-gray-600">{resetTime}</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div
          className={`h-3 rounded-full ${
            percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-sm text-gray-600">
        {current.toLocaleString()} / {limit.toLocaleString()} ({percentage.toFixed(1)}%)
      </div>
    </div>
  )
}

function StatusRow({ label, status, color, value }: any) {
  const colorMap: any = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="font-semibold text-gray-700">{label}</div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{value}</span>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorMap[color]}`}>
          {status}
        </span>
      </div>
    </div>
  )
}
