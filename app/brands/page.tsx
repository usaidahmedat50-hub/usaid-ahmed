import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { getAllBrands, getVehiclesByBrand } from '@/lib/data/mock-db';
import { Building2, Globe, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Electric Car Brands in Pakistan — Complete Automotive Index',
  description: 'Explore official electric car brands in Pakistan including BYD, Deepal, MG, BMW, Mercedes-Benz, Audi, Tesla, Hyundai, Toyota, and GWM.',
  alternates: {
    canonical: 'https://pakevfinder.com/brands',
  },
};

export default function BrandsIndexPage() {
  const brands = getAllBrands();

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Automotive Brands', url: 'https://pakevfinder.com/brands' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Brand Index
          </span>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
            {brands.length} Brands
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Electric Vehicle Manufacturers & Distributors
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Directory of official EV importers, 3S dealership networks, and local assembly partners in Pakistan.
        </p>
      </div>

      <AnswerFirstSummary
        answer={`PakevFinder tracks ${brands.length} automotive brands operating in Pakistan, including official distributors such as Mega Motor Company (BYD), Master Changan (Deepal), JW Auto Park (MG), Dewan Motors (BMW), and Shahnawaz (Mercedes-Benz).`}
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Distributor Registry"
      />

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {brands.map((b) => {
          const brandVehicles = getVehiclesByBrand(b.slug);
          return (
            <Link
              key={b.id}
              href={`/brands/${b.slug}`}
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4 group block"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {b.name}
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">{b.country}</span>
                </div>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                  {brandVehicles.length} Models
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {b.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>View Models & Specs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
