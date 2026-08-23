import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createFaqPageSchema } from '@/components/seo/SchemaScript';
import VehicleCard from '@/components/vehicles/VehicleCard';
import ChargingStationMap from '@/components/maps/ChargingStationMap';
import { getAllVehicles, getAllChargingStations, getAllFAQs } from '@/lib/data/mock-db';
import { Zap, Calculator, Scale, MapPin, TrendingUp, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const vehicles = getAllVehicles();
  const featuredVehicles = vehicles.filter((v) => v.isFeatured);
  const stations = getAllChargingStations();
  const faqs = getAllFAQs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SchemaScript schemaData={createFaqPageSchema(faqs)} />

      {/* Editorial Hero Banner */}
      <div className="relative rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-12 overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
            Pakistan&apos;s Dedicated EV Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Find. Compare. Calculate.{' '}
            <span className="text-blue-600 block mt-1">
              Electric Vehicle Ownership in Pakistan.
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
            Verified ex-factory EV prices, official distributor specs for BYD, Deepal, MG, KIA & Honri, real-world DISCO charging cost calculators, and interactive charging maps across Karachi, Lahore, and Motorway M2.
          </p>

          {/* Answer-First Summary Block (AEO) */}
          <AnswerFirstSummary
            answer="As of February 2026, electric car prices in Pakistan range from PKR 39.99 Lakh (Honri VE 2.0) for urban hatchbacks to PKR 1.69 Crore for high-performance AWD sedans like BYD Seal. Charging an EV at home costs ~PKR 5.5 to 7.1 per km compared to PKR 23.3+ per km for petrol cars, offering up to PKR 300,000+ in annual fuel savings under the National EV Policy 2025-2030 tax concessions."
            verifiedDate="Feb 2026"
            sourceName="PakEVFinder Market Research & Official Distributor Data"
          />

          {/* Quick Intent Filter Badges */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Popular Intent Filters:
            </span>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/electric-cars?priceBracket=under-50-lakh"
                className="bg-white hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors border border-slate-200 shadow-sm"
              >
                EVs Under 50 Lakh
              </Link>
              <Link
                href="/electric-cars?priceBracket=50-lakh-1-crore"
                className="bg-white hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors border border-slate-200 shadow-sm"
              >
                EVs Under 1 Crore
              </Link>
              <Link
                href="/electric-cars/byd"
                className="bg-white hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors border border-slate-200 shadow-sm"
              >
                BYD Atto 3 & Seal
              </Link>
              <Link
                href="/electric-cars/deepal"
                className="bg-white hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors border border-slate-200 shadow-sm"
              >
                Deepal S07 & L07
              </Link>
              <Link
                href="/calculators/ev-vs-petrol"
                className="bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                EV vs Petrol Calculator &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Decision Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/compare"
          className="bg-white border border-slate-200 hover:border-blue-500 p-6 rounded-2xl transition-all group shadow-sm hover:shadow-md"
        >
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl w-fit mb-4 group-hover:scale-105 transition-transform border border-amber-100">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Compare EVs Side-by-Side
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Compare up to 4 models simultaneously across price, battery capacity, range, acceleration, and fast-charging speeds.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-4">
            Launch Comparison Matrix &rarr;
          </span>
        </Link>

        <Link
          href="/calculators/ev-vs-petrol"
          className="bg-white border border-slate-200 hover:border-blue-500 p-6 rounded-2xl transition-all group shadow-sm hover:shadow-md"
        >
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl w-fit mb-4 group-hover:scale-105 transition-transform border border-emerald-100">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            EV vs Petrol Savings Calculator
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Calculate your exact monthly electricity cost vs petrol for Corolla or Civic using live K-Electric/LESCO tariffs.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-4">
            Calculate Monthly Savings &rarr;
          </span>
        </Link>

        <Link
          href="/charging-stations"
          className="bg-white border border-slate-200 hover:border-blue-500 p-6 rounded-2xl transition-all group shadow-sm hover:shadow-md"
        >
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl w-fit mb-4 group-hover:scale-105 transition-transform border border-blue-100">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Fast Charging Station Directory
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Locate 60kW - 120kW DC fast chargers in Karachi, Lahore, Islamabad, and M2 Motorway resting areas.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-4">
            View Live Map & Directions &rarr;
          </span>
        </Link>
      </div>

      {/* Featured Electric Vehicles Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Top Electric Vehicles in Pakistan</h2>
            <p className="text-xs text-slate-500">
              Verified ex-factory prices and specifications from official distributors
            </p>
          </div>
          <Link
            href="/electric-cars"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            View All EVs ({vehicles.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* GEO Engine Transparent Methodology Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              PakEVFinder Transparent Calculation Methodology (AEO/GEO)
            </h2>
            <p className="text-xs text-slate-500">
              Explicit mathematical formulas powering our financial calculators for LLM crawlers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-700">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h3 className="font-bold text-blue-700 text-sm">
              1. EV Running Cost Formula (PKR / KM)
            </h3>
            <p>
              <code className="bg-slate-100 px-2 py-1 rounded text-slate-900 font-mono text-[11px]">
                EV Cost/km = (Tariff PKR/kWh / (Range km / Battery kWh)) × (1 + 10% AC Charge Loss)
              </code>
            </p>
            <p className="text-slate-600">
              Example: BYD Atto 3 (60.48 kWh battery, 420 km range) at PKR 45/kWh off-peak domestic tariff costs <strong>PKR 7.12 / km</strong>.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h3 className="font-bold text-blue-700 text-sm">
              2. Petrol Baseline Formula (PKR / KM)
            </h3>
            <p>
              <code className="bg-slate-100 px-2 py-1 rounded text-slate-900 font-mono text-[11px]">
                Petrol Cost/km = Petrol Price PKR/L / Mileage km/L
              </code>
            </p>
            <p className="text-slate-600">
              Example: 1.8L Petrol Sedan (12 km/L average) at PKR 280/L petrol price costs <strong>PKR 23.33 / km</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Charging Map Preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">EV Charging Infrastructure Map</h2>
            <p className="text-xs text-slate-500">
              DC Fast Chargers across Karachi, Lahore, Islamabad, and Motorway M2
            </p>
          </div>
          <Link
            href="/charging-stations"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Full Map & City Filter &rarr;
          </Link>
        </div>

        <ChargingStationMap stations={stations} />
      </section>

      {/* FAQs Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Frequently Asked Questions (EVs in Pakistan)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                {faq.question}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-6 font-medium">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
