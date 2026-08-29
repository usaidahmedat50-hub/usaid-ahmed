'use client';

import React, { useState } from 'react';
import StationsMap from '@/components/map/StationsMap';
import AnswerFirstSummary from '@/components/seo/AnswerFirstSummary';
import SchemaScript, { createBreadcrumbSchema } from '@/components/seo/SchemaScript';
import stationsData from '@/lib/data/stations.json';
import { ChargingStation, ConnectorType } from '@/types/station';
import { Zap, MapPin, Navigation, ExternalLink, Filter, Search } from 'lucide-react';

export default function ChargingStationsPage() {
  const allStations: ChargingStation[] = stationsData as ChargingStation[];

  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [motorwayFilter, setMotorwayFilter] = useState<string>('All');
  const [connectorFilter, setConnectorFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cities = ['All', 'Bhera', 'Kallar Kahar', 'Sukheki', 'Nooriabad', 'Zahir Pir', 'Karachi', 'Lahore', 'Islamabad'];

  const filteredStations = allStations.filter((station) => {
    // City filter
    if (selectedCity !== 'All' && station.city !== selectedCity) return false;

    // Motorway filter
    if (motorwayFilter === 'MotorwaysOnly' && !station.isMotorway) return false;
    if (motorwayFilter === 'M-2' && station.motorwayName !== 'M-2') return false;
    if (motorwayFilter === 'M-9' && station.motorwayName !== 'M-9') return false;
    if (motorwayFilter === 'M-5' && station.motorwayName !== 'M-5') return false;

    // Connector filter
    if (connectorFilter !== 'All') {
      const hasType = station.connectors.some((c) => c.type === connectorFilter);
      if (!hasType) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = station.name.toLowerCase().includes(q);
      const matchCity = station.city.toLowerCase().includes(q);
      const matchNetwork = station.network.toLowerCase().includes(q);
      const matchAddr = station.address.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchNetwork && !matchAddr) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SchemaScript
        schemaData={createBreadcrumbSchema([
          { name: 'Home', url: 'https://pakevfinder.com' },
          { name: 'EV Charging Stations Map', url: 'https://pakevfinder.com/charging-stations' },
        ])}
      />

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
          {allStations.length} Live Operational EV Stations in Pakistan
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Interactive EV Charging Stations Map
        </h1>

        <p className="text-slate-600 text-sm sm:text-base font-medium max-w-3xl leading-relaxed">
          Locate 60kW to 160kW DC fast charging stations across M-2, M-9, M-5 motorways, Karachi, Lahore, and Islamabad with live connector types (CCS2, GB/T, Type 2) and pricing.
        </p>

        <AnswerFirstSummary
          answer="Pakistan's primary EV charging highway network covers the M-2 Motorway (Bhera, Kallar Kahar, Sukheki up to 120 kW DC), M-9 Motorway (Nooriabad 60 kW DC), and M-5 Motorway (Zahir Pir 60 kW DC), supported by urban high-power hubs in Karachi (Clifton/DHA), Lahore (Gulberg/DHA), and Islamabad (F-7/Blue Area)."
          verifiedDate="August 2026"
          sourceName="PakEVFinder Highway Network Map"
        />
      </div>

      {/* Filter Control Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
            <Filter className="w-4 h-4 text-blue-600" />
            Filter Stations
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bhera, Karachi, CCS2..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
          {/* Motorway Filter Chips */}
          <div className="space-y-1.5">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Corridor Filter:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'All Locations', value: 'All' },
                { label: 'Motorways Only', value: 'MotorwaysOnly' },
                { label: 'M-2', value: 'M-2' },
                { label: 'M-9', value: 'M-9' },
                { label: 'M-5', value: 'M-5' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setMotorwayFilter(item.value)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    motorwayFilter === item.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Connector Filter */}
          <div className="space-y-1.5">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Connector Type:</span>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'CCS2', 'GB/T', 'Type 2'].map((type) => (
                <button
                  key={type}
                  onClick={() => setConnectorFilter(type)}
                  className={`px-3 py-1.5 rounded-lg border transition-all ${
                    connectorFilter === type
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* City Selection Dropdown */}
          <div className="space-y-1.5">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">City / Region:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-sm"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Cities & Motorway Hubs' : city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Live Map ({filteredStations.length} Stations Found)
          </h2>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              60kW+ Fast DC
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
              AC / Standard
            </div>
          </div>
        </div>

        <StationsMap stations={filteredStations} />
      </div>

      {/* Searchable Station Directory List below Map */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-xl font-black text-slate-900">
          Station Directory Listing ({filteredStations.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStations.map((st) => (
            <div
              key={st.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-blue-600 stroke-none" />
                    {st.network}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    st.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {st.status}
                  </span>
                </div>

                <h3 className="font-black text-base text-slate-900 leading-snug">
                  {st.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-normal">
                  {st.address}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 uppercase block">Max Speed</span>
                    <span className="font-extrabold text-emerald-700">{st.maxPowerKw} kW DC</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-slate-500 uppercase block">Rate / kWh</span>
                    <span className="font-extrabold text-slate-900">PKR {st.pricePerKwh}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 font-semibold flex items-center justify-between">
                  <span>Connectors:</span>
                  <span className="text-slate-900 font-bold">
                    {st.connectors.map((c) => `${c.count}x ${c.type}`).join(', ')}
                  </span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${st.lat},${st.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200"
                >
                  <Navigation className="w-3.5 h-3.5 fill-blue-600 hover:fill-white stroke-none" />
                  Open in Google Maps
                  <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
