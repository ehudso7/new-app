# How to Add RapidAPI Key on iPhone (Claude Code)

## Quick Method: Have Claude Add It

1. Copy your RapidAPI key from Vercel:
   - Open vercel.com in Safari
   - Go to Settings → Environment Variables
   - Find `RAPIDAPI_KEY`
   - Copy the value

2. Paste it in chat:
   "My RapidAPI key is: [paste-your-key-here]"

3. I'll update .env.local for you automatically!

## What the .env.local File Should Look Like

```bash
# Amazon Associates Configuration
NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG=dealsplus077-20

# RapidAPI Configuration (PASTE YOUR KEY HERE)
RAPIDAPI_KEY=your-actual-rapidapi-key-goes-here

# Email Marketing (optional)
MAILCHIMP_API_KEY=
MAILCHIMP_AUDIENCE_ID=

# Cron job secret
CRON_SECRET=dealpulse-secret-2025
```

## Example with Real Key Format

If your key looks like: `abc123xyz789def456ghi`

The line should be:
```bash
RAPIDAPI_KEY=abc123xyz789def456ghi
```

(No quotes, no spaces)

## After Adding the Key

The .env.local file is only for local testing on a computer. Since your key is already in Vercel environment variables, **your deployed app is already using RapidAPI!**

This file helps if you want to test locally by running `npm run dev` on a laptop.

## Verify Your Vercel Deployment

Your live site should already be working with RapidAPI since you added the key to Vercel.

Test it: Visit `https://your-app.vercel.app/api/deals?limit=5`

You should see JSON with product data.
