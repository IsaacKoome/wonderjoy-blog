//app/(blog)/articles/[slug]/page.tsx
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import ArticleScanCta from '@/app/components/ArticleScanCta';
import NewsletterSignup from '@/app/components/NewsletterSignup';

const UNDER_18_ARTICLE_PATTERN = /\b(baby|babies|child|children|kid|kids|teen|teens|teenage|teenager|adolescent|adolescents|puberty)\b/i;

function supportsAdultScan(title: string, slug: string) {
  return !UNDER_18_ARTICLE_PATTERN.test(`${title} ${slug.replaceAll('-', ' ')}`);
}

function splitForInlineCta(content: string) {
  const lines = content.split('\n');
  let sectionCount = 0;
  let insideCodeFence = false;

  for (let index = 0; index < lines.length; index += 1) {
    if (/^\s*```/.test(lines[index])) insideCodeFence = !insideCodeFence;
    if (!insideCodeFence && /^##\s+/.test(lines[index])) {
      sectionCount += 1;
      if (sectionCount === 3) {
        return { beforeCta: lines.slice(0, index).join('\n'), afterCta: lines.slice(index).join('\n') };
      }
    }
  }

  return { beforeCta: content, afterCta: '' };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    notFound();
  }

  const showScanCta = supportsAdultScan(article.title, article.slug);
  const { beforeCta, afterCta } = splitForInlineCta(article.content);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <div className="text-gray-500">
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
            >
              {beforeCta}
            </ReactMarkdown>
          </div>
          {showScanCta && afterCta && <ArticleScanCta articleSlug={article.slug} placement="inline" />}
          {afterCta && <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{afterCta}</ReactMarkdown>
          </div>}
          <NewsletterSignup placement="article" />
        </div>
      </article>
    </main>
  );
}
