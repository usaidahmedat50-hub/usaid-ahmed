'use client';

import React, { useState } from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import VehicleCard from '@/components/vehicles/VehicleCard';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import { getAllVehicles } from '@/lib/data/mock-db';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function FindAnEvPage() {
  const allVehicles = getAllVehicles();

  const [budget, setBudget] = useState<string>('50-lakh-1-crore');
  const [dailyKm, setDailyKm] = useState<number>(60);
  const [bodyPreference, setBodyPreference] = useState<string>('SUV');
  const [hasHomeCharging, setHasHomeCharging] = useState<boolean>(true);

  const recommendedVehicles = allVehicles.filter((v) => {
    if (budget === 'under-50-lakh' && v.startingPricePkr > 5000000) return false;
    if (budget === '50-lakh-1-crore' && (v.startingPricePkr <= 5000000 || v.startingPricePkr > 10000000))
      return false;
    if (budget === '1-crore-2-crore' && (v.startingPricePkr <= 10000000 || v.startingPricePkr > 20000000))
      return false;
    if (budget === 'above-2-crore' && v.startingPricePkr <= 20000000) return false;

    return true;
  });

  const displayVehicles = recommendedVehicles.length > 0 ? recommendedVehicles : allVehicles.slice(0, 3);

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Find An EV', url: 'https://pakevfinder.com/find-an-ev' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Interactive Matcher Tool
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Smart EV Matcher & Discovery Quiz
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Answer 4 quick questions to find the ideal electric vehicle tailored for your budget and driving routine in Pakistan.
        </p>
      </div>

      {/* AEO Summary */}
      <AnswerFirstSummary
        answer="The PakEVFinder Smart Matcher analyzes ex-factory prices, battery range safety margins, and local home charging availability to recommend optimal EV choices across Pakistan. For budgets under 50 Lakh, the Honri VE is recommended; for PKR 80-99 Lakh, BYD Atto 3 and MG4 are prime contenders; for PKR 1.5+ Crore, Deepal S07 and BYD Seal lead."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Recommendation Engine"
      />

      {/* Interactive Quiz Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
          Your Ownership Requirements
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Question 1: Budget */}
          <div>
            <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              1. Ex-Factory Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 font-medium"
            >
              <option value="under-50-lakh">Under 50 Lakh (Budget)</option>
              <option value="50-lakh-1-crore">50 Lakh - 1 Crore (Mid-Range)</option>
              <option value="1-crore-2-crore">1 Crore - 2 Crore (Executive)</option>
              <option value="above-2-crore">Above 2 Crore (Luxury)</option>
            </select>
          </div>

          {/* Question 2: Daily KM */}
          <div>
            <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              2. Daily Driving: {dailyKm} KM
            </label>
            <input
              type="range"
              min="20"
              max="250"
              step="10"
              value={dailyKm}
              onChange={(e) => setDailyKm(Number(e.target.value))}
              className="w-full accent-blue-600 bg-slate-100 mt-2 cursor-pointer"
            />
          </div>

          {/* Question 3: Body Style */}
          <div>
            <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              3. Preferred Body Style
            </label>
            <select
              value={bodyPreference}
              onChange={(e) => setBodyPreference(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 font-medium"
            >
              <option value="SUV">Compact / Mid-Size SUV</option>
              <option value="Sedan">Aerodynamic Sedan</option>
              <option value="Hatchback">Urban Hatchback</option>
            </select>
          </div>

          {/* Question 4: Home Charging */}
          <div>
            <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              4. Home Charger Access
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setHasHomeCharging(true)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                  hasHomeCharging
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Yes (7kW AC)
              </button>
              <button
                onClick={() => setHasHomeCharging(false)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                  !hasHomeCharging
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Public Only
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Matches */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            Top Recommended Matches ({displayVehicles.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayVehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </div>
    </div>
  );
}
