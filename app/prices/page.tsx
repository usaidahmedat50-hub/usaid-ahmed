import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { getAllVehicles } from '@/lib/data/mock-db';
import { formatPkr } from '@/lib/utils/format';
import { Tag, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Electric Car Prices in Pakistan 2026 — Official Distributor Tariffs',
  description: 'Find official electric vehicle prices, ex-factory tariffs, import duty subsidies, and price history logs across Pakistan.',
};

export default function PriceDirectoryPage() {
  const vehicles = getAllVehicles();

  const priceBrackets = [
    { title: 'Under PKR 5 Million', budgetPkr: 5000000, link: '/prices/under-5000000' },
    { title: 'Under PKR 10 Million (1 Crore)', budgetPkr: 10000000, link: '/prices/under-10000000' },
    { title: 'Under PKR 15 Million', budgetPkr: 15000000, link: '/prices/under-15000000' },
    { title: 'Luxury & Premium (1.5 Crore+)', budgetPkr: 35000000, link: '/prices/premium' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Tag className="w-4 h-4 text-emerald-400" />
          <span>Price & Tariff Directory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Electric Car Prices in Pakistan (2026 Tariffs)
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Browse verified ex-factory prices, distributor tariffs, historical price logs, and tax reduction benefits under Pakistan NEV policy.
        </p>
      </div>

      <AnswerFirstSummary
        answer="Electric car prices in Pakistan range from PKR 4.9 Million for compact urban hatchbacks up to PKR 32.5 Million for luxury flagship sedans. All published ex-factory prices are verified against distributor announcements and updated monthly."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Verified Price Registry"
      />

      {/* Budget Brackets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {priceBrackets.map((pb) => (
          <Link
            key={pb.title}
            href={pb.link}
            className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl transition-all space-y-2 group"
          >
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price Category</span>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
              <span>{pb.title}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h3>
          </Link>
        ))}
      </div>

      {/* All Vehicle Prices List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
          <h2 className="text-2xl font-black text-white">All Indexed Vehicle Tariffs</h2>
          <span className="text-xs text-slate-400">Total {vehicles.length} Models</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </div>
    </div>
  );
}
