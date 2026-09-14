import React from 'react';
import { ChargingStation } from '@/lib/types';
import { Zap, MapPin, ExternalLink, ShieldCheck, Navigation } from 'lucide-react';

interface StationCardProps {
  station: ChargingStation;
  isActive?: boolean;
  onFocusOnMap?: (station: ChargingStation) => void;
  onOpenDetails?: (station: ChargingStation) => void;
}

export function StationCard({
  station,
  isActive = false,
  onFocusOnMap,
  onOpenDetails,
}: StationCardProps) {
  const isUltraFast = station.power_kw >= 100;
  const isFastDc = station.power_kw >= 30 && station.power_kw < 100;
  const isAc = station.power_kw < 30;

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(station);
    } else if (onFocusOnMap) {
      onFocusOnMap(station);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 bg-white ${
        isActive
          ? 'border-blue-600 ring-2 ring-blue-600/15 shadow-md bg-blue-50/20'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="font-bold uppercase tracking-wider text-blue-700">
              {station.city}
            </span>
            {station.network_operator && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-[10px]">
                  {station.network_operator}
                </span>
              </>
            )}
            {station.verification_status === 'verified' && (
              <>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
            {station.name}
          </h3>
        </div>

        {/* Speed Rating Pill */}
        <div
          className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold tabular-nums border ${
            isUltraFast
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : isFastDc
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${isUltraFast ? 'text-emerald-600 fill-emerald-600' : isFastDc ? 'text-blue-600 fill-blue-600' : 'text-amber-600 fill-amber-600'}`} />
          <span>{station.power_kw} kW</span>
        </div>
      </div>

      {station.address && (
        <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-2 line-clamp-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{station.address}</span>
        </p>
      )}

      {/* Meta Bar: Ports, Connectors, Tariff */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {/* Connector badges */}
          {station.connector_types.map((conn) => (
            <span
              key={conn}
              className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-semibold tracking-wide"
            >
              {conn}
            </span>
          ))}

          {/* Ports count */}
          {station.ports_count && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-50 text-slate-600 border border-slate-200 font-medium">
              {station.ports_count} {station.ports_count === 1 ? 'Plug' : 'Plugs'}
            </span>
          )}

          {/* Pricing */}
          {station.price_per_kwh_pkr && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] bg-emerald-50/70 text-emerald-800 border border-emerald-200/70 font-semibold tabular-nums">
              Rs. {station.price_per_kwh_pkr}/kWh
            </span>
          )}
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onOpenDetails && onOpenDetails(station)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Helpline & Specs</span>
          </button>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors"
            title="Directions in Google Maps"
          >
            <Navigation className="w-3 h-3 text-blue-600" />
            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
          </a>

          {onFocusOnMap && (
            <button
              type="button"
              onClick={() => onFocusOnMap(station)}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline px-1 py-0.5 cursor-pointer"
            >
              Map &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
