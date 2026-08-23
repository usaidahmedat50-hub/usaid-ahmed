import React from 'react';
import { notFound } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema, createFaqPageSchema } from '@/components/seo/SchemaScript';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { getBrandBySlug, getVehiclesByBrand, getAllBrands } from '@/lib/data/mock-db';
import { Globe, Building2 } from 'lucide-react';

interface BrandPageProps {
  params: {
    brand: string;
  };
}

export async function generateStaticParams() {
  const brands = getAllBrands();
  return brands.map((b) => ({ brand: b.slug }));
}

export default function BrandShowcasePage({ params }: BrandPageProps) {
  const brand = getBrandBySlug(params.brand);
  if (!brand) {
    notFound();
  }

  const brandVehicles = getVehiclesByBrand(brand.slug);

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Electric Cars', url: 'https://pakevfinder.com/electric-cars' },
    { name: brand.name, url: `https://pakevfinder.com/electric-cars/${brand.slug}` },
  ];

  const brandFaqs = [
    {
      question: `Who is the official distributor of ${brand.name} electric cars in Pakistan?`,
      answer: `${brand.name} electric vehicles in Pakistan are officially distributed and backed by ${brand.officialDistributor}, offering official warranty coverage and 3S dealership support.`,
    },
    {
      question: `What is the price range of ${brand.name} EVs in Pakistan?`,
      answer: `${brand.name} electric vehicle prices in Pakistan start from ex-factory PKR ${
        brandVehicles.length > 0 ? (brandVehicles[0].startingPricePkr / 100000).toFixed(2) + ' Lakh' : 'N/A'
      } depending on model and trim levels.`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript
        schemaData={[
          createBreadcrumbSchema(breadcrumbs),
          createFaqPageSchema(brandFaqs),
        ]}
      />

      {/* Brand Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {brand.country} EV Brand
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-1">
              {brand.name} Electric Cars Price in Pakistan
            </h1>
          </div>
          {brand.website && (
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 px-4 py-2.5 rounded-xl transition-colors border border-slate-200 w-fit"
            >
              <Globe className="w-4 h-4 text-blue-600" /> Visit Official Site
            </a>
          )}
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl font-medium">
          {brand.description}
        </p>

        {/* Distributor Badge */}
        <div className="flex items-center gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 w-fit font-medium">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>
            Official Pakistan Partner:{' '}
            <strong className="text-slate-900 font-bold">{brand.officialDistributor}</strong>
          </span>
        </div>
      </div>

      {/* Answer-First Summary */}
      <AnswerFirstSummary
        answer={`${brand.name} electric vehicles in Pakistan are distributed by ${brand.officialDistributor}. Models include ${
          brandVehicles.map((v) => v.name).join(', ')
        } with ex-factory pricing backed by ${brand.country} engineering and dedicated battery warranty coverage.`}
        verifiedDate="Feb 2026"
        sourceName={`${brand.officialDistributor} Official Tariff`}
      />

      {/* Models Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          All {brand.name} EV Models & Variants in Pakistan
        </h2>
        {brandVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-500 shadow-sm">
            No models currently listed for {brand.name}.
          </div>
        )}
      </div>
    </div>
  );
}
