export default function TermsPage() {
  const lastUpdated = 'November 1, 2025'

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-12">Last updated: {lastUpdated}</p>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using DealPulse, you accept and agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Description</h2>
            <p className="text-gray-700 leading-relaxed">
              DealPulse is a deal aggregation platform that helps users discover discounted products on Amazon.
              We curate and display deals from Amazon.com and earn affiliate commissions on qualifying purchases.
              We do not sell products directly, process payments, or handle shipping.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Amazon Associates Disclosure</h2>
            <p className="text-gray-700 leading-relaxed">
              DealPulse is a participant in the Amazon Services LLC Associates Program, an affiliate advertising
              program designed to provide a means for sites to earn advertising fees by advertising and linking
              to Amazon.com. When you make a purchase through our links, we may earn a commission at no additional
              cost to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deal Accuracy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to provide accurate deal information, but:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Prices and availability are subject to change without notice</li>
              <li>Deals may expire or become unavailable at any time</li>
              <li>Amazon determines final pricing and product availability</li>
              <li>We are not responsible for pricing errors or discrepancies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">When using DealPulse, you agree to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Use the service for lawful purposes only</li>
              <li>Not attempt to disrupt or harm the platform</li>
              <li>Not scrape, copy, or redistribute our content without permission</li>
              <li>Verify all deal details on Amazon before purchasing</li>
              <li>Comply with Amazon's terms and conditions when making purchases</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Purchases and Returns</h2>
            <p className="text-gray-700 leading-relaxed">
              All purchases are made through Amazon.com and are subject to Amazon's terms of sale, return policy,
              and customer service. DealPulse is not responsible for order fulfillment, shipping, returns, refunds,
              or customer support related to your Amazon purchases.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The DealPulse platform, including its design, features, and content, is protected by copyright and
              other intellectual property laws. Product images, descriptions, and trademarks are the property of
              their respective owners (primarily Amazon and product manufacturers).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              DealPulse is provided "as is" without warranties of any kind. We are not liable for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Product quality, defects, or dissatisfaction with purchases</li>
              <li>Pricing errors or unavailable deals</li>
              <li>Loss or damages resulting from use of our service</li>
              <li>Issues with Amazon orders, shipping, or customer service</li>
              <li>Technical errors, downtime, or data loss</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              DealPulse contains links to Amazon.com and potentially other third-party websites. We are not
              responsible for the content, privacy policies, or practices of these external sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications to Service</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue DealPulse (or any part thereof) at any time
              without notice. We may also update these Terms of Service periodically, and continued use constitutes
              acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to terminate or restrict access to DealPulse for any user who violates these
              terms or engages in harmful behavior.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of the United States.
              Any disputes shall be resolved in the appropriate courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms of Service, please contact us at:{' '}
              <a href="mailto:legal@dealpulse.com" className="text-primary hover:underline">
                legal@dealpulse.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
