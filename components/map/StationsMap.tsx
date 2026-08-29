'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ChargingStation } from '@/types/station';
import { Loader2 } from 'lucide-react';

const StationsMapInner = dynamic(() => import('./StationsMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-500">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
      <span className="text-sm font-semibold">Loading Interactive EV Charging Stations Map...</span>
    </div>
  ),
});

interface StationsMapProps {
  stations: ChargingStation[];
  center?: [number, number];
  zoom?: number;
}

export default function StationsMap({
  stations,
  center,
  zoom,
}: StationsMapProps) {
  return <StationsMapInner stations={stations} center={center} zoom={zoom} />;
}
