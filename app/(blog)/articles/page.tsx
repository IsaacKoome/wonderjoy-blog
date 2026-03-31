// app/(blog)/articles/page.tsx

import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';

export default function ArticlesPage() {
  const articles = getAllArticles();
  
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">All Articles</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link 
            key={article.slug} 
            href={`/articles/${article.slug}`}
            className="block p-6 border rounded-xl hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-gray-600 mt-2">{article.excerpt}</p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(article.date).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}