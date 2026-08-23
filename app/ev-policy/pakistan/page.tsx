import React from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema, createFaqPageSchema } from '@/components/seo/SchemaScript';
import { FileText, Percent, DollarSign, Building } from 'lucide-react';

export default function EvPolicyPakistanPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'EV Policy Pakistan', url: 'https://pakevfinder.com/ev-policy/pakistan' },
  ];

  const policyFaqs = [
    {
      question: 'What is the customs duty rate on imported CBU electric cars under NEV Policy 2025-2030?',
      answer: 'Under the National EV Policy (NEV Policy 2025-2030), CBU electric cars with battery capacity up to 50 kWh attract 1% customs duty, providing massive tax relief compared to traditional ICE vehicles (which face 50% to 100%+ customs duty).',
    },
    {
      question: 'Are electric cars exempt from sales tax and registration fees in Pakistan?',
      answer: 'Yes, electric cars enjoy a reduced Sales Tax rate of 1% (versus 18% standard sales tax for petrol cars). Additionally, the Government of Sindh and Islamabad ICT have announced 100% registration fee and annual road tax exemptions for EVs.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript
        schemaData={[
          createBreadcrumbSchema(breadcrumbs),
          createFaqPageSchema(policyFaqs),
        ]}
      />

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase mb-2">
          <FileText className="w-3.5 h-3.5 text-blue-600" /> Official Policy Guide
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Pakistan National EV Policy 2025-2030 & Tax Exemptions
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Complete breakdown of customs duties, sales tax concessions, DISCO charging tariffs, and provincial registration fee waivers.
        </p>
      </div>

      {/* AEO Summary */}
      <AnswerFirstSummary
        answer="Pakistan's National Electric Vehicle Policy (2025-2030) grants 1% customs duty on EV battery packs and CBU imports up to 50kWh, 1% sales tax (down from 18%), 0% registration fee in Sindh and Islamabad, and dedicated off-peak EV charging tariffs set by NEPRA."
        verifiedDate="Feb 2026"
        sourceName="Ministry of Industries & Production / FBR Pakistan Gazette"
      />

      {/* Key Policy Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl w-fit border border-blue-100">
            <Percent className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">1% Customs Duty</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Imported CBU electric vehicles up to 50 kWh battery capacity enjoy 1% customs duty to encourage rapid adoption of clean mobility.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl w-fit border border-amber-100">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">1% Sales Tax</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Sales tax on local EV assembly and CBU sales is capped at 1%, providing a 17% cost advantage over petrol cars (18% GST).
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl w-fit border border-emerald-100">
            <Building className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">0% Registration Fee</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Sindh Excise & Taxation Department and ICT Islamabad offer 100% registration fee waivers and zero annual motor vehicle token tax.
          </p>
        </div>
      </div>

      {/* Detailed Policy Text */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed shadow-sm font-medium">
        <h2 className="text-xl font-bold text-slate-900">NEV Policy 2025-2030 Framework Breakdown</h2>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-blue-700">1. Charging Infrastructure Mandate</h3>
          <p>
            The Ministry of Energy mandates that all new petrol pumps along motorways (M1, M2, M3, M4, M9) and major national highways must reserve space and electrical transformer capacity for minimum 60kW DC fast chargers.
          </p>

          <h3 className="text-base font-bold text-blue-700">2. Special DISCO Tariff for Public Chargers</h3>
          <p>
            NEPRA has structured a dedicated commercial charging tariff category for public fast charging station operators, capping maximum retail unit pricing at PKR 85-95 / kWh to protect consumers from arbitrary markups.
          </p>

          <h3 className="text-base font-bold text-blue-700">3. Local Assembly Incentives (CKD)</h3>
          <p>
            CKD kits for electric vehicles attract 1% customs duty on non-localized parts and 1% on localized parts for 5 years, driving investments from BYD (Mega Motor Company), Changan (Deepal), and MG Motors in Pakistani manufacturing plants.
          </p>
        </div>
      </div>
    </div>
  );
}
