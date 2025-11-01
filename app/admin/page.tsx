'use client'

import { useState, useEffect } from 'react'
import DashboardOverview from '@/components/admin/DashboardOverview'
import DealManager from '@/components/admin/DealManager'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import EmailManager from '@/components/admin/EmailManager'
import SocialMediaAgent from '@/components/admin/SocialMediaAgent'
import SEOContentAgent from '@/components/admin/SEOContentAgent'
import AutomationSettings from '@/components/admin/AutomationSettings'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)

  // Simple password protection (in production, use proper auth like NextAuth.js)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Default password: "dealpulse2025" - change this!
    if (password === 'dealpulse2025') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminPassword', password)
    } else {
      alert('Invalid password')
    }
  }

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminPassword')
    setPassword('')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">DealPulse Admin</h1>
          <p className="text-gray-600 mb-6">Enter password to access dashboard</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-500">
            Default password: <code className="bg-gray-100 px-2 py-1 rounded">dealpulse2025</code>
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: '📊 Overview', icon: '📊' },
    { id: 'deals', name: '🎯 Deal Manager', icon: '🎯' },
    { id: 'analytics', name: '📈 Analytics', icon: '📈' },
    { id: 'email', name: '📧 Email Marketing', icon: '📧' },
    { id: 'social', name: '🚀 Social Media', icon: '🚀' },
    { id: 'seo', name: '🔍 SEO Content', icon: '🔍' },
    { id: 'automation', name: '⚙️ Automation', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">DealPulse Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Automated Business Operations</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'deals' && <DealManager />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'email' && <EmailManager />}
        {activeTab === 'social' && <SocialMediaAgent />}
        {activeTab === 'seo' && <SEOContentAgent />}
        {activeTab === 'automation' && <AutomationSettings />}
      </div>
    </div>
  )
}
