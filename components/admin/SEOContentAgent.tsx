'use client'

import { useState } from 'react'

export default function SEOContentAgent() {
  const [autoGenerate, setAutoGenerate] = useState(true)

  const handleGenerateContent = () => {
    alert('AI Content Generator started! Creating SEO-optimized blog posts...')
  }

  return (
    <div className="space-y-6">
      {/* SEO Agent Control */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🤖 AI SEO Content Generator</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-800">Auto-Generate SEO Content</div>
              <div className="text-sm text-gray-600">Create blog posts, product reviews, and deal roundups</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoGenerate}
                onChange={(e) => setAutoGenerate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content Generation Frequency
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option>Daily (1 post per day)</option>
              <option>Every 2 days</option>
              <option>Weekly (7 posts per week)</option>
              <option>Bi-weekly (3-4 posts per week)</option>
            </select>
          </div>

          <button
            onClick={handleGenerateContent}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700"
          >
            ✨ Generate Content Now
          </button>
        </div>
      </div>

      {/* Target Keywords */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Target Keywords</h3>

        <div className="space-y-3">
          <KeywordCard
            keyword="amazon deals"
            difficulty="Medium"
            volume="110K/mo"
            ranking="#15"
            trend="up"
          />
          <KeywordCard
            keyword="best deals today"
            difficulty="Low"
            volume="49K/mo"
            ranking="#8"
            trend="up"
          />
          <KeywordCard
            keyword="lightning deals amazon"
            difficulty="Low"
            volume="33K/mo"
            ranking="#4"
            trend="stable"
          />
          <KeywordCard
            keyword="amazon prime day deals"
            difficulty="High"
            volume="201K/mo"
            ranking="Not ranked"
            trend="seasonal"
          />
        </div>

        <button className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
          ➕ Add New Keyword
        </button>
      </div>

      {/* Content Templates */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📝 AI Content Templates</h3>

        <div className="space-y-3">
          <ContentTemplate
            name="Best Deals This Week"
            type="Roundup"
            length="1,500-2,000 words"
            frequency="Weekly"
            status="active"
          />
          <ContentTemplate
            name="Product Category Deep Dive"
            type="Review"
            length="2,500-3,000 words"
            frequency="Bi-weekly"
            status="active"
          />
          <ContentTemplate
            name="How to Save Money on Amazon"
            type="Guide"
            length="1,000-1,500 words"
            frequency="Monthly"
            status="active"
          />
          <ContentTemplate
            name="Deal vs Regular Price Comparison"
            type="Analysis"
            length="800-1,200 words"
            frequency="Weekly"
            status="paused"
          />
        </div>
      </div>

      {/* Content Calendar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📅 Content Calendar</h3>

        <div className="space-y-3">
          <CalendarItem
            date="Nov 1, 2025"
            title="Top 10 Amazon Electronics Deals This Week"
            status="published"
            views={1245}
            traffic="SEO: 892 • Social: 353"
          />
          <CalendarItem
            date="Nov 2, 2025"
            title="Black Friday Preview: Best Deals to Watch"
            status="scheduled"
            views={0}
            traffic="Scheduled for 9:00 AM"
          />
          <CalendarItem
            date="Nov 3, 2025"
            title="Complete Guide to Amazon Lightning Deals"
            status="draft"
            views={0}
            traffic="In progress"
          />
          <CalendarItem
            date="Nov 4, 2025"
            title="Smart Home Devices Under $50"
            status="idea"
            views={0}
            traffic="Not started"
          />
        </div>
      </div>

      {/* AI Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🤖 AI Configuration</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              AI Model Selection
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option>OpenAI GPT-4 (Highest Quality)</option>
              <option>OpenAI GPT-3.5 (Fast & Cost-Effective)</option>
              <option>Claude 3 (Excellent for Long Content)</option>
              <option>Local Model (Free, Lower Quality)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              placeholder="sk-..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content Tone
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option>Professional & Informative</option>
              <option>Casual & Friendly</option>
              <option>Enthusiastic & Exciting</option>
              <option>Expert & Authoritative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Word Count
            </label>
            <input
              type="number"
              defaultValue={1500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              min="500"
              max="5000"
            />
          </div>

          <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
            💾 Save AI Configuration
          </button>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="font-semibold text-purple-800 mb-2">💡 Pro Tip</div>
            <p className="text-sm text-purple-700">
              OpenAI GPT-4 costs ~$0.03 per article. With 30 articles/month, that's only $0.90/month for fully automated SEO content that can drive thousands in revenue!
            </p>
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔍 SEO Optimization Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-700">Auto-generate Meta Descriptions</div>
              <div className="text-sm text-gray-600">Create SEO-optimized meta tags</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-700">Internal Linking</div>
              <div className="text-sm text-gray-600">Auto-link to related deals and posts</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-700">Schema Markup</div>
              <div className="text-sm text-gray-600">Add structured data for rich snippets</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-700">Alt Text for Images</div>
              <div className="text-sm text-gray-600">Generate descriptive alt text</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-700">Auto-Submit to Google</div>
              <div className="text-sm text-gray-600">Index new content immediately</div>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Content Performance</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Published Articles</div>
            <div className="text-3xl font-bold text-gray-800">47</div>
            <div className="text-sm text-green-600 font-semibold">+5 this month</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Organic Traffic</div>
            <div className="text-3xl font-bold text-gray-800">12.4K</div>
            <div className="text-sm text-green-600 font-semibold">+28% vs last month</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Avg. Time on Page</div>
            <div className="text-3xl font-bold text-gray-800">3:42</div>
            <div className="text-sm text-green-600 font-semibold">+15% engagement</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Top Articles</th>
                <th className="text-right py-3 px-4">Views</th>
                <th className="text-right py-3 px-4">Clicks</th>
                <th className="text-right py-3 px-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Best Amazon Deals November 2025</td>
                <td className="py-3 px-4 text-right">2,456</td>
                <td className="py-3 px-4 text-right">342</td>
                <td className="py-3 px-4 text-right text-green-600 font-semibold">$245.80</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Top 10 Electronics Under $50</td>
                <td className="py-3 px-4 text-right">1,892</td>
                <td className="py-3 px-4 text-right">278</td>
                <td className="py-3 px-4 text-right text-green-600 font-semibold">$198.20</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">How to Find Lightning Deals</td>
                <td className="py-3 px-4 text-right">1,634</td>
                <td className="py-3 px-4 text-right">234</td>
                <td className="py-3 px-4 text-right text-green-600 font-semibold">$167.40</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function KeywordCard({ keyword, difficulty, volume, ranking, trend }: any) {
  const difficultyColor = difficulty === 'Low' ? 'green' : difficulty === 'Medium' ? 'yellow' : 'red'
  const trendIcon = trend === 'up' ? '📈' : trend === 'stable' ? '➡️' : '📅'

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{keyword}</div>
        <div className="text-sm text-gray-600">{volume} monthly searches</div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${difficultyColor}-100 text-${difficultyColor}-800`}>
          {difficulty}
        </span>
        <div className="text-right">
          <div className="font-semibold text-gray-800">{ranking}</div>
          <div className="text-sm text-gray-600">{trendIcon}</div>
        </div>
      </div>
    </div>
  )
}

function ContentTemplate({ name, type, length, frequency, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{name}</div>
        <div className="text-sm text-gray-600">
          {type} • {length} • {frequency}
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
        status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {status}
      </span>
    </div>
  )
}

function CalendarItem({ date, title, status, views, traffic }: any) {
  const statusColors: any = {
    published: 'green',
    scheduled: 'blue',
    draft: 'yellow',
    idea: 'gray'
  }

  return (
    <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <div className="text-sm text-gray-600 mb-1">{date}</div>
        <div className="font-semibold text-gray-800 mb-2">{title}</div>
        <div className="text-sm text-gray-600">{traffic}</div>
      </div>
      <div className="text-right">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${statusColors[status]}-100 text-${statusColors[status]}-800`}>
          {status}
        </span>
        {views > 0 && (
          <div className="text-sm text-gray-600 mt-2">{views.toLocaleString()} views</div>
        )}
      </div>
    </div>
  )
}
