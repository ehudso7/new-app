'use client'

import { useState } from 'react'

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('7days')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📈 Analytics Dashboard</h2>
            <p className="text-gray-600">Track your performance and earnings</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="$2,456.80"
          change="+18.2%"
          icon="💰"
          chartData={[40, 55, 45, 60, 70, 65, 80]}
        />
        <MetricCard
          title="Total Visitors"
          value="8,234"
          change="+12.5%"
          icon="👥"
          chartData={[100, 120, 110, 140, 150, 145, 160]}
        />
        <MetricCard
          title="Click-Through Rate"
          value="8.4%"
          change="+2.1%"
          icon="🖱️"
          chartData={[6, 7, 6.5, 7.5, 8, 7.8, 8.4]}
        />
        <MetricCard
          title="Conversion Rate"
          value="4.7%"
          change="+0.8%"
          icon="🎯"
          chartData={[3, 3.5, 3.8, 4, 4.2, 4.5, 4.7]}
        />
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🌐 Traffic Sources</h3>
        <div className="space-y-3">
          <TrafficSource name="Organic Search" percentage={45} value="3,705 visitors" color="green" />
          <TrafficSource name="Social Media" percentage={25} value="2,058 visitors" color="blue" />
          <TrafficSource name="Direct" percentage={15} value="1,235 visitors" color="purple" />
          <TrafficSource name="Email" percentage={10} value="823 visitors" color="orange" />
          <TrafficSource name="Referral" percentage={5} value="413 visitors" color="pink" />
        </div>
      </div>

      {/* Top Performing Deals */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 Top Performing Deals</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-right py-3 px-4">Clicks</th>
                <th className="text-right py-3 px-4">Conversions</th>
                <th className="text-right py-3 px-4">Revenue</th>
                <th className="text-right py-3 px-4">CTR</th>
              </tr>
            </thead>
            <tbody>
              <TopDealRow
                product="Wireless Bluetooth Earbuds"
                clicks={245}
                conversions={18}
                revenue="$127.50"
                ctr="12.3%"
              />
              <TopDealRow
                product="Smart Watch Heart Rate Monitor"
                clicks={198}
                conversions={14}
                revenue="$98.20"
                ctr="10.8%"
              />
              <TopDealRow
                product="Portable Phone Charger 20000mAh"
                clicks={176}
                conversions={12}
                revenue="$84.60"
                ctr="9.5%"
              />
              <TopDealRow
                product="Robot Vacuum Cleaner"
                clicks={154}
                conversions={9}
                revenue="$76.40"
                ctr="8.2%"
              />
              <TopDealRow
                product="Air Purifier HEPA Filter"
                clicks={132}
                conversions={8}
                revenue="$64.20"
                ctr="7.1%"
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Revenue by Category</h3>
        <div className="space-y-4">
          <CategoryRevenue category="Electronics" revenue="$1,245.30" percentage={51} />
          <CategoryRevenue category="Home & Kitchen" revenue="$564.20" percentage={23} />
          <CategoryRevenue category="Fashion" revenue="$342.10" percentage={14} />
          <CategoryRevenue category="Sports & Fitness" revenue="$198.60" percentage={8} />
          <CategoryRevenue category="Beauty" revenue="$106.60" percentage={4} />
        </div>
      </div>

      {/* Amazon Associates Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🛍️ Amazon Associates Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Clicks to Amazon</div>
            <div className="text-3xl font-bold text-gray-800">692</div>
            <div className="text-sm text-green-600 font-semibold">+15.2% vs last week</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Orders Placed</div>
            <div className="text-3xl font-bold text-gray-800">61</div>
            <div className="text-sm text-green-600 font-semibold">+8.8% conversion</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Commission Rate</div>
            <div className="text-3xl font-bold text-gray-800">5.2%</div>
            <div className="text-sm text-gray-600 font-semibold">Average</div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📥 Export Reports</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            📊 Export to CSV
          </button>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
            📈 Export to Excel
          </button>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
            📄 Generate PDF Report
          </button>
          <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold">
            📧 Email Report
          </button>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, icon, chartData }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">{title}</div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          <div className="text-sm text-green-600 font-semibold">{change}</div>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      {/* Simple chart representation */}
      <div className="flex items-end gap-1 h-12">
        {chartData.map((val: number, i: number) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
            style={{ height: `${val}%` }}
          />
        ))}
      </div>
    </div>
  )
}

function TrafficSource({ name, percentage, value, color }: any) {
  const colorMap: any = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-semibold">{name}</span>
        <span className="text-gray-600">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${colorMap[color]} h-3 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-sm text-gray-600 mt-1">{percentage}%</div>
    </div>
  )
}

function TopDealRow({ product, clicks, conversions, revenue, ctr }: any) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4 font-medium text-gray-800">{product}</td>
      <td className="py-3 px-4 text-right text-gray-700">{clicks}</td>
      <td className="py-3 px-4 text-right text-gray-700">{conversions}</td>
      <td className="py-3 px-4 text-right text-green-600 font-semibold">{revenue}</td>
      <td className="py-3 px-4 text-right text-blue-600 font-semibold">{ctr}</td>
    </tr>
  )
}

function CategoryRevenue({ category, revenue, percentage }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-semibold">{category}</span>
        <span className="text-green-600 font-bold">{revenue}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
