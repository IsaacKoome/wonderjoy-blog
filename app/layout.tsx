import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wonderjoy AI - Daily Skincare Guidance',
  description: 'Simple skincare tips, routines, and solutions that actually work for healthy, glowing skin.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="p:domain_verify" content="c13622a3100474f214fd617ea3edad41"/>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <nav className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-pink-600">
              WonderJoy AI
            </Link>
            <div className="space-x-6">
              <Link href="/" className="text-gray-600 hover:text-pink-600 transition">
                Home
              </Link>
              <Link href="/analyze" className="text-gray-600 hover:text-pink-600 transition">
                  Analyze
              </Link>
              <Link href="/articles" className="text-gray-600 hover:text-pink-600 transition">
                Articles
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-pink-600 transition">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-pink-600 transition">Contact</Link>
            </div>
          </div>
        </nav>
        {children}
        <footer className="bg-gray-900 text-white mt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Wonderjoy AI</h3>
                <p className="text-gray-400">Daily guidance to healthy, glowing skin.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition">About</Link></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
                  <li><Link href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Connect</h3>
                <p className="text-gray-400">Coming soon: Newsletter & Social Media</p>
              </div>
            </div>
            
            {/* Amazon Affiliate Disclosure */}
            <div className="border-t border-gray-800 mt-8 pt-6">
              <div className="text-xs text-gray-500 text-center space-y-2">
                <p>
                  As an Amazon Associate, Wonderjoy AI earns from qualifying purchases. 
                  This means if you click on an affiliate link and make a purchase, 
                  we may receive a commission at no extra cost to you.
                </p>
                <p>
                  All recommendations are based on honest research and dermatologist-approved advice. 
                  We only recommend products we genuinely believe in.
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
              <p>&copy; 2026 Wonderjoy AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
        
        {/* Google Analytics */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}