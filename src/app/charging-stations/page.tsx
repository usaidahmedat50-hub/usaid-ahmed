import React from 'react';
import type { Metadata } from 'next';
import { getAllChargingStations } from '@/lib/stations';
import { ChargingStationDirectoryClient } from '@/components/stations/ChargingStationDirectoryClient';

export const metadata: Metadata = {
  title: 'EV Charging Stations Map in Pakistan (Fast DC & AC) — PakEVFinder',
  description:
    'Find and navigate electric vehicle charging stations across Pakistan and motorway corridors (M-1, M-2, M-3, M-5, M-9). Filter by CCS2, GB/T, and DC fast charging power (kW).',
  alternates: {
    canonical: 'https://pakevfinder.com/charging-stations',
  },
};

export const revalidate = 3600; // ISR 1 hour

export default async function ChargingStationsPage() {
  const stations = await getAllChargingStations();

  return <ChargingStationDirectoryClient initialStations={stations} />;
}
