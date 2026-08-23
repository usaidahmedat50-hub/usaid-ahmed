'use client';

import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Brand } from '@/lib/data/mock-db';

export interface FilterState {
  search: string;
  brand: string;
  bodyType: string;
  priceBracket: string;
  minRange: string;
  driveType: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  brands: Brand[];
}

export default function FilterPanel({ filters, onChange, brands }: FilterPanelProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onChange({
      search: '',
      brand: '',
      bodyType: '',
      priceBracket: '',
      minRange: '',
      driveType: '',
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Filter EVs in Pakistan</h2>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Search Input */}
        <div className="col-span-1 lg:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Search Model or Keyword
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="e.g. BYD Atto 3, Deepal S07..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Brand Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Brand
          </label>
          <select
            value={filters.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Body Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Body Type
          </label>
          <select
            value={filters.bodyType}
            onChange={(e) => handleChange('bodyType', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
          >
            <option value="">All Body Types</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Crossover">Crossover</option>
          </select>
        </div>

        {/* Price Bracket */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Price Bracket
          </label>
          <select
            value={filters.priceBracket}
            onChange={(e) => handleChange('priceBracket', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
          >
            <option value="">Any Price</option>
            <option value="under-50-lakh">Under 50 Lakh</option>
            <option value="50-lakh-1-crore">50 Lakh - 1 Crore</option>
            <option value="1-crore-2-crore">1 Crore - 2 Crore</option>
            <option value="above-2-crore">Above 2 Crore</option>
          </select>
        </div>

        {/* Minimum Range */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Min Range (KM)
          </label>
          <select
            value={filters.minRange}
            onChange={(e) => handleChange('minRange', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
          >
            <option value="">Any Range</option>
            <option value="200">200+ km</option>
            <option value="350">350+ km</option>
            <option value="450">450+ km</option>
            <option value="550">550+ km</option>
          </select>
        </div>
      </div>
    </div>
  );
}
