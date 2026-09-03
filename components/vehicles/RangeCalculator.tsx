'use client';

import React, { useState } from 'react';
import { Gauge, Thermometer, Users, Battery, Zap, Wind } from 'lucide-react';

interface RangeCalculatorProps {
  vehicleName: string;
  claimedWltpRangeKm: number;
  batteryCapacityKwh: number;
}

export default function RangeCalculator({
  vehicleName,
  claimedWltpRangeKm,
  batteryCapacityKwh,
}: RangeCalculatorProps) {
  const [speedKmh, setSpeedKmh] = useState<number>(90);
  const [temperatureC, setTemperatureC] = useState<number>(35); // Summer 35C in Pakistan
  const [acOn, setAcOn] = useState<boolean>(true);
  const [passengers, setPassengers] = useState<number>(2);

  // Range Estimation Math
  let speedFactor = 1.0;
  if (speedKmh > 90) {
    speedFactor = 1.0 - ((speedKmh - 90) * 0.008); // Speed penalty
  } else {
    speedFactor = 1.0 + ((90 - speedKmh) * 0.003); // Low speed bonus
  }

  let tempFactor = 1.0;
  if (temperatureC > 30) {
    tempFactor -= acOn ? 0.12 : 0.04; // High summer AC penalty
  } else if (temperatureC < 15) {
    tempFactor -= 0.10; // Cold weather battery efficiency penalty
  }

  let payloadFactor = 1.0 - ((passengers - 1) * 0.015);

  const estimatedRangeKm = Math.round(claimedWltpRangeKm * speedFactor * tempFactor * payloadFactor);
  const efficiencyKwhPer100Km = Math.round((batteryCapacityKwh / Math.max(100, estimatedRangeKm)) * 100 * 10) / 10;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-white">
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
        <div className="bg-blue-600/20 border border-blue-500/30 p-2 rounded-xl text-blue-400">
          <Wind className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{vehicleName} Real-World Range Estimator</h3>
          <p className="text-xs text-slate-400">
            Adjust driving conditions to see estimated range vs official WLTP claim
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Controls */}
        <div className="space-y-5">
          {/* Speed Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-400" /> Cruising Speed
              </span>
              <span className="text-blue-400 font-extrabold">{speedKmh} km/h</span>
            </div>
            <input
              type="range"
              min="50"
              max="140"
              step="5"
              value={speedKmh}
              onChange={(e) => setSpeedKmh(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Temperature Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" /> Weather Temperature
              </span>
              <span className="text-amber-400 font-extrabold">{temperatureC}°C (Pakistan Climate)</span>
            </div>
            <input
              type="range"
              min="10"
              max="48"
              step="1"
              value={temperatureC}
              onChange={(e) => setTemperatureC(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* AC Toggle & Passengers */}
          <div className="grid grid-cols-2 gap-3 text-xs font-bold">
            <button
              onClick={() => setAcOn(!acOn)}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                acOn
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span>Climate AC Control</span>
              <span className="text-[10px] uppercase font-black">{acOn ? 'ON' : 'OFF'}</span>
            </button>

            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Occupants
              </span>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="bg-slate-900 text-white font-extrabold text-xs rounded-lg p-1 focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((p) => (
                  <option key={p} value={p}>
                    {p} Person{p > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Result Banner */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-inner text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Estimated Real-World Range
          </div>

          <div>
            <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 block">
              {estimatedRangeKm} KM
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Claimed WLTP: <strong className="text-slate-200">{claimedWltpRangeKm} KM</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Efficiency Rate</span>
              <span className="font-bold text-emerald-400">{efficiencyKwhPer100Km} kWh / 100km</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Battery Pack</span>
              <span className="font-bold text-blue-400">{batteryCapacityKwh} kWh Usable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
