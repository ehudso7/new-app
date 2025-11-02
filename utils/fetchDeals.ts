// Client-side utility to fetch deals from your API

export async function fetchDeals(category: string = 'all', limit: number = 24) {
  try {
    const response = await fetch(`/api/deals?category=${category}&limit=${limit}`)

    if (!response.ok) {
      throw new Error('Failed to fetch deals')
    }

    const data = await response.json()
    const deals = data.deals || []
    
    // Debug logging
    console.log(`fetchDeals: Received ${deals.length} deals`)
    if (deals.length > 0) {
      console.log(`First deal: ${deals[0].title}, image: ${deals[0].image}`)
      // Check if images are present
      const dealsWithImages = deals.filter((d: any) => d.image && d.image.trim() !== '')
      console.log(`Deals with images: ${dealsWithImages.length}/${deals.length}`)
    }
    
    return deals
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
