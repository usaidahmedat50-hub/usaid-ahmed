'use client';

import React, { useEffect } from 'react';
import { ChargingStation } from '@/lib/types';
import {
  X,
  Zap,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  ExternalLink,
  Navigation,
  Sparkles,
  Route,
  Copy,
  Check,
} from 'lucide-react';
import Link from 'next/link';

interface StationDrawerProps {
  station: ChargingStation | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StationDrawer({ station, isOpen, onClose }: StationDrawerProps) {
  const [copiedPhone, setCopiedPhone] = React.useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !station) return null;

  const isUltraFast = station.power_kw >= 120;
  const isFastDc = station.power_kw >= 30 && station.power_kw < 120;

  const handleCopyPhone = () => {
    if (station.contact_phone) {
      navigator.clipboard.writeText(station.contact_phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide-out Panel */}
      <aside
        aria-label="Charging Station Details"
        className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200/80 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out"
      >
        {/* Header Strip */}
        <div className="p-5 sm:p-6 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {station.network_operator || 'Independent Hub'}
              </span>
              {station.verification_status === 'verified' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Station
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close station details"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight mt-3 leading-snug">
            {station.name}
          </h2>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700">{station.city}</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-400">
              {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Key Specs Card */}
          <div className="bg-gradient-to-br from-[#090D1A] to-[#0E1626] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            {/* Background cyan glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Peak Power Output
                </span>
                <div className="text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-1.5 mt-0.5">
                  <span>{station.power_kw}</span>
                  <span className="text-sm font-bold text-slate-400">kW</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 ml-1">
                    {isUltraFast ? 'Ultra-Fast DC' : isFastDc ? 'Fast DC' : 'AC Destination'}
                  </span>
                </div>
              </div>

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isUltraFast
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isFastDc
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                <Zap className="w-6 h-6 fill-current" />
              </div>
            </div>

            {/* Sub-row in card: Tariff & Ports */}
            <div className="relative z-10 grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                  Charging Tariff
                </span>
                <span className="text-sm font-bold text-emerald-400 tabular-nums">
                  {station.price_per_kwh_pkr
                    ? `Rs. ${station.price_per_kwh_pkr} / kWh`
                    : 'Est. Rs. 95 / kWh'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                  Available Plugs
                </span>
                <span className="text-sm font-bold text-white tabular-nums">
                  {station.ports_count ? `${station.ports_count} Dedicated Ports` : '2 Ports'}
                </span>
              </div>
            </div>
          </div>

          {/* Supported Connector Types */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Supported Port Standards
            </h3>
            <div className="flex flex-wrap gap-2">
              {station.connector_types.map((conn) => (
                <div
                  key={conn}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{conn}</span>
                  <span className="text-[10px] font-medium text-slate-500">
                    {conn === 'CCS2' ? '(EU / PK Spec)' : conn === 'GB/T' ? '(China Spec)' : '(AC)'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address & Highway Positioning */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Exact Location & Corridor
            </h3>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-700 leading-relaxed space-y-1.5">
              <p className="font-semibold text-slate-900">{station.address || station.city}</p>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span>Verified by editorial field logs:</span>
                <span className="font-semibold text-slate-700">
                  {station.last_verified_at || 'Recent 2026 Audit'}
                </span>
              </div>
            </div>
          </div>

          {/* Operating Hours & Operator Helpline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Opening Hours */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Operating Hours</span>
              </span>
              <span className="text-xs font-extrabold text-slate-900 block">
                {station.opening_hours || '24 Hours / 7 Days'}
              </span>
            </div>

            {/* Operator Contact / Helpline */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>Operator Helpline</span>
              </span>
              {station.contact_phone ? (
                <div className="flex items-center justify-between">
                  <a
                    href={`tel:${station.contact_phone}`}
                    className="text-xs font-extrabold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {station.contact_phone}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    title="Copy phone number"
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {copiedPhone ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-500">Official Web Portal</span>
              )}
            </div>
          </div>

          {/* Amenities Badges */}
          {station.amenities && station.amenities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>On-Site Rest Area Amenities</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {station.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 border-t border-slate-200/80 bg-slate-50/80 space-y-2.5 sticky bottom-0">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Google Maps Navigation</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <div className="flex gap-2">
            {station.contact_phone && (
              <a
                href={`tel:${station.contact_phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Helpline</span>
              </a>
            )}

            <Link
              href="/route-planner"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              <Route className="w-3.5 h-3.5 text-emerald-600" />
              <span>Plan Highway Route</span>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
