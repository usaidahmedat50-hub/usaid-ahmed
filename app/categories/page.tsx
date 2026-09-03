import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { Sparkles, ArrowRight, Car, Shield } from 'lucide-react';

export const metadata = {
  title: 'Electric Vehicle Categories — Browse by Body Type & Price Range',
  description: 'Browse electric SUVs, sedans, hatchbacks, microcars, and budget EVs in Pakistan.',
  alternates: {
    canonical: 'https://pakevfinder.com/categories',
  },
};

export default function CategoriesIndexPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Categories', url: 'https://pakevfinder.com/categories' },
  ];

  const categories = [
    {
      slug: 'electric-suvs',
      name: 'Electric SUVs & Crossovers',
      description: 'High ground clearance, AWD capabilities, and family luxury electric SUVs.',
      badge: 'Popular',
    },
    {
      slug: 'electric-sedans',
      name: 'Electric Sedans & Gran Coupes',
      description: 'Aerodynamic efficiency, long WLTP range, and executive comfort sedans.',
      badge: 'High Range',
    },
    {
      slug: 'electric-hatchbacks',
      name: 'Electric Hatchbacks & Urban EVs',
      description: 'Compact urban commuters with easy maneuverability and lower running costs.',
      badge: 'City Friendly',
    },
    {
      slug: 'hybrid-cars',
      name: 'Hybrid & Range-Extended EVs',
      description: 'PHEVs and REEVs providing extended range without range anxiety.',
      badge: 'Extended Range',
    },
    {
      slug: 'evs-under-5000000',
      name: 'EVs Under PKR 5 Million',
      description: 'Budget-friendly electric vehicles and city microcars in Pakistan.',
      badge: 'Budget Choice',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Vehicle Categories
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Browse EVs by Body Type & Price Range
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Indexable category hubs designed for fast discovery based on body style, powertrain architecture, and budget.
        </p>
      </div>

      <AnswerFirstSummary
        answer="PakevFinder categorizes vehicles into SUVs, Sedans, Hatchbacks, Microcars, PHEVs, REEVs, and price-bracketed hubs to help buyers locate models matching their lifestyle and budget."
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Vehicle Taxonomy Index"
      />

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4 group block"
          >
            <div className="flex justify-between items-center">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                {c.badge}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {c.name}
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              {c.description}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Explore Category</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
