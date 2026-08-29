'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ChargingStation } from '@/types/station';
import { Loader2 } from 'lucide-react';

interface RouteStop {
  station: ChargingStation;
  distanceFromOriginKm: number;
  arrivalBatteryPct: number;
  chargeTimeMins: number;
  topUpKwh: number;
  costPkr: number;
}

interface RouteMapProps {
  polyline: [number, number][];
  origin: { displayName: string; lat: number; lng: number };
  destination: { displayName: string; lat: number; lng: number };
  chargingStops: RouteStop[];
}

const RouteMapInner = dynamic(() => import('./RouteMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-500">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
      <span className="text-sm font-semibold">Generating Interactive Road Route Map...</span>
    </div>
  ),
});

export default function RouteMap({
  polyline,
  origin,
  destination,
  chargingStops,
}: RouteMapProps) {
  return (
    <RouteMapInner
      polyline={polyline}
      origin={origin}
      destination={destination}
      chargingStops={chargingStops}
    />
  );
}
