import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">💰</span>
              <span className="text-2xl font-bold">DealPulse</span>
            </div>
            <p className="text-gray-400 text-sm">
              Discover the best Amazon deals and save money on every purchase. Your smart shopping companion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white">All Categories</Link></li>
              <li><Link href="/trending" className="text-gray-400 hover:text-white">Trending Deals</Link></li>
              <li><Link href="/saved" className="text-gray-400 hover:text-white">Saved Deals</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/categories" className="text-gray-400 hover:text-white">Electronics</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white">Home & Kitchen</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white">Fashion</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white">Sports & Fitness</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white">Toys & Games</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white">Beauty</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
            </ul>
            <div className="mt-4">
              <a
                href="mailto:support@dealpulse.com"
                className="text-primary hover:text-green-400 font-semibold"
              >
                📧 support@dealpulse.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            DealPulse is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com
          </p>
          <p className="text-gray-500 text-sm">
            © {currentYear} DealPulse. All rights reserved. Built with ❤️ for savvy shoppers.
          </p>
        </div>
      </div>
    </footer>
  )
}
