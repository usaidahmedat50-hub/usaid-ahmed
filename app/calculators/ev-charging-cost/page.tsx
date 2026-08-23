'use client';

import React, { useState } from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { calculateEvChargingCost, ChargingCostInputs } from '@/lib/calculators/ev-charging-cost';

export default function EvChargingCostCalculatorPage() {
  const [inputs, setInputs] = useState<ChargingCostInputs>({
    batteryCapacityKwh: 60,
    startSocPercent: 10,
    targetSocPercent: 80,
    chargerType: 'HOME_AC_7KW',
    tariffPerUnitPkr: 45,
    chargerEfficiency: 90,
  });

  const handleChargerTypeChange = (type: ChargingCostInputs['chargerType']) => {
    let tariff = 45;
    if (type === 'COMMERCIAL_DC_60KW' || type === 'COMMERCIAL_DC_120KW') {
      tariff = 85;
    }
    setInputs({
      ...inputs,
      chargerType: type,
      tariffPerUnitPkr: tariff,
    });
  };

  const result = calculateEvChargingCost(inputs);

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Calculators', url: 'https://pakevfinder.com/calculators/ev-charging-cost' },
    { name: 'Charging Session Calculator', url: 'https://pakevfinder.com/calculators/ev-charging-cost' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Home AC vs Commercial DC Charging Session Calculator
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Calculate single session cost, charging time (minutes/hours), and energy billed (kWh).
        </p>
      </div>

      {/* AEO Summary */}
      <AnswerFirstSummary
        answer="Charging a 60 kWh battery EV from 10% to 80% (adding 42 kWh net energy) at home costs ~PKR 2,100 taking approx 5-6 hours on a 7kW AC charger. The same session on a commercial 120kW DC fast charger (at PKR 85-95/unit) costs ~PKR 3,960 and takes only 30 minutes."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Session Energy Model"
      />

      {/* Input / Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Charging Session Setup
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Charger Type
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => handleChargerTypeChange('HOME_AC_7KW')}
                className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                  inputs.chargerType === 'HOME_AC_7KW'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                7kW Home AC (Slow)
              </button>
              <button
                onClick={() => handleChargerTypeChange('COMMERCIAL_DC_120KW')}
                className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                  inputs.chargerType === 'COMMERCIAL_DC_120KW'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                120kW Fast DC (Public)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Battery Pack (kWh)
              </label>
              <input
                type="number"
                value={inputs.batteryCapacityKwh}
                onChange={(e) => setInputs({ ...inputs, batteryCapacityKwh: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tariff (PKR / kWh)
              </label>
              <input
                type="number"
                value={inputs.tariffPerUnitPkr}
                onChange={(e) => setInputs({ ...inputs, tariffPerUnitPkr: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Start SoC (%)
              </label>
              <input
                type="number"
                value={inputs.startSocPercent}
                onChange={(e) => setInputs({ ...inputs, startSocPercent: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target SoC (%)
              </label>
              <input
                type="number"
                value={inputs.targetSocPercent}
                onChange={(e) => setInputs({ ...inputs, targetSocPercent: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
              />
            </div>
          </div>
        </div>

        {/* Output Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Session Cost Summary
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-blue-700">
                PKR {result.totalCostPkr.toLocaleString()}
              </span>
              <span className="text-slate-500 text-xs font-semibold">Total Session Price</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Est. Time Required:</span>
                <span className="text-base font-bold text-slate-900">
                  {result.estimatedTimeMinutes} mins
                </span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Billed Energy:</span>
                <span className="text-base font-bold text-amber-600">
                  {result.totalEnergyBilledKwh} kWh
                </span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Effective Cost / kWh:</span>
                <span className="text-base font-bold text-blue-700">
                  PKR {result.effectiveCostPerKwh}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
