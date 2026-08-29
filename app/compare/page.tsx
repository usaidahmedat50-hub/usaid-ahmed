'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ComparisonTable from '@/components/compare/ComparisonTable';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import vehiclesData from '@/lib/data/vehicles.json';
import { VehicleSpec } from '@/types/vehicle';
import { Scale, Zap, Info, Loader2 } from 'lucide-react';

function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const allVehicles: VehicleSpec[] = vehiclesData as VehicleSpec[];

  // Parse initial car IDs from URL params or default to top 3 models
  const car1Param = searchParams.get('car1') || 'forthing-friday-reev';
  const car2Param = searchParams.get('car2') || 'chery-tiggo-7-phev';
  const car3Param = searchParams.get('car3') || 'deepal-s05-reev';

  const [selectedIds, setSelectedIds] = useState<string[]>([car1Param, car2Param, car3Param]);

  useEffect(() => {
    const p1 = searchParams.get('car1');
    const p2 = searchParams.get('car2');
    const p3 = searchParams.get('car3');

    const newIds: string[] = [];
    if (p1) newIds.push(p1);
    if (p2) newIds.push(p2);
    if (p3) newIds.push(p3);

    if (newIds.length >= 2) {
      setSelectedIds(newIds);
    }
  }, [searchParams]);

  const updateUrlParams = (ids: string[]) => {
    const params = new URLSearchParams();
    if (ids[0]) params.set('car1', ids[0]);
    if (ids[1]) params.set('car2', ids[1]);
    if (ids[2]) params.set('car3', ids[2]);

    router.push(`/compare?${params.toString()}`);
  };

  const handleSelectVehicle = (index: number, vehicleId: string) => {
    const updated = [...selectedIds];
    updated[index] = vehicleId;
    setSelectedIds(updated);
    updateUrlParams(updated);
  };

  const handleRemoveVehicle = (index: number) => {
    if (selectedIds.length <= 2) return;
    const updated = selectedIds.filter((_, i) => i !== index);
    setSelectedIds(updated);
    updateUrlParams(updated);
  };

  const handleAddSlot = () => {
    if (selectedIds.length >= 3) return;
    const available = allVehicles.find((v) => !selectedIds.includes(v.id));
    const nextId = available ? available.id : allVehicles[0].id;
    const updated = [...selectedIds, nextId];
    setSelectedIds(updated);
    updateUrlParams(updated);
  };

  const selectedVehicles = selectedIds
    .map((id) => allVehicles.find((v) => v.id === id))
    .filter((v): v is VehicleSpec => v !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript
        schemaData={createBreadcrumbSchema([
          { name: 'Home', url: 'https://pakevfinder.com' },
          { name: 'EV Comparison', url: 'https://pakevfinder.com/compare' },
        ])}
      />

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-4 h-4 text-blue-600" />
          Multi-Vehicle Comparison Engine
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Compare Electric & Hybrid Cars in Pakistan
        </h1>

        <p className="text-slate-600 text-sm sm:text-base font-medium max-w-3xl leading-relaxed">
          Side-by-side comparison for EV, REEV (Range Extended EV), and PHEV models available in Pakistan. Top numeric specs automatically highlighted in green for best market value.
        </p>

        {/* Answer-First AEO Summary */}
        <AnswerFirstSummary
          answer="When comparing EVs, REEVs, and PHEVs in Pakistan (such as Forthing Friday REEV, Chery Tiggo 7 PHEV, Deepal S05/S07, and BYD Atto 3), REEV models offer 180-200 km pure electric range for daily city driving plus up to 1,200+ km total combined range for intercity trips across M-2, M-9, and M-5 motorways without range anxiety."
          verifiedDate="August 2026"
          sourceName="PakEVFinder Market Intelligence"
        />
      </div>

      {/* Comparison Engine Component */}
      <ComparisonTable
        allVehicles={allVehicles}
        selectedVehicles={selectedVehicles}
        onSelectVehicle={handleSelectVehicle}
        onRemoveVehicle={handleRemoveVehicle}
        onAddSlot={handleAddSlot}
      />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <span className="text-sm font-semibold">Loading EV Comparison Engine...</span>
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}
