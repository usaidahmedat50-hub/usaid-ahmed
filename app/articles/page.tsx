import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'EV Guides & Educational Articles — PakevFinder Insights',
  description: 'Read EV buyer guides, electric vehicle vs petrol cost analysis, home charging setup guides, and EV policy updates in Pakistan.',
  alternates: {
    canonical: 'https://pakevfinder.com/articles',
  },
};

export default function ArticlesIndexPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Articles & Guides', url: 'https://pakevfinder.com/articles' },
  ];

  const articles = [
    {
      slug: 'ev-vs-petrol-cost-analysis-pakistan',
      title: 'Electric Car vs Petrol Car Running Cost Comparison in Pakistan (2026)',
      description: 'Calculate real-world monthly electricity costs for EVs at 50 PKR/kWh vs 275 PKR/L petrol cars. Save up to PKR 300,000 every year.',
      category: 'Cost Analysis',
      date: 'Feb 2026',
    },
    {
      slug: 'how-to-charge-ev-at-home-pakistan',
      title: 'How to Install a 7 kW / 11 kW AC Home Charger in Pakistan',
      description: 'Complete step-by-step guide to installing a dedicated 3-phase EV charger at home, solar net-metering integration, and off-peak tariff savings.',
      category: 'Charging Guide',
      date: 'Feb 2026',
    },
    {
      slug: 'pakistan-ev-policy-tax-benefits-2026',
      title: 'Pakistan EV Policy 2026: Customs Duty Rates, Sales Tax & Registration Benefits',
      description: 'Detailed breakdown of 1% customs duty on EV imports, reduced sales tax, and free registration incentives across provinces.',
      category: 'Policy & Taxes',
      date: 'Jan 2026',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            EV Insights
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          EV Educational Articles & Buyer Guides
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Comprehensive, data-driven guides covering EV ownership, home solar charging, intercity motorway routes, and tax policies in Pakistan.
        </p>
      </div>

      <AnswerFirstSummary
        answer="PakevFinder Insights publishes verified EV educational content covering running cost savings, home AC charger installation, solar net-metering, and government policy updates."
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Editorial Board"
      />

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <Link
            key={art.slug}
            href={`/articles/${art.slug}`}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full">
                  {art.category}
                </span>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {art.date}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {art.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {art.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
