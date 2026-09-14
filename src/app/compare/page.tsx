import React from 'react';
import type { Metadata } from 'next';
import { getAllVehiclesWithDetailsFromJson } from '@/lib/vehicles-json';
import { CompareBoardClient } from '@/components/compare/CompareBoardClient';

export const metadata: Metadata = {
  title: 'Compare Electric & Hybrid Cars in Pakistan (3-Way Comparison) — PakEVFinder',
  description:
    'Put any three cars side by side. Compare ex-factory prices, usable battery capacity, real summer range, DC charging speeds, and official distributor warranties with best-in-class green highlighting.',
  alternates: {
    canonical: 'https://pakevfinder.com/compare',
  },
  openGraph: {
    title: 'Compare Electric & Hybrid Cars in Pakistan — PakEVFinder',
    description: 'Interactive 3-slot side-by-side comparison engine for Pakistani electric and hybrid cars with auto-highlighted winner metrics.',
    url: 'https://pakevfinder.com/compare',
  },
};

export const revalidate = 3600; // ISR 1 hour

interface ComparePageProps {
  searchParams: Promise<{
    cars?: string;
    v1?: string;
    v2?: string;
    v3?: string;
  }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { cars, v1, v2, v3 } = await searchParams;
  const allVehicles = getAllVehiclesWithDetailsFromJson();

  // Parse initial slugs from URL
  let initialSlugs: string[] = [];

  if (cars) {
    initialSlugs = cars.split(',').map((s) => s.trim()).filter(Boolean);
  } else {
    const legacy = [v1, v2, v3].filter(Boolean) as string[];
    if (legacy.length > 0) {
      initialSlugs = legacy;
    }
  }

  // Fallback defaults if none selected: BYD Atto 3 vs Deepal S07 vs Omoda E5
  if (initialSlugs.length === 0) {
    initialSlugs = ['byd-atto-3', 'deepal-s07', 'omoda-e5'];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CompareBoardClient
        allVehicles={allVehicles}
        initialSlugs={initialSlugs}
      />
    </div>
  );
}
