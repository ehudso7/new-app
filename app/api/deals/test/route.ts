import { NextResponse } from 'next/server'

/**
 * Diagnostic endpoint to test RapidAPI configuration
 * Usage: GET /api/deals/test
 */
export async function GET() {
  const rapidApiKey = process.env.RAPIDAPI_KEY
  const hasKey = !!(rapidApiKey && rapidApiKey !== 'your-rapidapi-key-here')
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    rapidApi: {
      configured: hasKey,
      keyLength: rapidApiKey ? rapidApiKey.length : 0,
      keyPrefix: rapidApiKey && hasKey ? rapidApiKey.substring(0, 8) + '...' : 'Not set',
    },
    affiliate: {
      tag: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || 'dealsplus077-20',
    },
    recommendations: [] as string[],
  }

  // Add recommendations
  if (!hasKey) {
    diagnostics.recommendations.push(
      'Add RAPIDAPI_KEY to your environment variables',
      'Sign up at https://rapidapi.com and subscribe to "Real-Time Amazon Data" API',
      'The app will work with curated deals, but RapidAPI provides live, auto-updating deals'
    )
  } else {
    diagnostics.recommendations.push(
      'RapidAPI is configured - test it by visiting /api/deals?category=electronics&limit=5',
      'Check server logs for [RapidAPI] messages to see if it\'s working',
      'If you see authentication errors, verify your API key is correct',
      'If you see rate limit errors, upgrade your RapidAPI plan'
    )
  }

  // Try a test fetch if key is configured
  if (hasKey) {
    try {
      const testUrl = 'https://real-time-amazon-data.p.rapidapi.com/search?query=deals&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL'
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey!,
          'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
        },
        signal: controller.signal,
      }).finally(() => {
        clearTimeout(timeoutId)
      })

      diagnostics.rapidApi = {
        ...diagnostics.rapidApi,
        testStatus: response.status,
        testStatusText: response.statusText,
        testOk: response.ok,
      }

      if (response.ok) {
        const data = await response.json()
        diagnostics.rapidApi.testResponse = {
          hasData: !!data.data,
          hasProducts: !!data.data?.products,
          hasResults: !!data.results,
          topLevelKeys: Object.keys(data),
          productCount: data.data?.products?.length || data.results?.length || 0,
        }
        diagnostics.recommendations.push('✅ RapidAPI test successful! The API is working correctly.')
      } else {
        const errorText = await response.text().catch(() => 'Unknown error')
        diagnostics.rapidApi.testError = errorText.substring(0, 500)
        
        if (response.status === 401 || response.status === 403) {
          diagnostics.recommendations.push('❌ Authentication failed - check your API key')
        } else if (response.status === 429) {
          diagnostics.recommendations.push('⚠️ Rate limit exceeded - upgrade your plan')
        } else {
          diagnostics.recommendations.push(`❌ API error: ${response.status} ${response.statusText}`)
        }
      }
    } catch (error: any) {
      diagnostics.rapidApi.testError = error.message
      if (error.name === 'AbortError') {
        diagnostics.recommendations.push('⏱️ Request timed out - API may be slow or unavailable')
      } else {
        diagnostics.recommendations.push(`❌ Test failed: ${error.message}`)
      }
    }
  }

  return NextResponse.json(diagnostics, {
    status: diagnostics.recommendations.some(r => r.includes('✅')) ? 200 : 200, // Always 200 for diagnostics
  })
}
