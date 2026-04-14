import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';

// ✅ THIS PART GENERATES STATIC PATHS
export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// ✅ ⭐ THIS IS WHAT YOU WERE MISSING (CRITICAL)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const url = `https://wonderjoyai.com/articles/${params.slug}`;

  return {
    title: params.slug,
    alternates: {
      canonical: url,
    },
  };
}

// ✅ MAIN PAGE
export default async function ArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { slug } = params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    notFound();
  }

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
              {article.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </main>
  );
}