'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Zap, Building2, BookOpen, ArrowRight } from 'lucide-react';
import { getAllVehicles, getAllBrands } from '@/lib/data/mock-db';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const vehicles = getAllVehicles();
  const brands = getAllBrands();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredVehicles = query.trim() === '' ? vehicles.slice(0, 4) : vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.brandName.toLowerCase().includes(query.toLowerCase()) ||
      v.bodyType.toLowerCase().includes(query.toLowerCase())
  );

  const filteredBrands = query.trim() === '' ? brands.slice(0, 3) : brands.filter(
    (b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.country.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-start justify-center pt-16 px-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-6 space-y-6 shadow-2xl relative">
        {/* Search Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3 w-full">
            <Search className="w-5 h-5 text-blue-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search by brand (BYD, MG), model (Seal, S07), or budget..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none text-white text-sm font-bold placeholder-slate-500 focus:outline-none focus:ring-0"
            />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Discovery Shortcuts */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-2">
              {query ? 'Matched Vehicles' : 'Popular Search Results'}
            </span>
            <div className="space-y-2">
              {filteredVehicles.map((v) => (
                <Link
                  key={v.id}
                  href={`/vehicles/${v.slug}`}
                  onClick={onClose}
                  className="bg-slate-950 hover:bg-slate-800/80 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600/20 text-blue-400 p-2 rounded-xl">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors block">
                        {v.brandName} {v.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {v.bodyType} • {v.maxRangeKm} km WLTP Range
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-2">
              Automotive Brands
            </span>
            <div className="grid grid-cols-2 gap-2">
              {filteredBrands.map((b) => (
                <Link
                  key={b.id}
                  href={`/brands/${b.slug}`}
                  onClick={onClose}
                  className="bg-slate-950 hover:bg-slate-800/80 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-2 transition-colors text-xs font-bold text-slate-200"
                >
                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{b.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
