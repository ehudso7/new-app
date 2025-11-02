#!/bin/bash

# RapidAPI Integration Test Script
# This script helps you verify if RapidAPI is actually working

echo "🔍 RapidAPI Integration Test"
echo "================================"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ Found .env.local file"
    
    # Check if RAPIDAPI_KEY is set
    if grep -q "RAPIDAPI_KEY=" .env.local; then
        KEY_VALUE=$(grep "RAPIDAPI_KEY=" .env.local | cut -d '=' -f2)
        if [ "$KEY_VALUE" = "your-rapidapi-key-here" ] || [ -z "$KEY_VALUE" ]; then
            echo "❌ RAPIDAPI_KEY is not set (default value)"
            echo ""
            echo "ACTION REQUIRED:"
            echo "1. Go to https://rapidapi.com/"
            echo "2. Subscribe to 'Real-Time Amazon Data' API"
            echo "3. Copy your API key"
            echo "4. Update RAPIDAPI_KEY in .env.local"
        else
            KEY_LENGTH=${#KEY_VALUE}
            echo "✅ RAPIDAPI_KEY is set (length: $KEY_LENGTH characters)"
            echo ""
            echo "Your key: ${KEY_VALUE:0:10}...${KEY_VALUE: -5}"
        fi
    else
        echo "❌ RAPIDAPI_KEY not found in .env.local"
    fi
else
    echo "❌ .env.local file not found"
    echo ""
    echo "Creating .env.local from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local - Please edit it with your API key"
    else
        echo "❌ .env.example not found"
    fi
fi

echo ""
echo "================================"
echo "📊 Current Deal Source Check"
echo "================================"
echo ""

# Check what's running
if [ -f "node_modules/.bin/next" ]; then
    echo "✅ Next.js is installed"
else
    echo "⚠️  Next.js not installed - run: npm install"
fi

echo ""
echo "================================"
echo "🧪 Testing Options"
echo "================================"
echo ""

echo "Option 1: Test RapidAPI directly with curl"
echo "-------------------------------------------"
echo "Run this command (replace YOUR_KEY):"
echo ""
echo "curl -X GET 'https://real-time-amazon-data.p.rapidapi.com/search?query=laptop&page=1&country=US' \\"
echo "  -H 'X-RapidAPI-Key: YOUR_KEY' \\"
echo "  -H 'X-RapidAPI-Host: real-time-amazon-data.p.rapidapi.com'"
echo ""
echo "Expected: JSON with products = API is working ✅"
echo "403 error = Wrong key or not subscribed ❌"
echo "429 error = Rate limit exceeded ⚠️"
echo ""

echo "Option 2: Test your local API endpoint"
echo "---------------------------------------"
echo "1. Start dev server: npm run dev"
echo "2. In another terminal run:"
echo "   curl http://localhost:3000/api/deals?limit=5"
echo ""
echo "3. Check the response for 'source' field:"
echo "   \"source\": \"rapidapi\" = Using RapidAPI ✅"
echo "   \"source\": \"curated\" = Using fallback deals ⚠️"
echo ""

echo "Option 3: Check production logs"
echo "--------------------------------"
echo "If deployed to Vercel:"
echo "1. Go to Vercel Dashboard"
echo "2. Select your project"
echo "3. Click 'Logs' tab"
echo "4. Look for these messages:"
echo "   - '✅ Successfully fetched from RapidAPI'"
echo "   - '❌ RapidAPI error'"
echo "   - '📦 Using curated Amazon deals'"
echo ""

echo "================================"
echo "🐛 Common Issues"
echo "================================"
echo ""
echo "Issue 1: 'Demo deals still showing'"
echo "- Check RAPIDAPI_KEY is set correctly"
echo "- Restart dev server after changing .env.local"
echo "- Clear browser cache (Ctrl+Shift+R)"
echo ""
echo "Issue 2: '403 Forbidden error'"
echo "- You didn't subscribe to the API on RapidAPI"
echo "- Wrong API endpoint"
echo "- API key has extra spaces/newlines"
echo ""
echo "Issue 3: 'Different products each time'"
echo "- This is GOOD! It means RapidAPI is working ✅"
echo "- Curated deals are always the same 14 products"
echo ""

echo "================================"
echo "✅ Quick Verification"
echo "================================"
echo ""
echo "How to tell which source you're using:"
echo ""
echo "CURATED DEALS (Not using RapidAPI):"
echo "- Always shows same 14 products"
echo "- IDs have '-0', '-1' suffix (e.g., B0BN3K4C7K-0)"
echo "- Products: AirPods Pro, Fire TV Stick, Roomba, etc."
echo ""
echo "RAPIDAPI DEALS (Working correctly):"
echo "- Different products on each refresh"
echo "- IDs are pure ASINs (e.g., B0ABCDEFGH)"
echo "- Variety of products based on search term"
echo ""

echo "================================"
echo "🚀 Next Steps"
echo "================================"
echo ""
echo "1. Get your RapidAPI key: https://rapidapi.com/"
echo "2. Test with curl command above"
echo "3. Add key to .env.local"
echo "4. Restart dev server"
echo "5. Test /api/deals endpoint"
echo "6. Check terminal logs for '✅ Successfully fetched from RapidAPI'"
echo ""
echo "Need help? Check RAPIDAPI_DIAGNOSIS.md for detailed troubleshooting"
echo ""
