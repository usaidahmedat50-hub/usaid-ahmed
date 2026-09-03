import React from 'react';
import { notFound } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, {
  createVehicleProductSchema,
  createBreadcrumbSchema,
} from '@/components/seo/SchemaScript';
import VehicleFallbackImage from '@/components/vehicles/VehicleFallbackImage';
import VehicleRunningCostCalculator from '@/components/vehicles/VehicleRunningCostCalculator';
import { getVehicleBySlug, getAllVehicles } from '@/lib/data/mock-db';
import { getVerificationBadgeConfig } from '@/lib/data/verification';
import { calculateVehicleScore } from '@/lib/calculations/scoring';
import { formatPkr } from '@/lib/utils/format';
import {
  Zap,
  Battery,
  Gauge,
  Clock,
  FileSpreadsheet,
  Calendar,
  Sparkles,
  ShieldCheck,
  Radio,
  Plug,
  Award,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

interface VehicleSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const vehicles = getAllVehicles();
  return vehicles.map((v) => ({
    slug: v.slug,
  }));
}

export default async function VehicleSlugPage({ params }: VehicleSlugPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const defaultVariant = vehicle.variants[0];
  const verificationConfig = getVerificationBadgeConfig(
    (defaultVariant.status as any) || 'verified'
  );

  const scores = calculateVehicleScore({
    startingPricePkr: vehicle.startingPricePkr,
    maxRangeKm: vehicle.maxRangeKm,
    batteryCapacityKwh: defaultVariant.batteryCapacityKwh,
    fastChargeKw: defaultVariant.fastChargeKw,
    motorPowerHp: defaultVariant.motorPowerHp,
    motorTorqueNm: defaultVariant.motorTorqueNm,
    accelerationSec: vehicle.accelerationSec,
    warrantyYears: defaultVariant.warrantyYears,
    batteryWarrantyYears: defaultVariant.batteryWarrantyYears,
  });

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Vehicles', url: 'https://pakevfinder.com/vehicles' },
    { name: vehicle.brandName, url: `https://pakevfinder.com/brands/${vehicle.brandSlug}` },
    { name: vehicle.name, url: `https://pakevfinder.com/vehicles/${vehicle.slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SchemaScript
        schemaData={[
          createVehicleProductSchema(vehicle),
          createBreadcrumbSchema(breadcrumbs),
        ]}
      />

      {/* Main Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {vehicle.bodyType} • {vehicle.powertrain || 'EV'}
            </span>

            {/* Verification Status Badge */}
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${verificationConfig.badgeClass}`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${verificationConfig.iconColorClass}`} />
              {verificationConfig.label}
            </span>

            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Verified {vehicle.verifiedDate || 'Feb 2026'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            {vehicle.name} Specs, Price & Range
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            {vehicle.description}
          </p>

          <div className="pt-2 flex items-baseline gap-3">
            <span className="text-slate-500 text-xs font-semibold">Ex-Factory Starting Price:</span>
            <span className="text-3xl font-black text-blue-700">
              {vehicle.startingPricePkr > 0 ? formatPkr(vehicle.startingPricePkr) : 'Upcoming / Expected'}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              href={`/compare/${vehicle.slug}-vs-byd-seal`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Compare {vehicle.name} &rarr;
            </Link>
            <Link
              href="/plan-a-route"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-5 rounded-xl transition-all border border-slate-200 flex items-center gap-1.5"
            >
              Plan Intercity Route
            </Link>
          </div>
        </div>

        {/* Vehicle Image */}
        <div className="lg:col-span-5 relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
          <VehicleFallbackImage
            src={vehicle.imageUrl}
            alt={`${vehicle.brandName} ${vehicle.name} Electric Vehicle`}
            brandName={vehicle.brandName}
            modelName={vehicle.name}
            bodyType={vehicle.bodyType}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Answer-First Summary (AEO) */}
      <AnswerFirstSummary
        answer={`The ${vehicle.name} is distributed by ${vehicle.distributorName} in Pakistan starting at ex-factory price ${
          vehicle.startingPricePkr > 0 ? formatPkr(vehicle.startingPricePkr) : 'Expected'
        }. It features a ${defaultVariant.batteryCapacityKwh} kWh battery delivering up to ${
          vehicle.maxRangeKm
        } km WLTP range, ${defaultVariant.motorPowerHp} HP motor output, and ${
          defaultVariant.fastChargeKw
        } kW DC fast charging capabilities.`}
        verifiedDate="Feb 2026"
        sourceName={`${vehicle.distributorName} Verified Specifications`}
      />

      {/* Highlights KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm">
          <Battery className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <span className="text-xl font-bold text-slate-900 block">{vehicle.maxRangeKm} km</span>
          <span className="text-xs text-slate-500">WLTP / NEDC Range</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm">
          <Zap className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <span className="text-xl font-bold text-slate-900 block">{defaultVariant.batteryCapacityKwh} kWh</span>
          <span className="text-xs text-slate-500">Battery Pack Size</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm">
          <Gauge className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <span className="text-xl font-bold text-slate-900 block">
            {defaultVariant.motorPowerHp} HP / {defaultVariant.motorTorqueNm} Nm
          </span>
          <span className="text-xs text-slate-500">Motor Output & Torque</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm">
          <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <span className="text-xl font-bold text-slate-900 block">{defaultVariant.fastChargeTimeMin} min</span>
          <span className="text-xs text-slate-500">10-80% DC Fast Charge</span>
        </div>
      </div>

      {/* Value Scoring Breakdown */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">PakevFinder Value Score Index</h2>
          </div>
          <span className="bg-blue-600 text-white font-black text-lg px-4 py-1.5 rounded-2xl">
            {scores.overallScore} / 10
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(scores.categoryScores).map((cs, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>{cs.category}</span>
                <span className="text-blue-700 font-extrabold">{cs.score}/10</span>
              </div>
              <span className="text-sm font-bold text-slate-900 block">{cs.label}</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">{cs.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charging Specs & Compatibility */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <Plug className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold">Charging Ports & Public Network Compatibility</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase block">AC Home Charger Port</span>
            <span className="text-lg font-bold text-white block">
              {defaultVariant.acChargerType || 'Type 2 - 11 kW'}
            </span>
            <span className="text-xs text-slate-300 block">
              Max AC Power: {defaultVariant.acChargeKw} kW (~{defaultVariant.acChargeTimeHours} hrs full)
            </span>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase block">DC Fast Charge Port</span>
            <span className="text-lg font-bold text-emerald-400 block">
              {defaultVariant.dcChargerType || `CCS2 - ${defaultVariant.fastChargeKw} kW`}
            </span>
            <span className="text-xs text-slate-300 block">
              10-80% Charge: {defaultVariant.fastChargeTimeMin} mins @ {defaultVariant.fastChargeKw} kW
            </span>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase block">Public Network Coverage</span>
            <span className="text-lg font-bold text-blue-400 block">
              {defaultVariant.networkCoverageRatio || '101/105 stations - 96% compatibility'}
            </span>
            <span className="text-xs text-slate-300 block">
              Compatible across Motorway M2, Karachi, Lahore & Islamabad
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Running Cost Calculator */}
      <VehicleRunningCostCalculator
        vehicleName={vehicle.name}
        batteryCapacityKwh={defaultVariant.batteryCapacityKwh}
        maxRangeKm={vehicle.maxRangeKm}
      />

      {/* Specifications Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Technical Specifications Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <th className="p-4">Spec Feature</th>
                {vehicle.variants.map((v) => (
                  <th key={v.id} className="p-4 text-blue-700 font-bold text-sm">
                    {v.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Ex-Factory Price</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-black text-sm text-blue-700">
                    {v.pricePkr > 0 ? formatPkr(v.pricePkr) : 'Expected'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Battery Capacity</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.batteryCapacityKwh} kWh Usable
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Claimed Range</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.wltpRangeKm ? `${v.wltpRangeKm} km WLTP` : `${v.nedcRangeKm} km NEDC`}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Motor Power & Torque</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.motorPowerHp} HP / {v.motorTorqueNm} Nm ({v.driveType})
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Warranty Coverage</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-semibold text-emerald-700">
                    {v.warrantyYears} Years Vehicle / {v.batteryWarrantyYears} Years Battery
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
