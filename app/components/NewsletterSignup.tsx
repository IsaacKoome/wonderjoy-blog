import Script from 'next/script';
import Link from 'next/link';

const KIT_FORM_UID = '4d20ae7367';

type NewsletterSignupProps = {
  placement?: 'homepage' | 'article' | 'landing';
};

export default function NewsletterSignup({ placement = 'article' }: NewsletterSignupProps) {
  return (
    <aside
      className={`newsletter-signup newsletter-signup--${placement}`}
      aria-label="Join the WonderJoy skincare newsletter"
    >
      <div className="newsletter-signup__copy">
        <span className="newsletter-signup__eyebrow">Free 14-day skincare tracker</span>
        <h2>Build a routine you can actually follow.</h2>
        <p>
          Get the printable WonderJoy routine tracker plus one practical skincare email each week.
          No complicated ten-step routines and no daily inbox clutter.
        </p>
        <div className="newsletter-signup__benefits" aria-label="Newsletter benefits">
          <span>14 guided days</span>
          <span>One email weekly</span>
          <span>Unsubscribe anytime</span>
        </div>
      </div>

      <div className="newsletter-signup__action">
        <div className="newsletter-signup__form">
          <Script
            id={`kit-form-${KIT_FORM_UID}`}
            async
            data-uid={KIT_FORM_UID}
            src={`https://wonderjoy-ai.kit.com/${KIT_FORM_UID}/index.js`}
            strategy="afterInteractive"
          />
        </div>
        <small>
          By subscribing, you agree to receive WonderJoy emails. See our <Link href="/privacy">privacy policy</Link>.
        </small>
      </div>
    </aside>
  );
}
