import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllBrands, getBrandBySlug } from '@/lib/vehicles';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { ArrowLeft, ExternalLink, Shield } from 'lucide-react';

export const revalidate = 43200;

interface BrandSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const brands = await getAllBrands();
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: BrandSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { brand } = await getBrandBySlug(slug);
  if (!brand) return { title: 'Brand Not Found — PakEVFinder' };

  return {
    title: `${brand.name} Electric Vehicles in Pakistan (2026 Prices & Models) — PakEVFinder`,
    description: `Browse official ${brand.name} electric vehicle lineup in Pakistan. Verified ex-factory prices, battery capacities, and local distributor information.`,
  };
}

export default async function BrandSlugPage({ params }: BrandSlugPageProps) {
  const { slug } = await params;
  const { brand, vehicles } = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <Link
          href="/brands"
          className="inline-flex items-center gap-1 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All EV Brands</span>
        </Link>
        <span className="text-blue-700 font-semibold uppercase tracking-wider text-[11px]">
          Brand Showcase
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-xl text-blue-700">
            {brand.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111114]">{brand.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                Active
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Country of Origin: <strong className="text-gray-800">{brand.country}</strong>
            </p>
          </div>
        </div>

        {brand.website_url && (
          <a
            href={brand.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#111114] transition-colors self-start sm:self-auto"
          >
            <span>Visit Manufacturer Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-700" />
          </a>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#111114] mb-4">
          Available {brand.name} Models in Pakistan ({vehicles.length})
        </h2>

        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((veh) => (
              <VehicleCard key={veh.id} vehicle={veh} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 p-12 rounded-lg text-center text-gray-500">
            <p className="text-sm font-semibold text-[#111114]">No models currently cataloged for {brand.name}.</p>
            <p className="text-xs text-gray-400 mt-1">
              New models are only published once official tariffs or certified importer details are verified.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
