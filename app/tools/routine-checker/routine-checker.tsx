'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';

type Ingredient = {
  id: string;
  name: string;
  purpose: string;
  timing: 'AM' | 'PM' | 'Either';
  article: string;
};

type PairRule = { level: 'caution' | 'separate'; title: string; advice: string };

const INGREDIENTS: Ingredient[] = [
  { id: 'retinoid', name: 'Retinol or retinoid', purpose: 'Texture, acne and visible aging', timing: 'PM', article: '/articles/retinol-vs-retinoids' },
  { id: 'vitamin-c', name: 'Vitamin C', purpose: 'Antioxidant and tone support', timing: 'AM', article: '/articles/niacinamide-vs-vitamin-c' },
  { id: 'niacinamide', name: 'Niacinamide', purpose: 'Barrier, oil and tone support', timing: 'Either', article: '/articles/niacinamide-vs-vitamin-c' },
  { id: 'salicylic', name: 'Salicylic acid (BHA)', purpose: 'Clogged pores and breakouts', timing: 'PM', article: '/articles/benzoyl-peroxide-vs-salicylic-acid' },
  { id: 'glycolic', name: 'Glycolic acid (AHA)', purpose: 'Surface texture and dullness', timing: 'PM', article: '/articles/salicylic-acid-vs-glycolic-acid' },
  { id: 'benzoyl-peroxide', name: 'Benzoyl peroxide', purpose: 'Inflamed acne', timing: 'Either', article: '/articles/benzoyl-peroxide-vs-salicylic-acid' },
  { id: 'azelaic', name: 'Azelaic acid', purpose: 'Acne, redness and dark marks', timing: 'Either', article: '/articles/azelaic-acid-for-acne-dark-spots' },
  { id: 'hyaluronic', name: 'Hyaluronic acid', purpose: 'Surface hydration support', timing: 'Either', article: '/articles/hyaluronic-acid-guide' },
  { id: 'ceramides', name: 'Ceramides', purpose: 'Skin-barrier support', timing: 'Either', article: '/articles/ceramides-for-skin-barrier' },
  { id: 'alpha-arbutin', name: 'Alpha arbutin', purpose: 'Uneven-looking tone', timing: 'Either', article: '/articles/alpha-arbutin-for-dark-spots' },
];

function pairKey(a: string, b: string) { return [a, b].sort().join('|'); }

const PAIR_RULES: Record<string, PairRule> = {
  [pairKey('retinoid', 'salicylic')]: { level: 'separate', title: 'Retinoid + salicylic acid', advice: 'Both can dry or irritate skin. Beginners should usually alternate nights instead of layering them.' },
  [pairKey('retinoid', 'glycolic')]: { level: 'separate', title: 'Retinoid + glycolic acid', advice: 'This is a high-irritation combination. Use on different nights unless a clinician has designed your routine.' },
  [pairKey('retinoid', 'benzoyl-peroxide')]: { level: 'separate', title: 'Retinoid + benzoyl peroxide', advice: 'Separate them into morning and evening or alternate nights. Some retinoid formulas also have specific compatibility instructions.' },
  [pairKey('salicylic', 'glycolic')]: { level: 'separate', title: 'Salicylic acid + glycolic acid', advice: 'Using two exfoliating acids together can over-exfoliate. Pick one, or alternate them slowly.' },
  [pairKey('salicylic', 'benzoyl-peroxide')]: { level: 'separate', title: 'Salicylic acid + benzoyl peroxide', advice: 'Both can be useful for acne but may cause excessive dryness together. Separate them and start at low frequency.' },
  [pairKey('glycolic', 'benzoyl-peroxide')]: { level: 'separate', title: 'Glycolic acid + benzoyl peroxide', advice: 'This pairing can be harsh. Use on different days and keep the rest of the routine gentle.' },
  [pairKey('vitamin-c', 'benzoyl-peroxide')]: { level: 'caution', title: 'Vitamin C + benzoyl peroxide', advice: 'Benzoyl peroxide can reduce the usefulness of some vitamin C formulas. Use vitamin C in the morning and benzoyl peroxide later.' },
  [pairKey('vitamin-c', 'glycolic')]: { level: 'caution', title: 'Vitamin C + glycolic acid', advice: 'The combination may sting sensitive skin. Try vitamin C in the morning and glycolic acid on selected nights.' },
  [pairKey('vitamin-c', 'salicylic')]: { level: 'caution', title: 'Vitamin C + salicylic acid', advice: 'They can fit in one overall routine, but sensitive skin may prefer vitamin C in the morning and salicylic acid at night.' },
  [pairKey('retinoid', 'vitamin-c')]: { level: 'caution', title: 'Retinoid + vitamin C', advice: 'Many people use both by separating them: vitamin C in the morning and the retinoid at night.' },
  [pairKey('retinoid', 'azelaic')]: { level: 'caution', title: 'Retinoid + azelaic acid', advice: 'This can be effective but irritating at first. Separate morning and evening use or alternate nights.' },
  [pairKey('azelaic', 'salicylic')]: { level: 'caution', title: 'Azelaic acid + salicylic acid', advice: 'Both may help breakouts, but layering can increase dryness. Introduce one first and separate if irritation appears.' },
  [pairKey('azelaic', 'glycolic')]: { level: 'caution', title: 'Azelaic acid + glycolic acid', advice: 'Use cautiously because both may sting. Alternating nights is a gentler starting approach.' },
};

export default function RoutineChecker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const started = useRef(false);

  const selectedIngredients = useMemo(() => INGREDIENTS.filter((item) => selected.includes(item.id)), [selected]);
  const findings = useMemo(() => {
    const matches: PairRule[] = [];
    for (let i = 0; i < selected.length; i += 1) {
      for (let j = i + 1; j < selected.length; j += 1) {
        const rule = PAIR_RULES[pairKey(selected[i], selected[j])];
        if (rule) matches.push(rule);
      }
    }
    return matches.sort((a, b) => (a.level === b.level ? 0 : a.level === 'separate' ? -1 : 1));
  }, [selected]);

  function toggleIngredient(id: string) {
    if (!started.current) {
      trackEvent('routine_checker_started');
      started.current = true;
    }
    setChecked(false);
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 6 ? [...current, id] : current);
  }

  function checkRoutine() {
    if (selected.length < 2) return;
    setChecked(true);
    trackEvent('routine_checker_completed', {
      ingredient_count: selected.length,
      flagged_pair_count: findings.length,
    });
    requestAnimationFrame(() => document.getElementById('routine-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  const amItems = selectedIngredients.filter((item) => item.timing !== 'PM');
  const pmItems = selectedIngredients.filter((item) => item.timing !== 'AM');

  return (
    <div className="rounded-[2rem] border border-[#dbe4dc] bg-white p-5 shadow-[0_22px_70px_rgba(42,65,52,.09)] md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#426a55]">Step 1</p><h2 className="mt-2 font-serif text-3xl">What is in your routine?</h2><p className="mt-2 text-[#6a766f]">Choose 2–6 ingredients. Select active ingredients, not product brand names.</p></div>
        <span className="rounded-full bg-[#edf4ea] px-4 py-2 text-sm font-bold text-[#42634f]">{selected.length}/6 selected</span>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {INGREDIENTS.map((ingredient) => {
          const active = selected.includes(ingredient.id);
          return <button key={ingredient.id} type="button" onClick={() => toggleIngredient(ingredient.id)} disabled={!active && selected.length >= 6} aria-pressed={active} className={`rounded-2xl border p-4 text-left transition ${active ? 'border-[#3d6a52] bg-[#eaf3e7] shadow-sm' : 'border-[#dfe5df] bg-[#fcfcfa] hover:border-[#aac0ae]'} disabled:cursor-not-allowed disabled:opacity-40`}><span className="flex items-start gap-3"><b className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs ${active ? 'border-[#3d6a52] bg-[#3d6a52] text-white' : 'border-[#bbc7be] text-transparent'}`}>✓</b><span><strong className="block text-[#203229]">{ingredient.name}</strong><small className="mt-1 block leading-5 text-[#748078]">{ingredient.purpose} · {ingredient.timing}</small></span></span></button>;
        })}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="button" onClick={checkRoutine} disabled={selected.length < 2} className="min-h-13 rounded-full bg-[#1c2c24] px-7 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#365e49] disabled:cursor-not-allowed disabled:opacity-35">Check my routine →</button>
        {selected.length > 0 && <button type="button" onClick={() => { setSelected([]); setChecked(false); started.current = false; }} className="min-h-12 rounded-full px-5 font-bold text-[#557064] hover:bg-[#f0f4ef]">Clear selections</button>}
        {selected.length < 2 && <small className="text-[#879189]">Choose at least two ingredients to compare.</small>}
      </div>

      {checked && <section id="routine-results" className="mt-12 scroll-mt-24 border-t border-[#dfe5df] pt-10" aria-live="polite">
        <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#426a55]">Your compatibility check</p>
        <h2 className="mt-3 font-serif text-4xl tracking-[-.04em]">{findings.length === 0 ? 'No common conflicts flagged' : `${findings.length} pairing${findings.length === 1 ? '' : 's'} to handle carefully`}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-[#66736b]">{findings.length === 0 ? 'These ingredients are generally used in the same overall routine. Introduce them gradually because compatibility does not guarantee your skin will tolerate every formula.' : 'This does not mean every pairing is forbidden. It means separating products or reducing frequency is a gentler place to start.'}</p>

        {findings.length > 0 && <div className="mt-7 grid gap-3">{findings.map((finding) => <article key={finding.title} className={`rounded-2xl border p-5 ${finding.level === 'separate' ? 'border-[#f0c3b7] bg-[#fff2ed]' : 'border-[#efdba9] bg-[#fff9e8]'}`}><span className="text-xs font-extrabold uppercase tracking-[.12em] text-[#815044]">{finding.level === 'separate' ? 'Separate or alternate' : 'Use with caution'}</span><h3 className="mt-2 font-serif text-2xl">{finding.title}</h3><p className="mt-2 leading-7 text-[#6f635e]">{finding.advice}</p></article>)}</div>}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl bg-[#edf4e9] p-6"><p className="text-xs font-extrabold uppercase tracking-[.13em] text-[#426a55]">Morning framework</p><ol className="mt-5 space-y-3 text-sm leading-6"><li><b>1.</b> Gentle cleanser or water rinse</li>{amItems.map((item, index) => <li key={item.id}><b>{index + 2}.</b> {item.name}</li>)}<li><b>{amItems.length + 2}.</b> Moisturizer, then broad-spectrum SPF 30+</li></ol></article>
          <article className="rounded-2xl bg-[#26392f] p-6 text-white"><p className="text-xs font-extrabold uppercase tracking-[.13em] text-[#bfd4c2]">Evening framework</p><ol className="mt-5 space-y-3 text-sm leading-6 text-[#eef5ef]"><li><b>1.</b> Gentle cleanser</li>{pmItems.map((item, index) => <li key={item.id}><b>{index + 2}.</b> {item.name}{['retinoid', 'salicylic', 'glycolic', 'benzoyl-peroxide'].includes(item.id) ? ' — alternate if flagged above' : ''}</li>)}<li><b>{pmItems.length + 2}.</b> Moisturizer</li></ol></article>
        </div>

        <div className="mt-8 rounded-2xl border border-[#dbe4dc] p-6"><h3 className="font-serif text-2xl">Read the ingredient guides</h3><div className="mt-4 flex flex-wrap gap-2">{selectedIngredients.map((item) => <Link key={item.id} href={item.article} className="rounded-full border border-[#cedacf] bg-[#f7faf5] px-4 py-2 text-sm font-bold text-[#385f4b] hover:bg-[#eaf2e7]">{item.name} →</Link>)}</div></div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#fff1eb] p-6 sm:flex-row sm:items-center"><div><h3 className="font-serif text-2xl">Want help simplifying the full routine?</h3><p className="mt-2 text-sm leading-6 text-[#735f57]">Use the guided cosmetic check-in to combine visible observations with your own concerns.</p></div><Link href="/scan?source=routine-checker" className="inline-flex min-h-12 shrink-0 items-center rounded-full bg-[#1c2c24] px-6 font-extrabold text-white">Try the AI check-in →</Link></div>
      </section>}
    </div>
  );
}
