'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { VehicleWithDetails } from '@/lib/types';
import { Plus, X, GitCompare } from 'lucide-react';

interface CompareSelectorProps {
  allVehicles: VehicleWithDetails[];
  selectedSlugs: string[];
}

export function CompareSelector({ allVehicles, selectedSlugs }: CompareSelectorProps) {
  const router = useRouter();

  const handleSelectChange = (index: number, newSlug: string) => {
    const updated = [...selectedSlugs];
    if (newSlug) {
      updated[index] = newSlug;
    } else {
      updated.splice(index, 1);
    }
    const cleanSlugs = updated.filter(Boolean);
    if (cleanSlugs.length > 0) {
      router.push(`/compare?cars=${cleanSlugs.join(',')}`);
    } else {
      router.push('/compare');
    }
  };

  const addVehicleSlot = () => {
    if (selectedSlugs.length < 3) {
      const remaining = allVehicles.find((v) => !selectedSlugs.includes(v.slug));
      if (remaining) {
        const nextSlugs = [...selectedSlugs, remaining.slug];
        router.push(`/compare?cars=${nextSlugs.join(',')}`);
      }
    }
  };

  const removeVehicle = (slugToRemove: string) => {
    const nextSlugs = selectedSlugs.filter((s) => s !== slugToRemove);
    if (nextSlugs.length > 0) {
      router.push(`/compare?cars=${nextSlugs.join(',')}`);
    } else {
      router.push('/compare');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mb-8">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-blue-700" />
          <h2 className="text-sm font-bold text-[#111114]">Select Vehicles to Compare</h2>
        </div>
        <span className="text-xs text-gray-500">
          Comparing {selectedSlugs.length} of 3 models
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {selectedSlugs.map((slug, idx) => {
          return (
            <div
              key={slug || idx}
              className="bg-gray-50 border border-gray-200 rounded-md p-3 flex items-center justify-between gap-2"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-blue-700 uppercase font-semibold block mb-0.5">
                  Vehicle {idx + 1}
                </span>
                <select
                  value={slug}
                  onChange={(e) => handleSelectChange(idx, e.target.value)}
                  className="bg-transparent text-[#111114] text-xs font-bold w-full truncate focus:outline-none cursor-pointer"
                >
                  {allVehicles.map((v) => (
                    <option key={v.id} value={v.slug} className="bg-white text-[#111114]">
                      {v.brand.name} {v.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSlugs.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeVehicle(slug)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded transition-colors"
                  title="Remove vehicle"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {selectedSlugs.length < 3 && (
          <button
            type="button"
            onClick={addVehicleSlot}
            className="border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 rounded-md p-3 flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 hover:text-blue-700 transition-all"
          >
            <Plus className="w-4 h-4 text-blue-700" />
            <span>Add 3rd Vehicle</span>
          </button>
        )}
      </div>
    </div>
  );
}
