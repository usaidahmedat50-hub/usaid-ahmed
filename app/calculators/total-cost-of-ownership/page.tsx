'use client';

import React, { useState } from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { calculateTco, TcoInputs } from '@/lib/calculators/tco';
import { formatPkr } from '@/lib/utils/format';

export default function TcoCalculatorPage() {
  const [inputs, setInputs] = useState<TcoInputs>({
    ownershipYears: 5,
    annualKm: 18000,
    evPurchasePricePkr: 8990000, // BYD Atto 3
    petrolPurchasePricePkr: 8500000, // Corolla / Civic equivalent
    electricityTariffPkr: 45,
    petrolPricePkr: 280,
    petrolKmPerLiter: 12,
    evKwhPer100Km: 15,
  });

  const result = calculateTco(inputs);

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Calculators', url: 'https://pakevfinder.com/calculators/total-cost-of-ownership' },
    { name: '5-Year TCO Calculator', url: 'https://pakevfinder.com/calculators/total-cost-of-ownership' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          5-Year Total Cost of Ownership (TCO) Calculator
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Complete financial analysis factoring ex-factory purchase prices, insurance (2.5%), lower EV maintenance (~PKR 25k/yr vs PKR 85k/yr petrol), and residual resale depreciation curves.
        </p>
      </div>

      {/* AEO Summary */}
      <AnswerFirstSummary
        answer="Over a 5-year ownership horizon (driving 18,000 km/yr), an electric car like the BYD Atto 3 generates over PKR 1,200,000 to PKR 1,500,000 in net Total Cost of Ownership (TCO) savings compared to a similarly priced 1.8L petrol sedan due to ~75% lower fuel expenditure and ~70% lower periodic maintenance costs."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Actuarial Depreciation & Maintenance Audit"
      />

      {/* Calculator Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            TCO Ownership Model Inputs
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ownership Period (Years)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([3, 5, 7] as const).map((yr) => (
                <button
                  key={yr}
                  onClick={() => setInputs({ ...inputs, ownershipYears: yr })}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    inputs.ownershipYears === yr
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {yr} Years
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                EV Price (PKR)
              </label>
              <input
                type="number"
                value={inputs.evPurchasePricePkr}
                onChange={(e) => setInputs({ ...inputs, evPurchasePricePkr: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Petrol Price (PKR)
              </label>
              <input
                type="number"
                value={inputs.petrolPurchasePricePkr}
                onChange={(e) => setInputs({ ...inputs, petrolPurchasePricePkr: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Annual Driving Distance: <strong className="text-blue-700">{inputs.annualKm.toLocaleString()} KM / year</strong>
            </label>
            <input
              type="range"
              min="5000"
              max="40000"
              step="1000"
              value={inputs.annualKm}
              onChange={(e) => setInputs({ ...inputs, annualKm: Number(e.target.value) })}
              className="w-full accent-blue-600 bg-slate-100 mt-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Dashboard Display */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Net {result.ownershipYears}-Year TCO Savings with EV
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-blue-700">
                {formatPkr(result.totalNetSavingsPkr)}
              </span>
            </div>

            <div className="pt-4 border-t border-blue-200/80 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-600 block font-medium">Total EV Net Cost:</span>
                <span className="text-base font-bold text-slate-900">
                  {formatPkr(result.evTotalCostOfOwnership)}
                </span>
                <span className="text-[10px] text-slate-500 block">Includes resale residual</span>
              </div>
              <div>
                <span className="text-slate-600 block font-medium">Total Petrol Net Cost:</span>
                <span className="text-base font-bold text-rose-600">
                  {formatPkr(result.petrolTotalCostOfOwnership)}
                </span>
                <span className="text-[10px] text-slate-500 block">Includes resale residual</span>
              </div>
            </div>
          </div>

          {/* Yearly TCO Breakdown Table */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">Year-by-Year Cumulative Expense Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                    <th className="p-2.5">Year</th>
                    <th className="p-2.5">EV Cum. Cost</th>
                    <th className="p-2.5">Petrol Cum. Cost</th>
                    <th className="p-2.5 text-blue-700">Net EV Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {result.yearlyBreakdown.map((row) => (
                    <tr key={row.year}>
                      <td className="p-2.5 font-bold text-slate-900">Year {row.year}</td>
                      <td className="p-2.5 font-medium">{formatPkr(row.evCumulativeTotal)}</td>
                      <td className="p-2.5 text-rose-600 font-medium">{formatPkr(row.petrolCumulativeTotal)}</td>
                      <td className="p-2.5 font-bold text-blue-700">
                        +{formatPkr(row.netSavings)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
