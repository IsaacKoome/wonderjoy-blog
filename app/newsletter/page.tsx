import type { Metadata } from 'next';
import NewsletterSignup from '@/app/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Free 14-Day Skincare Routine Tracker | WonderJoy AI',
  description: 'Get a free printable 14-day skincare routine tracker and one practical WonderJoy skincare email each week.',
  alternates: { canonical: 'https://wonderjoyai.com/newsletter' },
};

export default function NewsletterPage() {
  return (
    <main className="newsletter-page">
      <section className="newsletter-page__hero">
        <div className="newsletter-page__inner">
          <p className="newsletter-page__eyebrow">A calmer way to improve your routine</p>
          <h1>Fourteen days. One simple skincare habit at a time.</h1>
          <p className="newsletter-page__intro">
            Use the tracker to record what you actually apply, how your skin feels and what changes are worth keeping.
          </p>
          <NewsletterSignup placement="landing" />
          <div className="newsletter-page__steps">
            <div><strong>01</strong><span>Choose a gentle baseline routine.</span></div>
            <div><strong>02</strong><span>Track consistency instead of chasing overnight results.</span></div>
            <div><strong>03</strong><span>Review your notes before adding another product.</span></div>
          </div>
        </div>
      </section>
    </main>
  );
}
