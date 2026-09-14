import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllVehicles } from '@/lib/vehicles';
import { CATEGORIES } from '@/lib/categories';
import { Grid, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Browse Electric Cars by Category & Budget in Pakistan — PakEVFinder',
  description:
    'Browse Pakistani electric cars by body style (SUV, Sedan, Hatchback, Microcar), budget bracket (Under 50 Lacs, Under 1 Crore), or long range.',
};

export const revalidate = 3600;

export default async function CategoriesIndexPage() {
  const allVehicles = await getAllVehicles();

  const groups = [
    { id: 'body', title: 'By Body Type' },
    { id: 'budget', title: 'By Budget Bracket' },
    { id: 'range', title: 'By Highway Range & Efficiency' },
    { id: 'powertrain', title: 'By Powertrain Architecture' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <Grid className="w-3.5 h-3.5 text-blue-700" />
          <span>Category Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111114]">
          Browse Electric Vehicles by Category
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
          Find electric and plug-in hybrid cars matched to your preferred vehicle style, household budget, or highway range requirements in Pakistan.
        </p>
      </div>

      <div className="space-y-10">
        {groups.map((g) => {
          const groupCategories = CATEGORIES.filter((c) => c.group === g.id);
          if (groupCategories.length === 0) return null;

          return (
            <section key={g.id} className="space-y-4">
              <h2 className="text-lg font-bold text-[#111114] border-b border-gray-200 pb-2">
                {g.title}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {groupCategories.map((cat) => {
                  const matchingVehicles = allVehicles.filter(cat.filterFn);

                  return (
                    <div
                      key={cat.slug}
                      className="bg-white border border-gray-200 hover:border-gray-400 rounded-lg p-5 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
                            Category
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-50 text-gray-700 border border-gray-200 tabular-nums">
                            {matchingVehicles.length} {matchingVehicles.length === 1 ? 'Model' : 'Models'}
                          </span>
                        </div>

                        <Link href={`/categories/${cat.slug}`}>
                          <h3 className="text-base font-bold text-[#111114] hover:text-blue-700 transition-colors">
                            {cat.shortTitle}
                          </h3>
                        </Link>

                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                          {cat.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          {matchingVehicles.slice(0, 2).map((v) => v.name).join(', ') || 'Models pending'}
                        </span>
                        <Link
                          href={`/categories/${cat.slug}`}
                          className="font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 shrink-0"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
