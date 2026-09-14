import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { Newspaper, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pakistan EV News, Market Intelligence & Buyer Guides — PakEVFinder',
  description:
    'Latest updates on EV prices, charging infrastructure, federal NEPRA electricity tariffs, solar net-metering, and automotive policy in Pakistan.',
  alternates: {
    canonical: 'https://pakevfinder.com/news',
  },
};

export const revalidate = 3600;

export default async function NewsDirectoryPage() {
  const articles = await getAllArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0A101D] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Automotive Intelligence & Policy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Pakistan EV News & Market Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Data-backed reporting on electric vehicle prices, NEPRA TOU electricity tariffs, M-2 fast charging corridor progress, and local CKD assembly announcements.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art, idx) => (
          <article
            key={art.id}
            className="bg-white border border-slate-200/80 hover:border-blue-400 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-xs group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  <span>{art.read_time_mins} Min Read</span>
                </div>
                {idx === 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-extrabold uppercase tracking-wider">
                    Featured
                  </span>
                )}
              </div>

              <Link href={`/news/${art.slug}`}>
                <h2 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h2>
              </Link>

              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] font-medium">{art.author}</span>
              <Link
                href={`/news/${art.slug}`}
                className="font-bold text-blue-600 group-hover:text-blue-700 inline-flex items-center gap-1 text-xs"
              >
                <span>Read Story</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
