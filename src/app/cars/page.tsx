import React from 'react';
import type { Metadata } from 'next';
import { getAllVehiclesWithDetailsFromJson } from '@/lib/vehicles-json';
import { VehiclesDirectoryClient } from '@/components/vehicles/VehiclesDirectoryClient';

export const metadata: Metadata = {
  title: 'Electric & Hybrid Cars in Pakistan (2026 Prices & Specs) — PakEVFinder',
  description:
    'Browse, search, and compare all electric and hybrid cars in Pakistan. Filter by BEV, PHEV, REEV, Hybrid, price bracket, body type, and real-world range.',
  alternates: {
    canonical: 'https://pakevfinder.com/cars',
  },
  openGraph: {
    title: 'Electric & Hybrid Cars in Pakistan (2026 Prices & Specs)',
    description: 'Official showroom of electric and hybrid vehicles in Pakistan with verified battery capacity, range, and ex-factory prices.',
    url: 'https://pakevfinder.com/cars',
  },
};

export const revalidate = 3600; // ISR 1 hour

export default async function CarsPage() {
  const vehicles = getAllVehiclesWithDetailsFromJson();

  // JSON-LD ItemList Schema for AI Indexing and Search
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Electric & Hybrid Cars in Pakistan (2026)',
    description: 'Tracked directory of official distributor and imported electric & hybrid vehicles in Pakistan.',
    numberOfItems: vehicles.length,
    itemListElement: vehicles.map((v, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: v.name,
      url: `https://pakevfinder.com/cars/${v.slug}`,
      item: {
        '@type': ['Product', 'Vehicle'],
        name: v.name,
        brand: {
          '@type': 'Brand',
          name: v.brand.name,
        },
        vehicleConfiguration: v.powertrain.toUpperCase(),
        offers: v.latest_ex_factory_price ? {
          '@type': 'Offer',
          priceCurrency: 'PKR',
          price: v.latest_ex_factory_price.amount_pkr,
          availability: 'https://schema.org/InStock',
        } : undefined,
      },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Embedded JSON-LD ItemList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Electric & Hybrid Cars in Pakistan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Comprehensive showroom of official distributor models, local assemblies (CKD), and confirmed CBU imports with verified specs, battery capacity, range, and ex-factory prices.
        </p>
      </div>

      <VehiclesDirectoryClient initialVehicles={vehicles} />
    </div>
  );
}

