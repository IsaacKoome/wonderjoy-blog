import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import NewsletterSignup from '@/app/components/NewsletterSignup';

export default function Home() {
  const latestArticles = getAllArticles().slice(0, 6);

  return (
    <main className="min-h-screen bg-[#fbf8f2] text-[#19221e]">
      <section className="relative overflow-hidden border-b border-[#dde5dd] px-4 py-20 md:py-28">
        <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-[#dce9d8] blur-2xl" />
        <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-[#f7d9d0] blur-2xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_360px]">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#476755]">Your skincare progress coach</p>
            <h1 className="max-w-4xl font-serif text-5xl leading-[0.95] tracking-[-0.055em] md:text-7xl">
              Understand your skin.<br /><span className="italic text-[#e86f5b]">Build a routine that fits.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#657069]">
              Start with a private, guided camera check-in. WonderJoy turns visible cosmetic patterns and your concerns into a gentle morning and evening routine.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/scan" className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#19221e] px-7 font-bold text-white shadow-xl transition hover:-translate-y-0.5">
                Try the 2-minute skin check <span className="ml-3">→</span>
              </Link>
              <Link href="/articles" className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#cdd7cf] bg-white px-7 font-bold text-[#29352f] transition hover:-translate-y-0.5">
                Explore 250+ guides
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[#5c6861]">
              <span className="rounded-full border border-[#d8e0d9] bg-white/70 px-3 py-2">18+ only</span>
              <span className="rounded-full border border-[#d8e0d9] bg-white/70 px-3 py-2">No WonderJoy photo storage</span>
              <span className="rounded-full border border-[#d8e0d9] bg-white/70 px-3 py-2">Cosmetic guidance—not diagnosis</span>
            </div>
          </div>
          <div className="rounded-[2rem] bg-[#385c49] p-7 text-white shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#cddfce]">One check-in. Three steps.</p>
            <ol className="mt-8 space-y-7">
              <li className="grid grid-cols-[42px_1fr] gap-3"><span className="font-serif text-2xl text-[#f4aa97]">01</span><div><b className="block">Capture three angles</b><small className="mt-1 block leading-5 text-[#dce8de]">Clear, guided photos in consistent light.</small></div></li>
              <li className="grid grid-cols-[42px_1fr] gap-3"><span className="font-serif text-2xl text-[#f4aa97]">02</span><div><b className="block">Choose your concerns</b><small className="mt-1 block leading-5 text-[#dce8de]">Tell us what you actually want help with.</small></div></li>
              <li className="grid grid-cols-[42px_1fr] gap-3"><span className="font-serif text-2xl text-[#f4aa97]">03</span><div><b className="block">Get a focused routine</b><small className="mt-1 block leading-5 text-[#dce8de]">Simple AM and PM steps you can follow.</small></div></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="border-b border-[#dde5dd] bg-white px-4 py-14">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[.85fr_1.15fr] md:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#476755]">Free skincare tools</p><h2 className="mt-3 font-serif text-4xl leading-tight tracking-[-.04em]">Make your routine easier to understand.</h2><p className="mt-4 max-w-xl leading-7 text-[#657069]">Use the AI check-in or compare active ingredients before layering another product.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/scan?source=homepage-tools" className="group rounded-2xl border border-[#d9e3da] bg-[#edf4ea] p-5 transition hover:-translate-y-1 hover:shadow-lg"><span className="text-xs font-extrabold uppercase tracking-[.12em] text-[#476755]">Camera tool</span><strong className="mt-3 block font-serif text-2xl font-medium">AI skin check-in</strong><span className="mt-5 inline-block font-bold text-[#315f49]">Start check-in <span className="transition group-hover:ml-1">→</span></span></Link>
            <Link href="/tools/routine-checker" className="group rounded-2xl border border-[#efd4ca] bg-[#fff4ef] p-5 transition hover:-translate-y-1 hover:shadow-lg"><span className="text-xs font-extrabold uppercase tracking-[.12em] text-[#8b574c]">Ingredient tool</span><strong className="mt-3 block font-serif text-2xl font-medium">Routine compatibility checker</strong><span className="mt-5 inline-block font-bold text-[#70463d]">Check ingredients <span className="transition group-hover:ml-1">→</span></span></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16">
        <NewsletterSignup placement="homepage" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#476755]">The WonderJoy library</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight text-[#19221e]">Keep learning about your skin</h2>
          </div>
          <Link href="/articles" className="hidden font-bold text-[#395b4b] hover:underline sm:block">View all articles →</Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className="group overflow-hidden rounded-2xl border border-[#e1e6e1] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {article.coverImage && <div className="h-48 bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${article.coverImage})` }} />}
              <div className="p-6">
                <p className="mb-2 text-sm text-[#d45d4b]">{article.date ? new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}</p>
                <h3 className="text-xl font-semibold text-gray-800 transition group-hover:text-[#395b4b]">{article.title}</h3>
                <p className="mt-2 line-clamp-3 text-gray-600">{article.excerpt}</p>
                <div className="mt-4 font-medium text-[#395b4b] group-hover:underline">Read more →</div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/articles" className="mt-8 inline-flex font-bold text-[#395b4b] hover:underline sm:hidden">View all articles →</Link>
      </section>
    </main>
  );
}
