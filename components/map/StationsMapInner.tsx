'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChargingStation } from '@/types/station';
import { Zap, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';

interface StationsMapInnerProps {
  stations: ChargingStation[];
  center?: [number, number];
  zoom?: number;
}

export default function StationsMapInner({
  stations,
  center = [30.3753, 69.3451], // Center of Pakistan
  zoom = 6,
}: StationsMapInnerProps) {
  useEffect(() => {
    // Fix default marker icon issue in Leaflet with Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Marker creation based on charger speed (Green for >= 60 kW DC, Blue for AC/Slow)
  const createEvIcon = (maxPowerKw: number) => {
    const isFast = maxPowerKw >= 60;
    const bgColor = isFast ? '#10b981' : '#2563eb'; // Green vs Blue

    return L.divIcon({
      className: 'custom-station-marker',
      html: `<div style="background-color: ${bgColor}; border: 2.5px solid #ffffff; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((st) => (
          <Marker
            key={st.id}
            position={[st.lat, st.lng]}
            icon={createEvIcon(st.maxPowerKw)}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1.5 max-w-xs text-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-blue-600 stroke-none" />
                    {st.network}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    st.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {st.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {st.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">{st.address}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1.5 border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-600">Max Charging Power:</span>
                    <span className="font-extrabold text-emerald-700">{st.maxPowerKw} kW DC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-600">Connectors:</span>
                    <span className="font-bold text-slate-800">
                      {st.connectors.map((c) => `${c.count}x ${c.type}`).join(' | ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-600">Rate:</span>
                    <span className="font-extrabold text-slate-900">PKR {st.pricePerKwh} / kWh</span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${st.lat},${st.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 fill-white stroke-none" />
                  Navigate in Google Maps
                  <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
