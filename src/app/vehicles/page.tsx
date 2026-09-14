import React from 'react';
import type { Metadata } from 'next';
import { getAllVehicles } from '@/lib/vehicles';
import { VehiclesDirectoryClient } from '@/components/vehicles/VehiclesDirectoryClient';
import { Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Electric Vehicles in Pakistan (2026 Prices & Specs) — PakEVFinder',
  description:
    'Browse and filter electric cars, SUVs, sedans, and city microcars in Pakistan. Compare ex-factory tariffs, battery capacities, and WLTP ranges.',
};

export const revalidate = 3600; // ISR 1 hour

export default async function VehiclesPage() {
  const vehicles = await getAllVehicles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <Zap className="w-3.5 h-3.5 text-blue-700" />
          <span>Vehicle Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111114]">
          Electric & Hybrid Vehicles in Pakistan
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
          Complete catalog of official distributor models and confirmed imports with verified specs, battery capacity, range, and ex-factory pricing.
        </p>
      </div>

      <VehiclesDirectoryClient initialVehicles={vehicles} />
    </div>
  );
}
