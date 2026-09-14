'use client';

import React, { useState } from 'react';
import { PivotedSpecs, SpecMetadata } from '@/lib/types';
import { Battery, Zap, Ruler, Shield, Layers } from 'lucide-react';

interface SpecTableProps {
  specs: PivotedSpecs;
}

interface SpecRowConfig {
  key: keyof PivotedSpecs;
  label: string;
  category: 'battery' | 'performance' | 'dimensions' | 'warranty';
  description?: string;
}

const SPEC_DEFINITIONS: SpecRowConfig[] = [
  // Battery & Charging
  { key: 'battery_kwh', label: 'Battery Capacity (Usable)', category: 'battery' },
  { key: 'battery_chemistry', label: 'Battery Chemistry', category: 'battery' },
  { key: 'wltp_range_km', label: 'Official Range (WLTP / NEDC / CLTC)', category: 'battery' },
  { key: 'real_world_range_km', label: 'Est. Real-World Range (Pakistan Climate)', category: 'battery', description: 'Tested/modeled with 38°C+ summer A/C load' },
  { key: 'dc_fast_charge_kw', label: 'Max DC Fast Charging Speed', category: 'battery' },
  { key: 'dc_charge_time_mins', label: 'DC Charge Time (10% to 80%)', category: 'battery' },
  { key: 'ac_charge_kw', label: 'On-Board AC Charger Speed', category: 'battery' },
  { key: 'charging_port_standard', label: 'Charging Connector Standard', category: 'battery', description: 'CCS2 (Global/Euro) or GB/T (Chinese Standard)' },

  // Performance
  { key: 'motor_layout', label: 'Drive Layout', category: 'performance' },
  { key: 'motor_power_hp', label: 'Motor Power (hp / kW)', category: 'performance' },
  { key: 'torque_nm', label: 'Peak Torque', category: 'performance' },
  { key: 'zero_to_hundred_sec', label: '0 – 100 km/h Acceleration', category: 'performance' },
  { key: 'top_speed_kmh', label: 'Top Speed', category: 'performance' },

  // Dimensions
  { key: 'seating_capacity', label: 'Seating Capacity', category: 'dimensions' },
  { key: 'boot_capacity_litres', label: 'Boot Luggage Volume', category: 'dimensions' },
  { key: 'length_mm', label: 'Overall Length', category: 'dimensions' },
  { key: 'width_mm', label: 'Overall Width', category: 'dimensions' },
  { key: 'height_mm', label: 'Overall Height', category: 'dimensions' },
  { key: 'wheelbase_mm', label: 'Wheelbase', category: 'dimensions' },
  { key: 'ground_clearance_mm', label: 'Ground Clearance', category: 'dimensions', description: 'Critical for Pakistani road humps and speed breakers' },
  { key: 'curb_weight_kg', label: 'Curb Weight', category: 'dimensions' },

  // Warranty & Ownership
  { key: 'battery_warranty_years', label: 'Traction Battery Warranty', category: 'warranty' },
  { key: 'vehicle_warranty_years', label: 'Vehicle Warranty', category: 'warranty' },
  { key: 'distributor_name', label: 'Official Pakistani Distributor', category: 'warranty' },
  { key: 'key_features', label: 'Key Features & Driver Assistance', category: 'performance', description: 'ADAS, Panoramic Roof, Camera systems, V2L' },
];

export function SpecTable({ specs }: SpecTableProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'battery' | 'performance' | 'dimensions' | 'warranty'>('all');

  const categories = [
    { id: 'all', label: 'All Specs', icon: Layers },
    { id: 'battery', label: 'Battery & Charging', icon: Battery },
    { id: 'performance', label: 'Performance & Motor', icon: Zap },
    { id: 'dimensions', label: 'Dimensions & Body', icon: Ruler },
    { id: 'warranty', label: 'Warranty & Distributor', icon: Shield },
  ] as const;

  // Only show fields that have real sourced data per 04-DESIGN.md §4
  // Hide unknown fields entirely rather than listing rows of "Not Disclosed"
  const visibleSpecs = SPEC_DEFINITIONS.filter((def) => {
    if (activeTab !== 'all' && def.category !== activeTab) return false;
    const specMeta = specs[def.key];
    return specMeta && specMeta.value !== null && specMeta.value !== undefined && String(specMeta.value).trim() !== '';
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Category Tabs - Clean technical styling */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-white text-blue-700 border border-blue-200 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-[#111114] hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Two-Column Technical Spec Table per 04-DESIGN.md */}
      <div className="overflow-x-auto">
        {visibleSpecs.length > 0 ? (
          <table className="w-full text-left text-xs border-collapse">
            <tbody className="divide-y divide-gray-100">
              {visibleSpecs.map((def) => {
                const specMeta = specs[def.key]!;

                return (
                  <tr
                    key={def.key as string}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Left Column: Field Name (Muted) */}
                    <td className="py-3 px-4 sm:px-6 w-1/2 align-top">
                      <div className="font-medium text-gray-700">{def.label}</div>
                      {def.description && (
                        <div className="text-[11px] text-gray-500 mt-0.5">{def.description}</div>
                      )}
                    </td>

                    {/* Right Column: Value (Bold, Tabular Numerals) */}
                    <td className="py-3 px-4 sm:px-6 w-1/2 align-top text-right sm:text-left">
                      <span className="font-semibold text-[#111114] tabular-nums text-xs sm:text-sm">
                        {specMeta.value}
                        {specMeta.unit ? ` ${specMeta.unit}` : ''}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-xs text-gray-500">
            No additional verified specifications published in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
