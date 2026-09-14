import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllBrands, getAllVehicles } from '@/lib/vehicles';
import { Shield, ArrowRight, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'EV Brands in Pakistan (BYD, Deepal, MG, Tesla) — PakEVFinder',
  description:
    'Directory of all electric vehicle brands and official distributors operating in Pakistan with active model lineups and verified specs.',
};

export const revalidate = 3600;

export default async function BrandsPage() {
  const [brands, vehicles] = await Promise.all([getAllBrands(), getAllVehicles()]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <Shield className="w-3.5 h-3.5 text-blue-700" />
          <span>Manufacturer & Distributor Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111114]">
          Electric Vehicle Brands in Pakistan
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
          Overview of official automotive groups, joint ventures, and direct import brands retailing electric vehicles in Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {brands.map((brand) => {
          const brandVehicles = vehicles.filter((v) => v.brand_id === brand.id);
          return (
            <div
              key={brand.id}
              className="bg-white border border-gray-200 hover:border-gray-400 rounded-lg p-5 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-base text-blue-700">
                      {brand.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#111114]">{brand.name}</h3>
                      <span className="text-xs text-gray-500">{brand.country}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200 tabular-nums">
                    {brandVehicles.length} {brandVehicles.length === 1 ? 'Model' : 'Models'}
                  </span>
                </div>

                <div className="space-y-1.5 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold">
                    Available Models:
                  </span>
                  {brandVehicles.length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {brandVehicles.map((v) => (
                        <li key={v.id} className="text-gray-700">
                          • <Link href={`/vehicles/${v.slug}`} className="hover:text-blue-700">{v.name}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Models arriving soon</p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                {brand.website_url ? (
                  <a
                    href={brand.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-black flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-gray-400">No official portal</span>
                )}

                <Link
                  href={`/brands/${brand.slug}`}
                  className="font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Lineup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
