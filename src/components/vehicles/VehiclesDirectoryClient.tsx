'use client';

import React, { useState, useMemo } from 'react';
import { VehicleWithDetails } from '@/lib/types';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { Search, GitCompare, X, RotateCcw, Check } from 'lucide-react';
import Link from 'next/link';

interface VehiclesDirectoryClientProps {
  initialVehicles: VehicleWithDetails[];
}

export function VehiclesDirectoryClient({ initialVehicles }: VehiclesDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPowertrain, setSelectedPowertrain] = useState<string>('all');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [minRange, setMinRange] = useState<number>(0);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [comparedSlugs, setComparedSlugs] = useState<string[]>([]);

  const toggleCompare = (slug: string) => {
    if (comparedSlugs.includes(slug)) {
      setComparedSlugs(comparedSlugs.filter((s) => s !== slug));
    } else {
      if (comparedSlugs.length < 3) {
        setComparedSlugs([...comparedSlugs, slug]);
      }
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPowertrain('all');
    setSelectedBodyType('all');
    setMaxPrice(0);
    setMinRange(0);
    setAvailableOnly(false);
  };

  const filteredVehicles = useMemo(() => {
    return initialVehicles.filter((veh) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          veh.name.toLowerCase().includes(q) ||
          veh.brand.name.toLowerCase().includes(q) ||
          (veh.summary && veh.summary.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Powertrain
      if (selectedPowertrain !== 'all' && veh.powertrain !== selectedPowertrain) {
        return false;
      }

      // Body Type
      if (selectedBodyType !== 'all' && veh.body_type !== selectedBodyType) {
        return false;
      }

      // Max Price
      if (maxPrice > 0) {
        const price = veh.latest_ex_factory_price?.amount_pkr;
        if (!price || price > maxPrice) return false;
      }

      // Min Range
      if (minRange > 0) {
        const range = parseFloat(veh.specs.wltp_range_km?.value || '0');
        if (range < minRange) return false;
      }

      // Available Only
      if (availableOnly && veh.status !== 'available') {
        return false;
      }

      return true;
    });
  }, [
    initialVehicles,
    searchQuery,
    selectedPowertrain,
    selectedBodyType,
    maxPrice,
    minRange,
    availableOnly,
  ]);

  return (
    <div className="space-y-6">
      {/* Search Bar & Filter Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand, model, or spec (e.g. BYD, Deepal, 500 km)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md pl-9 pr-4 py-2 text-xs text-[#111114] placeholder:text-gray-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
                availableOnly
                  ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                  : 'bg-white text-gray-700 hover:text-[#111114] border-gray-300 hover:bg-gray-50'
              }`}
            >
              {availableOnly && <Check className="w-3.5 h-3.5 text-blue-700" />}
              <span>Available in Market</span>
            </button>

            {(searchQuery ||
              selectedPowertrain !== 'all' ||
              selectedBodyType !== 'all' ||
              maxPrice > 0 ||
              minRange > 0 ||
              availableOnly) && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-xs text-gray-500 hover:text-rose-600 bg-white border border-gray-300 hover:border-rose-300 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Powertrain */}
          <div>
            <label className="block text-slate-500 text-[10px] uppercase font-semibold mb-1">
              Powertrain
            </label>
            <select
              value={selectedPowertrain}
              onChange={(e) => setSelectedPowertrain(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Powertrains</option>
              <option value="bev">Pure Electric (BEV)</option>
              <option value="phev">Plug-in Hybrid (PHEV)</option>
              <option value="reev">Range-Extender (REEV)</option>
              <option value="hev">Self-Charging Hybrid (HEV)</option>
            </select>
          </div>

          {/* Body Type */}
          <div>
            <label className="block text-slate-500 text-[10px] uppercase font-semibold mb-1">
              Body Type
            </label>
            <select
              value={selectedBodyType}
              onChange={(e) => setSelectedBodyType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Body Types</option>
              <option value="suv">SUV / Crossover</option>
              <option value="sedan">Sedan</option>
              <option value="hatchback">Hatchback</option>
              <option value="microcar">City Microcar</option>
              <option value="pickup">Electric Pickup</option>
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-slate-500 text-[10px] uppercase font-semibold mb-1">
              Budget Filter
            </label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="0">Open Budget</option>
              <option value="2000000">Under 20 Lakhs</option>
              <option value="4000000">Under 40 Lakhs</option>
              <option value="6000000">Under 60 Lakhs</option>
              <option value="8000000">Under 80 Lakhs</option>
              <option value="10000000">Under 1.0 Crore</option>
              <option value="15000000">Under 1.5 Crore</option>
              <option value="25000000">Under 2.5 Crore</option>
            </select>
          </div>

          {/* Min Range */}
          <div>
            <label className="block text-slate-500 text-[10px] uppercase font-semibold mb-1">
              Min Range (WLTP)
            </label>
            <select
              value={minRange}
              onChange={(e) => setMinRange(parseInt(e.target.value, 10))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="0">Any Range</option>
              <option value="200">200+ km</option>
              <option value="350">350+ km</option>
              <option value="450">450+ km</option>
              <option value="550">550+ km</option>
            </select>
          </div>
        </div>

        {/* Quick Budget Chips Row */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Quick Budget:
          </span>
          {[
            { label: 'Under 20 Lacs', value: 2000000 },
            { label: 'Under 40 Lacs', value: 4000000 },
            { label: 'Under 60 Lacs', value: 6000000 },
            { label: 'Under 80 Lacs', value: 8000000 },
            { label: 'Under 1 Cr', value: 10000000 },
            { label: 'Open Budget', value: 0 },
          ].map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => setMaxPrice(chip.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                maxPrice === chip.value
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Showing <strong className="text-[#111114] tabular-nums font-semibold">{filteredVehicles.length}</strong> of{' '}
          <strong className="text-[#111114] tabular-nums font-semibold">{initialVehicles.length}</strong> vehicles
        </span>
        {availableOnly && (
          <span className="text-blue-700 font-medium">Filtering available market models</span>
        )}
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicles.map((veh) => (
            <VehicleCard
              key={veh.id}
              vehicle={veh}
              onCompareToggle={toggleCompare}
              isCompared={comparedSlugs.includes(veh.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-10 rounded-lg text-center space-y-2.5">
          <p className="text-sm font-bold text-[#111114]">No electric vehicles match your filters.</p>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Try resetting your budget or body type filters to view other catalog models.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-3.5 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium transition-colors mt-2"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Floating Compare Bar */}
      {comparedSlugs.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-blue-300 p-3.5 rounded-lg shadow-xl flex items-center gap-4 max-w-md w-[92vw]">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-blue-700 shrink-0" />
            <div>
              <span className="text-xs font-bold text-[#111114] block">
                {comparedSlugs.length} of 3 Vehicles Selected
              </span>
              <span className="text-[10px] text-gray-500">
                Ready for side-by-side comparison
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setComparedSlugs([])}
              className="p-1.5 text-gray-400 hover:text-[#111114] rounded text-xs"
              title="Clear compare tray"
            >
              <X className="w-4 h-4" />
            </button>

            <Link
              href={
                comparedSlugs.length >= 2
                  ? `/compare/${comparedSlugs.join('-vs-')}`
                  : `/compare?v1=${comparedSlugs[0]}`
              }
              className="px-3.5 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs transition-colors"
            >
              Compare &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
