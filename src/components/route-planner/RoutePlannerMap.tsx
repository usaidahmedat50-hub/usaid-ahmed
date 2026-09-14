'use client';

import React, { useEffect, useRef } from 'react';
import { ChargingStation } from '@/lib/types';
import L from 'leaflet';

interface RoutePlannerMapProps {
  originCoords: [number, number];
  originName: string;
  destCoords: [number, number];
  destName: string;
  station?: ChargingStation;
  stations?: ChargingStation[];
  allNetworkStations?: ChargingStation[];
  isNonStop?: boolean;
  distanceKm: number;
  motorwayName?: string;
  motorwayPolyline?: [number, number][];
  className?: string;
}

export function RoutePlannerMap({
  originCoords,
  originName,
  destCoords,
  destName,
  station,
  stations = [],
  allNetworkStations = [],
  isNonStop = false,
  distanceKm,
  motorwayName = 'Motorway Corridor',
  motorwayPolyline,
  className = '',
}: RoutePlannerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const stationsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [(originCoords[0] + destCoords[0]) / 2, (originCoords[1] + destCoords[1]) / 2],
        zoom: 7,
        zoomControl: false, // Clean look, can add custom zoom or top-right zoom
        scrollWheelZoom: true,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const stationsLayer = L.layerGroup().addTo(map);
      const routeLayer = L.layerGroup().addTo(map);

      stationsLayerGroupRef.current = stationsLayer;
      routeLayerGroupRef.current = routeLayer;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const routeLayer = routeLayerGroupRef.current;
    const stationsLayer = stationsLayerGroupRef.current;
    if (!map || !routeLayer || !stationsLayer) return;

    // 1. Clear previous layers
    routeLayer.clearLayers();
    stationsLayer.clearLayers();

    // 2. Render background charging network pins
    const activeStopIds = new Set(
      (stations.length > 0 ? stations : station ? [station] : []).map((s) => s.id)
    );

    allNetworkStations.forEach((st) => {
      // Don't render active route stops as background pins (they get special highlighted pins)
      if (activeStopIds.has(st.id)) return;

      let pinColor = '#F59E0B'; // Amber
      if (st.power_kw >= 180) pinColor = '#8B5CF6'; // Purple
      else if (st.power_kw >= 100) pinColor = '#10B981'; // Emerald
      else if (st.power_kw >= 30) pinColor = '#2563EB'; // Blue

      const netIcon = L.divIcon({
        className: 'custom-net-station-pin',
        html: `
          <div style="
            background: ${pinColor};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            color: #ffffff;
            font-size: 8px;
            font-weight: 800;
            cursor: pointer;
            transition: transform 0.15s ease;
          " title="${st.name} (${st.power_kw} kW)">
            ⚡
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
      });

      const netMarker = L.marker([st.latitude, st.longitude], { icon: netIcon });
      const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${st.latitude},${st.longitude}`;
      netMarker.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 4px; min-width: 200px; color: #0F172A;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
            <span style="font-size: 9px; font-weight: 800; background: ${pinColor}20; color: ${pinColor}; padding: 1px 5px; border-radius: 4px; text-transform: uppercase;">
              ${st.power_kw} kW Fast DC
            </span>
            <span style="font-size: 9px; color: #64748B; font-weight: 600;">${st.network_operator || 'Operator'}</span>
          </div>
          <div style="font-size: 12px; font-weight: 800; color: #0F172A; margin: 2px 0;">
            ${st.name}
          </div>
          <div style="font-size: 10px; color: #64748B;">
            ${st.city} • Plugs: ${st.connector_types.join(', ')}
          </div>
          <a href="${navUrl}" target="_blank" rel="noopener noreferrer" style="
            display: block;
            margin-top: 6px;
            background: #2563EB;
            color: #FFFFFF;
            font-weight: 700;
            font-size: 10px;
            padding: 4px 6px;
            border-radius: 6px;
            text-align: center;
            text-decoration: none;
          ">
            Navigate in Maps &rarr;
          </a>
        </div>
      `);
      stationsLayer.addLayer(netMarker);
    });

    // 3. Prepare route coordinates
    const allStops = stations.length > 0 ? stations : station ? [station] : [];
    const polylineCoords: L.LatLngExpression[] =
      motorwayPolyline && motorwayPolyline.length > 1
        ? motorwayPolyline
        : [originCoords, ...allStops.map((s): [number, number] => [s.latitude, s.longitude]), destCoords];

    // Secondary casing line for depth
    const casingPolyline = L.polyline(polylineCoords, {
      color: '#1D4ED8',
      weight: 8,
      opacity: 0.25,
      lineCap: 'round',
      lineJoin: 'round',
    });
    routeLayer.addLayer(casingPolyline);

    // Primary vibrant Electric Blue route line
    const routePolyline = L.polyline(polylineCoords, {
      color: '#2563EB',
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    });
    routeLayer.addLayer(routePolyline);

    // 4. Origin Marker (A - Blue)
    const originIcon = L.divIcon({
      className: 'custom-origin-pin',
      html: `
        <div style="
          background: linear-gradient(135deg, #06B6D4, #2563EB);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
          color: #ffffff;
          font-weight: 900;
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        ">
          A
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17],
    });

    const originMarker = L.marker(originCoords, { icon: originIcon });
    originMarker.bindPopup(`
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 6px 8px; color: #0F172A;">
        <div style="font-size: 10px; font-weight: 800; color: #2563EB; text-transform: uppercase;">Origin / Start</div>
        <div style="font-size: 13px; font-weight: 800; color: #0F172A;">${originName}</div>
      </div>
    `);
    routeLayer.addLayer(originMarker);

    // 5. Active Route Charging Stops (Highlighted with pulsing badge)
    if (!isNonStop && allStops.length > 0) {
      allStops.forEach((st, idx) => {
        const isUltra = st.power_kw >= 180;
        const pinBg = isUltra
          ? 'linear-gradient(135deg, #A855F7, #7C3AED)'
          : 'linear-gradient(135deg, #10B981, #059669)';

        const stationIcon = L.divIcon({
          className: 'custom-stop-pin',
          html: `
            <div style="
              background: ${pinBg};
              width: 38px;
              height: 38px;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border: 3px solid #ffffff;
              box-shadow: 0 4px 16px ${isUltra ? 'rgba(124, 58, 237, 0.5)' : 'rgba(5, 150, 105, 0.5)'};
              color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              cursor: pointer;
              position: relative;
            ">
              <span style="font-size: 11px; font-weight: 900; line-height: 1;">⚡</span>
              <span style="font-size: 8px; font-weight: 800; line-height: 1; margin-top: 1px;">${st.power_kw}k</span>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
          popupAnchor: [0, -19],
        });

        const stationMarker = L.marker([st.latitude, st.longitude], { icon: stationIcon });
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${st.latitude},${st.longitude}`;
        stationMarker.bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 8px; min-width: 220px; color: #0F172A;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #059669; letter-spacing: 0.05em;">
                Recharge Stop ${allStops.length > 1 ? `#${idx + 1}` : ''}
              </span>
              <span style="font-size: 9px; font-weight: 800; background: #ECFDF5; color: #047857; padding: 2px 6px; border-radius: 4px; border: 1px solid #A7F3D0;">
                ${st.power_kw} kW Fast DC
              </span>
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #0F172A; line-height: 1.3;">
              ${st.name}
            </div>
            <div style="font-size: 11px; color: #64748B; margin: 4px 0;">
              ${st.network_operator || 'Network Operator'} • ${st.city}
            </div>
            <div style="font-size: 10px; color: #475569; margin-bottom: 6px;">
              Plugs: ${st.connector_types.join(', ')} • Rate: Rs. ${st.price_per_kwh_pkr || 98}/unit
            </div>
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="
              display: block;
              background: #059669;
              color: #FFFFFF;
              font-weight: 700;
              font-size: 11px;
              padding: 6px 8px;
              border-radius: 6px;
              text-align: center;
              text-decoration: none;
            ">
              Open in Google Maps &rarr;
            </a>
          </div>
        `);
        routeLayer.addLayer(stationMarker);
      });
    }

    // 6. Destination Marker (B - Dark Slate)
    const destIcon = L.divIcon({
      className: 'custom-dest-pin',
      html: `
        <div style="
          background: #0F172A;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.45);
          color: #ffffff;
          font-weight: 900;
          font-size: 13px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        ">
          B
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17],
    });

    const destMarker = L.marker(destCoords, { icon: destIcon });
    destMarker.bindPopup(`
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 6px 8px; color: #0F172A;">
        <div style="font-size: 10px; font-weight: 800; color: #0F172A; text-transform: uppercase;">Final Destination</div>
        <div style="font-size: 13px; font-weight: 800; color: #0F172A;">${destName}</div>
      </div>
    `);
    routeLayer.addLayer(destMarker);

    // 7. Auto-fit map bounds
    const bounds = L.latLngBounds(polylineCoords);
    map.fitBounds(bounds, {
      paddingTopLeft: [400, 50], // desktop: leave room for floating console card on left
      paddingBottomRight: [50, 50],
      maxZoom: 10,
    });
  }, [
    originCoords,
    originName,
    destCoords,
    destName,
    station,
    stations,
    allNetworkStations,
    isNonStop,
    distanceKm,
    motorwayPolyline,
  ]);

  return (
    <div className={`relative w-full h-full bg-slate-100 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
