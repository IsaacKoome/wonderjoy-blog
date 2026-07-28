//lib/articles.ts

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

function findFirstArticleImage(content: string): string | undefined {
  const markdownImage = content.match(/!\[[^\]]*\]\((\/images\/[^)]+)\)/);
  return markdownImage?.[1];
}

export interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  content: string;
}

export function getAllArticles(): Article[] {
  const files = fs.readdirSync(contentDirectory);
  
  const articles = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        coverImage: data.coverImage || findFirstArticleImage(content),
        content,
      } as Article;
    });
  
  // Sort by date (newest first)
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      coverImage: data.coverImage || findFirstArticleImage(content),
      content,
    };
  } catch {
    return null;
  }
}
