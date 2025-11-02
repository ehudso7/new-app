// This simulates deal data. In production, this would come from:
// 1. Amazon Product Advertising API (requires Associates account)
// 2. Web scraping (legal gray area, use cautiously)
// 3. Deal aggregator APIs (some have free tiers)
// 4. Manual curation + affiliate links

const categories = ['electronics', 'home', 'fashion', 'sports', 'toys', 'beauty']

const productTemplates = {
  electronics: [
    'Wireless Bluetooth Earbuds with Noise Cancellation',
    'Smart Watch with Heart Rate Monitor',
    'Portable Phone Charger 20000mAh',
    '4K Webcam for Streaming and Video Calls',
    'RGB Gaming Mouse with 7 Programmable Buttons',
    'USB-C Hub with HDMI and Card Reader',
    'Bluetooth Speaker Waterproof Portable',
    'Wireless Charging Pad for iPhone and Android',
  ],
  home: [
    'Robot Vacuum Cleaner with Self-Emptying Base',
    'Air Purifier with HEPA Filter for Large Rooms',
    'Smart LED Light Bulbs (4-Pack)',
    'Electric Kettle with Temperature Control',
    'Memory Foam Pillow Set of 2',
    'Non-Stick Cookware Set 10-Piece',
    'Coffee Maker with Programmable Timer',
    'Weighted Blanket for Better Sleep',
  ],
  fashion: [
    'Leather Crossbody Bag for Women',
    'Mens Casual Athletic Sneakers',
    'Polarized Sunglasses UV Protection',
    'Winter Warm Knit Beanie Hat',
    'Stainless Steel Watch for Men',
    'Yoga Pants High Waist Workout Leggings',
    'Leather Belt Automatic Buckle',
    'Backpack Laptop Bag Water Resistant',
  ],
  sports: [
    'Yoga Mat Extra Thick with Carrying Strap',
    'Resistance Bands Set of 5',
    'Adjustable Dumbbells 5-25 lbs Pair',
    'Foam Roller for Muscle Recovery',
    'Jump Rope for Cardio Workout',
    'Gym Gloves with Wrist Support',
    'Protein Shaker Bottle with Mixer',
    'Fitness Tracker with Step Counter',
  ],
  toys: [
    'Building Blocks Set 1000 Pieces',
    'Remote Control Car Off-Road Racing',
    'Educational STEM Learning Kit',
    'Puzzle Jigsaw 1000 Pieces for Adults',
    'Board Game for Family Game Night',
    'Plush Stuffed Animal Giant Teddy Bear',
    'Arts and Crafts Supplies Kit for Kids',
    'Science Experiment Kit for Children',
  ],
  beauty: [
    'Facial Cleansing Brush Waterproof',
    'Hair Dryer Ionic with Diffuser',
    'Makeup Brush Set Professional 12 Piece',
    'Vitamin C Serum for Face Anti-Aging',
    'Nail Polish Set 12 Colors',
    'Bath Bombs Gift Set Organic',
    'Electric Toothbrush Sonic Rechargeable',
    'Moisturizer Cream Hyaluronic Acid',
  ],
}

export function generateDeals() {
  const deals = []
  let id = 1

  for (const category of categories) {
    const templates = productTemplates[category as keyof typeof productTemplates]
    for (let i = 0; i < 4; i++) {
      const template = templates[i % templates.length]
      const originalPrice = Math.random() * 100 + 20
      const discount = Math.floor(Math.random() * 60) + 20
      const currentPrice = originalPrice * (1 - discount / 100)

      deals.push({
        id: `deal-${id++}`,
        title: template,
        originalPrice: Math.round(originalPrice * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        discount,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        reviews: Math.floor(Math.random() * 10000) + 100,
        imageUrl: '', // Would be actual Amazon image URL
        category,
        // Amazon Associates affiliate link with your tag
        amazonUrl: `https://www.amazon.com/s?k=${encodeURIComponent(template)}&tag=dealsplus077-20`,
        isLightningDeal: Math.random() > 0.7,
        stockStatus: Math.random() > 0.8 ? 'Only 3 left in stock!' : undefined,
      })
    }
  }

  // Sort by discount percentage (highest first)
  return deals.sort((a, b) => b.discount - a.discount)
}
