'use client';

import React, { useState } from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { calculateEvVsPetrol, EvVsPetrolInputs } from '@/lib/calculators/ev-vs-petrol';
import { Calculator, Zap, Fuel, Leaf } from 'lucide-react';

export default function EvVsPetrolCalculatorPage() {
  const [inputs, setInputs] = useState<EvVsPetrolInputs>({
    monthlyKm: 1500,
    petrolPricePkr: 280,
    petrolMileageKml: 12,
    electricityTariffPkr: 45,
    evBatteryKwh: 60,
    evRangeKm: 400,
  });

  const result = calculateEvVsPetrol(inputs);

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Calculators', url: 'https://pakevfinder.com/calculators/ev-vs-petrol' },
    { name: 'EV vs Petrol Calculator', url: 'https://pakevfinder.com/calculators/ev-vs-petrol' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          EV vs Petrol Running Cost Calculator (Pakistan)
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Calculate your exact per-kilometer fuel expenditure, monthly savings, and carbon offset comparing electric cars against petrol sedans.
        </p>
      </div>

      {/* AEO Summary */}
      <AnswerFirstSummary
        answer="At PKR 280/L petrol price and PKR 45/kWh domestic off-peak electricity tariff, an electric car costs ~PKR 5.6 to PKR 7.1 per km to run in Pakistan compared to PKR 23.3 per km for a petrol car (12 km/L). Driving 1,500 km per month yields PKR 24,000+ in direct monthly savings."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Financial Math Engine"
      />

      {/* Dual Column Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Adjust Driving Parameters</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Monthly Driving Distance (KM): <strong className="text-blue-700">{inputs.monthlyKm} km</strong>
            </label>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={inputs.monthlyKm}
              onChange={(e) => setInputs({ ...inputs, monthlyKm: Number(e.target.value) })}
              className="w-full accent-blue-600 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Petrol Price (PKR/L)
              </label>
              <input
                type="number"
                value={inputs.petrolPricePkr}
                onChange={(e) => setInputs({ ...inputs, petrolPricePkr: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Petrol Mileage (KM/L)
              </label>
              <input
                type="number"
                value={inputs.petrolMileageKml}
                onChange={(e) => setInputs({ ...inputs, petrolMileageKml: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Electricity Tariff (PKR/kWh)
              </label>
              <input
                type="number"
                value={inputs.electricityTariffPkr}
                onChange={(e) => setInputs({ ...inputs, electricityTariffPkr: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                EV Range (KM)
              </label>
              <input
                type="number"
                value={inputs.evRangeKm}
                onChange={(e) => setInputs({ ...inputs, evRangeKm: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-2 font-semibold">
                <Zap className="w-4 h-4 text-emerald-600" /> EV Per-KM Cost
              </div>
              <span className="text-3xl font-black text-emerald-700">
                PKR {result.evCostPerKm}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Includes 10% AC charging loss</span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-2 font-semibold">
                <Fuel className="w-4 h-4 text-rose-500" /> Petrol Per-KM Cost
              </div>
              <span className="text-3xl font-black text-rose-600">
                PKR {result.petrolCostPerKm}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Based on {inputs.petrolMileageKml} km/L</span>
            </div>
          </div>

          {/* Savings Display */}
          <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Net Monthly Fuel Savings
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-blue-700">
                PKR {result.monthlySavings.toLocaleString()}
              </span>
              <span className="text-slate-700 font-bold text-sm">/ month</span>
            </div>

            <div className="pt-4 border-t border-blue-200/80 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-600 block font-medium">1-Year Fuel Savings:</span>
                <span className="text-lg font-bold text-slate-900">
                  PKR {result.yearlySavings.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-600 block font-medium">5-Year Cumulative Savings:</span>
                <span className="text-lg font-bold text-emerald-700">
                  PKR {result.fiveYearSavings.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* CO2 Savings */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 border border-emerald-100">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Annual CO2 Emissions Prevented</span>
                <span className="text-base font-bold text-slate-900">
                  {result.co2SavedTonsPerYear} Tons of CO2 / Year
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
