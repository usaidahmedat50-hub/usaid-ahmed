'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChargingStation } from '@/types/station';
import { Navigation, Zap, ExternalLink, ShieldCheck } from 'lucide-react';

interface RouteStop {
  station: ChargingStation;
  distanceFromOriginKm: number;
  arrivalBatteryPct: number;
  chargeTimeMins: number;
  topUpKwh: number;
  costPkr: number;
}

interface RouteMapInnerProps {
  polyline: [number, number][];
  origin: { displayName: string; lat: number; lng: number };
  destination: { displayName: string; lat: number; lng: number };
  chargingStops: RouteStop[];
}

// Map Auto-Fitter to adjust zoom bounds to fit full polyline and markers
function MapAutoFit({ polyline }: { polyline: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (polyline && polyline.length > 0) {
      const bounds = L.latLngBounds(polyline);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [polyline, map]);

  return null;
}

export default function RouteMapInner({
  polyline,
  origin,
  destination,
  chargingStops,
}: RouteMapInnerProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Origin Icon (Green Start Marker)
  const originIcon = L.divIcon({
    className: 'custom-origin-marker',
    html: `<div style="background-color: #10b981; border: 3px solid #ffffff; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 10 20-10-4-10 4Z"/></svg>
          </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

  // Destination Icon (Red End Marker)
  const destIcon = L.divIcon({
    className: 'custom-dest-marker',
    html: `<div style="background-color: #ef4444; border: 3px solid #ffffff; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
          </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

  // Charging Stop Icon (Orange Bolt Marker with Pulse effect)
  const stopIcon = L.divIcon({
    className: 'custom-stop-marker',
    html: `<div style="background-color: #f59e0b; border: 3px solid #ffffff; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.5); animation: pulse 2s infinite;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  const centerLat = (origin.lat + destination.lat) / 2;
  const centerLng = (origin.lng + destination.lng) / 2;

  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapAutoFit polyline={polyline} />

        {/* Road Polyline */}
        <Polyline
          positions={polyline}
          pathOptions={{
            color: '#2563eb',
            weight: 5,
            opacity: 0.8,
            dashArray: '1, 2',
          }}
        />

        {/* Origin Marker */}
        <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
          <Popup>
            <div className="p-1 text-xs">
              <span className="font-extrabold text-emerald-700 uppercase block mb-1">
                Departure Point
              </span>
              <h4 className="font-bold text-slate-900">{origin.displayName}</h4>
            </div>
          </Popup>
        </Marker>

        {/* Charging Stop Markers */}
        {chargingStops.map((stop, idx) => (
          <Marker
            key={idx}
            position={[stop.station.lat, stop.station.lng]}
            icon={stopIcon}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1.5 max-w-xs space-y-2 text-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-600 stroke-none" />
                    Charging Stop #{idx + 1}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {stop.distanceFromOriginKm} km mark
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {stop.station.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {stop.station.address}
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1.5 border border-slate-200">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Arrive Battery:</span>
                    <span className="font-extrabold text-blue-700">{stop.arrivalBatteryPct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Fast Charge:</span>
                    <span className="font-extrabold text-emerald-700">
                      +{Math.round(stop.topUpKwh)} kWh ({stop.chargeTimeMins} mins)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-600">Cost:</span>
                    <span className="font-extrabold text-slate-900">PKR {stop.costPkr}</span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${stop.station.lat},${stop.station.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 fill-white stroke-none" />
                  Navigate to Charger
                  <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Destination Marker */}
        <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
          <Popup>
            <div className="p-1 text-xs">
              <span className="font-extrabold text-red-600 uppercase block mb-1">
                Final Destination
              </span>
              <h4 className="font-bold text-slate-900">{destination.displayName}</h4>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
