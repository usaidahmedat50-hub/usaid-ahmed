'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import FilterPanel, { FilterState } from '@/components/vehicles/FilterPanel';
import VehicleCard from '@/components/vehicles/VehicleCard';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { getAllVehicles, getAllBrands } from '@/lib/data/mock-db';
import { Loader2 } from 'lucide-react';

function DirectoryContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialPrice = searchParams.get('priceBracket') || '';

  const allVehicles = getAllVehicles();
  const allBrands = getAllBrands();

  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch,
    brand: '',
    bodyType: '',
    priceBracket: initialPrice,
    minRange: '',
    driveType: '',
  });

  const filteredVehicles = useMemo(() => {
    return allVehicles.filter((v) => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(q);
        const matchesBrand = v.brandName.toLowerCase().includes(q);
        const matchesTagline = v.tagline.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesTagline) return false;
      }

      // Brand
      if (filters.brand && v.brandSlug !== filters.brand) return false;

      // Body Type
      if (filters.bodyType && v.bodyType !== filters.bodyType) return false;

      // Price Bracket
      if (filters.priceBracket) {
        const p = v.startingPricePkr;
        if (filters.priceBracket === 'under-50-lakh' && p > 5000000) return false;
        if (filters.priceBracket === '50-lakh-1-crore' && (p <= 5000000 || p > 10000000)) return false;
        if (filters.priceBracket === '1-crore-2-crore' && (p <= 10000000 || p > 20000000)) return false;
        if (filters.priceBracket === 'above-2-crore' && p <= 20000000) return false;
      }

      // Min Range
      if (filters.minRange) {
        const r = parseInt(filters.minRange, 10);
        if (v.maxRangeKm < r) return false;
      }

      return true;
    });
  }, [allVehicles, filters]);

  return (
    <>
      {/* Interactive Filter Panel */}
      <FilterPanel filters={filters} onChange={setFilters} brands={allBrands} />

      {/* Results Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-6">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Showing <strong className="text-blue-600">{filteredVehicles.length}</strong> Verified Electric Vehicles
        </span>
      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
          <p className="text-base font-bold text-slate-900 mb-2">No Electric Cars Match Your Filters</p>
          <p className="text-xs">Try resetting or broadening your search parameters above.</p>
        </div>
      )}
    </>
  );
}

export default function ElectricCarsDirectoryPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Electric Cars Pakistan', url: 'https://pakevfinder.com/electric-cars' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Electric Cars in Pakistan (2026 Prices & Specs)
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Explore all official and imported electric vehicle models available across Pakistan.
        </p>
      </div>

      {/* AEO Summary */}
      <AnswerFirstSummary
        answer="Pakistan's electric car directory features models ranging from budget hatchbacks like the Honri VE (PKR 39.99 Lakh) to luxury SUVs like the BYD Atto 3, Deepal S07, and KIA EV5. All prices reflect verified ex-factory rates from official distributors Mega Motors, Master Changan, JW Auto Park, and Lucky Motor Corporation."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Verified EV Price Index"
      />

      <Suspense
        fallback={
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading EV Directory Filters...</p>
          </div>
        }
      >
        <DirectoryContent />
      </Suspense>
    </div>
  );
}
