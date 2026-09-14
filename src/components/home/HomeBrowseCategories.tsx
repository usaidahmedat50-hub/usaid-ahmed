import React from 'react';
import Link from 'next/link';
import {
  Wallet,
  Car,
  Zap,
  ArrowRight,
  ShieldCheck,
  BatteryCharging,
  Layers,
  Sparkles,
} from 'lucide-react';

export function HomeBrowseCategories() {
  const budgetTiles = [
    {
      title: 'Under 50 Lacs',
      range: 'PKR 35 – 50 Lakhs',
      desc: 'Urban runabouts & budget city commuters.',
      models: 'Honri VE 2.0 / 3.0, Dongfeng Box',
      slug: 'under-50-lacs',
      accentColor: 'border-emerald-200 bg-emerald-50/40 text-emerald-950',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: '50 Lacs to 1 Crore',
      range: 'PKR 50L – 1 Crore',
      desc: 'High-spec family crossovers & sedans.',
      models: 'MG4 EV, BYD Atto 3, Omoda E5',
      slug: 'under-1-crore',
      accentColor: 'border-blue-200 bg-blue-50/40 text-blue-950',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      title: '1 to 1.5 Crore',
      range: 'PKR 1.0 – 1.5 Crore',
      desc: 'Executive fastbacks & long-range SUVs.',
      models: 'Deepal S07, Deepal L07, BYD Seal Dynamic',
      slug: 'under-1-5-crore',
      accentColor: 'border-cyan-200 bg-cyan-50/40 text-cyan-950',
      badgeColor: 'bg-cyan-100 text-cyan-800',
    },
    {
      title: 'Above 1.5 Crore',
      range: 'PKR 1.5 Crore+',
      desc: 'Flagship luxury, dual-motor performance AWD.',
      models: 'BYD Seal AWD, Audi e-tron, KIA EV5',
      slug: 'pure-electric',
      accentColor: 'border-indigo-200 bg-indigo-50/40 text-indigo-950',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
  ];

  const bodyTypes = [
    {
      name: 'Electric SUVs',
      desc: 'High ground clearance & family space',
      slug: 'suv',
      count: '12+ Models',
    },
    {
      name: 'Electric Sedans',
      desc: 'Aerodynamic executive highway cruisers',
      slug: 'sedan',
      count: '6+ Models',
    },
    {
      name: 'City Hatchbacks',
      desc: 'Agile daily urban commuting',
      slug: 'hatchback',
      count: '4+ Models',
    },
    {
      name: 'Microcars',
      desc: 'Ultra-low charging cost & tight parking',
      slug: 'microcar',
      count: '3+ Models',
    },
  ];

  return (
    <div className="space-y-12">
      {/* 1. Browse by Budget Tiles */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Wallet className="w-3.5 h-3.5" />
              <span>Investment Brackets</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
              Browse by Budget Bracket
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare vehicles segmented by verified Pakistani ex-factory distributor pricing.
            </p>
          </div>

          <Link
            href="/categories"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>All 11 Categories &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {budgetTiles.map((tile) => (
            <Link
              key={tile.slug}
              href={`/categories/${tile.slug}`}
              className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between group ${tile.accentColor}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${tile.badgeColor}`}>
                    {tile.range}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                  {tile.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{tile.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Notable:</span>
                <span className="line-clamp-1">{tile.models}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. Browse by Car Body Silhouette */}
      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Car className="w-3.5 h-3.5" />
            <span>Body Styles</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            Browse by Vehicle Silhouette
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select the driving ergonomics and cabin proportions matched to your household.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bodyTypes.map((body) => (
            <Link
              key={body.slug}
              href={`/categories/${body.slug}`}
              className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {body.count}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {body.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{body.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600 group-hover:underline">
                <span>View Models &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
