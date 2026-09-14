'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { VehicleWithDetails } from '@/lib/types';
import { VehicleSmartImage } from '@/components/vehicles/VehicleSmartImage';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Zap,
  BatteryCharging,
  Car,
  Home,
  ShieldCheck,
  GitCompare,
  TrendingDown,
  Fuel,
  Flame,
  Clock,
  Navigation,
} from 'lucide-react';

interface CarMatchQuizProps {
  vehicles: VehicleWithDetails[];
}

interface QuizAnswers {
  dailyKm: '20' | '40' | '80' | '150' | '';
  chargingLocation: 'home-garage' | 'home-socket' | 'public-only' | '';
  highwayFrequency: 'rarely' | 'monthly' | 'frequent' | '';
  budget: 'under-40' | '40-70' | '70-120' | 'above-120' | '';
  bodyStyle: 'suv' | 'sedan' | 'hatchback' | 'pickup' | 'any' | '';
  chargingTolerance: 'willing-dc' | 'prefer-backup' | '';
}

export function CarMatchQuiz({ vehicles }: CarMatchQuizProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  const [answers, setAnswers] = useState<QuizAnswers>({
    dailyKm: '',
    chargingLocation: '',
    highwayFrequency: '',
    budget: '',
    bodyStyle: '',
    chargingTolerance: '',
  });

  const handleSelectOption = (key: keyof QuizAnswers, val: string) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCurrentStep(totalSteps + 1); // Results screen
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({
      dailyKm: '',
      chargingLocation: '',
      highwayFrequency: '',
      budget: '',
      bodyStyle: '',
      chargingTolerance: '',
    });
    setCurrentStep(1);
  };

  // Powertrain Recommendation Engine
  const powertrainRecommendation = useMemo(() => {
    if (currentStep <= totalSteps) return null;

    const { chargingLocation, highwayFrequency, chargingTolerance } = answers;

    if (chargingTolerance === 'prefer-backup' || (highwayFrequency === 'frequent' && chargingLocation === 'public-only')) {
      return {
        type: 'REEV / PHEV',
        badgeColor: 'from-amber-500 to-orange-600',
        title: 'Plug-in / Range Extended Hybrid (REEV / PHEV)',
        rationale:
          'Because you prefer petrol backup for long trips or have limited overnight charging, an REEV or PHEV delivers 80–180 km of pure electric city driving plus 800–1,000 km of petrol cruising with zero charging wait times.',
        preferredPowertrains: ['reev', 'phev', 'hev'],
      };
    }

    return {
      type: 'Pure BEV',
      badgeColor: 'from-cyan-500 to-blue-600',
      title: 'Pure Battery Electric Vehicle (BEV)',
      rationale:
        'With your charging arrangement and acceptance of 25–35 min motorway fast charges, a pure BEV maximizes your financial savings (up to 80% vs petrol) and gives you the lowest running costs in Pakistan.',
      preferredPowertrains: ['bev'],
    };
  }, [answers, currentStep, totalSteps]);

  // Fuel Cost Savings Estimation
  const savingsCalc = useMemo(() => {
    const dailyKm = parseInt(answers.dailyKm || '40', 10);
    const monthlyKm = dailyKm * 30;

    // Petrol car: 11 km/L @ PKR 280 / Litre
    const petrolLitres = monthlyKm / 11;
    const monthlyPetrolCost = Math.round(petrolLitres * 280);

    // EV: 16 kWh / 100 km (0.16 kWh/km)
    const evKwh = (monthlyKm * 16) / 100;
    const tariffPerKwh = answers.chargingLocation === 'public-only' ? 100 : 55; // PKR 55/unit offpeak vs 100 commercial DC
    const monthlyEvCost = Math.round(evKwh * tariffPerKwh);

    const monthlySavings = Math.max(0, monthlyPetrolCost - monthlyEvCost);
    const yearlySavings = monthlySavings * 12;

    return {
      monthlyKm,
      monthlyPetrolCost,
      monthlyEvCost,
      monthlySavings,
      yearlySavings,
    };
  }, [answers.dailyKm, answers.chargingLocation]);

  // Vehicle Matching Engine
  const matchedVehicles = useMemo(() => {
    if (currentStep <= totalSteps) return [];

    const scored = vehicles.map((v) => {
      let score = 40;
      const reasons: string[] = [];

      const pricePkr = v.latest_ex_factory_price?.amount_pkr || 9000000;
      const wltpRange = parseFloat(v.specs.wltp_range_km?.value || v.specs.electric_range_km?.value || '350') || 350;
      const bodyType = (v.body_type || '').toLowerCase();
      const pt = (v.powertrain || 'bev').toLowerCase();
      const dcKw = parseFloat(v.specs.dc_fast_charge_kw?.value || '50') || 50;

      // 1. Powertrain alignment
      if (powertrainRecommendation?.preferredPowertrains.includes(pt)) {
        score += 30;
        reasons.push(`Matches your recommended ${v.powertrain.toUpperCase()} powertrain architecture`);
      } else if (pt === 'bev' && answers.chargingTolerance === 'willing-dc') {
        score += 20;
      } else {
        score -= 10;
      }

      // 2. Budget Scoring
      if (answers.budget === 'under-40') {
        if (pricePkr <= 4000000) {
          score += 35;
          reasons.push('Comfortably within your sub-40 Lakh budget limit');
        } else if (pricePkr <= 5000000) {
          score += 10;
        } else {
          score -= 35;
        }
      } else if (answers.budget === '40-70') {
        if (pricePkr >= 3500000 && pricePkr <= 7500000) {
          score += 35;
          reasons.push('Ideal mid-range value in the PKR 40–70 Lakhs tier');
        } else {
          score -= 15;
        }
      } else if (answers.budget === '70-120') {
        if (pricePkr >= 6800000 && pricePkr <= 12500000) {
          score += 35;
          reasons.push('Premium executive engineering in the PKR 70L–1.2Cr bracket');
        } else {
          score -= 15;
        }
      } else if (answers.budget === 'above-120') {
        if (pricePkr >= 11500000) {
          score += 35;
          reasons.push('Flagship performance, AWD capability, and executive luxury');
        } else {
          score += 5;
        }
      }

      // 3. Body Style Scoring
      if (answers.bodyStyle === 'any') {
        score += 15;
      } else if (answers.bodyStyle === 'suv') {
        if (bodyType.includes('suv') || bodyType.includes('crossover')) {
          score += 25;
          reasons.push('SUV ground clearance tailored for Pakistani urban and highway roads');
        } else {
          score -= 15;
        }
      } else if (answers.bodyStyle === 'sedan') {
        if (bodyType.includes('sedan')) {
          score += 25;
          reasons.push('Aerodynamic executive sedan with low drag and high cruising range');
        } else {
          score -= 15;
        }
      } else if (answers.bodyStyle === 'hatchback') {
        if (bodyType.includes('hatchback') || bodyType.includes('microcar')) {
          score += 25;
          reasons.push('Nimble city footprint with ultra-tight turning circle');
        } else {
          score -= 15;
        }
      } else if (answers.bodyStyle === 'pickup') {
        if (bodyType.includes('pickup')) {
          score += 35;
          reasons.push('Rugged dual-cab pickup with heavy load capacity');
        } else {
          score -= 20;
        }
      }

      // 4. Daily commute & charging alignment
      const dailyVal = parseInt(answers.dailyKm || '40', 10);
      if (wltpRange >= dailyVal * 3) {
        score += 15;
        reasons.push(`Range of ${wltpRange} km allows 3+ days of commuting per single charge`);
      }

      if (answers.chargingLocation === 'public-only' && dcKw >= 60) {
        score += 10;
        reasons.push(`Rapid ${dcKw} kW DC charging supports quick public pit-stops`);
      }

      const matchPercentage = Math.min(99, Math.max(68, Math.round(score)));

      return {
        vehicle: v,
        matchPercentage,
        reasons: reasons.slice(0, 3),
      };
    });

    return scored.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);
  }, [vehicles, answers, currentStep, totalSteps, powertrainRecommendation]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Quiz Progress Header */}
      {currentStep <= totalSteps && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-200">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Question {currentStep} of {totalSteps}
              </span>
            </div>
            <span className="text-xs font-extrabold text-blue-600 tabular-nums">
              {Math.round(((currentStep - 1) / totalSteps) * 100)}% Completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 1: Daily Commuting Distance */}
      {currentStep === 1 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Step 1 of 6 • Daily Commute
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              What is your average daily driving distance?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Determines required battery capacity and how often you will need to plug in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                id: '20',
                title: '20 km / day',
                desc: 'Short neighborhood errands, grocery runs, and school drops.',
                badge: 'City Runabout',
              },
              {
                id: '40',
                title: '40 km / day',
                desc: 'Standard daily office commute across Karachi, Lahore, or Islamabad.',
                badge: 'Average Commuter',
              },
              {
                id: '80',
                title: '80 km / day',
                desc: 'Cross-city transit or twin-cities daily travel (Rawalpindi-Islamabad).',
                badge: 'Suburban Regular',
              },
              {
                id: '150',
                title: '150 km / day',
                desc: 'Heavy daily running, highway routes, or high-mileage business use.',
                badge: 'High Mileage',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption('dailyKm', opt.id)}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-500 transition-all text-left group cursor-pointer space-y-2 shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-700">
                    {opt.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                <span className="inline-block text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {opt.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Primary Charging Location */}
      {currentStep === 2 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Step 2 of 6 • Charging Setup
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Where will you charge the vehicle most often?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your home charging situation determines whether pure electric or hybrid fits best.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 p-2 rounded-xl bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              {
                id: 'home-garage',
                title: 'Dedicated Home Garage',
                desc: 'Can install a 7kW AC wallbox connected to home power or solar net-metering.',
                badge: 'Fast Home Charging',
              },
              {
                id: 'home-socket',
                title: 'Regular 15A Socket',
                desc: 'Access to a standard 220V household plug for overnight slow trickle charging.',
                badge: 'Standard Socket (3kW)',
              },
              {
                id: 'public-only',
                title: 'Public / Street Parking Only',
                desc: 'Apartment or street parking with no personal plug; will use public DC chargers.',
                badge: 'Public Network Reliant',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption('chargingLocation', opt.id)}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-500 transition-all text-left group cursor-pointer space-y-2 shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700">
                    {opt.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                <span className="inline-block text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {opt.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Intercity Highway Trips Frequency */}
      {currentStep === 3 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Step 3 of 6 • Motorway Driving
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                How often do you take intercity highway trips?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Corridors like M-2 (Lahore-Islamabad), M-9 (Karachi-Hyderabad), or M-5 (Multan-Sukkur).
              </p>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 p-2 rounded-xl bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              {
                id: 'rarely',
                title: 'Rarely / City Only',
                desc: '95%+ driving inside city limits; intercity road trips once or twice a year.',
                badge: 'Urban Primary',
              },
              {
                id: 'monthly',
                title: '1 to 2 Times a Month',
                desc: 'Occasional weekend visits or business runs between major cities.',
                badge: 'Moderate Highway',
              },
              {
                id: 'frequent',
                title: 'Frequent Long Distance',
                desc: 'Weekly long-haul travel covering 350+ km per journey across provinces.',
                badge: 'Road Warrior',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption('highwayFrequency', opt.id)}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-500 transition-all text-left group cursor-pointer space-y-2 shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700">
                    {opt.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                <span className="inline-block text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {opt.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Target Budget */}
      {currentStep === 4 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Step 4 of 6 • Price Range
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                What is your target budget ceiling in Pakistan?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Based on verified ex-factory retail tariffs and local assembler prices.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 p-2 rounded-xl bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                id: 'under-40',
                title: 'Under PKR 40 Lakhs',
                desc: 'Economical city EV runabouts (Honri VE 2.0 / 3.0, JMEV EV3, GiGi EV).',
                badge: 'Entry-Level Electric',
              },
              {
                id: '40-70',
                title: 'PKR 40 to 70 Lakhs',
                desc: 'Smart hatchbacks & compact crossovers (Dongfeng Box, Chery Tiggo 7 PHEV).',
                badge: 'Mid-Range Value',
              },
              {
                id: '70-120',
                title: 'PKR 70 Lakhs to 1.2 Crore',
                desc: 'Premium crossovers & sedans (BYD Atto 3, Deepal S07/L07, MG HS PHEV, Forthing REEV).',
                badge: 'Executive Long-Range',
              },
              {
                id: 'above-120',
                title: 'Above PKR 1.2 Crore',
                desc: 'Flagship luxury EVs & AWD performance (BYD Seal AWD, Audi Q8 e-tron, Mercedes EQS).',
                badge: 'Flagship Luxury',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption('budget', opt.id)}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-500 transition-all text-left group cursor-pointer space-y-2 shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-700">
                    {opt.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                <span className="inline-block text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {opt.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Preferred Body Style */}
      {currentStep === 5 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Step 5 of 6 • Vehicle Type
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Which body style fits your passenger & cargo needs?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ground clearance for monsoon roads vs low drag for motorway range.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 p-2 rounded-xl bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              {
                id: 'suv',
                title: 'SUV / Crossover',
                desc: 'High ground clearance for rough roads, high driving position, big boot.',
                badge: 'High Clearance',
              },
              {
                id: 'sedan',
                title: 'Sedan / Fastback',
                desc: 'Low aerodynamic drag, executive cruising comfort, maximum highway range.',
                badge: 'Low Drag & Comfort',
              },
              {
                id: 'hatchback',
                title: 'Hatchback / Microcar',
                desc: 'Compact footprint, zippy city maneuverability, easiest parking in tight lanes.',
                badge: 'Urban Compact',
              },
              {
                id: 'pickup',
                title: 'Pickup Truck',
                desc: 'Heavy cargo bed, high towing capability, dual-cab utility (e.g. Hunter REEV).',
                badge: 'Utility & Cargo',
              },
              {
                id: 'any',
                title: 'Any Body Style',
                desc: 'Open to whichever body format provides the best technical value and range.',
                badge: 'Best Value First',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption('bodyStyle', opt.id)}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-500 transition-all text-left group cursor-pointer space-y-2 shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-700">
                    {opt.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                <span className="inline-block text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {opt.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 6: Highway Charging Tolerance */}
      {currentStep === 6 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Step 6 of 6 • Travel Tolerance
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                How do you prefer handling highway stops during travel?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Crucial factor in deciding between Pure Electric (BEV) and Extended Range (REEV/PHEV).
              </p>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 p-2 rounded-xl bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                id: 'willing-dc',
                title: 'Yes, 25–35 min break is fine',
                desc: 'Comfortable stopping at Sukheke, Bhera, or Rashakai motorway fast chargers for a cup of tea while the EV recharges to 80%.',
                badge: '100% Pure BEV Friendly',
              },
              {
                id: 'prefer-backup',
                title: 'Prefer petrol backup engine',
                desc: 'Prefer having an onboard petrol generator (REEV / PHEV) to refuel in 5 minutes at any standard fuel pump on long journeys.',
                badge: 'Zero Range Anxiety',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption('chargingTolerance', opt.id)}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-500 transition-all text-left group cursor-pointer space-y-2 shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-700">
                    {opt.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                <span className="inline-block text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {opt.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Screen */}
      {currentStep > totalSteps && (
        <div className="space-y-8">
          {/* Powertrain Recommendation Banner */}
          <div className="bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0A101D] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Powertrain Assessment</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Recommended: {powertrainRecommendation?.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {powertrainRecommendation?.rationale}
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer shrink-0 self-start md:self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Assessment</span>
              </button>
            </div>
          </div>

          {/* Running Cost Savings Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600">
              <TrendingDown className="w-4 h-4" />
              <span>Projected Running Cost Savings in Pakistan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Monthly Petrol Cost (11 km/L)
                </span>
                <div className="text-xl font-black text-slate-900 tabular-nums">
                  PKR {savingsCalc.monthlyPetrolCost.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Based on Rs. 280/L petrol price</p>
              </div>

              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                  Monthly EV Electric Cost
                </span>
                <div className="text-xl font-black text-blue-700 tabular-nums">
                  PKR {savingsCalc.monthlyEvCost.toLocaleString()}
                </div>
                <p className="text-[11px] text-blue-600 mt-1">
                  At {answers.chargingLocation === 'public-only' ? 'Rs. 100/kWh commercial DC' : 'Rs. 55/kWh off-peak'}
                </p>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Estimated Monthly Savings
                </span>
                <div className="text-xl font-black text-emerald-700 tabular-nums">
                  PKR {savingsCalc.monthlySavings.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">
                  ≈ PKR {(savingsCalc.yearlySavings / 100000).toFixed(1)} Lakhs saved / year
                </p>
              </div>
            </div>
          </div>

          {/* Top 3 Vehicle Matches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Top 3 Matched Vehicles for You
              </h3>
              <span className="text-xs text-slate-500 font-medium">Ranked by algorithm score</span>
            </div>

            <div className="space-y-5">
              {matchedVehicles.map((match, idx) => {
                const v = match.vehicle;
                const formattedPrice = v.latest_ex_factory_price?.amount_pkr
                  ? `Rs. ${(v.latest_ex_factory_price.amount_pkr / 100000).toFixed(2)} Lacs`
                  : 'Price on Request';

                const rangeVal =
                  v.specs.wltp_range_km?.value ||
                  v.specs.electric_range_km?.value ||
                  v.specs.combined_range_km?.value ||
                  '400';

                return (
                  <div
                    key={v.id}
                    className={`bg-white border rounded-2xl p-5 sm:p-7 transition-all shadow-xs space-y-5 ${
                      idx === 0
                        ? 'border-blue-600 ring-2 ring-blue-600/15'
                        : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      {/* Vehicle Identity & Badges */}
                      <div className="flex items-start gap-4">
                        {/* Rank Badge */}
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                            idx === 0
                              ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          #{idx + 1}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                              {v.brand.name}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[11px] font-bold text-slate-600 uppercase">
                              {v.body_type}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {v.powertrain.toUpperCase()}
                            </span>
                            {idx === 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider">
                                Top Pick
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                            {v.brand.name} {v.name}
                          </h3>
                          <div className="text-sm font-extrabold text-blue-700 tabular-nums">
                            {formattedPrice}{' '}
                            <span className="text-xs font-medium text-slate-400">Ex-Factory</span>
                          </div>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="shrink-0 flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Match Score
                        </span>
                        <div className="text-2xl font-black text-emerald-700 tabular-nums flex items-baseline gap-1">
                          <span>{match.matchPercentage}%</span>
                          <span className="text-xs font-bold text-emerald-600">Match</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Specs Pill Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Battery</span>
                        <span className="font-extrabold text-slate-900 tabular-nums">
                          {v.specs.battery_kwh?.value || '—'} kWh
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Range</span>
                        <span className="font-extrabold text-slate-900 tabular-nums">
                          {rangeVal} km
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">0–100 km/h</span>
                        <span className="font-extrabold text-slate-900 tabular-nums">
                          {v.specs.zero_to_hundred_sec?.value || '—'}s
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Fast DC</span>
                        <span className="font-extrabold text-slate-900 tabular-nums">
                          {v.specs.dc_fast_charge_kw?.value || '—'} kW
                        </span>
                      </div>
                    </div>

                    {/* Why this matches you */}
                    <div className="space-y-1.5 bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                        Why this vehicle matches your lifestyle:
                      </span>
                      <ul className="space-y-1 text-slate-700">
                        {match.reasons.map((r, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action CTAs */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <Link
                        href={`/cars/${v.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <span>Explore Full Specifications</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/compare/${v.slug}-vs-${matchedVehicles[(idx + 1) % matchedVehicles.length].vehicle.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                      >
                        <GitCompare className="w-3.5 h-3.5 text-slate-600" />
                        <span>Compare with #{((idx + 1) % matchedVehicles.length) + 1} Match</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
