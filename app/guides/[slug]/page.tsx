import React from 'react';
import { notFound } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema, createArticleSchema } from '@/components/seo/SchemaScript';

interface GuideSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'first-time-ev-buyer-guide-pakistan' },
    { slug: 'intercity-ev-travel-motorway-m2-guide' },
  ];
}

export default async function GuideSlugPage({ params }: GuideSlugPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  const guidesData: Record<string, any> = {
    'first-time-ev-buyer-guide-pakistan': {
      title: 'First-Time EV Buyer Guide: 10 Things to Check Before Purchasing',
      description: 'Battery health warranties, charging port standards (CCS2 vs GBT), home wallbox installation, and resale considerations.',
      summaryAnswer: 'Before purchasing an EV in Pakistan, confirm: 1) Official 8-year battery warranty from a recognized distributor, 2) CCS2 charging port compatibility, 3) 3-phase home electrical setup, and 4) verified WLTP real-world range.',
      content: `
### 1. Battery Pack Warranty & Health Coverage
Ensure the vehicle includes a minimum 8-Year / 160,000 KM battery warranty backed by an official local 3S distributor (e.g. Mega Motor for BYD, Master Changan for Deepal, JW Auto Park for MG, Dewan for BMW, Shahnawaz for Mercedes-Benz).

### 2. Charging Port Standards (CCS2 vs GBT)
CCS2 is the predominant fast-charging standard across Pakistan's motorway fast-charging network. If purchasing a GBT port import, ensure a certified GBT-to-CCS2 adapter is supplied.
      `,
    },
    'intercity-ev-travel-motorway-m2-guide': {
      title: 'Intercity EV Travel Guide: Driving M2 Lahore to Islamabad Safely',
      description: 'Fast-charging stations along M2 Motorway service areas (Bhera, Sukheki), charging speeds, and range management strategies.',
      summaryAnswer: 'Traveling 375 km between Lahore and Islamabad on the M2 Motorway requires one 20-minute fast-charging stop at Bhera or Sukheki Service Area, where 60 kW – 120 kW CCS2 DC chargers are operational 24/7.',
      content: `
### 1. Fast Charging Stops on M2
- **Sukheki Rest Area (KM 110)**: 60 kW Dual-Gun CCS2 DC Fast Charger.
- **Bhera Service Area (KM 210)**: 120 kW High-Power DC Charger (10-80% in 25 mins).

### 2. Speed & Consumption Strategy
Cruising at 110 km/h delivers optimal energy efficiency (15–17 kWh / 100 km), allowing most 60+ kWh EVs to complete the journey with a single 15-minute splash charge.
      `,
    },
  };

  const guide = guidesData[slug];

  if (!guide) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Guides', url: 'https://pakevfinder.com/guides' },
    { name: guide.title, url: `https://pakevfinder.com/guides/${slug}` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript
        schemaData={[
          createBreadcrumbSchema(breadcrumbs),
          createArticleSchema({
            title: guide.title,
            slug,
            description: guide.description,
            date: 'Feb 2026',
            author: 'PakevFinder Technical Advisory Desk',
          }),
        ]}
      />

      {/* Header */}
      <div className="space-y-4">
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Handbook Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          {guide.title}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          {guide.description}
        </p>
      </div>

      {/* Answer-First Summary (AEO) */}
      <AnswerFirstSummary
        answer={guide.summaryAnswer}
        verifiedDate="Feb 2026"
        sourceName="PakevFinder Technical Handbook"
      />

      {/* Guide Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-slate-800 text-sm leading-relaxed space-y-4 prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: guide.content.replace(/\n/g, '<br/>') }} />
      </div>
    </div>
  );
}
