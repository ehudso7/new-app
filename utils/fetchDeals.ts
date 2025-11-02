// Client-side utility to fetch deals from your API

export async function fetchDeals(category: string = 'all', limit: number = 24) {
  try {
    const response = await fetch(`/api/deals?category=${category}&limit=${limit}`)

    if (!response.ok) {
      throw new Error('Failed to fetch deals')
    }

    const data = await response.json()
    const deals = Array.isArray(data.deals) ? data.deals : []

    return deals.filter((deal: any) => {
      if (!deal || typeof deal !== 'object') return false
      if (!deal.image || typeof deal.image !== 'string') return false
      return deal.image.startsWith('http')
    })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return []
  }
}

export async function refreshDeals() {
  try {
    const response = await fetch('/api/deals/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error refreshing deals:', error)
    return { success: false, error: 'Failed to refresh deals' }
  }
}
