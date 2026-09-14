import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllVehiclesWithDetailsFromJson } from '@/lib/vehicles-json';
import { getVehicleBySlug } from '@/lib/vehicles';
import { CompareBoardClient } from '@/components/compare/CompareBoardClient';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 43200; // ISR 12 hours

interface CompareSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'byd-seal-vs-deepal-l07' },
    { slug: 'byd-atto-3-vs-deepal-s07' },
    { slug: 'honri-ve-2-vs-gugo-gigi-ev' },
  ];
}

export async function generateMetadata({ params }: CompareSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawSlugs = slug.split('-vs-');
  const compared = rawSlugs
    .map((s) => getVehicleBySlug(s))
    .filter(Boolean);

  if (compared.length < 2) {
    return { title: 'Comparison — PakEVFinder' };
  }

  const names = compared.map((v) => v!.name).join(' vs ');
  return {
    title: `${names} Comparison in Pakistan (2026) — PakEVFinder`,
    description: `Detailed comparison between ${names} in Pakistan. Compare ex-factory price, real battery range, DC charging speed, and distributor warranty.`,
    alternates: {
      canonical: `https://pakevfinder.com/compare/${slug}`,
    },
  };
}

export default async function CompareSlugPage({ params }: CompareSlugPageProps) {
  const { slug } = await params;
  const rawSlugs = slug.split('-vs-');
  const allVehicles = getAllVehiclesWithDetailsFromJson();

  // Strictly resolve each vehicle by slug in exact order requested
  const compared = rawSlugs
    .map((s) => getVehicleBySlug(s))
    .filter(Boolean);

  if (compared.length < 2) {
    notFound();
  }

  const initialSlugs = compared.map((v) => v!.slug);
  const names = compared.map((v) => v!.name).join(' vs ');

  const car1 = compared[0]!;
  const car2 = compared[1]!;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 hover:text-blue-700 font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Comparisons</span>
        </Link>
      </div>

      <DirectAnswerBlock
        title={`Editorial Comparison: ${names}`}
        summary={`When evaluating ${names} for Pakistani road conditions, key differentiators include real summer cooling range, local DC fast-charge compatibility (CCS2 vs GB/T), and official assembler warranty networks. ${(car1 as any).priceFormatted ? `${car1.name} retails at ${(car1 as any).priceFormatted}` : car1.name} compared with ${(car2 as any).priceFormatted ? `${car2.name} at ${(car2 as any).priceFormatted}` : car2.name}. Inspect full side-by-side technical specs below.`}
      />

      <CompareBoardClient
        allVehicles={allVehicles}
        initialSlugs={initialSlugs}
      />
    </div>
  );
}

