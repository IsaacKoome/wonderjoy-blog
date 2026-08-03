import type { Metadata } from 'next';
import Link from 'next/link';
import ScanExperience from './scan-experience';

export const metadata: Metadata = {
  title: 'AI Skin Check-In | WonderJoy AI',
  description:
    'Use your camera for a private, guided cosmetic skin check-in and receive a simple morning and evening skincare routine.',
  alternates: {
    canonical: 'https://wonderjoyai.com/scan',
  },
};

export default function ScanPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'WonderJoy AI Cosmetic Skin Check-In',
    url: 'https://wonderjoyai.com/scan',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    description: 'A guided educational cosmetic skin check-in using three camera angles and user-selected concerns.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    <ScanExperience />
    <section className="bg-white px-4 py-20 text-[#1b2b23]">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]">
          <div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#406b54]">What the camera can—and cannot—tell you</p><h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-.04em] md:text-5xl">Useful visible observations, with honest limits.</h2></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-[#d9e4da] bg-[#f2f7ef] p-6"><h3 className="font-serif text-2xl">It can describe</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-[#607068]"><li>Visible surface texture</li><li>Visible breakouts and dark-looking marks</li><li>Uneven-looking tone in the submitted lighting</li><li>Whether the photos are clear enough to assess</li></ul></article>
            <article className="rounded-2xl border border-[#efd2c9] bg-[#fff5f0] p-6"><h3 className="font-serif text-2xl">It cannot measure</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-[#71645e]"><li>Skin hydration or oil production</li><li>A medical condition or its severity</li><li>What is beneath the skin</li><li>Whether a changing lesion is dangerous</li></ul></article>
          </div>
        </div>

        <div className="mt-16 grid gap-6 border-t border-[#dce4dc] pt-14 md:grid-cols-3">
          <article><span className="font-serif text-2xl text-[#e0705a]">01</span><h3 className="mt-5 font-serif text-2xl">Use even daylight</h3><p className="mt-3 text-sm leading-6 text-[#66736b]">Face a window instead of standing with a bright window behind you. Avoid filters and colored lighting.</p></article>
          <article><span className="font-serif text-2xl text-[#e0705a]">02</span><h3 className="mt-5 font-serif text-2xl">Compare consistently</h3><p className="mt-3 text-sm leading-6 text-[#66736b]">For future check-ins, use a similar time, place, distance, and lighting. Consistency makes visual comparisons more meaningful.</p></article>
          <article><span className="font-serif text-2xl text-[#e0705a]">03</span><h3 className="mt-5 font-serif text-2xl">Know when to stop</h3><p className="mt-3 text-sm leading-6 text-[#66736b]">Seek professional care for persistent pain, bleeding, swelling, severe reactions, or a spot that changes rapidly.</p></article>
        </div>
      </div>
    </section>

    <section className="bg-[#edf3e9] px-4 py-16 text-[#1b2b23]">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 rounded-[2rem] bg-[#263b30] p-8 text-white md:flex-row md:items-center md:p-12">
        <div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#bed5c2]">Another free tool</p><h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight">Check whether your skincare ingredients fit together.</h2><p className="mt-4 max-w-2xl leading-7 text-[#d7e2d9]">Compare retinoids, exfoliating acids, vitamin C, benzoyl peroxide, azelaic acid, and barrier-supporting ingredients.</p></div>
        <Link href="/tools/routine-checker" className="inline-flex min-h-14 shrink-0 items-center justify-center rounded-full bg-[#fff7ef] px-7 font-extrabold text-[#263b30]">Check my routine →</Link>
      </div>
    </section>
  </>;
}
