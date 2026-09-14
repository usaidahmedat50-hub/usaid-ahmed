'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

interface BrandCardItem {
  id: string;
  name: string;
  slug: string;
  distributor: string;
  country: string;
  flag: string;
  modelsCount: number;
  highlightModel: string;
  tagline: string;
  status: 'Official Assembly / CKD' | 'Official Distributor CBU' | 'Direct Import';
  accentColor: string;
}

const MAJOR_BRANDS: BrandCardItem[] = [
  {
    id: 'byd',
    name: 'BYD',
    slug: 'byd',
    distributor: 'Mega Motor Co (Hubco)',
    country: 'China',
    flag: '🇨🇳',
    modelsCount: 3,
    highlightModel: 'Seal & Atto 3',
    tagline: 'Global #1 NEV Maker with Blade Battery Architecture',
    status: 'Official Distributor CBU',
    accentColor: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    id: 'deepal',
    name: 'Changan Deepal',
    slug: 'deepal',
    distributor: 'Master Changan Motors',
    country: 'China',
    flag: '🇨🇳',
    modelsCount: 2,
    highlightModel: 'S07 SUV & L07 Sedan',
    tagline: 'Futuristic styling, AR-HUD & frameless doors',
    status: 'Official Distributor CBU',
    accentColor: 'from-blue-500/20 to-cyan-500/10',
  },
  {
    id: 'mg',
    name: 'MG Motors',
    slug: 'mg',
    distributor: 'JW-SEZ / SAIC Motors',
    country: 'UK / China',
    flag: '🇨🇳',
    modelsCount: 3,
    highlightModel: 'MG4 EV & ZS EV',
    tagline: 'Rear-wheel-drive dynamics & 5-star Euro NCAP',
    status: 'Official Distributor CBU',
    accentColor: 'from-red-500/20 to-orange-500/10',
  },
  {
    id: 'gwm',
    name: 'GWM (Haval / Ora)',
    slug: 'gwm',
    distributor: 'Sazgar Engineering',
    country: 'China',
    flag: '🇨🇳',
    modelsCount: 1,
    highlightModel: 'Ora 03 EV',
    tagline: 'Retro-futuristic hatchback with 400 km range',
    status: 'Official Distributor CBU',
    accentColor: 'from-cyan-500/20 to-blue-500/10',
  },
  {
    id: 'honri',
    name: 'Honri',
    slug: 'honri',
    distributor: 'Dewan Motors',
    country: 'China',
    flag: '🇨🇳',
    modelsCount: 2,
    highlightModel: 'Honri VE 2.0 & 3.0',
    tagline: "Pakistan's accessible city EV starting from Rs. 35.99 Lacs",
    status: 'Official Assembly / CKD',
    accentColor: 'from-green-500/20 to-emerald-500/10',
  },
  {
    id: 'omoda',
    name: 'Omoda & Jaecoo',
    slug: 'omoda',
    distributor: 'Chery / Gandhara Network',
    country: 'China',
    flag: '🇨🇳',
    modelsCount: 1,
    highlightModel: 'Omoda E5',
    tagline: 'Fastback crossover with 61 kWh LFP & Sony Audio',
    status: 'Official Distributor CBU',
    accentColor: 'from-purple-500/20 to-indigo-500/10',
  },
  {
    id: 'dongfeng',
    name: 'Dongfeng',
    slug: 'dongfeng',
    distributor: 'Dongfeng Motor Corp',
    country: 'China',
    flag: '🇨🇳',
    modelsCount: 1,
    highlightModel: 'Dongfeng Box',
    tagline: 'Ultra-compact urban EV with frameless glass doors',
    status: 'Official Distributor CBU',
    accentColor: 'from-amber-500/20 to-yellow-500/10',
  },
  {
    id: 'gac',
    name: 'GAC Aion',
    slug: 'gac',
    distributor: 'Guangzhou Automobile Group',
    country: 'China',
    flag: '🇨🇳',
    modelsCount: 1,
    highlightModel: 'Aion V',
    tagline: 'Spacious electric SUV with 75.3 kWh battery capacity',
    status: 'Official Distributor CBU',
    accentColor: 'from-sky-500/20 to-blue-500/10',
  },
  {
    id: 'kia',
    name: 'KIA',
    slug: 'kia',
    distributor: 'Lucky Motor Corporation',
    country: 'South Korea',
    flag: '🇰🇷',
    modelsCount: 1,
    highlightModel: 'KIA EV5',
    tagline: 'Dedicated E-GMP architecture with 88.1 kWh battery',
    status: 'Official Distributor CBU',
    accentColor: 'from-slate-500/20 to-zinc-500/10',
  },
  {
    id: 'audi',
    name: 'Audi',
    slug: 'audi',
    distributor: 'Premier Systems',
    country: 'Germany',
    flag: '🇩🇪',
    modelsCount: 1,
    highlightModel: 'e-tron 50 quattro',
    tagline: 'Luxury performance dual-motor electric quattro',
    status: 'Official Distributor CBU',
    accentColor: 'from-slate-700/20 to-gray-600/10',
  },
];

export function BrandGrid() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            <span>Authorized Network & Assemblers</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Major EV Brands in Pakistan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified local distributor networks, assembly credentials, and model portfolios.
          </p>
        </div>

        <Link
          href="/brands"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
        >
          <span>View all 17 manufacturer hubs</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {MAJOR_BRANDS.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="group relative bg-white border border-slate-200/80 hover:border-cyan-500/50 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient Corner Glow on Hover */}
            <div
              className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br ${brand.accentColor} blur-2xl group-hover:opacity-100 opacity-40 transition-opacity pointer-events-none`}
            />

            <div>
              {/* Top Row: Country flag + Models Count */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-base" title={brand.country}>
                  {brand.flag}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-cyan-50 group-hover:text-cyan-700 border border-slate-200/60 transition-colors tabular-nums">
                  {brand.modelsCount} {brand.modelsCount === 1 ? 'Model' : 'Models'}
                </span>
              </div>

              {/* Brand Title */}
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                {brand.name}
              </h3>

              {/* Distributor */}
              <p className="text-[11px] font-semibold text-slate-500 line-clamp-1 mt-0.5">
                {brand.distributor}
              </p>

              {/* Key Hero Model */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-[11px]">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                  Lead Model
                </span>
                <span className="font-bold text-slate-800 text-xs line-clamp-1">
                  {brand.highlightModel}
                </span>
              </div>
            </div>

            {/* Bottom Status Pill */}
            <div className="mt-3.5 flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-medium truncate max-w-[85%]">{brand.status}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
