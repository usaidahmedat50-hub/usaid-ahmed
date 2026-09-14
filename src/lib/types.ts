// PakevFinder.com — Core Domain Types
// Strictly adhering to docs/01-PRD.md, docs/02-ARCHITECTURE.md, and docs/03-RULES.md

export type VerificationStatus = 'verified' | 'partially_verified' | 'unverified' | 'outdated';

export type Powertrain = 'bev' | 'phev' | 'reev' | 'hev';

export type BodyType = 'sedan' | 'suv' | 'hatchback' | 'pickup' | 'microcar' | 'crossover' | 'mpv';

export type VehicleStatus = 'available' | 'upcoming' | 'discontinued';

export type PriceType = 'ex_factory' | 'on_road_estimate';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  country: string | null;
  website_url: string | null;
  created_at?: string;
}

export interface SpecMetadata {
  value: string | null;
  unit: string | null;
  verification_status: VerificationStatus;
  source_url: string | null;
  last_verified_at: string | null;
}

export interface VehiclePrice {
  id: string;
  vehicle_id: string;
  price_type: PriceType;
  amount_pkr: number;
  effective_date: string;
  source_url: string | null;
  verification_status: VerificationStatus;
  created_at?: string;
}

export interface VehicleRaw {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  body_type: BodyType;
  powertrain: Powertrain;
  status: VehicleStatus;
  hero_image_url: string | null;
  summary: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleSpecRaw {
  id: string;
  vehicle_id: string;
  spec_key: string;
  spec_value: string | null;
  unit: string | null;
  verification_status: VerificationStatus;
  source_url: string | null;
  last_verified_at: string | null;
}

// Pivoted and strongly-typed spec dictionary
export interface PivotedSpecs {
  // Battery & Charging
  battery_kwh?: SpecMetadata;
  battery_chemistry?: SpecMetadata;
  wltp_range_km?: SpecMetadata;
  real_world_range_km?: SpecMetadata;
  electric_range_km?: SpecMetadata; // For PHEV/REEV
  combined_range_km?: SpecMetadata; // For PHEV/REEV
  dc_fast_charge_kw?: SpecMetadata;
  dc_charge_time_mins?: SpecMetadata;
  ac_charge_kw?: SpecMetadata;
  charging_port_standard?: SpecMetadata; // e.g. CCS2, GB/T

  // Performance
  motor_layout?: SpecMetadata; // RWD, AWD, FWD
  motor_power_hp?: SpecMetadata;
  motor_power_kw?: SpecMetadata;
  torque_nm?: SpecMetadata;
  zero_to_hundred_sec?: SpecMetadata;
  top_speed_kmh?: SpecMetadata;

  // Dimensions & Practicality
  length_mm?: SpecMetadata;
  width_mm?: SpecMetadata;
  height_mm?: SpecMetadata;
  wheelbase_mm?: SpecMetadata;
  ground_clearance_mm?: SpecMetadata;
  boot_capacity_litres?: SpecMetadata;
  seating_capacity?: SpecMetadata;
  curb_weight_kg?: SpecMetadata;

  // Warranty & Ownership
  battery_warranty_years?: SpecMetadata;
  battery_warranty_km?: SpecMetadata;
  vehicle_warranty_years?: SpecMetadata;
  vehicle_warranty_km?: SpecMetadata;
  distributor_name?: SpecMetadata;

  // Catch-all for additional powertrain-specific fields
  [key: string]: SpecMetadata | undefined;
}

export interface VehicleWithDetails extends VehicleRaw {
  brand: Brand;
  specs: PivotedSpecs;
  prices: VehiclePrice[];
  latest_ex_factory_price: VehiclePrice | null;
  latest_on_road_estimate: VehiclePrice | null;
  overall_verification_status: VerificationStatus;
  imageUrl?: string;
  priceFormatted?: string;
  distributor?: string;
}

export type VehicleWithSpecs = VehicleWithDetails;

// Charging Station Types
export type ConnectorType = 'CCS2' | 'GB/T' | 'Type 2' | 'CHAdeMO' | 'Tesla Supercharger';

export type StationStatus = 'active' | 'inactive' | 'unverified';

export interface ChargingStation {
  id: string;
  name: string;
  network_operator: string | null;
  latitude: number;
  longitude: number;
  city: string;
  address: string | null;
  connector_types: ConnectorType[];
  power_kw: number;
  ports_count?: number;
  price_per_kwh_pkr?: number;
  contact_phone?: string;
  amenities?: string[];
  opening_hours?: string;
  status: StationStatus;
  is_home_host?: boolean;
  operating_status?: 'operational' | 'out_of_service' | 'coming_soon';
  submitted_by: string | null;
  verification_status: VerificationStatus;
  source_url: string | null;
  last_verified_at: string | null;
  created_at?: string;
}

export interface ChargingStationSubmissionInput {
  name: string;
  network_operator?: string;
  latitude: number;
  longitude: number;
  city: string;
  address?: string;
  connector_types: ConnectorType[];
  power_kw: number;
  submitter_contact?: string;
  notes?: string;
}

// Route Planner Types
export interface CityCoordinates {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  highway_node?: string; // e.g. M-2, M-3, M-5
}

export interface RouteStop {
  station: ChargingStation;
  distance_from_origin_km: number;
  estimated_charge_time_mins: number;
  recommended_soc_arrival: number;
  recommended_soc_departure: number;
}

export interface RouteFeasibility {
  origin: CityCoordinates;
  destination: CityCoordinates;
  total_distance_km: number;
  vehicle_name: string;
  usable_range_km: number;
  is_feasible_without_stop: boolean;
  required_stops_count: number;
  suggested_stops: RouteStop[];
  warning?: string;
  disclaimer: string;
}

// Editorial Article Types
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  published_at: string;
  read_time_mins?: number;
}
