'use client';

import React, { useEffect, useRef } from 'react';
import { ChargingStation } from '@/lib/types';
import L from 'leaflet';

interface StationMapProps {
  stations: ChargingStation[];
  focusedStation?: ChargingStation | null;
  onSelectStation?: (station: ChargingStation) => void;
  onOpenDrawer?: (station: ChargingStation) => void;
  className?: string;
}

export function StationMap({
  stations,
  focusedStation,
  onSelectStation,
  onOpenDrawer,
  className = '',
}: StationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ id: string; marker: L.Marker }[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map centered on Pakistan
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [30.8, 71.8], // Optimal view covering Islamabad, Lahore, Multan down to Karachi
        zoom: 6,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    // Add station markers color-coded per prompt requirements:
    // Purple: 180–240 kW Hyper-Speed DC
    // Green: 100–160 kW Ultra-Fast DC
    // Blue: 30–90 kW Fast DC
    // Amber: AC Slow / Home Hosts (3.3–22 kW)
    stations.forEach((station) => {
      let pinColor = '#D97706'; // Amber default for AC / Home Hosts
      let pinGlow = 'rgba(217, 119, 6, 0.4)';
      let pinLabel = `${station.power_kw}k`;
      let isUltra = false;

      if (station.power_kw >= 180) {
        pinColor = '#9333EA'; // Purple for 180–240 kW
        pinGlow = 'rgba(147, 51, 234, 0.5)';
        pinLabel = `${station.power_kw}k`;
        isUltra = true;
      } else if (station.power_kw >= 100) {
        pinColor = '#10B981'; // Green for 100–160 kW
        pinGlow = 'rgba(16, 185, 129, 0.5)';
        pinLabel = `${station.power_kw}k`;
        isUltra = true;
      } else if (station.power_kw >= 30) {
        pinColor = '#2563EB'; // Blue for 30–90 kW
        pinGlow = 'rgba(37, 99, 235, 0.4)';
        pinLabel = `${station.power_kw}k`;
      } else {
        pinColor = '#D97706'; // Amber for AC / Home Hosts
        pinLabel = station.is_home_host ? 'HOME' : 'AC';
      }

      const customIcon = L.divIcon({
        className: 'custom-station-pin',
        html: `
          <div class="${isUltra ? 'custom-pin-pulse' : ''}" style="
            background: ${pinColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2.5px solid #ffffff;
            box-shadow: 0 0 12px ${pinGlow}, 0 4px 8px rgba(15, 23, 42, 0.25);
            color: #ffffff;
            font-weight: 800;
            font-size: 10px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            ${pinLabel}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([station.latitude, station.longitude], { icon: customIcon }).addTo(map);

      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
      const priceText = station.price_per_kwh_pkr
        ? `Rs. ${station.price_per_kwh_pkr}/kWh`
        : station.power_kw >= 50
        ? 'Est. Rs. 95/kWh'
        : 'Est. Rs. 65/kWh';

      const phoneBadge = station.contact_phone
        ? `<div style="font-size: 10px; color: #0284C7; font-weight: 700; margin-bottom: 6px;">📞 Helpline: ${station.contact_phone}</div>`
        : '';

      const popupHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 12px 14px; min-width: 240px; color: #090D16;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${pinColor}; letter-spacing: 0.05em; background: ${pinColor}15; padding: 2px 7px; border-radius: 4px;">
              ${station.network_operator || 'Independent'}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #090D16; font-family: monospace;">
              ${station.power_kw} kW ${station.power_kw >= 30 ? 'DC' : 'AC'}
            </span>
          </div>

          <div style="font-weight: 800; font-size: 13px; color: #090D16; margin-bottom: 3px; line-height: 1.3;">
            ${station.name}
          </div>

          <div style="color: #64748B; font-size: 11px; margin-bottom: 6px; line-height: 1.3;">
            ${station.address || station.city}
          </div>

          ${phoneBadge}

          <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 10px; font-size: 11px; border-top: 1px solid #F1F5F9; padding-top: 6px;">
            <span style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 2px 6px; border-radius: 4px; font-weight: 600; color: #334155;">
              ${station.connector_types.join(', ')}
            </span>
            <span style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #059669; font-family: monospace;">
              ${priceText}
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px;">
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              width: 100%;
              background: #2563EB;
              color: #FFFFFF;
              font-weight: 700;
              font-size: 11px;
              padding: 7px 10px;
              border-radius: 8px;
              text-decoration: none;
              box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
            ">
              <span>Directions in Google Maps</span>
              <span>&rarr;</span>
            </a>

            <button type="button" id="btn-details-${station.id}" style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              background: #090D1A;
              color: #06B6D4;
              font-weight: 700;
              font-size: 11px;
              padding: 6px 10px;
              border-radius: 8px;
              border: 1px solid #1E293B;
              cursor: pointer;
            ">
              View Full Details & Helplines
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      marker.on('popupopen', () => {
        const detailsBtn = document.getElementById(`btn-details-${station.id}`);
        if (detailsBtn) {
          detailsBtn.onclick = () => {
            if (onOpenDrawer) onOpenDrawer(station);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectStation) {
          onSelectStation(station);
        }
      });

      markersRef.current.push({ id: station.id, marker });
    });
  }, [stations, onSelectStation, onOpenDrawer]);

  // Handle focus changes when user clicks a card from the left list
  useEffect(() => {
    if (focusedStation && mapInstanceRef.current) {
      mapInstanceRef.current.setView([focusedStation.latitude, focusedStation.longitude], 13, {
        animate: true,
      });

      const found = markersRef.current.find((m) => m.id === focusedStation.id);
      if (found) {
        found.marker.openPopup();
      }
    }
  }, [focusedStation]);

  return (
    <div className={`relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-white ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px]" />

      {/* Floating Speed Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/80 p-3.5 rounded-2xl shadow-md text-[11px] text-slate-700 space-y-2 select-none">
        <div className="font-extrabold text-[#090D16] text-xs tracking-tight">Charging Speed Tiers</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-600 inline-block border-2 border-white shadow-2xs" />
          <span className="font-semibold text-slate-800">Ultra-Fast DC (180–240 kW)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block border-2 border-white shadow-2xs" />
          <span className="font-semibold text-slate-800">Fast DC (100–160 kW)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block border-2 border-white shadow-2xs" />
          <span className="font-semibold text-slate-800">Standard DC (30–90 kW)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-600 inline-block border-2 border-white shadow-2xs" />
          <span className="font-semibold text-slate-800">AC Slow (7–22 kW / Home)</span>
        </div>
      </div>
    </div>
  );
}
