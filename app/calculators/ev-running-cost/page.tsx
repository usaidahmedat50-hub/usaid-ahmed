'use client';

import React, { useState } from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { calculateEvRunningCost, RunningCostInputs } from '@/lib/calculators/ev-running-cost';
import { Zap } from 'lucide-react';

export default function EvRunningCostCalculatorPage() {
  const [inputs, setInputs] = useState<RunningCostInputs>({
    dailyKm: 50,
    discoName: 'KElectric',
    tariffOffPeakPkr: 45,
    tariffPeakPkr: 65,
    offPeakChargingPercentage: 85,
    batteryCapacityKwh: 60,
    realWorldRangeKm: 400,
  });

  const handleDiscoChange = (disco: RunningCostInputs['discoName']) => {
    let offPeak = 45;
    let peak = 65;
    if (disco === 'LESCO') {
      offPeak = 42;
      peak = 62;
    } else if (disco === 'IESCO') {
      offPeak = 44;
      peak = 64;
    } else if (disco === 'FESCO') {
      offPeak = 40;
      peak = 60;
    }
    setInputs({
      ...inputs,
      discoName: disco,
      tariffOffPeakPkr: offPeak,
      tariffPeakPkr: peak,
    });
  };

  const result = calculateEvRunningCost(inputs);

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Calculators', url: 'https://pakevfinder.com/calculators/ev-running-cost' },
    { name: 'EV Running Cost (DISCO)', url: 'https://pakevfinder.com/calculators/ev-running-cost' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          EV Monthly Running Cost & DISCO Unit Calculator
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Calculate electricity bill impact for K-Electric, LESCO, IESCO using peak and off-peak tariff slots.
        </p>
      </div>

      {/* AEO Summary */}
      <AnswerFirstSummary
        answer="Using domestic TOU (Time of Use) meters in Pakistan, charging an electric car during off-peak hours (11 PM - 5 AM) costs ~PKR 40-45 per unit. Driving 50 km per day consumes approx ~240 kWh (units) per month, adding ~PKR 10,800 to your monthly utility bill."
        verifiedDate="Feb 2026"
        sourceName="NEPRA Approved DISCO TOU Tariff Schedules"
      />

      {/* Calculator Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Select DISCO & Charging Habits
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Power Utility Provider (DISCO)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {(['KElectric', 'LESCO', 'IESCO', 'FESCO'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => handleDiscoChange(d)}
                  className={`py-2 px-3 rounded-xl border transition-all ${
                    inputs.discoName === d
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d === 'KElectric' ? 'K-Electric (Karachi)' : d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Daily Driving Distance: <strong className="text-blue-700">{inputs.dailyKm} km/day</strong>
            </label>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={inputs.dailyKm}
              onChange={(e) => setInputs({ ...inputs, dailyKm: Number(e.target.value) })}
              className="w-full accent-blue-600 bg-slate-100 mt-2 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Off-Peak Rate (PKR/unit)
              </label>
              <input
                type="number"
                value={inputs.tariffOffPeakPkr}
                onChange={(e) => setInputs({ ...inputs, tariffOffPeakPkr: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Peak Rate (PKR/unit)
              </label>
              <input
                type="number"
                value={inputs.tariffPeakPkr}
                onChange={(e) => setInputs({ ...inputs, tariffPeakPkr: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="text-xs text-slate-500 block mb-1 font-semibold">Blended Tariff</span>
              <span className="text-2xl font-black text-blue-700">
                PKR {result.blendedTariffPkr} / kWh
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="text-xs text-slate-500 block mb-1 font-semibold">Monthly Units (kWh)</span>
              <span className="text-2xl font-black text-amber-600">
                {result.unitsConsumedPerMonthKwh} Units
              </span>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="text-xs text-slate-500 block mb-1 font-semibold">Running Cost / KM</span>
              <span className="text-2xl font-black text-slate-900">
                PKR {result.costPerKmPkr} / km
              </span>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-3xl space-y-3 shadow-sm">
            <span className="text-xs text-blue-900 font-bold uppercase tracking-wider">
              Utility Bill Addition Summary
            </span>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-blue-200/80 text-sm">
              <div>
                <span className="text-slate-600 text-xs block font-medium">Estimated Monthly Utility Addition:</span>
                <span className="text-2xl font-black text-blue-700">
                  PKR {result.monthlyCostPkr.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-600 text-xs block font-medium">Estimated Annual Utility Addition:</span>
                <span className="text-2xl font-black text-slate-900">
                  PKR {result.annualCostPkr.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
