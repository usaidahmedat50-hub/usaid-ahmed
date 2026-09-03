import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { Compass, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'EV Buyer & Ownership Guides — PakevFinder Handbook',
  description: 'Comprehensive guides to buying, charging, financing, and maintaining an electric vehicle in Pakistan.',
  alternates: {
    canonical: 'https://pakevfinder.com/guides',
  },
};

export default function GuidesIndexPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'EV Guides', url: 'https://pakevfinder.com/guides' },
  ];

  const guides = [
    {
      slug: 'first-time-ev-buyer-guide-pakistan',
      title: 'First-Time EV Buyer Guide: 10 Things to Check Before Purchasing',
      description: 'Battery health warranties, charging port standards (CCS2 vs GBT), home wallbox installation, and resale considerations.',
    },
    {
      slug: 'intercity-ev-travel-motorway-m2-guide',
      title: 'Intercity EV Travel Guide: Driving M2 Lahore to Islamabad Safely',
      description: 'Fast-charging stations along M2 Motorway service areas (Bhera, Sukheki), charging speeds, and range management strategies.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Handbook & Guides
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          PakevFinder EV Ownership Handbook
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Step-by-step guides for buyers, owners, and fleet managers entering electric mobility.
        </p>
      </div>

      <AnswerFirstSummary
        answer="PakevFinder Guides provide structured handbooks on pre-purchase inspection, intercity motorway fast-charging routes, solar integration, and battery longevity optimization."
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Technical Advisory Team"
      />

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4 group block"
          >
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {g.title}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {g.description}
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Read Handbook</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
