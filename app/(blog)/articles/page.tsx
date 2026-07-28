import type { Metadata } from 'next';
import { ArticleLibrary } from '@/app/components/ArticleLibrary';
import { getAllArticles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Skincare Articles and Guides | WonderJoy AI',
  description:
    'Explore practical skincare guides about acne, dark spots, sensitive skin, ingredients, routines, sun care, and everyday skin concerns.',
};

export default function ArticlesPage() {
  const articles = getAllArticles().map(({ content: _content, ...article }) => article);

  return <ArticleLibrary articles={articles} />;
}
