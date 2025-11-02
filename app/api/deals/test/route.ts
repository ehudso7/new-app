import { NextResponse } from 'next/server'

/**
 * Diagnostic endpoint to test RapidAPI connectivity
 * Usage: GET /api/deals/test?key=your-api-key
 * Or set RAPIDAPI_KEY environment variable
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const testKey = searchParams.get('key') || process.env.RAPIDAPI_KEY
  const category = searchParams.get('category') || 'electronics'
  
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.RAPIDAPI_KEY,
    testKeyProvided: !!testKey,
    category,
    status: 'unknown',
    errors: [],
    warnings: [],
    info: [],
  }

  if (!testKey) {
    diagnostics.status = 'error'
    diagnostics.errors.push('No RapidAPI key provided. Set RAPIDAPI_KEY env var or use ?key=your-key')
    return NextResponse.json(diagnostics, { status: 400 })
  }

  try {
    const searchTerm = category === 'all' ? 'deals' : category
    const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(searchTerm)}&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL`
    
    diagnostics.info.push(`Testing URL: ${url}`)
    diagnostics.info.push(`Using API key: ${testKey.substring(0, 10)}...`)

    const startTime = Date.now()
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': testKey,
        'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
      },
    })
    const responseTime = Date.now() - startTime

    diagnostics.responseTime = `${responseTime}ms`
    diagnostics.httpStatus = response.status
    diagnostics.httpStatusText = response.statusText

    const responseText = await response.text()
    let data: any

    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      diagnostics.status = 'error'
      diagnostics.errors.push('Failed to parse JSON response')
      diagnostics.rawResponse = responseText.substring(0, 500)
      return NextResponse.json(diagnostics, { status: 200 })
    }

    // Check for common errors
    if (data.message) {
      if (data.message.includes('Invalid API key')) {
        diagnostics.status = 'error'
        diagnostics.errors.push('Invalid API key')
        diagnostics.errors.push('Please verify your RAPIDAPI_KEY is correct')
      } else if (data.message.includes('quota') || data.message.includes('limit')) {
        diagnostics.status = 'warning'
        diagnostics.warnings.push('Quota/rate limit issue: ' + data.message)
      } else {
        diagnostics.info.push('API message: ' + data.message)
      }
    }

    // Check response structure
    let products: any[] = []
    if (data.data?.products) {
      products = data.data.products
      diagnostics.info.push('Found products in data.data.products')
    } else if (data.products) {
      products = data.products
      diagnostics.info.push('Found products in data.products')
    } else if (Array.isArray(data)) {
      products = data
      diagnostics.info.push('Response is array of products')
    } else if (data.results) {
      products = data.results
      diagnostics.info.push('Found products in data.results')
    } else {
      diagnostics.warnings.push('Unexpected response structure')
      diagnostics.sampleResponse = JSON.stringify(data).substring(0, 500)
    }

    diagnostics.productCount = products.length

    if (products.length > 0) {
      const sampleProduct = products[0]
      diagnostics.sampleProduct = {
        hasAsin: !!sampleProduct.asin,
        hasTitle: !!sampleProduct.product_title || !!sampleProduct.title,
        hasPrice: !!(sampleProduct.product_price || sampleProduct.price),
        hasImage: !!(sampleProduct.product_photo || sampleProduct.image),
        fields: Object.keys(sampleProduct),
      }
    }

    if (response.ok && products.length > 0) {
      diagnostics.status = 'success'
      diagnostics.info.push(`Successfully fetched ${products.length} products`)
    } else if (response.ok && products.length === 0) {
      diagnostics.status = 'warning'
      diagnostics.warnings.push('API call succeeded but no products returned')
    } else {
      diagnostics.status = 'error'
      diagnostics.errors.push(`HTTP ${response.status}: ${response.statusText}`)
    }

    return NextResponse.json(diagnostics, { status: 200 })
  } catch (error: any) {
    diagnostics.status = 'error'
    diagnostics.errors.push(error.message)
    diagnostics.errors.push(error.stack?.split('\n')[0])
    return NextResponse.json(diagnostics, { status: 500 })
  }
}
