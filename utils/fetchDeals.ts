// Client-side utility to fetch deals from your API

export async function fetchDeals(category: string = 'all', limit: number = 24) {
  try {
    const response = await fetch(`/api/deals?category=${category}&limit=${limit}`)

    if (!response.ok) {
      console.error('API response not OK:', response.status, response.statusText)
      // Try to parse error response
      try {
        const errorData = await response.json()
        console.error('Error data:', errorData)
      } catch (e) {
        // Ignore JSON parse errors
      }
      throw new Error(`Failed to fetch deals: ${response.status}`)
    }

    const data = await response.json()
    
    // Handle both response formats
    if (data.deals && Array.isArray(data.deals)) {
      return data.deals
    }
    
    // If deals is empty but we have a successful response, return empty array
    console.warn('API returned empty deals array:', data)
    return []
  } catch (error) {
    console.error('Error fetching deals:', error)
    // Return empty array on error - the UI will show "No deals found"
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
