'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import VehicleCard from '@/components/vehicles/VehicleCard';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import { getAllVehicles } from '@/lib/data/mock-db';
import { formatPkr } from '@/lib/utils/format';
import { Sparkles, Compass, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';

export default function FindAnEvPage() {
  const allVehicles = getAllVehicles();

  const [budgetMaxPkr, setBudgetMaxPkr] = useState<number>(10000000); // 1 Crore default
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');
  const [hasHomeCharging, setHasHomeCharging] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState<string>('lahore');

  const filteredVehicles = allVehicles.filter((v) => {
    const matchesBudget = v.startingPricePkr <= budgetMaxPkr || v.startingPricePkr === 0;
    const matchesBody = selectedBodyType === 'all' || v.bodyType.toLowerCase().includes(selectedBodyType.toLowerCase());
    return matchesBudget && matchesBody;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Interactive Matchmaker</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Find the Right EV for Your Budget & Lifestyle
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Select your budget limit, daily driving habits, and home charging availability to instantly discover electric vehicles matched to your exact requirements in Pakistan.
        </p>
      </div>

      <AnswerFirstSummary
        answer="Finding the right EV in Pakistan depends on budget, home wallbox installation feasibility, and monthly driving mileage. For city commuting under 50 km daily with home charging, compact SUVs and sedans between PKR 6.5M and 11.5M provide optimal value and lowest cost per km."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Matchmaker Algorithm"
      />

      {/* Questionnaire Control Panel */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          <span>Filter Your Match Parameters</span>
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
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>PKR 40 Lakh</span>
              <span>PKR 3.5 Crore</span>
            </div>
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

          {/* Primary City & Home Charging */}
          <div className="space-y-2">
            <span className="text-slate-300 block">Primary City Location</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white font-extrabold text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
            >
              <option value="karachi">Karachi (Sindh)</option>
              <option value="lahore">Lahore (Punjab)</option>
              <option value="islamabad">Islamabad (Capital Territory)</option>
              <option value="rawalpindi">Rawalpindi (Punjab)</option>
              <option value="peshawar">Peshawar (KPK)</option>
              <option value="multan">Multan (Punjab)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matched Results Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
          <h2 className="text-2xl font-black text-white">
            Matched Electric Vehicles ({filteredVehicles.length})
          </h2>
          <span className="text-xs text-slate-400">
            Showing results under <strong className="text-emerald-400">{formatPkr(budgetMaxPkr)}</strong>
          </span>
        </div>

        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-3">
            <span className="text-slate-400 text-sm">No vehicles match your strict budget threshold. Try increasing your maximum budget limit above.</span>
          </div>
        )}
      </div>
    </div>
  );
}
