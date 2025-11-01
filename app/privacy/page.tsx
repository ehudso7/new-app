export default function PrivacyPage() {
  const lastUpdated = 'November 1, 2025'

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-12">Last updated: {lastUpdated}</p>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              DealPulse ("we," "our," or "us") respects your privacy and is committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              DealPulse is designed with privacy in mind. We collect minimal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Locally Stored Data:</strong> Saved deals are stored in your browser's local storage and never transmitted to our servers.</li>
              <li><strong>Analytics:</strong> We may use aggregated, anonymous analytics to improve our service (e.g., popular categories, click rates).</li>
              <li><strong>Email (Optional):</strong> If you subscribe to deal alerts, we collect and store your email address securely.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use collected information to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide and improve our deal-finding service</li>
              <li>Send deal alerts and notifications (only if you subscribe)</li>
              <li>Analyze website traffic and user behavior (anonymously)</li>
              <li>Ensure the security and proper functioning of our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              DealPulse uses the following third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Amazon Associates:</strong> We participate in the Amazon Services LLC Associates Program. When you click on deals and make purchases, Amazon may collect data according to their privacy policy.</li>
              <li><strong>Hosting Provider:</strong> Our website is hosted on Vercel, which may collect technical data like IP addresses for security purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use minimal cookies for essential functionality (e.g., remembering your preferences). We do not use
              tracking cookies for advertising purposes. You can disable cookies in your browser settings, though this
              may affect some features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your data. However, no method
              of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of email communications at any time</li>
              <li>Object to data processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              DealPulse is not intended for children under 13. We do not knowingly collect personal information from
              children. If you believe we have collected data from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this privacy policy from time to time. Changes will be posted on this page with an updated
              revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this privacy policy or your data, please contact us at:{' '}
              <a href="mailto:privacy@dealpulse.com" className="text-primary hover:underline">
                privacy@dealpulse.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
