import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';

export default function Home() {
  const articles = getAllArticles();

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
          Wonderjoy AI
        </h1>
        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
          Daily guidance to healthy, glowing skin. Simple tips that actually work.
        </p>
      </section>

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Latest Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {article.coverImage && (
                <div 
                  className="h-48 bg-gray-200 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${article.coverImage})` }} 
                />
              )}
              <div className="p-6">
              <p className="text-sm text-pink-500 mb-2">
  {article.date ? new Date(article.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) : 'Recent'}
</p>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-pink-600 transition">
                  {article.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-3">{article.excerpt}</p>
                <div className="mt-4 text-pink-500 font-medium group-hover:underline">
                  Read more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}