import React from 'react';
import { notFound } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema, createArticleSchema } from '@/components/seo/SchemaScript';
import { Calendar, User, BookOpen } from 'lucide-react';

interface ArticleSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { slug: 'ev-vs-petrol-cost-analysis-pakistan' },
    { slug: 'how-to-charge-ev-at-home-pakistan' },
    { slug: 'pakistan-ev-policy-tax-benefits-2026' },
  ];
}

export default async function ArticleSlugPage({ params }: ArticleSlugPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';

  const articlesData: Record<string, any> = {
    'ev-vs-petrol-cost-analysis-pakistan': {
      title: 'Electric Car vs Petrol Car Running Cost Comparison in Pakistan (2026)',
      description: 'Calculate real-world monthly electricity costs for EVs at 50 PKR/kWh vs 275 PKR/L petrol cars.',
      category: 'Cost Analysis',
      date: 'Feb 2026',
      author: 'PakevFinder Research Desk',
      summaryAnswer: 'Driving an electric car in Pakistan costs approximately PKR 4.5 to 7.0 per kilometer at standard domestic tariffs (50 PKR/kWh), compared to PKR 27.5 per kilometer for a 10 km/L petrol sedan (275 PKR/L). Driving 1,500 km per month saves over PKR 330,000 annually in fuel expenses alone.',
      content: `
### 1. Per Kilometer Fuel Cost Breakdown
When comparing an electric vehicle with a traditional internal combustion engine (ICE) car in Pakistan:
- **EV Electricity Consumption**: Average 15 kWh per 100 km (0.15 kWh/km).
- **EV Cost per KM**: 0.15 kWh × 50 PKR/kWh = **PKR 7.50 / km**.
- **Petrol Car Consumption**: Average 10 km per liter (0.10 L/km).
- **Petrol Cost per KM**: 0.10 L × 275 PKR/L = **PKR 27.50 / km**.

### 2. Monthly Driving Expenses (1,500 km / month)
- **Petrol Vehicle**: 1,500 km × 27.50 PKR = **PKR 41,250 / month**.
- **Electric Vehicle**: 1,500 km × 7.50 PKR = **PKR 11,250 / month**.
- **Net Monthly Savings**: **PKR 30,000 / month** (PKR 360,000 / year).

### 3. Solar Net-Metering Advantage
For homes equipped with rooftop solar PV systems, charging off daytime solar generation reduces the marginal electricity cost to near zero, increasing total annual savings to over PKR 450,000.
      `,
    },
    'how-to-charge-ev-at-home-pakistan': {
      title: 'How to Install a 7 kW / 11 kW AC Home Charger in Pakistan',
      description: 'Complete step-by-step guide to installing a dedicated 3-phase EV charger at home.',
      category: 'Charging Guide',
      date: 'Feb 2026',
      author: 'PakevFinder Engineering Team',
      summaryAnswer: 'Installing a 7 kW or 11 kW Type 2 AC wallbox in Pakistan requires a 32A single-phase or 3-phase electrical connection with dedicated circuit protection (MCB/RCD). Full charging takes 6 to 8 hours overnight.',
      content: `
### 1. Electrical Supply Requirements
Most modern EV wallboxes (Type 2 connector) require:
- **7.4 kW Single-Phase**: 230V, 32 Amp dedicated line.
- **11 kW Three-Phase**: 400V, 16 Amp per phase line.

### 2. Safety & Protection Equipment
Always install a dedicated Residual Current Device (RCD Type A or Type B) and Miniature Circuit Breaker (MCB) rated appropriately for the charger to ensure safety during voltage surges.
      `,
    },
    'pakistan-ev-policy-tax-benefits-2026': {
      title: 'Pakistan EV Policy 2026: Customs Duty Rates, Sales Tax & Registration Benefits',
      description: 'Detailed breakdown of 1% customs duty on EV imports, reduced sales tax, and free registration incentives.',
      category: 'Policy & Taxes',
      date: 'Jan 2026',
      author: 'PakevFinder Regulatory Desk',
      summaryAnswer: 'Under the revised National EV Policy 2026, CBU electric vehicles incur a reduced 1% customs duty on battery packs and key components, 1% sales tax on local assembly, and exempt token tax across Sindh, Punjab, and Islamabad.',
      content: `
### 1. Customs Duty Structure
- **EV Battery Packs & Motors**: 1% Customs Duty.
- **CBU Electric Vehicles**: Concessional tariff slabs based on battery capacity.

### 2. Token Tax & Registration Exemptions
Major provinces offer 100% token tax exemption for electric vehicles to accelerate adoption across urban centers.
      `,
    },
  };

  const article = articlesData[slug];

  if (!article) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Articles', url: 'https://pakevfinder.com/articles' },
    { name: article.title, url: `https://pakevfinder.com/articles/${slug}` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript
        schemaData={[
          createBreadcrumbSchema(breadcrumbs),
          createArticleSchema({
            title: article.title,
            slug,
            description: article.description,
            date: article.date,
            author: article.author,
          }),
        ]}
      />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {article.category}
          </span>
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {article.date}
          </span>
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {article.author}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
          {article.title}
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          {article.description}
        </p>
      </div>

      {/* Answer-First Summary (AEO) */}
      <AnswerFirstSummary
        answer={article.summaryAnswer}
        verifiedDate={article.date}
        sourceName={article.author}
      />

      {/* Article Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-slate-800 text-sm leading-relaxed space-y-4 prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
      </div>
    </div>
  );
}
