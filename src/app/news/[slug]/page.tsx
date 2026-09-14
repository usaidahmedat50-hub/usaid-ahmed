import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { ArrowLeft, Clock, Calendar, User, ShieldCheck } from 'lucide-react';
import { formatDate } from '@/lib/verification';

export const revalidate = 43200;

interface NewsSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: NewsSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found — PakEVFinder' };

  return {
    title: `${article.title} — PakEVFinder News`,
    description: article.excerpt,
    alternates: {
      canonical: `https://pakevfinder.com/news/${article.slug}`,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsSlugPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All News & Guides</span>
        </Link>
        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
          Verified Source
        </span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-800 font-bold">{article.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(article.published_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.read_time_mins || 5} min read</span>
          </div>
        </div>
      </div>

      {/* Direct Answer Summary Block */}
      <DirectAnswerBlock
        title="Direct Answer / Executive Takeaway"
        summary={article.excerpt}
      />

      {/* Body Content */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-slate-900 text-sm leading-relaxed space-y-4 shadow-2xs">
        <div className="space-y-4">
          {article.body.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-lg font-bold text-slate-900 pt-4 pb-1 border-b border-slate-100">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('#### ')) {
              return (
                <h4 key={index} className="text-sm font-bold text-blue-600 pt-2">
                  {paragraph.replace('#### ', '')}
                </h4>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n');
              return (
                <ul key={index} className="list-disc pl-5 space-y-1.5 text-slate-700">
                  {items.map((it, i) => (
                    <li key={i}>{it.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-slate-700 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
}
