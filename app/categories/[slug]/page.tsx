import React from 'react';
import { notFound } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { getAllVehicles } from '@/lib/data/mock-db';

interface CategorySlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'electric-suvs' },
    { slug: 'electric-sedans' },
    { slug: 'electric-hatchbacks' },
    { slug: 'hybrid-cars' },
    { slug: 'evs-under-5000000' },
  ];
}

export default async function CategorySlugPage({ params }: CategorySlugPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const vehicles = getAllVehicles();

  let filteredVehicles = vehicles;
  let title = 'Electric Vehicles Category';
  let description = 'Explore electric vehicles in Pakistan matching this category.';

  switch (slug) {
    case 'electric-suvs':
      title = 'Electric SUVs & Crossovers in Pakistan';
      description = 'All verified electric SUVs with battery capacity, range, and fast-charging specs.';
      filteredVehicles = vehicles.filter((v) => v.bodyType === 'SUV' || v.bodyType === 'Crossover');
      break;
    case 'electric-sedans':
      title = 'Electric Sedans & Gran Coupes in Pakistan';
      description = 'All verified electric sedans offering long WLTP range and executive comfort.';
      filteredVehicles = vehicles.filter((v) => v.bodyType === 'Sedan' || v.bodyType === 'Fastback');
      break;
    case 'electric-hatchbacks':
      title = 'Electric Hatchbacks & Microcars in Pakistan';
      description = 'Compact city EVs and hatchbacks ideal for daily urban commuting.';
      filteredVehicles = vehicles.filter((v) => v.bodyType === 'Hatchback' || v.bodyType === 'Microcar');
      break;
    case 'hybrid-cars':
      title = 'Plug-in Hybrid (PHEV) & REEV Cars in Pakistan';
      description = 'Hybrid and range-extended electric vehicles with zero range anxiety.';
      filteredVehicles = vehicles.filter((v) => v.powertrain === 'PHEV' || v.powertrain === 'REEV' || v.powertrain === 'Hybrid');
      break;
    case 'evs-under-5000000':
      title = 'Electric Cars Under PKR 5 Million in Pakistan';
      description = 'Budget electric vehicles priced below 5.0 Million PKR.';
      filteredVehicles = vehicles.filter((v) => v.startingPricePkr > 0 && v.startingPricePkr <= 5000000);
      break;
    default:
      notFound();
  }

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Categories', url: 'https://pakevfinder.com/categories' },
    { name: title, url: `https://pakevfinder.com/categories/${slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Category Hub
          </span>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
            {filteredVehicles.length} Models Found
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>

      <AnswerFirstSummary
        answer={`PakevFinder indexes ${filteredVehicles.length} models matching ${title.toLowerCase()} in Pakistan, with starting prices from ${
          filteredVehicles.length > 0 ? (filteredVehicles[0].startingPricePkr > 0 ? `${(filteredVehicles[0].startingPricePkr / 100000).toFixed(1)} Lakhs` : 'Expected') : 'PKR 0'
        }.`}
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Category Index"
      />

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </div>
  );
}
