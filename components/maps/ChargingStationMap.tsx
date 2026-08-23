'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ChargingStation } from '@/lib/data/mock-db';
import { Loader2 } from 'lucide-react';

const LeafletMapInner = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-500">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
      <span className="text-sm font-semibold">Loading Interactive EV Charging Map...</span>
    </div>
  ),
});

interface ChargingStationMapProps {
  stations: ChargingStation[];
  center?: [number, number];
  zoom?: number;
}

export default function ChargingStationMap({
  stations,
  center,
  zoom,
}: ChargingStationMapProps) {
  return <LeafletMapInner stations={stations} center={center} zoom={zoom} />;
}
