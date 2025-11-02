// Client-side utility to fetch deals from your API

export async function fetchDeals(category: string = 'all', limit: number = 24) {
  try {
    const response = await fetch(`/api/deals?category=${category}&limit=${limit}`)

    if (!response.ok) {
      throw new Error('Failed to fetch deals')
    }

    const data = await response.json()
    return data.deals || []
  } catch (error) {
    console.error('Error fetching deals:', error)
    return []
  }
}

export async function refreshDeals() {
  try {
    // Note: This should only be called from server-side or with proper authentication
    // Remove Authorization header as this is a client-side utility
    const response = await fetch('/api/deals/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization should be handled server-side or via proper auth mechanism
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error refreshing deals:', error)
    return { success: false, error: 'Failed to refresh deals' }
  }
}
