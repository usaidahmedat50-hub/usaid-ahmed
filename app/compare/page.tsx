import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { getAllVehicles } from '@/lib/data/mock-db';
import { formatPkr } from '@/lib/utils/format';
import { Sparkles, ArrowRightLeft, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Compare Electric Cars Side by Side — PakevFinder Comparison Engine',
  description: 'Compare price, battery capacity, WLTP range, fast charging speed, motor power, and value scores between electric vehicles in Pakistan.',
  alternates: {
    canonical: 'https://pakevfinder.com/compare',
  },
};

export default function CompareLandingPage() {
  const vehicles = getAllVehicles();

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Compare EVs', url: 'https://pakevfinder.com/compare' },
  ];

  const popularComparisons = [
    {
      car1: 'byd-seal',
      car2: 'tesla-model-3',
      title: 'BYD Seal vs Tesla Model 3',
      subtitle: 'Luxury Sedan Battle',
    },
    {
      car1: 'byd-atto-3',
      car2: 'deepal-s07',
      title: 'BYD Atto 3 vs Deepal S07',
      subtitle: 'Compact EV SUV Faceoff',
    },
    {
      car1: 'mg-zs-ev',
      car2: 'byd-atto-3',
      title: 'MG ZS EV vs BYD Atto 3',
      subtitle: 'Popular Pakistani EV SUVs',
    },
    {
      car1: 'bmw-i4',
      car2: 'byd-seal',
      title: 'BMW i4 vs BYD Seal',
      subtitle: 'Premium Electric Gran Coupe Comparison',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Comparison Engine
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Compare Electric Vehicles Side by Side
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Transparent, data-backed side-by-side comparison across prices, claimed range, battery capacity, peak DC charging speeds, motor horsepower, warranty coverage, and net running costs.
        </p>
      </div>

      <AnswerFirstSummary
        answer="PakevFinder Comparison Engine analyzes vehicles using verified metrics and independent value scoring logic. Missing metrics are labeled 'Not available' rather than estimated."
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Value Scoring Engine"
      />

      {/* Popular Comparison Shortcuts */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          Popular EV Comparisons
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularComparisons.map((comp, idx) => (
            <Link
              key={idx}
              href={`/compare/${comp.car1}-vs-${comp.car2}`}
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  {comp.subtitle}
                </span>
                <span className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors block">
                  {comp.title}
                </span>
                <p className="text-xs text-slate-500">
                  Compare price, battery kWh, WLTP range & 0-100 acceleration
                </p>
              </div>
              <div className="bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 p-3 rounded-xl transition-all">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Select Any 2 Vehicles Grid */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-bold">Select Vehicles to Compare</h2>
        <p className="text-xs text-slate-300">
          Pick any two vehicles from our 109+ model database to generate a dynamic comparison page.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {vehicles.slice(0, 12).map((v) => (
            <Link
              key={v.id}
              href={`/compare/${v.slug}-vs-byd-seal`}
              className="bg-slate-800 hover:bg-slate-700 p-3.5 rounded-xl border border-slate-700 transition-all text-xs space-y-1 block"
            >
              <span className="font-bold text-white block">{v.name}</span>
              <span className="text-slate-400 block">{v.maxRangeKm} km • {formatPkr(v.startingPricePkr)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
