'use client';

import Link from 'next/link';

type ArticleScanCtaProps = {
  articleSlug: string;
  placement: 'inline' | 'end';
  compact?: boolean;
};

type AnalyticsWindow = Window & {
  gtag?: (command: 'event', eventName: string, parameters: Record<string, string>) => void;
};

function ScanSparkle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8c.7 4.3 2.9 6.5 7.2 7.2-4.3.7-6.5 2.9-7.2 7.2-.7-4.3-2.9-6.5-7.2-7.2 4.3-.7 6.5-2.9 7.2-7.2Z" />
      <path d="M19 16.5c.3 2 1.3 3 3.2 3.3-1.9.3-2.9 1.3-3.2 3.2-.3-1.9-1.3-2.9-3.2-3.2 1.9-.3 2.9-1.3 3.2-3.3Z" />
    </svg>
  );
}

export default function ArticleScanCta({ articleSlug, placement, compact = false }: ArticleScanCtaProps) {
  const href = `/scan?source=article&article=${encodeURIComponent(articleSlug)}&placement=${placement}`;

  function recordClick() {
    (window as AnalyticsWindow).gtag?.('event', 'scan_cta_click', {
      article_slug: articleSlug,
      cta_placement: placement,
      destination: '/scan',
    });
  }

  if (compact) {
    return (
      <aside className="article-scan-cta article-scan-cta--compact" aria-label="Try the WonderJoy AI skin check-in">
        <div>
          <strong>Ready to apply what you learned?</strong>
          <span>Turn today&apos;s questions into a simple, personalized routine.</span>
        </div>
        <Link href={href} onClick={recordClick}>Start my AI check-in <span aria-hidden="true">→</span></Link>
      </aside>
    );
  }

  return (
    <aside className="article-scan-cta" aria-label="Try the WonderJoy AI skin check-in">
      <div className="article-scan-cta__icon"><ScanSparkle /></div>
      <div className="article-scan-cta__copy">
        <span className="article-scan-cta__eyebrow">WonderJoy AI cosmetic check-in</span>
        <h2>Not sure what your skin needs?</h2>
        <p>Use three guided camera angles and your own concerns to receive cautious visible observations and a simple morning and evening routine.</p>
        <div className="article-scan-cta__details"><span>About 2 minutes</span><span>Private by design</span><span>18+ only</span></div>
      </div>
      <div className="article-scan-cta__action">
        <Link href={href} onClick={recordClick}>Scan my skin <span aria-hidden="true">→</span></Link>
        <small>Educational guidance—not a medical diagnosis.</small>
      </div>
    </aside>
  );
}
