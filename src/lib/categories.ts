import { VehicleWithDetails } from './types';

export interface CategoryDefinition {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  group: 'body' | 'budget' | 'powertrain' | 'range';
  filterFn: (vehicle: VehicleWithDetails) => boolean;
}

export const CATEGORIES: CategoryDefinition[] = [
  // Body Types
  {
    slug: 'suv',
    title: 'Electric SUVs & Crossovers in Pakistan',
    shortTitle: 'Electric SUVs',
    description: 'High ground-clearance electric and hybrid SUVs designed for family travel, broken urban roads, and motorway cruising in Pakistan.',
    group: 'body',
    filterFn: (v) => v.body_type === 'suv',
  },
  {
    slug: 'sedan',
    title: 'Electric Sedans in Pakistan',
    shortTitle: 'Electric Sedans',
    description: 'Aerodynamic executive electric sedans offering premium comfort, high-efficiency highway cruising, and strong range.',
    group: 'body',
    filterFn: (v) => v.body_type === 'sedan',
  },
  {
    slug: 'hatchback',
    title: 'Electric Hatchbacks in Pakistan',
    shortTitle: 'Electric Hatchbacks',
    description: 'Practical, agile electric hatchbacks ideal for daily urban commuting and tight city parking in Lahore, Karachi, and Islamabad.',
    group: 'body',
    filterFn: (v) => v.body_type === 'hatchback',
  },
  {
    slug: 'microcar',
    title: 'City Microcars & Compact EVs in Pakistan',
    shortTitle: 'City Microcars',
    description: 'Affordable, compact city electric cars offering low purchase prices, minimal charging costs, and easy home 220V charging.',
    group: 'body',
    filterFn: (v) => v.body_type === 'microcar',
  },
  {
    slug: '7-seater',
    title: '7-Seater & 3-Row Family EVs in Pakistan',
    shortTitle: '7-Seater & Family',
    description: 'Multi-passenger electric and hybrid vehicles designed for extended family comfort, executive travel, and spacious boot capacity.',
    group: 'body',
    filterFn: (v) => {
      const seats = parseInt(v.specs.seating_capacity?.value || '5', 10);
      return seats >= 6 || v.body_type === 'mpv';
    },
  },

  // Budget Brackets
  {
    slug: 'under-50-lacs',
    title: 'Electric Cars Under 50 Lakhs (PKR 5 Million) in Pakistan',
    shortTitle: 'Under 50 Lacs',
    description: 'Entry-level electric vehicles under PKR 5,000,000 ex-factory, offering economical daily city transport with standard household charging.',
    group: 'budget',
    filterFn: (v) => {
      const p = v.latest_ex_factory_price?.amount_pkr;
      return !!(p && p <= 5000000);
    },
  },
  {
    slug: 'under-1-crore',
    title: 'Electric Cars Under 1 Crore (PKR 10 Million) in Pakistan',
    shortTitle: 'Under 1 Crore',
    description: 'Mid-tier electric cars and crossovers priced under PKR 10,000,000 ex-factory with DC fast charging and 300+ km usable range.',
    group: 'budget',
    filterFn: (v) => {
      const p = v.latest_ex_factory_price?.amount_pkr;
      return !!(p && p <= 10000000);
    },
  },
  {
    slug: 'under-1-5-crore',
    title: 'Electric Cars Under 1.5 Crore (PKR 15 Million) in Pakistan',
    shortTitle: 'Under 1.5 Crore',
    description: 'Full-size electric sedans and SUVs between PKR 10M and 15M featuring blade batteries, ADAS safety suites, and 450+ km range.',
    group: 'budget',
    filterFn: (v) => {
      const p = v.latest_ex_factory_price?.amount_pkr;
      return !!(p && p <= 15000000);
    },
  },

  // Range & Powertrain
  {
    slug: 'long-range',
    title: 'Long-Range Electric Vehicles (400+ km WLTP) in Pakistan',
    shortTitle: 'Long Range (400+ km)',
    description: 'High-capacity battery EVs capable of intercity motorway travel with minimal or single charging stops between major cities.',
    group: 'range',
    filterFn: (v) => {
      const range = parseFloat(v.specs.wltp_range_km?.value || '0');
      return range >= 400;
    },
  },
  {
    slug: 'pure-electric',
    title: 'Pure Electric Vehicles (BEV) in Pakistan',
    shortTitle: 'Pure Electric (BEV)',
    description: '100% battery-electric vehicles with zero tailpipe emissions, home charging capability, and public DC fast charger access.',
    group: 'powertrain',
    filterFn: (v) => v.powertrain === 'bev',
  },
  {
    slug: 'plug-in-hybrid',
    title: 'Plug-in Hybrids & Range-Extenders (PHEV / REEV) in Pakistan',
    shortTitle: 'Plug-in Hybrids (PHEV)',
    description: 'Vehicles combining electric battery driving for city commutes with petrol engines for anxiety-free long-distance highway travel.',
    group: 'powertrain',
    filterFn: (v) => v.powertrain === 'phev' || v.powertrain === 'reev',
  },
];

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
