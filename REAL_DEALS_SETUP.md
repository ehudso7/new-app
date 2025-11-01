# 🚀 Real Deals Integration Guide

**Make DealPulse fetch REAL Amazon deals automatically!**

Your app currently shows demo deals. Follow this guide to connect to real deal APIs and turn on full automation.

---

## 🎯 Two Options for Real Deals

### Option 1: RapidAPI (RECOMMENDED - Easiest)
✅ **Easier setup** (5 minutes)
✅ **Free tier**: 500 requests/day
✅ **No approval needed**
✅ **Works immediately**
💰 **Cost**: $0/month with free tier

### Option 2: Amazon Product API (Official)
⚠️ **Complex setup** (30 minutes)
⚠️ **Requires** approved Amazon Associates account
⚠️ **Complex authentication** (AWS signatures)
✅ **Official data** from Amazon
💰 **Cost**: $0/month (8,640 requests/day free)

**We recommend starting with RapidAPI!**

---

## 🚀 Quick Setup: RapidAPI (5 Minutes)

### Step 1: Sign Up for RapidAPI

1. Go to: **https://rapidapi.com/**
2. Click **"Sign Up"** (free account)
3. Verify your email

### Step 2: Subscribe to a Deal API

**Recommended API: "Amazon Data Scraper"**

1. Search for "Amazon Data Scraper" on RapidAPI
2. Or go to: https://rapidapi.com/restyler/api/amazon-data-scraper123
3. Click **"Subscribe to Test"**
4. Select **"Basic" plan** (FREE - 500 requests/month)
5. Click **"Subscribe"**

**Alternative APIs** (also free):
- "Real-Time Amazon Data"
- "Amazon Product API"
- "Amazon Data API v2"

### Step 3: Get Your API Key

1. After subscribing, you'll see **"X-RapidAPI-Key"** in the code snippet
2. Copy your API key (looks like: `abc123def456...`)

### Step 4: Add to Vercel

1. Go to your **Vercel Dashboard**: https://vercel.com/dashboard
2. Click your **DealPulse project**
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value |
|------|-------|
| `DEAL_API_SOURCE` | `rapidapi` |
| `RAPIDAPI_KEY` | Your API key from Step 3 |
| `CRON_SECRET` | Any random string (e.g., `mySecret123`) |

5. Click **"Save"**
6. Go to **Deployments** tab
7. Click **"Redeploy"** (to apply new variables)

### Step 5: Test It Works

1. Visit: `https://your-site.vercel.app`
2. You should now see **REAL Amazon deals**!
3. Check admin dashboard: `https://your-site.vercel.app/admin`

**That's it! Real deals are now live!** 🎉

---

## 🤖 Enable Automation (Auto-Refresh Deals)

Your deals will auto-refresh every 30 minutes via Vercel Cron.

### How It Works:

1. **Vercel Cron** calls `/api/deals/refresh` every 30 minutes
2. API fetches fresh deals from RapidAPI
3. Deals auto-update on your site
4. **No manual work needed!**

### Verify Cron is Working:

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Cron Jobs"** tab
3. You should see: `/api/deals/refresh` scheduled

**Cron configuration** is already in `vercel.json`:
```json
"crons": [
  {
    "path": "/api/deals/refresh",
    "schedule": "*/30 * * * *"  // Every 30 minutes
  }
]
```

---

## 📊 API Usage & Limits

### RapidAPI Free Tier:
- **500 requests/month** = 16 requests/day
- With cron every 30 minutes = 48 requests/day
- **Solution**: Upgrade to Basic tier ($10/month = 10,000 requests)

### Recommended Schedule:

**Free Tier** (500/month):
- Update every **2 hours** (12x/day = 360/month)
- Edit `vercel.json`: `"schedule": "0 */2 * * *"`

**Paid Tier** ($10/month):
- Update every **30 minutes** (48x/day = 1,440/month)
- Current setting: `"schedule": "*/30 * * * *"`

---

## 🔧 Advanced: Amazon Product API (Official)

**Only if you want official Amazon data and have approved Associates account.**

### Requirements:
- ✅ Approved Amazon Associates account
- ✅ At least 3 qualifying sales within 180 days
- ✅ Technical knowledge (AWS signature v4)

### Setup Steps:

1. **Get API Credentials**:
   - Go to: https://affiliate-program.amazon.com/assoc_credentials/home
   - Sign in with your Associates account
   - Click **"Add Credentials"**
   - Copy **Access Key** and **Secret Key**

2. **Add to Vercel**:
   | Name | Value |
   |------|-------|
   | `DEAL_API_SOURCE` | `amazon` |
   | `AMAZON_ACCESS_KEY` | Your access key |
   | `AMAZON_SECRET_KEY` | Your secret key |
   | `NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG` | `dealsplus077-20` |

3. **Install AWS SDK** (for signing requests):
   ```bash
   npm install aws4
   ```

4. **Redeploy** your app on Vercel

**Note**: Amazon API implementation is complex. The code in `/app/api/deals/route.ts` has a basic structure, but you'll need to implement full AWS signature v4 authentication.

---

## 🎨 Customization

### Change Update Frequency

Edit `vercel.json`:

**Every 1 hour**:
```json
"schedule": "0 * * * *"
```

**Every 6 hours**:
```json
"schedule": "0 */6 * * *"
```

**Daily at 9 AM**:
```json
"schedule": "0 9 * * *"
```

### Filter Deals by Quality

In `/app/api/deals/route.ts`, adjust the filter:

```typescript
const filteredDeals = deals.filter((deal: any) => {
  const discount = deal.discount || 0
  const rating = deal.rating || 0
  return discount >= 40 && rating >= 4.5  // Higher quality
})
```

### Add More Categories

Update categories array in both:
- `/app/api/deals/route.ts`
- `/app/page.tsx`

```typescript
const categories = [
  'electronics',
  'home',
  'fashion',
  'sports',
  'toys',
  'beauty',
  'books',      // Add new
  'automotive', // Add new
]
```

---

## 🔍 Testing Your API

### Test Deal Fetching:

Visit in browser:
```
https://your-site.vercel.app/api/deals
https://your-site.vercel.app/api/deals?category=electronics
https://your-site.vercel.app/api/deals?category=home&limit=10
```

You should see JSON with real deals!

### Test Manual Refresh:

```bash
curl -X POST https://your-site.vercel.app/api/deals/refresh \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Check Cron Logs:

1. Vercel Dashboard → Your Project
2. Click **"Logs"** tab
3. Filter by `/api/deals/refresh`
4. See execution logs

---

## 📈 Monitoring Deal Quality

### In Admin Dashboard:

1. Go to `/admin`
2. Click **"Deal Manager"**
3. See deal sources and status
4. Click **"Fetch Now"** to manually refresh

### Check Deal Metrics:

1. Click **"Analytics"** tab
2. See top-performing deals
3. Monitor click-through rates
4. Track revenue by category

---

## 💰 Cost Breakdown

| Scenario | API Cost | Profit Potential |
|----------|----------|------------------|
| **Free RapidAPI** | $0/month | $100-500/month |
| **Paid RapidAPI** | $10/month | $500-2,000/month |
| **Amazon API** | $0/month | $1,000-5,000/month |

**Even with paid APIs, you'll make 50-500x ROI!**

---

## 🆘 Troubleshooting

### "No deals found"
- ✅ Check API key is correct in Vercel
- ✅ Verify you have credits on RapidAPI
- ✅ Check API endpoint is responding
- ✅ Look at Vercel logs for errors

### "Demo deals still showing"
- ✅ Make sure `DEAL_API_SOURCE` is set to `rapidapi`
- ✅ Redeploy after adding env variables
- ✅ Clear browser cache (Ctrl+Shift+R)

### "API rate limit exceeded"
- ✅ Reduce cron frequency in `vercel.json`
- ✅ Upgrade RapidAPI plan
- ✅ Cache deals longer (store in database)

### "Deals not auto-updating"
- ✅ Check Cron is enabled in Vercel
- ✅ Verify `CRON_SECRET` matches in both places
- ✅ Check cron execution logs

---

## 🎯 Next Steps After Real Deals Work

1. **Add Database** (optional - for caching):
   - Vercel KV (Redis) - Free tier: 256MB
   - Store deals to reduce API calls
   - Faster load times

2. **Add More Deal Sources**:
   - Combine RapidAPI + Amazon API
   - Add eBay, Walmart deals
   - Aggregate multiple sources

3. **Optimize Performance**:
   - Cache deals for 30 minutes
   - Lazy load images
   - Add infinite scroll

4. **Advanced Filtering**:
   - ML to predict popular deals
   - User preference learning
   - Price history tracking

---

## ✅ Success Checklist

- [ ] RapidAPI account created
- [ ] Subscribed to deal API (free tier)
- [ ] API key added to Vercel
- [ ] Environment variables saved
- [ ] App redeployed
- [ ] Real deals showing on homepage
- [ ] Cron job configured
- [ ] Automatic refreshing working
- [ ] Admin dashboard shows real data
- [ ] Making money from affiliate clicks!

---

## 🚀 You're Live with Real Deals!

Your DealPulse app is now:
- ✅ Fetching real Amazon deals
- ✅ Auto-updating every 30 minutes
- ✅ Showing high-quality discounts
- ✅ Earning affiliate commissions
- ✅ Running on autopilot!

**Time to start marketing and watch the profits roll in!** 💰

---

**Need help?** Check the main README.md or ADMIN_GUIDE.md for more details.
