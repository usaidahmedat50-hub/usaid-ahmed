import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema, createWebSiteSchema } from '@/components/seo/SchemaScript';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleRunningCostCalculator from '@/components/vehicles/VehicleRunningCostCalculator';
import RangeCalculator from '@/components/vehicles/RangeCalculator';
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
  Award,
  Compass,
  Calculator,
  BrainCircuit,
} from 'lucide-react';

export const metadata = {
  title: 'PakevFinder.com — Pakistan EV & Vehicle Discovery Platform',
  description: 'Find, compare and decide on electric cars, hybrids, battery capacity, range specs, 5-year TCO calculators, and prices in Pakistan.',
  alternates: {
    canonical: 'https://pakevfinder.com',
  },
};

export default function HomePage() {
  const vehicles = getAllVehicles();
  const brands = getAllBrands();

  const featuredVehicle = vehicles[0]; // BYD Seal (Large Showcase)
  const secondaryVehicles = vehicles.slice(1, 6);

  const breadcrumbs = [{ name: 'Home', url: 'https://pakevfinder.com' }];

  return (
    <div className="space-y-16 pb-16">
      <SchemaScript
        schemaData={[
          createWebSiteSchema(),
          createBreadcrumbSchema(breadcrumbs),
        ]}
      />

      {/* Hero Section — Automotive Discovery Cover */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          <div className="max-w-4xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-indigo-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Pakistan Automotive Intelligence & Decision Platform</span>
            </div>

            <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-none text-white">
              Find your next <span className="gradient-text-electric">vehicle.</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
              Explore, compare and understand the real-world cost of electric cars, hybrids, and new energy vehicles available in Pakistan.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <div className="editorial-panel p-4 rounded-3xl border border-white/10 max-w-3xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-3 rounded-2xl">
              <Search className="w-5 h-5 text-blue-400 shrink-0 ml-1" />
              <input
                type="text"
                placeholder="Search by brand (BYD, MG), model (Seal, S07), or budget..."
                className="w-full bg-transparent border-none text-white placeholder-slate-500 text-xs sm:text-sm font-bold focus:outline-none focus:ring-0 p-1"
              />
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 shrink-0">
                Search
              </button>
            </div>

            {/* Quick Discovery Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-bold pt-1">
              <span className="text-slate-400 text-[11px] font-semibold mr-1">Quick Discovery:</span>
              <Link href="/prices/under-5000000" className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors">
                Under PKR 5M
              </Link>
              <Link href="/categories/electric-suvs" className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors">
                Longest Range
              </Link>
              <Link href="/find-an-ev" className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors">
                Best Value
              </Link>
              <Link href="/categories/electric-sedans" className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors">
                City EVs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Answer-First Summary (AEO) */}
        <AnswerFirstSummary
          answer={`PakevFinder is Pakistan's dedicated EV discovery platform, indexing ${vehicles.length} verified electric, PHEV, and REEV models with transparent technical specs, DC fast charging station maps, 5-year TCO calculators, and historical pricing log archives.`}
          verifiedDate="Feb 2026"
          sourceName="PakevFinder Data Verification Engine"
        />

        {/* Explore By Category Funnel */}
        <section className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Explore by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/vehicles/ev" className="editorial-card p-5 rounded-3xl space-y-2 group">
              <div className="bg-blue-600/20 text-blue-400 p-2.5 rounded-2xl w-fit">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Electric (BEV)</h3>
              <p className="text-xs text-slate-400">Zero-emission battery electric vehicles</p>
            </Link>

            <Link href="/vehicles/hybrid" className="editorial-card p-5 rounded-3xl space-y-2 group">
              <div className="bg-emerald-500/20 text-emerald-400 p-2.5 rounded-2xl w-fit">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Hybrid (HEV)</h3>
              <p className="text-xs text-slate-400">Fuel efficiency + electric flexibility</p>
            </Link>

            <Link href="/vehicles/reev" className="editorial-card p-5 rounded-3xl space-y-2 group">
              <div className="bg-cyan-500/20 text-cyan-400 p-2.5 rounded-2xl w-fit">
                <Battery className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">Range Extender (REEV)</h3>
              <p className="text-xs text-slate-400">Electric drive with generator support</p>
            </Link>

            <Link href="/vehicles/ice" className="editorial-card p-5 rounded-3xl space-y-2 group">
              <div className="bg-amber-500/20 text-amber-400 p-2.5 rounded-2xl w-fit">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Petrol / ICE</h3>
              <p className="text-xs text-slate-400">Conventional engine benchmark</p>
            </Link>
          </div>
        </section>

        {/* Vehicles Worth Knowing Showcase */}
        <section className="space-y-6">
          <div className="flex justify-between items-end flex-wrap gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Curated Inventory</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Vehicles Worth Knowing
              </h2>
            </div>
            <Link href="/vehicles" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5">
              <span>View All ({vehicles.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VehicleCard vehicle={featuredVehicle} />
            </div>
            <div className="space-y-6">
              {secondaryVehicles.slice(0, 2).map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        </section>

        {/* "The Numbers That Matter" Section */}
        <section className="editorial-panel rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-black text-white">Compare What Actually Matters</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white text-number-display block">PKR 9.49M</span>
              <span className="text-xs text-slate-400 font-medium">Flagship EV Starting Price</span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 text-number-display block">570 KM</span>
              <span className="text-xs text-slate-400 font-medium">Max Claimed WLTP Range</span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-blue-400 text-number-display block">150 kW</span>
              <span className="text-xs text-slate-400 font-medium">Peak Fast Charge Power</span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 text-number-display block">3.8 SEC</span>
              <span className="text-xs text-slate-400 font-medium">0–100 km/h Acceleration</span>
            </div>
          </div>
        </section>

        {/* "Don't Know Which EV to Buy?" Matchmaker CTA */}
        <section className="editorial-panel rounded-3xl p-8 space-y-4 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <span>Decision Support Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Don&apos;t know which EV to buy?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
              Tell us how you drive, your daily commute, and your budget limit. We&apos;ll narrow down the exact matches for your lifestyle.
            </p>
          </div>

          <Link
            href="/find-an-ev"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20 shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Find My EV</span>
          </Link>
        </section>

        {/* Real-World Range & Running Cost Calculators */}
        <RangeCalculator
          vehicleName="BYD Seal"
          claimedWltpRangeKm={570}
          batteryCapacityKwh={82.5}
        />

        <VehicleRunningCostCalculator
          vehicleName="BYD Seal"
          batteryCapacityKwh={82.5}
          maxRangeKm={570}
        />
      </div>
    </div>
  );
}
