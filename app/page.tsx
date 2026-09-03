import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema, createWebSiteSchema } from '@/components/seo/SchemaScript';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { getAllVehicles, getAllBrands } from '@/lib/data/mock-db';
import { formatPkr } from '@/lib/utils/format';
import {
  Search,
  Sparkles,
  ArrowRightLeft,
  ShieldCheck,
  Zap,
  Battery,
  Building2,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const metadata = {
  title: 'PakevFinder — Electric Vehicle Specifications, Prices & Comparison',
  description: 'Find verified electric car prices, battery capacity, WLTP range, fast charging speeds, and side-by-side comparison in Pakistan.',
  alternates: {
    canonical: 'https://pakevfinder.com',
  },
};

export default function HomePage() {
  const vehicles = getAllVehicles();
  const brands = getAllBrands();

  const featuredVehicles = vehicles.filter((v) => v.isFeatured).slice(0, 6);

  const breadcrumbs = [{ name: 'Home', url: 'https://pakevfinder.com' }];

  return (
    <div className="space-y-12 py-6">
      <SchemaScript
        schemaData={[
          createWebSiteSchema(),
          createBreadcrumbSchema(breadcrumbs),
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified EV Intelligence & Price Directory</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Find the right electric vehicle.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Compare verified prices, claimed range, battery capacity, DC fast charging, and net running costs across electric vehicles in Pakistan.
          </p>
        </div>

        {/* Hero Search Bar */}
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 max-w-2xl flex items-center gap-2">
          <div className="pl-3 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search vehicles, brands, or compare (e.g. BYD Seal, Deepal S07)..."
            className="w-full bg-transparent border-none text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-0 p-2"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md shrink-0">
            Search
          </button>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-3 flex-wrap text-xs font-semibold pt-2">
          <Link
            href="/compare"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-4 h-4 text-blue-400" />
            Compare EVs
          </Link>
          <Link
            href="/vehicles"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Explore Vehicles ({vehicles.length})
          </Link>
          <Link
            href="/brands"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            Browse Brands ({brands.length})
          </Link>
          <Link
            href="/articles"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            EV Guides
          </Link>
        </div>
      </section>

      {/* Answer-First Summary (AEO) */}
      <AnswerFirstSummary
        answer={`PakevFinder is Pakistan's dedicated EV discovery platform, indexing ${vehicles.length} verified electric, PHEV, and REEV models with transparent technical specs, DC fast charging station maps, running cost calculators, and historical pricing log archives.`}
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Automotive Data Verification Engine"
      />

      {/* Popular Vehicles Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Popular Electric Vehicles
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Verified specs and distributor pricing for top-searched models
            </p>
          </div>
          <Link
            href="/vehicles"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All Vehicles ({vehicles.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* Compare Section Banner */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Comparison Engine</span>
        </div>

        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Compare Any Two Vehicles Side by Side
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluate claimed range, battery capacity, peak DC fast charging speed, motor power, and total ownership costs with independent value scoring.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap gap-4">
          <Link
            href="/compare/byd-seal-vs-tesla-model-3"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            Compare BYD Seal vs Tesla Model 3 &rarr;
          </Link>
          <Link
            href="/compare/byd-atto-3-vs-deepal-s07"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3.5 px-6 rounded-xl transition-all border border-slate-200 flex items-center gap-2"
          >
            Compare BYD Atto 3 vs Deepal S07
          </Link>
        </div>
      </section>

      {/* Verified Price Log Summary Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold">Latest Verified Distributor Tariffs</h2>
          </div>
          <span className="text-xs text-slate-400">Updated Feb 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {vehicles.slice(0, 4).map((v) => (
            <div key={v.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-xs text-slate-400 font-medium block">{v.brandName}</span>
              <span className="text-sm font-bold text-white block">{v.name}</span>
              <span className="text-lg font-black text-emerald-400 block">
                {v.startingPricePkr > 0 ? formatPkr(v.startingPricePkr) : 'Expected'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Data Quality & Trust Section */}
      <section className="bg-slate-50 border border-slate-200 p-8 rounded-3xl space-y-4 text-center max-w-4xl mx-auto">
        <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
        <h3 className="text-2xl font-black text-slate-900">Transparent & Verified EV Data</h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Every vehicle record on PakevFinder clearly displays its verification status (`verified`, `partially_verified`, `unverified`, or `outdated`), source citation, and last verified date. We do not display unverified claims as fact.
        </p>
      </section>
    </div>
  );
}
