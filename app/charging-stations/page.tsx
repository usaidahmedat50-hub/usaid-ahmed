import React from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import ChargingStationMap from '@/components/maps/ChargingStationMap';
import { getAllChargingStations } from '@/lib/data/mock-db';
import { Navigation } from 'lucide-react';
import Link from 'next/link';

export default function ChargingStationsMainPage() {
  const stations = getAllChargingStations();

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Charging Stations', url: 'https://pakevfinder.com/charging-stations' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          EV Fast Charging Stations Directory in Pakistan
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Interactive map and directory of 60kW to 120kW DC fast chargers across Karachi, Lahore, Islamabad, and M2 Motorway.
        </p>
      </div>

      {/* AEO Summary */}
      <AnswerFirstSummary
        answer="Pakistan currently has over 40+ operational public EV charging stations. Key fast-charging hubs include BYD Mega Motors in Clifton Karachi, Master Changan Deepal station on MM Alam Road Lahore, Tesla Industries in F-7 Islamabad, and NHA Rest Areas on the M2 Motorway (Bhera & Sukheki) featuring CCS2 and GB/T 120kW DC chargers."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Public Charger Mapping Registry"
      />

      {/* City Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Filter By Location:
        </span>
        <Link
          href="/charging-stations/karachi"
          className="bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-xs font-bold text-slate-800 px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          Karachi Chargers (Clifton & DHA)
        </Link>
        <Link
          href="/charging-stations/lahore"
          className="bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-xs font-bold text-slate-800 px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          Lahore Chargers (Gulberg & DHA)
        </Link>
        <Link
          href="/charging-stations/islamabad"
          className="bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-xs font-bold text-slate-800 px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          Islamabad Chargers (F-7 Markaz)
        </Link>
        <Link
          href="/charging-stations/m2-motorway"
          className="bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-xs font-bold text-slate-800 px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          M2 Motorway Rest Areas
        </Link>
      </div>

      {/* Map Renderer */}
      <ChargingStationMap stations={stations} />

      {/* Stations List Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">All Operational Charging Hubs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((st) => (
            <div
              key={st.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-blue-500/50 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  {st.operator}
                </span>
                <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-semibold border border-slate-200">
                  {st.city}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{st.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{st.address}</p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Max Charging Speed:</span>
                  <span className="font-bold text-blue-700">{st.maxPowerKw} kW DC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Supported Ports:</span>
                  <span className="font-semibold text-slate-800">
                    {st.ccs2Ports > 0 && `${st.ccs2Ports}x CCS2 `}
                    {st.gbtPorts > 0 && `${st.gbtPorts}x GB/T`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Commercial Tariff:</span>
                  <span className="font-bold text-slate-900">
                    PKR {st.pricingPerUnitPkr || 85} / kWh
                  </span>
                </div>
              </div>

              {st.googleMapsUrl && (
                <a
                  href={st.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl w-full transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" /> Navigate on Google Maps
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
