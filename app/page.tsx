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
  Filter,
  Calculator,
  Compass,
} from 'lucide-react';

export const metadata = {
  title: 'PakEVFinder — Pakistan Electric Vehicle Discovery & Ownership Platform',
  description: 'Find verified electric car prices, battery capacity, WLTP range, fast charging speeds, 5-year TCO calculators, and side-by-side comparison in Pakistan.',
  alternates: {
    canonical: 'https://pakevfinder.com',
  },
};

export default function HomePage() {
  const vehicles = getAllVehicles();
  const brands = getAllBrands();

  const featuredVehicles = vehicles.slice(0, 6);

  const breadcrumbs = [{ name: 'Home', url: 'https://pakevfinder.com' }];

  return (
    <div className="space-y-16 pb-16">
      <SchemaScript
        schemaData={[
          createWebSiteSchema(),
          createBreadcrumbSchema(breadcrumbs),
        ]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80 pt-12 pb-20 bg-grid-pattern">
        {/* Decorative Ambient Lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          <div className="max-w-4xl space-y-6 text-center mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-indigo-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Pakistan Electric Vehicle Decision Platform</span>
            </div>

            <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-none text-white">
              Find the Right <span className="gradient-text-electric">Electric Car.</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
              Transparent battery specs, verified distributor prices, real-world WLTP range estimators, and 5-year TCO calculators across all EVs in Pakistan.
            </p>
          </div>

          {/* Hero Multi-Search Bar */}
          <div className="glass-panel p-3.5 rounded-3xl border border-white/10 max-w-3xl mx-auto shadow-2xl space-y-3.5">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-2xl">
              <Search className="w-5 h-5 text-blue-400 ml-2 shrink-0" />
              <input
                type="text"
                placeholder="Search BYD Seal, Deepal S07, MG ZS EV, Tesla Model 3..."
                className="w-full bg-transparent border-none text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:ring-0 p-2"
              />
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/25 shrink-0">
                Search Inventory
              </button>
            </div>

            {/* Quick Filter Shortcuts */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-bold pt-1">
              <span className="text-slate-400 text-[11px] font-semibold mr-1">Browse:</span>
              <Link href="/categories/electric-suvs" className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors">
                Electric SUVs
              </Link>
              <Link href="/categories/electric-sedans" className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors">
                Sedans
              </Link>
              <Link href="/categories/evs-under-5000000" className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors">
                Under 5 Million
              </Link>
              <Link href="/brands/byd" className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors">
                BYD
              </Link>
              <Link href="/brands/deepal" className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors">
                Deepal
              </Link>
            </div>
          </div>

          {/* Quick Tools Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2">
            <Link href="/find-an-ev" className="glass-card p-4 rounded-2xl flex items-center gap-3 border border-slate-800 hover:border-blue-500/50">
              <Compass className="w-6 h-6 text-blue-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">EV Matchmaker</span>
                <span className="text-[10px] text-slate-400">Find by Budget & Needs</span>
              </div>
            </Link>

            <Link href="/calculators/ev-vs-petrol" className="glass-card p-4 rounded-2xl flex items-center gap-3 border border-slate-800 hover:border-emerald-500/50">
              <ArrowRightLeft className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">EV vs Petrol</span>
                <span className="text-[10px] text-slate-400">Calculate Monthly Fuel Savings</span>
              </div>
            </Link>

            <Link href="/compare" className="glass-card p-4 rounded-2xl flex items-center gap-3 border border-slate-800 hover:border-indigo-500/50">
              <Sparkles className="w-6 h-6 text-indigo-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Compare EVs</span>
                <span className="text-[10px] text-slate-400">Side-by-Side Specs</span>
              </div>
            </Link>

            <Link href="/calculators/total-cost-of-ownership" className="glass-card p-4 rounded-2xl flex items-center gap-3 border border-slate-800 hover:border-amber-500/50">
              <Calculator className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">TCO Calculator</span>
                <span className="text-[10px] text-slate-400">3/5/7-Year Ownership</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Answer-First Summary (AEO) */}
        <AnswerFirstSummary
          answer={`PakEVFinder is Pakistan's dedicated EV discovery and ownership platform, indexing ${vehicles.length} verified electric, PHEV, and REEV models with transparent technical specs, DC fast charging station maps, 5-year TCO calculators, and historical pricing log archives.`}
          verifiedDate="Feb 2026"
          sourceName="PakEVFinder Automotive Data Verification Engine"
        />

        {/* Featured Vehicles Showcase */}
        <section className="space-y-6">
          <div className="flex justify-between items-end flex-wrap gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Popular Electric Lineup</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Featured Electric Cars in Pakistan
              </h2>
            </div>
            <Link
              href="/vehicles"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Explore All EVs ({vehicles.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>

        {/* Side-by-Side Comparison Engine Banner */}
        <section className="glass-panel rounded-3xl p-8 space-y-6 relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Comparison Engine</span>
          </div>

          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Compare Electric Vehicles Side-by-Side
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Evaluate claimed WLTP range, battery capacity, peak DC fast charging speed, motor horsepower, and 5-year total ownership cost with transparent value scoring.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/compare/byd-seal-vs-tesla-model-3"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <span>Compare BYD Seal vs Tesla Model 3</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/compare/byd-atto-3-vs-deepal-s07"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs py-3.5 px-6 rounded-xl transition-all border border-slate-800 flex items-center gap-2"
            >
              <span>BYD Atto 3 vs Deepal S07</span>
            </Link>
          </div>
        </section>

        {/* Interactive Real-World Range Estimator */}
        <RangeCalculator
          vehicleName="BYD Seal"
          claimedWltpRangeKm={570}
          batteryCapacityKwh={82.5}
        />

        {/* Interactive Running Cost Calculator */}
        <VehicleRunningCostCalculator
          vehicleName="BYD Seal"
          batteryCapacityKwh={82.5}
          maxRangeKm={570}
        />

        {/* Distributor Tariff Summary Matrix */}
        <section className="glass-panel border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Verified Distributor Price Matrix</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Updated Feb 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {vehicles.slice(0, 4).map((v) => (
              <div key={v.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{v.brandName}</span>
                <span className="text-sm font-bold text-white block">{v.name}</span>
                <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 block">
                  {v.startingPricePkr > 0 ? formatPkr(v.startingPricePkr) : 'Upcoming'}
                </span>
                <span className="text-[10px] text-slate-400 block pt-1">{v.distributorName}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
