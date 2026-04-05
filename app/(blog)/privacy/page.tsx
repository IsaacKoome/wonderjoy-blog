// app/(blog)/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <div className="w-20 h-1 bg-pink-500 mx-auto rounded-full"></div>
          <p className="text-gray-500 mt-4">Last updated: March 31, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-pink max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-700">
              Welcome to Wonderjoy AI. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Personal Data:</strong> Name, email address (when you contact us or subscribe to our newsletter)</li>
              <li><strong>Usage Data:</strong> Browser type, pages visited, time spent on pages, and other analytics data</li>
              <li><strong>Cookies:</strong> Small files stored on your device to enhance your browsing experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website content and user experience</li>
              <li>Send occasional newsletters (only if you explicitly subscribe)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookies & Tracking</h2>
            <p className="text-gray-700">
              We use cookies to analyze site traffic, remember user preferences, and improve our content. 
              You can control cookie settings through your browser preferences. Third-party services like 
              Google Analytics may also use cookies to provide anonymized usage data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Links</h2>
            <p className="text-gray-700">
              Our articles may contain links to external websites. We are not responsible for the privacy practices 
              of other sites. We encourage you to read their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
            <p className="text-gray-700">
              We implement reasonable security measures to protect your data. However, no internet transmission 
              is 100% secure. You share information at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
            <p className="text-gray-700">
              Depending on your location, you may have the right to access, correct, or delete your personal data. 
              To exercise these rights, please contact us at <a href="mailto:privacy@wonderjoy.ai" className="text-pink-500 hover:underline">privacy@wonderjoy.ai</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Children's Privacy</h2>
            <p className="text-gray-700">
              Wonderjoy AI does not knowingly collect data from children under 13. If you believe a child has 
              provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this privacy policy periodically. The "Last updated" date at the top indicates when 
              changes were made. Continued use of our site constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              For questions about this privacy policy or your data, please contact us at:
              <br />
              📧 <a href="mailto:2004742@students.kcau.ac.ke" className="text-pink-500 hover:underline">privacy@wonderjoy.ai</a>
              <br />
              🌐 <a href="https://wonderjoyai.com" className="text-pink-500 hover:underline">wonderjoy-blog.vercel.app</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}