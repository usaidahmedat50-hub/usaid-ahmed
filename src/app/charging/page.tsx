import React from 'react';
import type { Metadata } from 'next';
import { getAllChargingStations } from '@/lib/stations';
import { ChargingStationDirectoryClient } from '@/components/stations/ChargingStationDirectoryClient';

export const metadata: Metadata = {
  title: '115+ EV Charging Stations in Pakistan (Motorway DC & Urban Hubs) — PakEVFinder',
  description:
    'Explore 115+ verified electric vehicle charging stations across Pakistan. Filter by Ultra-Fast DC (120-240 kW), CCS2, GB/T, public hubs, and home hosts along M-1, M-2, M-4, M-5, and M-9.',
  alternates: {
    canonical: 'https://pakevfinder.com/charging',
  },
};

export const revalidate = 3600; // ISR 1 hour

export default async function ChargingPage() {
  const stations = await getAllChargingStations();

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Map',
    name: 'Pakistan EV Charging Stations Network',
    description: 'Verified map of 115+ DC Fast Chargers and AC points across Pakistan motorways and urban hubs.',
    url: 'https://pakevfinder.com/charging',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChargingStationDirectoryClient initialStations={stations} />
    </>
  );
}
