// Client-side utility to fetch deals from your API

export async function fetchDeals(category: string = 'all', limit: number = 24) {
  try {
    const response = await fetch(`/api/deals?category=${category}&limit=${limit}`, {
      cache: 'no-store', // Ensure fresh data
    })

    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText)
      throw new Error(`Failed to fetch deals: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      console.warn('API returned unsuccessful response:', data.error || data.warning)
    }

    const deals = data.deals || []
    
    if (deals.length === 0) {
      console.warn(`No deals returned for category: ${category}`)
      // Retry once after a short delay
      await new Promise(resolve => setTimeout(resolve, 500))
      const retryResponse = await fetch(`/api/deals?category=${category}&limit=${limit}`, {
        cache: 'no-store',
      })
      if (retryResponse.ok) {
        const retryData = await retryResponse.json()
        return retryData.deals || []
      }
    }
    
    return deals
  } catch (error) {
    console.error('Error fetching deals:', error)
    // Return empty array - let UI handle the empty state
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
