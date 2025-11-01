'use client'

import { useState } from 'react'

export default function SocialMediaAgent() {
  const [autoPost, setAutoPost] = useState(true)
  const [postingFrequency, setPostingFrequency] = useState('4')

  return (
    <div className="space-y-6">
      {/* Social Media Automation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🤖 Social Media Automation Agent</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div>
              <div className="font-semibold text-gray-800">Auto-Post Deals</div>
              <div className="text-sm text-gray-600">Automatically share deals on social media</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPost}
                onChange={(e) => setAutoPost(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Posts Per Day
            </label>
            <input
              type="number"
              value={postingFrequency}
              onChange={(e) => setPostingFrequency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="20"
            />
            <p className="text-sm text-gray-600 mt-1">Recommended: 4-10 posts per day for optimal engagement</p>
          </div>
        </div>
      </div>

      {/* Platform Integration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔗 Connected Platforms</h3>

        <div className="space-y-3">
          <PlatformCard
            name="Twitter/X"
            icon="𝕏"
            status="connected"
            followers="2,456"
            postsToday={5}
            engagement="8.2%"
          />
          <PlatformCard
            name="Facebook"
            icon="📘"
            status="connected"
            followers="1,234"
            postsToday={3}
            engagement="6.4%"
          />
          <PlatformCard
            name="Instagram"
            icon="📸"
            status="disconnected"
            followers="0"
            postsToday={0}
            engagement="0%"
          />
          <PlatformCard
            name="TikTok"
            icon="🎵"
            status="disconnected"
            followers="0"
            postsToday={0}
            engagement="0%"
          />
          <PlatformCard
            name="Pinterest"
            icon="📌"
            status="connected"
            followers="892"
            postsToday={2}
            engagement="12.1%"
          />
          <PlatformCard
            name="Reddit"
            icon="🤖"
            status="manual"
            followers="N/A"
            postsToday={0}
            engagement="N/A"
          />
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔑 API Keys Configuration</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Twitter API Key
            </label>
            <input
              type="password"
              placeholder="Enter your Twitter API key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Twitter API Secret
            </label>
            <input
              type="password"
              placeholder="Enter your Twitter API secret"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Facebook Access Token
            </label>
            <input
              type="password"
              placeholder="Enter your Facebook access token"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            💾 Save API Keys
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="font-semibold text-blue-800 mb-2">📚 API Setup Guide</div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Twitter: Get API keys from https://developer.twitter.com/</li>
              <li>• Facebook: Create app at https://developers.facebook.com/</li>
              <li>• Instagram: Use Facebook Graph API</li>
              <li>• All platforms have free tiers for automation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Post Templates */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Post Templates</h3>

        <div className="space-y-3">
          <PostTemplate
            name="Standard Deal Post"
            template="🔥 {dealName} is {discount}% OFF!\nWas: ${oldPrice}\nNow: ${newPrice}\n\n{link}\n\n#AmazonDeals #DealAlert"
            uses={145}
          />
          <PostTemplate
            name="Lightning Deal"
            template="⚡ LIGHTNING DEAL ⚡\n{dealName}\n{discount}% OFF - Hurry!\n\n{link}\n\n#FlashSale #LimitedTime"
            uses={89}
          />
          <PostTemplate
            name="Question Hook"
            template="Looking for a {category}?\n\nCheck out this deal: {dealName}\n{discount}% OFF right now! 👇\n\n{link}"
            uses={67}
          />
        </div>

        <button className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
          ➕ Create New Template
        </button>
      </div>

      {/* Hashtag Strategy */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">#️⃣ Hashtag Strategy</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Primary Hashtags (Always Include)
            </label>
            <textarea
              defaultValue="#AmazonDeals #DealAlert #SaveMoney #DealPulse"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category-Specific Hashtags
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-semibold text-gray-700 mb-1">Electronics</div>
                <div className="text-xs text-gray-600">#TechDeals #GadgetSale</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-semibold text-gray-700 mb-1">Fashion</div>
                <div className="text-xs text-gray-600">#FashionDeals #StyleSale</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-semibold text-gray-700 mb-1">Home</div>
                <div className="text-xs text-gray-600">#HomeDeals #HomeSale</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-semibold text-gray-700 mb-1">Sports</div>
                <div className="text-xs text-gray-600">#FitnessDeals #SportsSale</div>
              </div>
            </div>
          </div>

          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
            💾 Save Hashtag Strategy
          </button>
        </div>
      </div>

      {/* Quick Post */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Post</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Deal
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Wireless Bluetooth Earbuds - 65% OFF</option>
              <option>Smart Watch Heart Monitor - 58% OFF</option>
              <option>Portable Phone Charger - 72% OFF</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Post Template
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Standard Deal Post</option>
              <option>Lightning Deal</option>
              <option>Question Hook</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preview
            </label>
            <textarea
              defaultValue="🔥 Wireless Bluetooth Earbuds is 65% OFF!\nWas: $89.99\nNow: $31.49\n\n[DEAL_LINK_WILL_BE_INSERTED_HERE]\n\n#AmazonDeals #DealAlert #TechDeals"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              rows={6}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                <input type="checkbox" defaultChecked />
                <span>𝕏 Twitter</span>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                <input type="checkbox" defaultChecked />
                <span>📘 Facebook</span>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                <input type="checkbox" />
                <span>📸 Instagram</span>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                <input type="checkbox" defaultChecked />
                <span>📌 Pinterest</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
              🚀 Post Now
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              ⏰ Schedule Post
            </button>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Recent Posts</h3>

        <div className="space-y-3">
          <RecentPost
            platform="Twitter"
            time="15 min ago"
            text="🔥 Wireless Bluetooth Earbuds is 65% OFF!"
            likes={34}
            shares={12}
            clicks={89}
          />
          <RecentPost
            platform="Facebook"
            time="1 hour ago"
            text="Smart Watch Heart Monitor - Amazing Deal!"
            likes={67}
            shares={23}
            clicks={145}
          />
          <RecentPost
            platform="Pinterest"
            time="2 hours ago"
            text="10 Best Amazon Deals Today"
            likes={156}
            shares={89}
            clicks={342}
          />
        </div>
      </div>
    </div>
  )
}

function PlatformCard({ name, icon, status, followers, postsToday, engagement }: any) {
  const statusColor = status === 'connected' ? 'green' : status === 'manual' ? 'blue' : 'gray'

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <div className="font-semibold text-gray-800">{name}</div>
          <div className="text-sm text-gray-600">
            {followers} followers • {postsToday} posts today • {engagement} engagement
          </div>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${statusColor}-100 text-${statusColor}-800`}>
        {status}
      </span>
    </div>
  )
}

function PostTemplate({ name, template, uses }: any) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-gray-800">{name}</div>
        <div className="text-sm text-gray-600">{uses} uses</div>
      </div>
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded font-mono whitespace-pre-wrap">
        {template}
      </div>
    </div>
  )
}

function RecentPost({ platform, time, text, likes, shares, clicks }: any) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-gray-800">{platform}</div>
        <div className="text-sm text-gray-600">{time}</div>
      </div>
      <div className="text-gray-700 mb-3">{text}</div>
      <div className="flex gap-4 text-sm">
        <span className="text-gray-600">❤️ {likes} likes</span>
        <span className="text-gray-600">🔄 {shares} shares</span>
        <span className="text-green-600 font-semibold">🖱️ {clicks} clicks</span>
      </div>
    </div>
  )
}
