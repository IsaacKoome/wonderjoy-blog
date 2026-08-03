import type { Metadata } from 'next';
import Link from 'next/link';
import RoutineChecker from './routine-checker';

export const metadata: Metadata = {
  title: 'Skincare Routine Compatibility Checker | WonderJoy AI',
  description: 'Check whether popular skincare ingredients can be used together and get a gentler AM and PM routine plan.',
  alternates: { canonical: 'https://wonderjoyai.com/tools/routine-checker' },
};

const faqs = [
  ['Can I use retinol and salicylic acid together?', 'Both can irritate skin. Many beginners tolerate them better on alternating nights rather than in the same routine.'],
  ['Can I use niacinamide with vitamin C?', 'Most people can. Modern formulas are generally compatible, although sensitive skin may still prefer introducing one product at a time.'],
  ['Does compatible mean irritation-free?', 'No. Formula strength, frequency, skin sensitivity, and other products all matter. Patch test and introduce one change at a time.'],
];

export default function RoutineCheckerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Skincare Routine Compatibility Checker',
    url: 'https://wonderjoyai.com/tools/routine-checker',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    description: 'An educational checker for common skincare ingredient combinations.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#19271f]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <section className="relative overflow-hidden border-b border-[#dce5dc] px-4 py-16 md:py-24">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#dcebd8] blur-2xl" />
        <div className="relative mx-auto max-w-5xl">
          <Link href="/tools" className="text-sm font-bold text-[#426a55] hover:underline">← All free tools</Link>
          <p className="mt-8 text-xs font-extrabold uppercase tracking-[.18em] text-[#3d6b53]">Free routine safety helper</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.98] tracking-[-.05em] md:text-7xl">Can these skincare ingredients <span className="italic text-[#e36f59]">work together?</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#627068]">Select what you use. The checker flags common irritation conflicts and suggests a simpler way to separate your actives.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16"><RoutineChecker /></section>

      <section className="mx-auto max-w-5xl border-t border-[#dce4dc] px-4 py-16">
        <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr]">
          <div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#426a55]">Use it wisely</p><h2 className="mt-3 font-serif text-4xl tracking-[-.04em]">A compatibility check is a starting point.</h2></div>
          <div className="space-y-4 leading-7 text-[#637068]"><p>Products with the same headline ingredient can have very different strengths and formulas. Your skin history, prescriptions, and frequency also change what is appropriate.</p><p>Introduce one product at a time, patch test when practical, and stop if you develop persistent burning, swelling, blistering, or a worsening rash. Ask a qualified clinician about prescription treatments, pregnancy, breastfeeding, or a diagnosed skin condition.</p></div>
        </div>
      </section>

      <section className="bg-[#edf3e9] px-4 py-16">
        <div className="mx-auto max-w-5xl"><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#426a55]">Common questions</p><h2 className="mt-3 font-serif text-4xl">Ingredient compatibility FAQ</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{faqs.map(([question, answer]) => <article key={question} className="rounded-2xl border border-[#d5e1d5] bg-white p-6"><h3 className="font-serif text-xl leading-tight">{question}</h3><p className="mt-3 text-sm leading-6 text-[#66736b]">{answer}</p></article>)}</div></div>
      </section>
    </main>
  );
}
