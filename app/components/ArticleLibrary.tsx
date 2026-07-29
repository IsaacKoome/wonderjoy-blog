'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type FormEvent, type KeyboardEvent, useMemo, useRef, useState } from 'react';

type ArticlePreview = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
};

type ArticleLibraryProps = {
  articles: ArticlePreview[];
};

const categories = [
  'All topics',
  'Acne',
  'Dark spots',
  'Sensitive skin',
  'Ingredients',
  'Routines',
  'Life stages',
  'Sun care',
  'Body care',
  'Everyday life',
] as const;

type Category = (typeof categories)[number];

const categoryMatchers: Array<[Exclude<Category, 'All topics'>, string[]]> = [
  ['Life stages', ['pregnan', 'postpartum', 'baby', 'teen', 'menopaus', 'period', 'hormonal', 'men ', 'men-', 'male', 'anti-aging', 'mature skin', 'aging skin', 'over 40']],
  ['Sun care', ['sunscreen', 'sun ', 'spf', 'uv ', 'melasma']],
  ['Body care', ['body', 'back acne', 'chest acne', 'stretch mark', 'razor', 'shav', 'underarm', 'hand', 'foot', 'feet', 'neck']],
  ['Dark spots', ['dark spot', 'hyperpigment', 'uneven tone', 'acne mark', 'melanin-rich', 'ashy', 'white cast']],
  ['Sensitive skin', ['sensitive', 'eczema', 'rosacea', 'irritat', 'redness', 'barrier', 'allerg', 'dermatitis', 'rash']],
  ['Acne', ['acne', 'pimple', 'breakout', 'comedone', 'blackhead', 'whitehead', 'clogged pore', 'maskne']],
  ['Ingredients', ['acid', 'retinol', 'retinoid', 'niacinamide', 'vitamin c', 'ceramide', 'peptide', 'urea', 'squalane', 'zinc', 'sulfur', 'benzoyl', 'ingredient']],
  ['Everyday life', ['workout', 'phone', 'pillowcase', 'airplane', 'weather', 'air conditioning', 'hard water', 'night shift', 'pollution', 'travel', 'swim', 'stress', 'sleep', 'diet', 'water']],
  ['Routines', ['routine', 'morning', 'night', 'layer', 'cleanser', 'moisturizer', 'face wash', 'skincare', 'mistake']],
];

function getCategory(article: ArticlePreview): Exclude<Category, 'All topics'> {
  const everydaySlugs = [
    'air-conditioning',
    'air-pollution',
    'airplane',
    'hard-water',
    'hot-humid',
    'night-shift',
    'phone-cause-acne',
    'pillowcase-acne',
    'before-after-workout',
  ];

  if (everydaySlugs.some((term) => article.slug.includes(term))) {
    return 'Everyday life';
  }

  const searchable = `${article.slug} ${article.title} ${article.excerpt}`.toLowerCase();
  return categoryMatchers.find(([, terms]) => terms.some((term) => searchable.includes(term)))?.[0] ?? 'Routines';
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ArticleImage({ article, priority = false }: { article: ArticlePreview; priority?: boolean }) {
  if (!article.coverImage) {
    return (
      <div className="article-library__image-fallback" aria-hidden="true">
        <span>WJ</span>
      </div>
    );
  }

  return (
    <Image
      src={article.coverImage}
      alt=""
      fill
      priority={priority}
      sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
    />
  );
}

export function ArticleLibrary({ articles }: ArticleLibraryProps) {
  const [draftQuery, setDraftQuery] = useState('');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All topics');
  const [visibleCount, setVisibleCount] = useState(18);
  const resultsRef = useRef<HTMLElement>(null);

  const categorizedArticles = useMemo(
    () => articles.map((article) => ({ ...article, category: getCategory(article) })),
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return categorizedArticles.filter((article) => {
      const matchesCategory = activeCategory === 'All topics' || article.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, categorizedArticles, query]);

  const isDiscovering = query.trim().length > 0 || activeCategory !== 'All topics';
  const featuredArticles = categorizedArticles.slice(0, 3);
  const libraryArticles = isDiscovering ? filteredArticles : filteredArticles.slice(3);
  const visibleArticles = libraryArticles.slice(0, visibleCount);

  function chooseCategory(category: Category) {
    setActiveCategory(category);
    setVisibleCount(18);
  }

  function applySearch() {
    setQuery(draftQuery.trim());
    setVisibleCount(18);

    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applySearch();
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      applySearch();
    }
  }

  function clearSearch() {
    setDraftQuery('');
    setQuery('');
    setVisibleCount(18);
  }

  return (
    <main className="articles-page">
      <section className="articles-hero">
        <div className="articles-shell articles-hero__grid">
          <div className="articles-hero__copy">
            <p className="articles-eyebrow">The WonderJoy skincare library</p>
            <h1>Find the answer your skin needs.</h1>
            <p className="articles-hero__intro">
              Search {articles.length} practical guides for everyday concerns, confusing ingredients, and routines that fit real life.
            </p>

            <form className="articles-search" role="search" onSubmit={submitSearch}>
              <label className="sr-only" htmlFor="article-search">Search skincare articles</label>
              <SearchIcon />
              <input
                id="article-search"
                type="search"
                value={draftQuery}
                onChange={(event) => setDraftQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Try “dark spots,” “retinol,” or “dry skin”"
                enterKeyHint="search"
              />
              {(draftQuery || query) && (
                <button className="articles-search__clear" type="button" onClick={clearSearch}>
                  Clear
                </button>
              )}
              <button className="articles-search__submit" type="submit">
                Search
              </button>
            </form>
          </div>

          <aside className="articles-hero__scan">
            <span className="articles-hero__scan-icon" aria-hidden="true">✦</span>
            <p className="articles-hero__scan-label">Not sure where to begin?</p>
            <h2>Start with your own skin.</h2>
            <p>Use three guided camera angles for a private, educational cosmetic check-in.</p>
            <Link href="/scan">
              Try the AI check-in <ArrowIcon />
            </Link>
            <small>About 2 minutes · 18+ · Not a diagnosis</small>
          </aside>
        </div>
      </section>

      <div className="articles-shell">
        <nav className="articles-topics" aria-label="Filter articles by topic">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? 'is-active' : undefined}
              aria-pressed={activeCategory === category}
              onClick={() => chooseCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>

        {!isDiscovering && (
          <section className="articles-featured" aria-labelledby="featured-heading">
            <div className="articles-section-heading">
              <div>
                <p className="articles-eyebrow">New this week</p>
                <h2 id="featured-heading">Fresh from WonderJoy</h2>
              </div>
              <p>Timely, useful guidance from our newest topic cluster.</p>
            </div>

            <div className="articles-featured__grid">
              {featuredArticles.map((article, index) => (
                <Link className="articles-feature-card" href={`/articles/${article.slug}`} key={article.slug}>
                  <div className="articles-feature-card__image">
                    <ArticleImage article={article} priority={index === 0} />
                    <span>{article.category}</span>
                  </div>
                  <div className="articles-feature-card__body">
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <span className="articles-read-link">Read the guide <ArrowIcon /></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section ref={resultsRef} className="articles-library" aria-labelledby="library-heading">
          <div className="articles-section-heading articles-library__heading">
            <div>
              <p className="articles-eyebrow">Browse the library</p>
              <h2 id="library-heading">{isDiscovering ? 'Search results' : 'Explore all guides'}</h2>
            </div>
            <p>
              {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
              {activeCategory !== 'All topics' ? ` in ${activeCategory}` : ''}
            </p>
          </div>

          {visibleArticles.length > 0 ? (
            <div className="articles-library__grid">
              {visibleArticles.map((article) => (
                <Link className="article-discovery-card" href={`/articles/${article.slug}`} key={article.slug}>
                  <div className="article-discovery-card__image">
                    <ArticleImage article={article} />
                  </div>
                  <div className="article-discovery-card__body">
                    <div className="article-discovery-card__meta">
                      <span>{article.category}</span>
                      <time dateTime={article.date}>{formatDate(article.date)}</time>
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <span className="articles-read-link">Read article <ArrowIcon /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="articles-empty-state">
              <span aria-hidden="true">⌕</span>
              <h3>No exact match yet</h3>
              <p>Try a broader phrase or choose another topic.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  chooseCategory('All topics');
                }}
              >
                Show all articles
              </button>
            </div>
          )}

          {visibleCount < libraryArticles.length && (
            <div className="articles-load-more">
              <button type="button" onClick={() => setVisibleCount((count) => count + 18)}>
                Show more articles
              </button>
              <span>{libraryArticles.length - visibleCount} more in the library</span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
