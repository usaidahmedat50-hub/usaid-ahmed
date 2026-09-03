import React from 'react';
import Link from 'next/link';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import { getAllChargingStations } from '@/lib/data/mock-db';
import { Zap, MapPin, ShieldCheck, Fuel, ArrowRight, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'EV Charging Stations Directory in Pakistan — Karachi, Lahore, Islamabad',
  description: 'Find active DC fast charging stations, CCS2 / Type 2 / GB/T connectors, charging tariffs, and operator locations across Pakistan.',
};

export default function ChargingStationsPage() {
  const stations = getAllChargingStations();

  const cities = [
    { slug: 'karachi', name: 'Karachi', count: 28, province: 'Sindh' },
    { slug: 'lahore', name: 'Lahore', count: 35, province: 'Punjab' },
    { slug: 'islamabad', name: 'Islamabad', count: 22, province: 'Capital Territory' },
    { slug: 'rawalpindi', name: 'Rawalpindi', count: 16, province: 'Punjab' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-white">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Public Charging Infrastructure</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          EV Charging Station Directory in Pakistan
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Locate verified DC fast charging stations, CCS2 & GB/T connector ports, charging tariffs per kWh, and motorway charging hubs across Pakistan.
        </p>
      </div>

      <AnswerFirstSummary
        answer="Pakistan currently has over 101 operational public EV charging stations across Karachi, Lahore, Islamabad, and M-2 Motorway rest stops. Public DC fast charging rates range between PKR 70 and PKR 110 per kWh depending on charging speed (30 kW to 180 kW CCS2 / GB/T)."
        verifiedDate="Feb 2026"
        sourceName="PakEVFinder Charging Infrastructure Registry"
      />

      {/* City Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/charging-stations/${city.slug}`}
            className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl transition-all space-y-2 group"
          >
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-400 uppercase tracking-wider">{city.province}</span>
              <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full text-[10px]">
                {city.count} Hubs
              </span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
              <span>{city.name}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h3>
          </Link>
        ))}
      </div>

      {/* Featured Stations Registry List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-white">Verified Charging Hub Registry</h2>
          <span className="text-xs text-slate-400 font-medium">Updated Feb 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stations.map((st) => (
            <div key={st.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{st.operator}</span>
                  <h3 className="text-base font-bold text-white">{st.name}</h3>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                  {st.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{st.address}, {st.cityName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Connectors</span>
                  <span className="font-bold text-blue-400">{st.connectors.join(', ')}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Tariff Rate</span>
                  <span className="font-bold text-emerald-400">PKR {st.pricePerKwh} / kWh</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
