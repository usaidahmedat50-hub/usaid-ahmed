import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { getAllVehicles, getAllBrands } from '@/lib/data/mock-db';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Electric Cars in Pakistan — Complete EV Directory & Prices 2026',
  description: 'Explore all verified electric cars, PHEVs, REEVs, and Hybrids available in Pakistan with prices, battery capacity, range, and fast-charging specs.',
  alternates: {
    canonical: 'https://pakevfinder.com/vehicles',
  },
};

export default function VehiclesDirectoryPage() {
  const vehicles = getAllVehicles();
  const brands = getAllBrands();

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Vehicles Directory', url: 'https://pakevfinder.com/vehicles' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            2026 Directory
          </span>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
            {vehicles.length} Models Indexed
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Electric & Hybrid Vehicles Directory
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Filter and compare verified electric vehicles (BEVs), Plug-in Hybrids (PHEVs), and Range-Extended EVs (REEVs) across Pakistan with official distributor tariffs and verified technical metrics.
        </p>
      </div>

      <AnswerFirstSummary
        answer={`PakevFinder indexes ${vehicles.length} verified electric and hybrid vehicles in Pakistan across 30+ official automotive brands including BYD, Deepal, MG, BMW, Mercedes-Benz, Audi, Tesla, Hyundai, and Toyota. Starting prices range from PKR 2.8 Million for urban micro-EVs up to PKR 85 Million for flagship luxury SUVs.`}
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Automotive Intelligence Index"
      />

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Inventory</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Powertrain Filter */}
          <select className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Powertrains (EV / PHEV / REEV)</option>
            <option value="BEV">Pure Electric (BEV)</option>
            <option value="PHEV">Plug-in Hybrid (PHEV)</option>
            <option value="REEV">Range-Extended (REEV)</option>
            <option value="Hybrid">Hybrid (HEV)</option>
          </select>

          {/* Body Type Filter */}
          <select className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Body Types</option>
            <option value="SUV">SUV / Crossover</option>
            <option value="Sedan">Sedan / Fastback</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Microcar">Microcar / City EV</option>
            <option value="Pickup">Pickup Truck</option>
          </select>

          {/* Brand Filter */}
          <select className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Brands ({brands.length})</option>
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Price Range Filter */}
          <select className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Price Ranges</option>
            <option value="under-5m">Under PKR 5.0 Million</option>
            <option value="5m-10m">PKR 5.0M – 10.0M</option>
            <option value="10m-20m">PKR 10.0M – 20.0M</option>
            <option value="above-20m">Above PKR 20.0 Million</option>
          </select>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </div>
  );
}
