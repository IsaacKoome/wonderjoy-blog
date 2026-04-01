import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Header */}
        <header className="mb-12 text-center">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
              Skincare Tips
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-500">
            <time dateTime={article.date} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(article.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            <span>•</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              4 min read
            </span>
          </div>
        </header>

        {/* Article Content with Typography - FIXED TABLE STYLING */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 lg:p-12">
          <div className="prose prose-slate max-w-none 
                        prose-headings:text-gray-900 
                        prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:text-gray-900
                        prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-pink-700
                        prose-h3:text-xl prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-gray-800
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                        prose-ul:text-gray-700 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                        prose-ol:text-gray-700 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
                        prose-li:text-gray-700 prose-li:mb-2
                        prose-strong:text-pink-600 prose-strong:font-semibold
                        prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-4 prose-blockquote:border-pink-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                        prose-img:rounded-xl prose-img:shadow-md
                        prose-table:w-full prose-table:border-collapse prose-table:my-6
                        prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-th:text-gray-800 prose-th:font-semibold
                        prose-td:border prose-td:border-gray-300 prose-td:p-3 prose-td:text-gray-700
                        prose-tr:bg-white
                        [&_table]:w-full [&_table]:border-collapse [&_table]:my-6
                        [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:p-3 [&_th]:text-left [&_th]:text-gray-800 [&_th]:font-semibold
                        [&_td]:border [&_td]:border-gray-300 [&_td]:p-3 [&_td]:text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <span>✨</span>
              <span>Share this article</span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition">
                Share on Twitter
              </button>
              <button className="px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition">
                Share on Facebook
              </button>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}