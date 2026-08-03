'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

const AMAZON_HOSTS = /(^|\.)(amazon\.com|amzn\.to)$/i;

export default function AnalyticsLinkTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      const linkText = anchor.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120) || 'Unlabeled link';

      if (AMAZON_HOSTS.test(url.hostname)) {
        trackEvent('amazon_affiliate_click', {
          link_url: url.href,
          link_text: linkText,
          source_path: window.location.pathname,
        });
      }

      if (url.origin === window.location.origin && url.pathname === '/scan') {
        trackEvent('scan_cta_click', {
          source_path: window.location.pathname,
          article_slug: url.searchParams.get('article') || undefined,
          cta_placement: url.searchParams.get('placement') || undefined,
          link_text: linkText,
        });
      }

      if (url.origin === window.location.origin && url.pathname.startsWith('/tools/')) {
        trackEvent('tool_cta_click', {
          tool_path: url.pathname,
          source_path: window.location.pathname,
          link_text: linkText,
        });
      }
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
