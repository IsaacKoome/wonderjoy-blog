import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wonderjoy AI - Daily Skincare Guidance',
  description: 'Simple skincare tips, routines, and solutions that actually work for healthy, glowing skin.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-pink-600">
              Wonderjoy AI
            </Link>
            <div className="space-x-6">
              <Link href="/" className="text-gray-600 hover:text-pink-600 transition">
                Home
              </Link>
              <Link href="/articles" className="text-gray-600 hover:text-pink-600 transition">
                Articles
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}