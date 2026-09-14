import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'EV Guides & Calculators for Pakistan (Running Costs, Home Charging) — PakEVFinder',
  description:
    'Research guides on electric car ownership in Pakistan: running costs per km vs petrol, 7kW vs 11kW home wallbox installation, solar net metering, and customs duties.',
};

export const revalidate = 3600;

export default async function GuidesPage() {
  const articles = await getAllArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5 text-blue-700" />
          <span>EV Intelligence & Editorial</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111114]">
          EV Buyer Guides & Ownership Analysis
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
          Practical analysis on electricity tariffs, solar integration, home wallbox installation, and federal import policy in Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {articles.map((art) => (
          <div
            key={art.id}
            className="bg-white border border-gray-200 hover:border-gray-400 rounded-lg p-5 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-700 uppercase tracking-wider mb-2">
                <Clock className="w-3 h-3 text-blue-700" />
                <span>{art.read_time_mins} Min Read</span>
              </div>
              <Link href={`/guides/${art.slug}`}>
                <h3 className="text-sm font-bold text-[#111114] hover:text-blue-700 transition-colors line-clamp-2">
                  {art.title}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">{art.author}</span>
              <Link
                href={`/guides/${art.slug}`}
                className="font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1 text-xs"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
