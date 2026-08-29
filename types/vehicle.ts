export type PowertrainType = 'EV' | 'PHEV' | 'REEV';

export interface VehicleSpec {
  id: string;
  brand: string;
  model: string;
  variant: string;
  priceLakh: number; // e.g. 89.0 means PKR 89 Lakhs
  powertrain: PowertrainType;
  bodyType: string; // SUV, Sedan, Hatchback, Crossover
  image: string;
  batteryKwh: number;
  electricRangeKm: number;
  consumptionKwh100km: number;
  maxAcChargeKw: number;
  maxDcChargeKw: number;
  dcChargeTimeMin: number; // 10% to 80% or standard fast charge time
  engineDesc?: string; // For PHEV / REEV (e.g., "1.5L 4-Cyl Turbo Range Extender")
  fuelEconomyKmPerL?: number; // For PHEV / REEV
  totalRangeKm: number; // EV range or Combined range for PHEV/REEV
  powerHp: number;
  torqueNm: number;
  drivetrain: 'FWD' | 'RWD' | 'AWD';
  zeroToHundredSec: number;
  topSpeedKmh: number;
  seats: number;
  bootCapacityL: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
  kerbWeightKg: number;
}
