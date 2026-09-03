'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRightLeft, X, Trash2, ArrowRight } from 'lucide-react';

export interface SelectedVehicleItem {
  id: string;
  name: string;
  slug: string;
  brandName: string;
  startingPricePkr: number;
}

export default function StickyCompareTray() {
  const [selectedVehicles, setSelectedVehicles] = useState<SelectedVehicleItem[]>([]);

  useEffect(() => {
    // Read from localStorage on mount
    const updateTrayFromStorage = () => {
      try {
        const stored = localStorage.getItem('pakev_compare_vehicles');
        if (stored) {
          setSelectedVehicles(JSON.parse(stored));
        } else {
          setSelectedVehicles([]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    updateTrayFromStorage();
    window.addEventListener('pakev_compare_updated', updateTrayFromStorage);
    return () => window.removeEventListener('pakev_compare_updated', updateTrayFromStorage);
  }, []);

  if (selectedVehicles.length === 0) return null;

  const removeVehicle = (slug: string) => {
    const updated = selectedVehicles.filter((v) => v.slug !== slug);
    setSelectedVehicles(updated);
    localStorage.setItem('pakev_compare_vehicles', JSON.stringify(updated));
    window.dispatchEvent(new Event('pakev_compare_updated'));
  };

  const clearAll = () => {
    setSelectedVehicles([]);
    localStorage.removeItem('pakev_compare_vehicles');
    window.dispatchEvent(new Event('pakev_compare_updated'));
  };

  const comparisonSlug = selectedVehicles.map((v) => v.slug).join('-vs-');

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="glass-panel border border-blue-500/40 rounded-3xl p-3 sm:p-4 shadow-2xl flex items-center justify-between gap-4">
        {/* Selected Vehicles List */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {selectedVehicles.map((vehicle) => (
            <div
              key={vehicle.slug}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs shrink-0 shadow-sm"
            >
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{vehicle.brandName}</span>
                <span className="font-bold text-white leading-none">{vehicle.name}</span>
              </div>
              <button
                onClick={() => removeVehicle(vehicle.slug)}
                className="text-slate-400 hover:text-red-400 p-0.5 rounded-md hover:bg-slate-800 transition-colors"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {selectedVehicles.length < 4 && (
            <span className="text-[11px] text-slate-400 font-semibold px-2 hidden sm:inline">
              +{4 - selectedVehicles.length} more slot available
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearAll}
            className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <Link
            href={selectedVehicles.length >= 2 ? `/compare/${comparisonSlug}` : '/compare'}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Compare Now ({selectedVehicles.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
