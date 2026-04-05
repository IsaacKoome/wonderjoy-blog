// app/(about)/contact/page.tsx

'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulate form submission (replace with actual form handling later)
    setTimeout(() => {
      setFormStatus('sent');
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <div className="w-20 h-1 bg-pink-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Have questions, feedback, or collaboration ideas? We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                    placeholder="Question about skincare routine"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition resize-vertical"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formStatus !== 'idle'}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'sending' && 'Sending...'}
                  {formStatus === 'sent' && '✓ Message Sent!'}
                  {formStatus === 'error' && 'Error - Please try again'}
                  {formStatus === 'idle' && 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-pink-500 text-xl">📧</span>
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <a href="mailto:2004742@students.kcau.ac.ke" className="text-gray-600 hover:text-pink-500 transition">
                      2004742@students.kcau.ac.ke
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-pink-500 text-xl">⏰</span>
                  <div>
                    <p className="font-medium text-gray-800">Response Time</p>
                    <p className="text-gray-600">We typically respond within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Collaborations</h3>
              <p className="text-gray-700 mb-3">
                For PR, guest posts, or partnership inquiries, please email us with "Collaboration" in the subject line.
              </p>
              <p className="text-sm text-gray-600">
                📢 We welcome guest posts from skincare experts and dermatologists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}