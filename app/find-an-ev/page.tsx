'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import VehicleCard from '@/components/vehicles/VehicleCard';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import { getAllVehicles } from '@/lib/data/mock-db';
import { formatPkr } from '@/lib/utils/format';
import { Sparkles, Compass, CheckCircle2, Sliders, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FindAnEvPage() {
  const allVehicles = getAllVehicles();

  const [budgetMaxPkr, setBudgetMaxPkr] = useState<number>(10000000); // 1 Crore default
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [hasHomeCharging, setHasHomeCharging] = useState<boolean>(true);
  const [primaryDrivingMix, setPrimaryDrivingMix] = useState<string>('city');

  // Calculate Percentage Match Score for each vehicle
  const matchedVehicles = allVehicles.map((v) => {
    let score = 70; // Base score

    if (v.startingPricePkr <= budgetMaxPkr) score += 15;
    else score -= 25;

    if (selectedBodyType === 'all' || v.bodyType.toLowerCase().includes(selectedBodyType.toLowerCase())) {
      score += 10;
    }

    if (hasHomeCharging && v.maxRangeKm >= 400) score += 5;
    if (primaryDrivingMix === 'highway' && v.maxRangeKm >= 500) score += 5;

    const matchPercent = Math.min(98, Math.max(45, score));

    return {
      ...v,
      matchPercent,
      matchReason: v.startingPricePkr <= budgetMaxPkr
        ? 'Fits your exact budget threshold and delivers strong WLTP range efficiency'
        : 'Slightly above threshold but offers extended battery pack and fast DC charging',
    };
  }).sort((a, b) => b.matchPercent - a.matchPercent);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Automotive Decision Lab</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Find the Vehicle That Fits Your Life
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Tell us your budget, driving patterns, and home charging availability. Our recommendation engine scores vehicles based on real-world match parameters.
        </p>
      </div>

      <AnswerFirstSummary
        answer="Finding the right EV in Pakistan requires evaluating your budget, home wallbox feasibility, and daily commuting patterns. The PakEVFinder matchmaker ranks vehicles by calculating compatibility scores across budget adherence, range efficiency, and charging infrastructure."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Decision Engine"
      />

      {/* Guided Questionnaire Control Panel */}
      <div className="editorial-panel p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          <span>Match Parameters</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold">
          {/* Budget Limit Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Maximum Budget Limit</span>
              <span className="text-emerald-400 font-extrabold">{formatPkr(budgetMaxPkr)}</span>
            </div>
            <input
              type="range"
              min="4000000"
              max="35000000"
              step="500000"
              value={budgetMaxPkr}
              onChange={(e) => setBudgetMaxPkr(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Body Type Filter */}
          <div className="space-y-2">
            <span className="text-slate-300 block">Preferred Body Style</span>
            <select
              value={selectedBodyType}
              onChange={(e) => setSelectedBodyType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white font-extrabold text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Body Styles (SUVs, Sedans, Hatchbacks)</option>
              <option value="SUV">Electric SUVs & Crossovers</option>
              <option value="Sedan">Electric Sedans</option>
              <option value="Hatchback">Compact Hatchbacks</option>
            </select>
          </div>

          {/* Driving Mix */}
          <div className="space-y-2">
            <span className="text-slate-300 block">Primary Driving Pattern</span>
            <select
              value={primaryDrivingMix}
              onChange={(e) => setPrimaryDrivingMix(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white font-extrabold text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
            >
              <option value="city">City Commuting (Under 60 km daily)</option>
              <option value="highway">Highway / Intercity Driving (M-2 Travel)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ranked Matches Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
          <h2 className="text-2xl font-black text-white">
            Top Matched Vehicles ({matchedVehicles.length})
          </h2>
          <span className="text-xs text-slate-400">
            Ordered by Percentage Match Score
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedVehicles.map((v) => (
            <div key={v.id} className="space-y-2">
              {/* Match Percentage Banner */}
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Match Score
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 font-black text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {v.matchPercent}% Match
                </span>
              </div>

              <VehicleCard vehicle={v} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
