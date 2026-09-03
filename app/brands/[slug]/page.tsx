import React from 'react';
import { notFound } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema, createFaqPageSchema } from '@/components/seo/SchemaScript';
import VehicleCard from '@/components/vehicles/VehicleCard';
import { getBrandBySlug, getVehiclesByBrand, getAllBrands } from '@/lib/data/mock-db';
import { Globe, Building2, CheckCircle2 } from 'lucide-react';

interface BrandSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const brands = getAllBrands();
  return brands.map((b) => ({ slug: b.slug }));
}

export default async function BrandSlugPage({ params }: BrandSlugPageProps) {
  const resolvedParams = await params;
  const brandSlug = resolvedParams?.slug || '';
  const brand = getBrandBySlug(brandSlug);

  if (!brand) {
    notFound();
  }

  const brandVehicles = getVehiclesByBrand(brand.slug);

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Brands', url: 'https://pakevfinder.com/brands' },
    { name: brand.name, url: `https://pakevfinder.com/brands/${brand.slug}` },
  ];

  const brandFaqs = [
    {
      question: `Who is the official distributor of ${brand.name} electric cars in Pakistan?`,
      answer: `${brand.name} vehicles in Pakistan are officially distributed by ${brand.officialDistributor}, offering official warranty coverage and 3S dealership support.`,
    },
    {
      question: `What is the claimed range of ${brand.name} EVs in Pakistan?`,
      answer: `${brand.name} electric models deliver claimed WLTP ranges from ${
        brandVehicles.length > 0 ? Math.min(...brandVehicles.map((v) => v.maxRangeKm)) : 300
      } km up to ${
        brandVehicles.length > 0 ? Math.max(...brandVehicles.map((v) => v.maxRangeKm)) : 600
      } km per charge.`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SchemaScript
        schemaData={[
          createBreadcrumbSchema(breadcrumbs),
          createFaqPageSchema(brandFaqs),
        ]}
      />

      {/* Brand Hero Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {brand.country}
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            {brand.officialDistributor}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          {brand.name} Electric Cars in Pakistan
        </h1>

        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed font-medium">
          {brand.description}
        </p>

        {brand.website && (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 underline"
          >
            <Globe className="w-4 h-4" />
            Official Website ({brand.name})
          </a>
        )}
      </div>

      <AnswerFirstSummary
        answer={`${brand.name} operates in Pakistan through ${brand.officialDistributor}, offering ${brandVehicles.length} indexed models with verified prices, battery capacities, and WLTP range specs.`}
        verifiedDate="Feb 2026"
        sourceName={`${brand.officialDistributor} Verified Registry`}
      />

      {/* Models Catalog Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Available {brand.name} Vehicle Lineup ({brandVehicles.length})
        </h2>

        {brandVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center text-slate-500 text-xs font-medium">
            No active vehicles currently listed for {brand.name}. Check back soon for upcoming model releases!
          </div>
        )}
      </div>

      {/* Brand FAQs */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions ({brand.name})</h3>
        <div className="space-y-3">
          {brandFaqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-sm font-bold text-slate-900 block">{faq.question}</span>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
