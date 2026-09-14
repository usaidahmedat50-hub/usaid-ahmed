// PakevFinder.com — Centralized Vehicle Data Access Layer
// Strictly implements docs/03-RULES.md Rule 3.6 (single centralized pivot logic)

import {
  VehicleWithDetails,
  VehicleSpecRaw,
  VehiclePrice,
  PivotedSpecs,
  VerificationStatus,
  Brand,
} from './types';
import { computeVerificationStatus } from './verification';
import { SEED_VEHICLES, SEED_BRANDS } from '@/data/seed-data';
import { createServerClient } from './supabase/server';
import {
  getAllVehiclesWithDetailsFromJson,
  getVehicleDetailsFromJsonBySlug,
} from './vehicles-json';


/**
 * Pivots an array of key/value vehicle_specs rows into a strongly-typed PivotedSpecs object.
 * Applies staleness calculations to ensure outdated items (>180d) are tagged accordingly.
 */
export function pivotVehicleSpecs(rawSpecs: VehicleSpecRaw[]): PivotedSpecs {
  const pivoted: PivotedSpecs = {};

  for (const row of rawSpecs) {
    const effectiveStatus = computeVerificationStatus(
      row.verification_status,
      row.last_verified_at,
      'spec'
    );

    pivoted[row.spec_key] = {
      value: row.spec_value,
      unit: row.unit,
      verification_status: effectiveStatus,
      source_url: row.source_url,
      last_verified_at: row.last_verified_at,
    };
  }

  return pivoted;
}

/**
 * Computes overall verification badge for a vehicle:
 * - 'verified' if key specs (battery, range, motor) are verified
 * - 'partially_verified' if some specs are verified
 * - 'unverified' if none are verified
 * - 'outdated' if previously verified specs are now stale
 */
export function computeOverallVerificationStatus(
  specs: PivotedSpecs,
  latestPrice: VehiclePrice | null
): VerificationStatus {
  const allStatuses: VerificationStatus[] = [];

  if (latestPrice) {
    allStatuses.push(latestPrice.verification_status);
  }

  for (const key of Object.keys(specs)) {
    const s = specs[key];
    if (s?.verification_status) {
      allStatuses.push(s.verification_status);
    }
  }

  if (allStatuses.length === 0) return 'unverified';
  if (allStatuses.some((st) => st === 'outdated')) return 'outdated';
  if (allStatuses.every((st) => st === 'verified')) return 'verified';
  if (allStatuses.some((st) => st === 'verified' || st === 'partially_verified')) {
    return 'partially_verified';
  }

  return 'unverified';
}

/**
 * Retrieves all vehicles with pivoted specs, latest prices, and verification status.
 */
export async function getAllVehicles(): Promise<VehicleWithDetails[]> {
  const supabase = createServerClient();

  const jsonVehicles = getAllVehiclesWithDetailsFromJson();

  if (!supabase) {
    const jsonSlugs = new Set(jsonVehicles.map((v) => v.slug));
    const extraSeeds = SEED_VEHICLES.filter((sv) => !jsonSlugs.has(sv.slug));
    return [...jsonVehicles, ...extraSeeds];
  }

  try {
    const { data: vehiclesData, error: vehError } = await supabase
      .from('vehicles')
      .select('*, brands(*)');

    if (vehError || !vehiclesData || vehiclesData.length === 0) {
      const jsonSlugs = new Set(jsonVehicles.map((v) => v.slug));
      const extraSeeds = SEED_VEHICLES.filter((sv) => !jsonSlugs.has(sv.slug));
      return [...jsonVehicles, ...extraSeeds];
    }

    const vehicleIds = vehiclesData.map((v) => v.id);

    const [{ data: specsData }, { data: pricesData }] = await Promise.all([
      supabase.from('vehicle_specs').select('*').in('vehicle_id', vehicleIds),
      supabase
        .from('vehicle_prices')
        .select('*')
        .in('vehicle_id', vehicleIds)
        .order('effective_date', { ascending: false }),
    ]);

    const mappedVehicles = vehiclesData.map((veh) => {
      const vSpecs = (specsData || []).filter((s) => s.vehicle_id === veh.id);
      const vPrices = (pricesData || []).filter((p) => p.vehicle_id === veh.id);

      const pivotedSpecs = pivotVehicleSpecs(vSpecs as VehicleSpecRaw[]);

      const latestExFactory =
        vPrices.find((p) => p.price_type === 'ex_factory') || null;
      const latestOnRoad =
        vPrices.find((p) => p.price_type === 'on_road_estimate') || null;

      const effectivePrice: VehiclePrice | null = latestExFactory
        ? {
            ...latestExFactory,
            verification_status: computeVerificationStatus(
              latestExFactory.verification_status,
              latestExFactory.effective_date,
              'price'
            ),
          }
        : null;

      const brand: Brand = veh.brands || {
        id: veh.brand_id,
        name: 'Unknown',
        slug: 'unknown',
        logo_url: null,
        country: null,
        website_url: null,
      };

      const overallStatus = computeOverallVerificationStatus(
        pivotedSpecs,
        effectivePrice
      );

      return {
        ...veh,
        brand,
        specs: pivotedSpecs,
        prices: vPrices as VehiclePrice[],
        latest_ex_factory_price: effectivePrice,
        latest_on_road_estimate: latestOnRoad as VehiclePrice | null,
        overall_verification_status: overallStatus,
      };
    });

    // Merge JSON vehicles and any seed vehicles not present in Supabase
    const dbSlugs = new Set(mappedVehicles.map((v) => v.slug));
    const missingJsonVehicles = jsonVehicles.filter((jv) => !dbSlugs.has(jv.slug));
    const missingSeedVehicles = SEED_VEHICLES.filter((sv) => !dbSlugs.has(sv.slug) && !missingJsonVehicles.some((jv) => jv.slug === sv.slug));

    return [...mappedVehicles, ...missingJsonVehicles, ...missingSeedVehicles];
  } catch {
    const jsonSlugs = new Set(jsonVehicles.map((v) => v.slug));
    const extraSeeds = SEED_VEHICLES.filter((sv) => !jsonSlugs.has(sv.slug));
    return [...jsonVehicles, ...extraSeeds];
  }
}

/**
 * Single data lookup helper: retrieves a single vehicle strictly by unique slug.
 */
export function getVehicleBySlug(slug: string): VehicleWithDetails | null {
  if (!slug) return null;
  return getVehicleDetailsFromJsonBySlug(slug);
}

export function getVehicleBySlugSync(slug: string): VehicleWithDetails | null {
  return getVehicleBySlug(slug);
}



/**
 * Retrieves all brands.
 */
export async function getAllBrands(): Promise<Brand[]> {
  const supabase = createServerClient();
  if (!supabase) return SEED_BRANDS;

  try {
    const { data, error } = await supabase.from('brands').select('*').order('name');
    if (error || !data || data.length === 0) return SEED_BRANDS;

    const dbSlugs = new Set(data.map((b) => b.slug));
    const missingSeedBrands = SEED_BRANDS.filter((sb) => !dbSlugs.has(sb.slug));

    return [...data, ...missingSeedBrands];
  } catch {
    return SEED_BRANDS;
  }
}

/**
 * Retrieves brand by slug with all associated vehicles.
 */
export async function getBrandBySlug(slug: string): Promise<{
  brand: Brand | null;
  vehicles: VehicleWithDetails[];
}> {
  const [brands, vehicles] = await Promise.all([getAllBrands(), getAllVehicles()]);
  const brand = brands.find((b) => b.slug.toLowerCase() === slug.toLowerCase()) || null;
  const brandVehicles = brand ? vehicles.filter((v) => v.brand_id === brand.id) : [];

  return { brand, vehicles: brandVehicles };
}

/**
 * Filters vehicles dynamically.
 */
export async function searchVehicles(filters: {
  query?: string;
  bodyType?: string;
  powertrain?: string;
  maxPrice?: number;
  minRange?: number;
  verifiedOnly?: boolean;
}): Promise<VehicleWithDetails[]> {
  let vehicles = await getAllVehicles();

  if (filters.query) {
    const q = filters.query.toLowerCase();
    vehicles = vehicles.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.brand.name.toLowerCase().includes(q) ||
        (v.summary && v.summary.toLowerCase().includes(q))
    );
  }

  if (filters.bodyType && filters.bodyType !== 'all') {
    vehicles = vehicles.filter((v) => v.body_type === filters.bodyType);
  }

  if (filters.powertrain && filters.powertrain !== 'all') {
    vehicles = vehicles.filter((v) => v.powertrain === filters.powertrain);
  }

  if (filters.maxPrice && filters.maxPrice > 0) {
    vehicles = vehicles.filter((v) => {
      const price = v.latest_ex_factory_price?.amount_pkr;
      if (!price) return false;
      return price <= filters.maxPrice!;
    });
  }

  if (filters.minRange && filters.minRange > 0) {
    vehicles = vehicles.filter((v) => {
      const rangeStr = v.specs.wltp_range_km?.value;
      if (!rangeStr) return false;
      const range = parseFloat(rangeStr);
      return !isNaN(range) && range >= filters.minRange!;
    });
  }

  if (filters.verifiedOnly) {
    vehicles = vehicles.filter(
      (v) => v.overall_verification_status === 'verified'
    );
  }

  return vehicles;
}
