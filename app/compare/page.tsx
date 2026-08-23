'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import ComparisonMatrix from '@/components/vehicles/ComparisonMatrix';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { getAllVehicles, getVehicleBySlug, Vehicle } from '@/lib/data/mock-db';
import { Loader2 } from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const allVehicles = getAllVehicles();

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  useEffect(() => {
    const v1 = searchParams.get('v1');
    const v2 = searchParams.get('v2');
    const v3 = searchParams.get('v3');
    const v4 = searchParams.get('v4');

    const initial: string[] = [];
    if (v1) initial.push(v1);
    if (v2) initial.push(v2);
    if (v3) initial.push(v3);
    if (v4) initial.push(v4);

    // If query empty, default to BYD Atto 3 vs Deepal S07
    if (initial.length === 0) {
      setSelectedSlugs(['byd-atto-3', 'deepal-s07']);
    } else {
      setSelectedSlugs(initial);
    }
  }, [searchParams]);

  const selectedVehicles = selectedSlugs
    .map((slug) => getVehicleBySlug(slug))
    .filter((v): v is Vehicle => v !== undefined);

  const handleAddVehicle = (slug: string) => {
    if (selectedSlugs.length < 4 && !selectedSlugs.includes(slug)) {
      const next = [...selectedSlugs, slug];
      setSelectedSlugs(next);
      updateQueryParams(next);
    }
  };

  const handleRemoveVehicle = (slug: string) => {
    const next = selectedSlugs.filter((s) => s !== slug);
    setSelectedSlugs(next);
    updateQueryParams(next);
  };

  const updateQueryParams = (slugs: string[]) => {
    const params = new URLSearchParams();
    slugs.forEach((slug, idx) => {
      params.set(`v${idx + 1}`, slug);
    });
    router.push(`/compare?${params.toString()}`);
  };

  return (
    <ComparisonMatrix
      vehicles={selectedVehicles}
      allVehicles={allVehicles}
      onAddVehicle={handleAddVehicle}
      onRemoveVehicle={handleRemoveVehicle}
    />
  );
}

export default function ComparePage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Compare EVs', url: 'https://pakevfinder.com/compare' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Electric Vehicle Side-by-Side Comparison Engine
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Compare up to 4 electric vehicles in Pakistan across prices, battery capacity, range, and fast charge speeds.
        </p>
      </div>

      {/* AEO Summary */}
      <AnswerFirstSummary
        answer="Comparing EVs in Pakistan: BYD Atto 3 offers superior battery safety with its 60.48 kWh LFP Blade Battery starting at PKR 89.9 Lakh, while Deepal S07 leads in futuristic interior styling at PKR 1.65 Crore, and MG4 EV provides rear-wheel drive hot-hatch dynamics starting at PKR 1.09 Crore."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Comparison Engine Matrix"
      />

      {/* Suspense Boundary */}
      <Suspense
        fallback={
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading Comparison Engine...</p>
          </div>
        }
      >
        <CompareContent />
      </Suspense>
    </div>
  );
}
