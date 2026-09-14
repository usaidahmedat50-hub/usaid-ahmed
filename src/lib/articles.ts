// PakevFinder.com — Editorial Guides Data Access
import { Article } from './types';
import { SEED_ARTICLES } from '@/data/seed-data';
import { createServerClient } from './supabase/server';

export async function getAllArticles(): Promise<Article[]> {
  const supabase = createServerClient();
  if (!supabase) return SEED_ARTICLES;

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return SEED_ARTICLES;
    }
    return data;
  } catch {
    return SEED_ARTICLES;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find((a) => a.slug.toLowerCase() === slug.toLowerCase()) || null;
}
