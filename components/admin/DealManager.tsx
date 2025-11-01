'use client'

import { useState } from 'react'

export default function DealManager() {
  const [autoFetch, setAutoFetch] = useState(true)
  const [fetchInterval, setFetchInterval] = useState(30)
  const [isRunning, setIsRunning] = useState(false)

  const handleStartAgent = async () => {
    setIsRunning(true)
    // Simulate API call
    setTimeout(() => {
      alert('Deal fetching agent started! Deals will auto-update every ' + fetchInterval + ' minutes.')
      setIsRunning(false)
    }, 1000)
  }

  const handleManualFetch = async () => {
    setIsRunning(true)
    setTimeout(() => {
      alert('Fetched 15 new deals successfully!')
      setIsRunning(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Agent Control */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🤖 Automated Deal Fetching Agent</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-800">Auto-Fetch Deals</div>
              <div className="text-sm text-gray-600">Automatically discover and add trending deals</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoFetch}
                onChange={(e) => setAutoFetch(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fetch Interval (minutes)
            </label>
            <input
              type="number"
              value={fetchInterval}
              onChange={(e) => setFetchInterval(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="5"
              max="120"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStartAgent}
              disabled={isRunning}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
            >
              {isRunning ? '⏳ Starting...' : '▶️ Start Auto-Fetch Agent'}
            </button>
            <button
              onClick={handleManualFetch}
              disabled={isRunning}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
            >
              {isRunning ? '⏳ Fetching...' : '🔄 Fetch Now (Manual)'}
            </button>
          </div>
        </div>
      </div>

      {/* Deal Sources */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📡 Deal Sources</h2>

        <div className="space-y-3">
          <DealSource
            name="Amazon Product API"
            status="connected"
            deals="150/day"
            description="Official Amazon Product Advertising API"
          />
          <DealSource
            name="RapidAPI Deals"
            status="connected"
            deals="200/day"
            description="Third-party deal aggregator API"
          />
          <DealSource
            name="Manual Curation"
            status="active"
            deals="20/day"
            description="Hand-picked deals by you"
          />
          <DealSource
            name="Price Tracker (Keepa)"
            status="inactive"
            deals="0/day"
            description="Track price drops automatically"
          />
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🔑 API Configuration</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amazon Product API Key
            </label>
            <input
              type="password"
              placeholder="Enter your API key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              RapidAPI Key
            </label>
            <input
              type="password"
              placeholder="Enter your RapidAPI key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            💾 Save API Configuration
          </button>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="font-semibold text-yellow-800 mb-2">📝 API Setup Guide</div>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Amazon API: Sign up at https://affiliate-program.amazon.com/assoc_credentials/home</li>
              <li>• RapidAPI: Free tier at https://rapidapi.com/hub</li>
              <li>• Keepa: Premium API at https://keepa.com/#!api</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Deal Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Smart Filters</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Minimum Discount %
            </label>
            <input
              type="number"
              defaultValue={30}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Minimum Rating
            </label>
            <input
              type="number"
              defaultValue={4.0}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
              max="5"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Minimum Reviews
            </label>
            <input
              type="number"
              defaultValue={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categories to Include
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Electronics', 'Home', 'Fashion', 'Sports', 'Toys', 'Beauty'].map((cat) => (
                <label key={cat} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
            💾 Save Filter Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function DealSource({ name, status, deals, description }: any) {
  const statusColor = status === 'connected' || status === 'active' ? 'green' : 'gray'

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full bg-${statusColor}-500`} />
        <div>
          <div className="font-semibold text-gray-800">{name}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-gray-800">{deals}</div>
        <div className={`text-sm text-${statusColor}-600 capitalize`}>{status}</div>
      </div>
    </div>
  )
}
