'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChargingStation } from '@/lib/data/mock-db';
import { Zap, Navigation } from 'lucide-react';

interface LeafletMapInnerProps {
  stations: ChargingStation[];
  center?: [number, number];
  zoom?: number;
}

export default function LeafletMapInner({
  stations,
  center = [30.3753, 69.3451], // Center of Pakistan
  zoom = 6,
}: LeafletMapInnerProps) {
  useEffect(() => {
    // Fix default marker icon issue in Leaflet with Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Custom cobalt blue EV marker
  const customEvIcon = L.divIcon({
    className: 'custom-ev-marker',
    html: `<div style="background-color: #2563eb; border: 2.5px solid #ffffff; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25);">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
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
            position={[st.latitude, st.longitude]}
            icon={customEvIcon}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 max-w-xs text-slate-900">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                  <Zap className="w-3.5 h-3.5 fill-blue-600 stroke-none" />
                  {st.operator}
                </div>
                <h4 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                  {st.name}
                </h4>
                <p className="text-xs text-slate-600 mb-2">{st.address}</p>
                <div className="bg-slate-50 p-2 rounded-lg text-xs space-y-1 mb-2 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Max Speed:</span>
                    <span className="font-bold text-blue-700">{st.maxPowerKw} kW DC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Connectors:</span>
                    <span className="font-medium">{st.ccs2Ports}x CCS2 | {st.gbtPorts}x GB/T</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Rate:</span>
                    <span className="font-bold text-slate-900">PKR {st.pricingPerUnitPkr || 85} / kWh</span>
                  </div>
                </div>
                {st.googleMapsUrl && (
                  <a
                    href={st.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg w-full justify-center transition-colors shadow-sm"
                  >
                    <Navigation className="w-3 h-3" /> Get Directions
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
