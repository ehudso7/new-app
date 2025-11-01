'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How does DealPulse find deals?',
      answer: 'DealPulse uses advanced AI algorithms to scan Amazon 24/7, monitoring millions of products for price drops, lightning deals, and exclusive discounts. We verify each deal to ensure genuine savings before featuring it on our platform.',
    },
    {
      question: 'Are these real Amazon deals?',
      answer: 'Yes! Every deal on DealPulse links directly to Amazon.com. We are participants in the Amazon Associates Program, which means when you make a purchase through our links, Amazon pays us a small commission at no extra cost to you.',
    },
    {
      question: 'How often are deals updated?',
      answer: 'Our system refreshes deals every 30 minutes to catch the latest discounts and lightning deals. Some deals may expire quickly, so we recommend acting fast when you see a great offer!',
    },
    {
      question: 'Is DealPulse free to use?',
      answer: 'Absolutely! DealPulse is completely free for users. We earn a small commission from Amazon when you make purchases through our links, which helps us maintain the platform and continue providing great deals.',
    },
    {
      question: 'How do I save deals?',
      answer: 'Click the heart icon on any deal card to save it to your Saved Deals page. Your saved deals are stored locally in your browser, so you can access them anytime.',
    },
    {
      question: 'Can I share deals with friends?',
      answer: 'Yes! Click the share button on any deal to share via social media, messaging apps, or copy the link to your clipboard. Help your friends save money too!',
    },
    {
      question: 'Do I need an Amazon account?',
      answer: 'Yes, you\'ll need an Amazon account to complete purchases. When you click "View on Amazon," you\'ll be redirected to Amazon where you can add items to your cart and checkout.',
    },
    {
      question: 'What is Amazon Prime and do I need it?',
      answer: 'Amazon Prime is a subscription service that offers free shipping, streaming, and exclusive deals. While you don\'t need Prime to use DealPulse, many deals are Prime-eligible for faster, free shipping.',
    },
    {
      question: 'How do I know if a deal is still available?',
      answer: 'Lightning deals and limited-time offers are marked with special badges. However, Amazon deals can expire at any time, so we recommend checking the Amazon product page for current availability and pricing.',
    },
    {
      question: 'Can I suggest deals or categories?',
      answer: 'Absolutely! We love hearing from our community. Contact us through our Contact page with your suggestions, and we\'ll do our best to include them in future updates.',
    },
    {
      question: 'Do you collect my personal data?',
      answer: 'No, DealPulse does not collect or store your personal information. Saved deals are stored locally in your browser. We respect your privacy and don\'t track your purchases or browsing behavior.',
    },
    {
      question: 'What if I have an issue with my Amazon order?',
      answer: 'Since all purchases are made through Amazon, any order issues should be directed to Amazon\'s customer service. We don\'t process payments or handle shipping - we simply help you discover great deals!',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Everything you need to know about DealPulse
        </p>

        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <span className="text-2xl text-primary flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-6 opacity-90">
            Can't find the answer you're looking for? Our support team is here to help!
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  )
}
