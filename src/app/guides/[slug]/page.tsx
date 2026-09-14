import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { ArrowLeft, Clock, Calendar, User, Shield } from 'lucide-react';
import { formatDate } from '@/lib/verification';

export const revalidate = 43200;

interface ArticleSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: ArticleSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Guide Not Found — PakEVFinder' };

  return {
    title: `${article.title} — PakEVFinder`,
    description: article.excerpt,
    alternates: {
      canonical: `https://pakevfinder.com/guides/${article.slug}`,
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleSlugPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Buyer Guides</span>
        </Link>
        <span className="text-blue-700 font-semibold uppercase tracking-wider text-[11px]">
          Verified Research
        </span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-blue-700" />
          <span>Factually Audited Guide</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#111114] leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-700" />
            <span className="text-gray-700 font-medium">{article.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{formatDate(article.published_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
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
      <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-[#111114] text-sm leading-relaxed space-y-4">
        <div className="space-y-4">
          {article.body.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-lg font-bold text-[#111114] pt-4 pb-1 border-b border-gray-200">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('#### ')) {
              return (
                <h4 key={index} className="text-sm font-bold text-blue-700 pt-2">
                  {paragraph.replace('#### ', '')}
                </h4>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n');
              return (
                <ul key={index} className="list-disc pl-5 space-y-1.5 text-gray-700">
                  {items.map((it, i) => (
                    <li key={i}>{it.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
}
