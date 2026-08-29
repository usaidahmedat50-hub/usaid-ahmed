import React from 'react';
import RoutePlanner from '@/components/routes/RoutePlanner';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import vehiclesData from '@/lib/data/vehicles.json';
import stationsData from '@/lib/data/stations.json';
import { VehicleSpec } from '@/types/vehicle';
import { ChargingStation } from '@/types/station';
import { Navigation, ShieldCheck, MapPin } from 'lucide-react';

export default function PlanARoutePage() {
  const vehicles: VehicleSpec[] = vehiclesData as VehicleSpec[];
  const stations: ChargingStation[] = stationsData as ChargingStation[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript
        schemaData={createBreadcrumbSchema([
          { name: 'Home', url: 'https://pakevfinder.com' },
          { name: 'Intercity EV Route Planner', url: 'https://pakevfinder.com/plan-a-route' },
        ])}
      />

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Navigation className="w-4 h-4 text-blue-600 fill-blue-600" />
          Intercity EV Highway Route Planner
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Plan Your Intercity EV Journey Across Pakistan
        </h1>

        <p className="text-slate-600 text-sm sm:text-base font-medium max-w-3xl leading-relaxed">
          Simulate battery consumption, calculate exact motorway charging stops (M-2 Bhera, M-9 Nooriabad, M-5 Zahir Pir), required top-up kWh, charging duration, and PKR electricity costs.
        </p>

        <AnswerFirstSummary
          answer="Traveling intercity in an EV across Pakistan (Lahore to Islamabad M-2, Karachi to Hyderabad M-9, or Multan to Sukkur M-5) requires stopping at fast DC charging hubs located every 150-190 km. A 20-35 minute fast-charging session at M-2 Bhera Service Area provides enough range to reach Islamabad safely with 25%+ reserve battery."
          verifiedDate="August 2026"
          sourceName="PakEVFinder Route Intelligence"
        />
      </div>

      {/* Route Planner Tool Component */}
      <RoutePlanner vehicles={vehicles} stations={stations} />
    </div>
  );
}
