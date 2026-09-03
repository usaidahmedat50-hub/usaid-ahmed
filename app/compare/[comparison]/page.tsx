import React from 'react';
import { notFound } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import VehicleFallbackImage from '@/components/vehicles/VehicleFallbackImage';
import { getVehicleBySlug, getAllVehicles } from '@/lib/data/mock-db';
import { calculateVehicleScore } from '@/lib/calculations/scoring';
import { formatPkr } from '@/lib/utils/format';
import { ArrowRightLeft, CheckCircle2, Award, Zap, Battery, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ComparisonPageProps {
  params: Promise<{
    comparison: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { comparison: 'byd-seal-vs-tesla-model-3' },
    { comparison: 'byd-seal-vs-deepal-s07' },
    { comparison: 'byd-seal-vs-byd-atto-3' },
    { comparison: 'byd-atto-3-vs-deepal-s07' },
  ];
}

export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const resolvedParams = await params;
  const comparisonSlug = resolvedParams?.comparison || '';
  const parts = comparisonSlug.split('-vs-');

  if (parts.length < 2) {
    notFound();
  }

  const vehicleA = getVehicleBySlug(parts[0]);
  const vehicleB = getVehicleBySlug(parts[1]);

  if (!vehicleA || !vehicleB) {
    notFound();
  }

  const varA = vehicleA.variants[0];
  const varB = vehicleB.variants[0];

  const scoreA = calculateVehicleScore({
    startingPricePkr: vehicleA.startingPricePkr,
    maxRangeKm: vehicleA.maxRangeKm,
    batteryCapacityKwh: varA.batteryCapacityKwh,
    fastChargeKw: varA.fastChargeKw,
    motorPowerHp: varA.motorPowerHp,
    motorTorqueNm: varA.motorTorqueNm,
    accelerationSec: vehicleA.accelerationSec,
    warrantyYears: varA.warrantyYears,
    batteryWarrantyYears: varA.batteryWarrantyYears,
  });

  const scoreB = calculateVehicleScore({
    startingPricePkr: vehicleB.startingPricePkr,
    maxRangeKm: vehicleB.maxRangeKm,
    batteryCapacityKwh: varB.batteryCapacityKwh,
    fastChargeKw: varB.fastChargeKw,
    motorPowerHp: varB.motorPowerHp,
    motorTorqueNm: varB.motorTorqueNm,
    accelerationSec: vehicleB.accelerationSec,
    warrantyYears: varB.warrantyYears,
    batteryWarrantyYears: varB.batteryWarrantyYears,
  });

  const rangeWinner = vehicleA.maxRangeKm >= vehicleB.maxRangeKm ? vehicleA.name : vehicleB.name;
  const priceWinner = vehicleA.startingPricePkr <= vehicleB.startingPricePkr ? vehicleA.name : vehicleB.name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
          <span>Side-by-Side Comparison Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {vehicleA.brandName} {vehicleA.name} vs {vehicleB.brandName} {vehicleB.name}
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Compare ex-factory prices, battery capacity, WLTP range, fast charging speeds, motor horsepower, and PakEV Value Scores in Pakistan.
        </p>
      </div>

      {/* Side-by-Side Vehicle Showcases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle A Card */}
        <div className="editorial-panel rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="aspect-video relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <VehicleFallbackImage
              src={vehicleA.imageUrl}
              alt={vehicleA.name}
              brandName={vehicleA.brandName}
              modelName={vehicleA.name}
              bodyType={vehicleA.bodyType}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">{vehicleA.brandName}</span>
            <h2 className="text-2xl font-black text-white">{vehicleA.name}</h2>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 block pt-1">
              {formatPkr(vehicleA.startingPricePkr)}
            </span>
          </div>
        </div>

        {/* Vehicle B Card */}
        <div className="editorial-panel rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="aspect-video relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <VehicleFallbackImage
              src={vehicleB.imageUrl}
              alt={vehicleB.name}
              brandName={vehicleB.brandName}
              modelName={vehicleB.name}
              bodyType={vehicleB.bodyType}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">{vehicleB.brandName}</span>
            <h2 className="text-2xl font-black text-white">{vehicleB.name}</h2>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 block pt-1">
              {formatPkr(vehicleB.startingPricePkr)}
            </span>
          </div>
        </div>
      </div>

      {/* Factual Verdict Summary Block */}
      <AnswerFirstSummary
        answer={`In this comparison between ${vehicleA.name} and ${vehicleB.name}, the ${rangeWinner} offers superior driving range (${Math.max(vehicleA.maxRangeKm, vehicleB.maxRangeKm)} km WLTP), while the ${priceWinner} delivers the lower starting price point (${formatPkr(Math.min(vehicleA.startingPricePkr, vehicleB.startingPricePkr))}).`}
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Comparison Engine"
      />

      {/* Where Each Vehicle Wins Breakdown */}
      <div className="editorial-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-2xl font-black text-white border-b border-slate-800 pb-4">
          Where Each Vehicle Wins
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-blue-400">{vehicleA.name} Advantages</h3>
            <ul className="space-y-2 text-slate-300">
              {vehicleA.maxRangeKm >= vehicleB.maxRangeKm && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Longer WLTP Range ({vehicleA.maxRangeKm} km vs {vehicleB.maxRangeKm} km)</span>
                </li>
              )}
              {varA.batteryCapacityKwh >= varB.batteryCapacityKwh && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Larger Battery Pack ({varA.batteryCapacityKwh} kWh vs {varB.batteryCapacityKwh} kWh)</span>
                </li>
              )}
              {vehicleA.startingPricePkr <= vehicleB.startingPricePkr && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Lower Starting Price ({formatPkr(vehicleA.startingPricePkr)})</span>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-cyan-400">{vehicleB.name} Advantages</h3>
            <ul className="space-y-2 text-slate-300">
              {vehicleB.maxRangeKm > vehicleA.maxRangeKm && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Longer WLTP Range ({vehicleB.maxRangeKm} km vs {vehicleA.maxRangeKm} km)</span>
                </li>
              )}
              {varB.fastChargeKw >= varA.fastChargeKw && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Faster Peak DC Charging ({varB.fastChargeKw} kW vs {varA.fastChargeKw} kW)</span>
                </li>
              )}
              {vehicleB.startingPricePkr < vehicleA.startingPricePkr && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Lower Starting Price ({formatPkr(vehicleB.startingPricePkr)})</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
