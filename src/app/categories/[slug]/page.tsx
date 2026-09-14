import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllVehicles } from '@/lib/vehicles';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { ArrowLeft, Grid } from 'lucide-react';

export const revalidate = 3600;

interface CategorySlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategorySlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: 'Category Not Found — PakEVFinder' };

  return {
    title: `${category.title} (2026 Prices & Specs) — PakEVFinder`,
    description: category.description,
    alternates: {
      canonical: `https://pakevfinder.com/categories/${slug}`,
    },
  };
}

export default async function CategorySlugPage({ params }: CategorySlugPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const allVehicles = await getAllVehicles();
  const matchingVehicles = allVehicles.filter(category.filterFn);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Categories</span>
        </Link>
        <span className="text-blue-700 font-semibold uppercase tracking-wider text-[11px]">
          Category Filter
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <Grid className="w-3.5 h-3.5 text-blue-700" />
          <span>EV Classification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111114]">
          {category.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
          {category.description}
        </p>
      </div>

      {/* Direct Answer Block */}
      <DirectAnswerBlock
        title={`Overview: ${category.shortTitle} in Pakistan`}
        summary={`There are currently ${matchingVehicles.length} verified models matching this category in Pakistan. Review verified ex-factory prices, battery capacities, and real-world range estimates below.`}
        keyFacts={[
          { label: 'Cataloged Models', value: `${matchingVehicles.length} Vehicles` },
          { label: 'Category Group', value: category.group.toUpperCase() },
          { label: 'Price Range', value: matchingVehicles.length > 0 ? 'Verified In Catalog' : 'TBA' },
          { label: 'Charging Standard', value: 'CCS2 / GB/T' },
        ]}
      />

      {/* Vehicle Cards Grid */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>
            Showing <strong className="text-[#111114] tabular-nums font-semibold">{matchingVehicles.length}</strong> vehicles in this category
          </span>
        </div>

        {matchingVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matchingVehicles.map((veh) => (
              <VehicleCard key={veh.id} vehicle={veh} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 p-12 rounded-lg text-center space-y-2">
            <p className="text-sm font-bold text-[#111114]">No vehicles currently logged under this category.</p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              We only list models with verified distributor specifications or official local announcements.
            </p>
            <Link
              href="/vehicles"
              className="inline-block px-4 py-2 mt-2 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors"
            >
              Browse All Vehicles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
