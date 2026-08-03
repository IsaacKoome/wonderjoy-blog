import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Skincare Tools | WonderJoy AI',
  description: 'Use free skincare tools to check product compatibility, simplify your routine, and receive a private AI cosmetic skin check-in.',
  alternates: { canonical: 'https://wonderjoyai.com/tools' },
};

const tools = [
  {
    href: '/scan?source=tools-hub',
    label: 'AI cosmetic check-in',
    title: 'Guided AI skin check-in',
    description: 'Use three guided camera angles and your own concerns to receive cautious visible observations and a simple morning and evening routine.',
    meta: 'About 2 minutes · 18+ · No WonderJoy photo storage',
    icon: '✦',
  },
  {
    href: '/tools/routine-checker',
    label: 'Routine safety helper',
    title: 'Skincare routine compatibility checker',
    description: 'Choose the active ingredients in your routine and learn which combinations are usually compatible, which need caution, and how to separate them.',
    meta: 'Instant · No account · No AI cost',
    icon: '↔',
  },
];

export default function ToolsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Skincare Tools',
    url: 'https://wonderjoyai.com/tools',
    description: 'Free tools that help people understand and simplify their skincare routines.',
    hasPart: tools.map((tool) => ({
      '@type': 'WebApplication',
      name: tool.title,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })),
  };

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#19271f]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <section className="relative overflow-hidden border-b border-[#dce5dc] px-4 py-20 md:py-28">
        <div className="absolute -right-28 -top-16 h-96 w-96 rounded-full bg-[#dcebd8] blur-2xl" />
        <div className="absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-[#f7d9cf] blur-2xl" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#3d6b53]">WonderJoy utility lab</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[.98] tracking-[-.055em] md:text-7xl">Free tools for a calmer,<br /><span className="italic text-[#e36f59]">smarter skincare routine.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#617068]">Get practical help before adding another product. These tools provide educational guidance, not a medical diagnosis or replacement for professional care.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group flex min-h-[360px] flex-col rounded-[2rem] border border-[#dbe4dc] bg-white p-7 shadow-[0_18px_55px_rgba(42,65,52,.08)] transition hover:-translate-y-1 hover:border-[#a9c2ae] hover:shadow-[0_24px_65px_rgba(42,65,52,.14)] md:p-9">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e5efe1] font-serif text-2xl text-[#345f49]">{tool.icon}</span>
              <p className="mt-10 text-xs font-extrabold uppercase tracking-[.14em] text-[#4b765f]">{tool.label}</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight tracking-[-.035em]">{tool.title}</h2>
              <p className="mt-4 leading-7 text-[#647169]">{tool.description}</p>
              <div className="mt-auto pt-8">
                <span className="inline-flex items-center gap-3 font-extrabold text-[#2f5c46]">Open free tool <span className="transition group-hover:translate-x-1">→</span></span>
                <small className="mt-3 block text-[#859088]">{tool.meta}</small>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 rounded-[1.75rem] bg-[#243a2f] p-8 text-white md:flex md:items-center md:justify-between md:gap-10 md:p-10">
          <div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#bed5c2]">Prefer to learn first?</p><h2 className="mt-3 font-serif text-3xl">Explore 250 evidence-aware skincare guides.</h2><p className="mt-3 max-w-2xl leading-7 text-[#d5e1d8]">Search by concern, ingredient, life stage, or routine and move from confusion to a focused next step.</p></div>
          <Link href="/articles" className="mt-6 inline-flex min-h-12 shrink-0 items-center rounded-full bg-[#fff8f1] px-6 font-extrabold text-[#243a2f] md:mt-0">Browse the library →</Link>
        </div>
      </section>
    </main>
  );
}
