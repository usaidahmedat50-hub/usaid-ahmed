import React from 'react';
import type { Metadata } from 'next';
import { getAllVehicles } from '@/lib/vehicles';
import { RoutePlannerWidget } from '@/components/route-planner/RoutePlannerWidget';

export const metadata: Metadata = {
  title: 'Pakistan EV Highway Route Planner & Range Calculator — PakEVFinder',
  description:
    'Plan your intercity electric car journey across Pakistan (Lahore to Islamabad, Karachi, Multan, Sukkur). Calculate battery consumption, motorway charging stops, and feasibility.',
  alternates: {
    canonical: 'https://pakevfinder.com/route-planner',
  },
};

export const revalidate = 3600;

export default async function RoutePlannerPage() {
  const vehicles = await getAllVehicles();

  return (
    <main className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-100">
      <RoutePlannerWidget vehicles={vehicles} />
    </main>
  );
}
