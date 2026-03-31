// app/(about)/about/page.tsx

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Wonderjoy AI
          </h1>
          <div className="w-20 h-1 bg-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At Wonderjoy AI, we believe that healthy, glowing skin should be accessible to everyone. 
              Our mission is to provide simple, science-backed skincare guidance that actually works. 
              No complicated 10-step routines. No expensive products you don't need. Just honest, 
              effective advice for real people.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              Wonderjoy AI was born from a simple observation: most skincare advice is overwhelming, 
              contradictory, or designed to sell products. We started this blog to cut through the 
              noise and share what really matters for healthy skin. Our approach combines 
              dermatological research with practical, everyday application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Believe</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-pink-500 text-xl">✨</span>
                <span><strong className="text-gray-900">Simplicity works:</strong> A consistent 4-step routine beats a complicated 10-step system.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 text-xl">🔬</span>
                <span><strong className="text-gray-900">Science over hype:</strong> We follow peer-reviewed research, not influencer trends.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 text-xl">💚</span>
                <span><strong className="text-gray-900">Skin health is personal:</strong> What works for you might not work for others, and that's okay.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 text-xl">🌿</span>
                <span><strong className="text-gray-900">Affordable options exist:</strong> Great skin doesn't require luxury budgets.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why "Wonderjoy"?</h2>
            <p className="text-gray-700 leading-relaxed">
              We chose "Wonderjoy" because discovering what works for your skin should be a journey 
              of wonder and joy, not frustration. When you find the right routine and see real 
              results, that feeling of confidence is pure joy.
            </p>
          </section>

          <div className="bg-pink-50 rounded-xl p-6 text-center">
            <p className="text-gray-800 font-medium">
              Thank you for being part of our journey to make skincare simpler and more joyful for everyone.
            </p>
            <p className="text-pink-600 mt-2">— The Wonderjoy AI Team</p>
          </div>
        </div>
      </div>
    </main>
  );
}