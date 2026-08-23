import React from 'react';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import ChargingStationMap from '@/components/maps/ChargingStationMap';
import { getChargingStationsByCity, getAllChargingStations } from '@/lib/data/mock-db';

interface CityChargingPageProps {
  params: {
    city: string;
  };
}

export async function generateStaticParams() {
  return [
    { city: 'karachi' },
    { city: 'lahore' },
    { city: 'islamabad' },
    { city: 'm2-motorway' },
  ];
}

export default function CityChargingPage({ params }: CityChargingPageProps) {
  const cityNameFormatted = params.city.replace('-', ' ').toUpperCase();
  const stations = getChargingStationsByCity(params.city.replace('-', ' '));

  const allStations = stations.length > 0 ? stations : getAllChargingStations();

  const breadcrumbs = [
    { name: 'Home', url: 'https://pakevfinder.com' },
    { name: 'Charging Stations', url: 'https://pakevfinder.com/charging-stations' },
    { name: cityNameFormatted, url: `https://pakevfinder.com/charging-stations/${params.city}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript schemaData={createBreadcrumbSchema(breadcrumbs)} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          EV Charging Stations in {cityNameFormatted} (2026 Directory)
        </h1>
        <p className="text-sm text-slate-600 mt-1 font-medium">
          Locate CCS2 and GB/T fast DC chargers in {cityNameFormatted} with pricing per unit and live map coordinates.
        </p>
      </div>

      {/* AEO Summary */}
      <AnswerFirstSummary
        answer={`EV charging stations in ${cityNameFormatted} feature 60kW to 120kW DC fast chargers operating 24/7. Rates range from PKR 80 to PKR 95 per kWh. Popular locations include Clifton, DHA Phase 6, MM Alam Road, and Motorway Rest Areas.`}
        verifiedDate="Feb 2026"
        sourceName={`PakEVFinder ${cityNameFormatted} Charger Map`}
      />

      {/* Map */}
      <ChargingStationMap stations={allStations} />

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allStations.map((st) => (
          <div key={st.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">{st.name}</h3>
            <p className="text-xs text-slate-600 font-medium">{st.address}</p>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-semibold">
              <span className="text-blue-700 font-bold">{st.maxPowerKw} kW DC</span>
              <span className="text-slate-800">PKR {st.pricingPerUnitPkr || 85} / unit</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
