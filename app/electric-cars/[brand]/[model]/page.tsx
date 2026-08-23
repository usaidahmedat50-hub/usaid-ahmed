import React from 'react';
import { notFound } from 'next/navigation';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, {
  createVehicleProductSchema,
  createBreadcrumbSchema,
} from '@/components/seo/SchemaScript';
import VehicleFallbackImage from '@/components/vehicles/VehicleFallbackImage';
import { getVehicleBySlug, getAllVehicles } from '@/lib/data/mock-db';
import { formatPkr } from '@/lib/utils/format';
import { calculateEvVsPetrol } from '@/lib/calculators/ev-vs-petrol';
import {
  Zap,
  Battery,
  Gauge,
  Clock,
  FileSpreadsheet,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

interface VehicleDetailPageProps {
  params: {
    brand: string;
    model: string;
  };
}

export async function generateStaticParams() {
  const vehicles = getAllVehicles();
  return vehicles.map((v) => ({
    brand: v.brandSlug,
    model: v.slug,
  }));
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const vehicle = getVehicleBySlug(params.model);

  if (!vehicle) {
    notFound();
  }

  const defaultVariant = vehicle.variants[0];

  const calcResult = calculateEvVsPetrol({
    monthlyKm: 1500,
    evBatteryKwh: defaultVariant.batteryCapacityKwh,
    evRangeKm: vehicle.maxRangeKm,
    electricityTariffPkr: 45,
    petrolPricePkr: 280,
    petrolMileageKml: 12,
  });

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Electric Cars', url: 'https://pakevfinder.com/electric-cars' },
    { name: vehicle.brandName, url: `https://pakevfinder.com/electric-cars/${vehicle.brandSlug}` },
    { name: vehicle.name, url: `https://pakevfinder.com/electric-cars/${vehicle.brandSlug}/${vehicle.slug}` },
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
              {vehicle.bodyType}
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Verified {vehicle.verifiedDate || 'Feb 2026'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Official Distributor: <strong className="text-slate-900">{vehicle.distributorName}</strong>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            {vehicle.name} Price in Pakistan & Specifications
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            {vehicle.description}
          </p>

          <div className="pt-2 flex items-baseline gap-3">
            <span className="text-slate-500 text-xs font-semibold">Ex-Factory Starting Price:</span>
            <span className="text-3xl font-black text-blue-700">
              {formatPkr(vehicle.startingPricePkr)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              href={`/compare?v1=${vehicle.slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-sm"
            >
              Compare {vehicle.name} &rarr;
            </Link>
            <Link
              href="/calculators/ev-vs-petrol"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-5 rounded-xl transition-all border border-slate-200"
            >
              Calculate Fuel Savings
            </Link>
          </div>
        </div>

        {/* 16:9 Image Container with Fallback */}
        <div className="lg:col-span-5 relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
          <VehicleFallbackImage
            src={vehicle.imageUrl}
            alt={`${vehicle.brandName} ${vehicle.name} - Electric Car Pakistan`}
            brandName={vehicle.brandName}
            modelName={vehicle.name}
            bodyType={vehicle.bodyType}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Answer-First Summary (AEO) */}
      <AnswerFirstSummary
        answer={`The ${vehicle.name} is available in Pakistan starting at ex-factory price ${formatPkr(
          vehicle.startingPricePkr
        )}, distributed officially by ${vehicle.distributorName}. It features a ${
          defaultVariant.batteryCapacityKwh
        } kWh battery delivering up to ${vehicle.maxRangeKm} km claimed range, 0-100 km/h in ${
          vehicle.accelerationSec
        } seconds, and ${defaultVariant.fastChargeKw} kW DC fast charging capabilities.`}
        verifiedDate="Feb 2026"
        sourceName={`${vehicle.distributorName} Verified Specification Sheet`}
      />

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm">
          <Battery className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <span className="text-xl font-bold text-slate-900 block">{vehicle.maxRangeKm} km</span>
          <span className="text-xs text-slate-500">Claimed Driving Range</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm">
          <Zap className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <span className="text-xl font-bold text-slate-900 block">{defaultVariant.batteryCapacityKwh} kWh</span>
          <span className="text-xs text-slate-500">Battery Pack Size</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm">
          <Gauge className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <span className="text-xl font-bold text-slate-900 block">{vehicle.accelerationSec}s</span>
          <span className="text-xs text-slate-500">0-100 km/h Acceleration</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm">
          <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <span className="text-xl font-bold text-slate-900 block">{defaultVariant.fastChargeTimeMin} min</span>
          <span className="text-xs text-slate-500">10-80% DC Fast Charge</span>
        </div>
      </div>

      {/* Variants & Technical Specifications */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Variant Specifications Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold">
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
                    {formatPkr(v.pricePkr)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Battery Pack</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.batteryCapacityKwh} kWh Usable
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Range (WLTP / NEDC)</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.wltpRangeKm ? `${v.wltpRangeKm} km WLTP` : `${v.nedcRangeKm} km NEDC`}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Motor Output</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.motorPowerHp} HP / {v.motorTorqueNm} Nm ({v.driveType})
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">DC Fast Charge Max</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.fastChargeKw} kW ({v.fastChargeTimeMin} mins 10-80%)
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Home AC Charge</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.acChargeKw} kW (~{v.acChargeTimeHours} hrs full)
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Seating & Boot Space</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-medium">
                    {v.seatingCapacity} Seats / {v.bootSpaceLiters} Liters
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50">Battery Warranty</td>
                {vehicle.variants.map((v) => (
                  <td key={v.id} className="p-4 font-semibold text-emerald-700">
                    {v.batteryWarrantyYears} Years / 160,000 KM
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Running Cost Calculator Live Snippet */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-blue-950">
          Estimated Running Cost for {vehicle.name} in Pakistan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 block mb-1">Per Kilometer Cost</span>
            <span className="text-2xl font-black text-blue-700">
              PKR {calcResult.evCostPerKm} / km
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              @ PKR 45/unit off-peak domestic tariff
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 block mb-1">Monthly Fuel Savings</span>
            <span className="text-2xl font-black text-amber-600">
              PKR {calcResult.monthlySavings.toLocaleString()} / mo
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Vs 1.8L petrol car (1,500 km monthly driving)
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 block mb-1">5-Year Fuel Savings</span>
            <span className="text-2xl font-black text-emerald-700">
              PKR {calcResult.fiveYearSavings.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Cumulative fuel expenditure saved
            </span>
          </div>
        </div>
      </div>

      {/* Verified Price History Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Verified Price History Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
                <th className="p-3">Verified Date</th>
                <th className="p-3">Price Type</th>
                <th className="p-3">Price (PKR)</th>
                <th className="p-3">Source Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {vehicle.priceHistory.map((ph, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-semibold text-blue-700">{ph.verifiedAt}</td>
                  <td className="p-3 font-medium">{ph.priceType}</td>
                  <td className="p-3 font-bold text-slate-900">{formatPkr(ph.pricePkr)}</td>
                  <td className="p-3 text-slate-600">{ph.sourceName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
