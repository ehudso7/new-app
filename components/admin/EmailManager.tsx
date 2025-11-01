'use client'

import { useState } from 'react'

export default function EmailManager() {
  const [autoSend, setAutoSend] = useState(true)
  const [sendTime, setSendTime] = useState('09:00')

  return (
    <div className="space-y-6">
      {/* Email Automation Control */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📧 Email Automation Agent</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-800">Automated Daily Emails</div>
              <div className="text-sm text-gray-600">Send daily deal roundup to subscribers</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSend}
                onChange={(e) => setAutoSend(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Send Time (Daily)
            </label>
            <input
              type="time"
              value={sendTime}
              onChange={(e) => setSendTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Subscriber Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatBox title="Total Subscribers" value="1,245" icon="👥" color="blue" />
        <StatBox title="Active (30d)" value="892" icon="✅" color="green" />
        <StatBox title="Open Rate" value="34.2%" icon="📬" color="purple" />
        <StatBox title="Click Rate" value="12.8%" icon="🖱️" color="orange" />
      </div>

      {/* Email Campaign Templates */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Campaign Templates</h3>

        <div className="space-y-3">
          <CampaignTemplate
            name="Daily Deal Digest"
            type="Automated"
            frequency="Daily at 9:00 AM"
            status="active"
            subscribers={1245}
          />
          <CampaignTemplate
            name="Weekend Mega Deals"
            type="Automated"
            frequency="Saturdays at 8:00 AM"
            status="active"
            subscribers={1245}
          />
          <CampaignTemplate
            name="Flash Deal Alert"
            type="Triggered"
            frequency="When deal posted"
            status="active"
            subscribers={892}
          />
          <CampaignTemplate
            name="Weekly Roundup"
            type="Automated"
            frequency="Sundays at 6:00 PM"
            status="paused"
            subscribers={1245}
          />
        </div>

        <button className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
          ➕ Create New Campaign
        </button>
      </div>

      {/* Email Service Integration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔗 Email Service Integration</h3>

        <div className="space-y-4">
          <EmailServiceOption
            name="Mailchimp"
            status="connected"
            subscribers="1,245"
            description="Free tier: 2,000 contacts"
          />
          <EmailServiceOption
            name="SendGrid"
            status="disconnected"
            subscribers="0"
            description="Free tier: 100 emails/day"
          />
          <EmailServiceOption
            name="ConvertKit"
            status="disconnected"
            subscribers="0"
            description="Free tier: 1,000 contacts"
          />
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔑 Mailchimp Configuration</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mailchimp API Key
            </label>
            <input
              type="password"
              placeholder="Enter your Mailchimp API key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Audience ID
            </label>
            <input
              type="text"
              placeholder="Enter your audience/list ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            💾 Save Configuration
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="font-semibold text-blue-800 mb-2">📚 Setup Guide</div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Sign up for free at https://mailchimp.com</li>
              <li>• Get API key from Account → Extras → API keys</li>
              <li>• Find Audience ID in Audience → Settings → Audience name and defaults</li>
              <li>• Free tier includes 2,000 contacts and 10,000 emails/month</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Send */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Send</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject Line
            </label>
            <input
              type="text"
              placeholder="🔥 Today's Hottest Deals - Save Up To 70%!"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preview Text
            </label>
            <input
              type="text"
              placeholder="Don't miss these amazing deals before they expire..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Deals to Include
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Top 10 Deals Today</option>
              <option>All Electronics Deals</option>
              <option>Lightning Deals Only</option>
              <option>Custom Selection</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
              📧 Send Now
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              👁️ Preview
            </button>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Recent Campaigns</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Campaign</th>
                <th className="text-right py-3 px-4">Sent</th>
                <th className="text-right py-3 px-4">Opens</th>
                <th className="text-right py-3 px-4">Clicks</th>
                <th className="text-right py-3 px-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              <CampaignRow
                name="Daily Digest - Nov 1"
                sent={1245}
                opens="34.2%"
                clicks="12.8%"
                revenue="$127.50"
              />
              <CampaignRow
                name="Weekend Deals - Oct 28"
                sent={1245}
                opens="42.1%"
                clicks="15.6%"
                revenue="$198.40"
              />
              <CampaignRow
                name="Flash Deal Alert - Oct 27"
                sent={892}
                opens="51.3%"
                clicks="22.4%"
                revenue="$245.80"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatBox({ title, value, icon, color }: any) {
  const colorMap: any = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} rounded-lg shadow-md p-6 text-white`}>
      <div className="text-sm opacity-90 mb-1">{title}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="text-2xl">{icon}</div>
    </div>
  )
}

function CampaignTemplate({ name, type, frequency, status, subscribers }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{name}</div>
        <div className="text-sm text-gray-600">
          {type} • {frequency} • {subscribers.toLocaleString()} subscribers
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
        status === 'active'
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {status}
      </span>
    </div>
  )
}

function EmailServiceOption({ name, status, subscribers, description }: any) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${
          status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
        }`} />
        <div>
          <div className="font-semibold text-gray-800">{name}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-gray-800">{subscribers}</div>
        <div className={`text-sm ${
          status === 'connected' ? 'text-green-600' : 'text-gray-600'
        }`}>
          {status}
        </div>
      </div>
    </div>
  )
}

function CampaignRow({ name, sent, opens, clicks, revenue }: any) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4 font-medium text-gray-800">{name}</td>
      <td className="py-3 px-4 text-right text-gray-700">{sent.toLocaleString()}</td>
      <td className="py-3 px-4 text-right text-blue-600 font-semibold">{opens}</td>
      <td className="py-3 px-4 text-right text-purple-600 font-semibold">{clicks}</td>
      <td className="py-3 px-4 text-right text-green-600 font-semibold">{revenue}</td>
    </tr>
  )
}
