export interface MockVehicleVariant {
  id: string;
  name: string;
  slug: string;
  pricePkr: number;
  batteryCapacityKwh: number;
  wltpRangeKm: number;
  nedcRangeKm?: number;
  fastChargeKw: number;
  fastChargeTimeMin: number;
  acChargeKw: number;
  acChargeTimeHours: number;
  acChargerType?: string;
  dcChargerType?: string;
  networkCoverageRatio?: string;
  motorPowerHp: number;
  motorTorqueNm: number;
  driveType: 'FWD' | 'RWD' | 'AWD';
  warrantyYears: number;
  batteryWarrantyYears: number;
  status: 'verified' | 'partially_verified' | 'unverified' | 'outdated';
}

export interface MockVehicle {
  id: string;
  brandName: string;
  brandSlug: string;
  name: string;
  slug: string;
  bodyType: string;
  powertrain: 'BEV' | 'PHEV' | 'REEV' | 'Hybrid' | null;
  startingPricePkr: number;
  maxRangeKm: number;
  accelerationSec: number;
  description: string;
  imageUrl?: string;
  distributorName: string;
  statusText?: string;
  verifiedDate?: string;
  isFeatured?: boolean;
  isUpcoming?: boolean;
  variants: MockVehicleVariant[];
  priceHistory: { pricePkr: number; priceType: string; verifiedAt: string; sourceName: string }[];
}

export interface MockBrand {
  id: string;
  name: string;
  slug: string;
  country: string;
  officialDistributor: string;
  description: string;
  website?: string;
}

export interface MockFaq {
  id: string;
  category: string;
  question: string;
  answer: string;
  slug: string;
}

const BRANDS: MockBrand[] = [
  {
    id: 'b1',
    name: 'BYD',
    slug: 'byd',
    country: 'China',
    officialDistributor: 'Mega Motor Company (Hubco Group)',
    description: 'World leading electric vehicle manufacturer pioneering LFP Blade Battery technology and e-Platform 3.0.',
    website: 'https://byd.com',
  },
  {
    id: 'b2',
    name: 'Deepal',
    slug: 'deepal',
    country: 'China',
    officialDistributor: 'Master Changan Motors',
    description: 'Changan Automobile EV sub-brand delivering futuristic design, digital cockpits, and REEV/BEV powertrains.',
    website: 'https://deepal.com',
  },
  {
    id: 'b3',
    name: 'MG',
    slug: 'mg',
    country: 'United Kingdom / China',
    officialDistributor: 'JW Auto Park (SAIC MG Pakistan)',
    description: 'Pioneer of mainstream electric SUVs in Pakistan with the MG ZS EV and MG4 EV electric hatchback.',
    website: 'https://mgmotors.com.pk',
  },
  {
    id: 'b4',
    name: 'BMW',
    slug: 'bmw',
    country: 'Germany',
    officialDistributor: 'Dewan Motors',
    description: 'German luxury automotive brand delivering flagship performance EVs including BMW i4, i5, i7, and iX.',
    website: 'https://bmw.com.pk',
  },
  {
    id: 'b5',
    name: 'Tesla',
    slug: 'tesla',
    country: 'USA',
    officialDistributor: 'Direct Commercial Importers',
    description: 'Global electric vehicle leader known for Autopilot, long range efficiency, and minimalist luxury.',
  },
];

const VEHICLES: MockVehicle[] = [
  {
    id: 'v1',
    brandName: 'BYD',
    brandSlug: 'byd',
    name: 'BYD Seal',
    slug: 'byd-seal',
    bodyType: 'Sedan',
    powertrain: 'BEV',
    startingPricePkr: 14790000,
    maxRangeKm: 570,
    accelerationSec: 3.8,
    description: 'Flagship electric sedan featuring Cell-to-Body (CTB) structural Blade battery technology, 800V architecture, and AWD dual-motor performance.',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    distributorName: 'Mega Motor Company',
    statusText: 'Verified Distributor Tariff',
    verifiedDate: 'Feb 2026',
    isFeatured: true,
    isUpcoming: false,
    variants: [
      {
        id: 'v1-var1',
        name: 'BYD Seal Excellence AWD',
        slug: 'byd-seal-excellence-awd',
        pricePkr: 14790000,
        batteryCapacityKwh: 82.5,
        wltpRangeKm: 570,
        fastChargeKw: 150,
        fastChargeTimeMin: 26,
        acChargeKw: 11,
        acChargeTimeHours: 7.5,
        acChargerType: 'Type 2 - 11 kW',
        dcChargerType: 'CCS2 - 150 kW',
        networkCoverageRatio: '101/105 stations - 96% compatibility',
        motorPowerHp: 523,
        motorTorqueNm: 670,
        driveType: 'AWD',
        warrantyYears: 6,
        batteryWarrantyYears: 8,
        status: 'verified',
      },
    ],
    priceHistory: [
      { pricePkr: 14790000, priceType: 'Ex-Factory Official Tariff', verifiedAt: 'Feb 2026', sourceName: 'Mega Motor Company Official Release' },
    ],
  },
  {
    id: 'v2',
    brandName: 'BYD',
    brandSlug: 'byd',
    name: 'BYD Atto 3',
    slug: 'byd-atto-3',
    bodyType: 'SUV',
    powertrain: 'BEV',
    startingPricePkr: 8990000,
    maxRangeKm: 420,
    accelerationSec: 7.3,
    description: 'Compact crossover electric SUV powered by BYD LFP Blade battery, panoramic sunroof, and rotating 15.6-inch infotainment display.',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    distributorName: 'Mega Motor Company',
    statusText: 'Verified Distributor Tariff',
    verifiedDate: 'Feb 2026',
    isFeatured: true,
    isUpcoming: false,
    variants: [
      {
        id: 'v2-var1',
        name: 'BYD Atto 3 Extended Range',
        slug: 'byd-atto-3-extended',
        pricePkr: 8990000,
        batteryCapacityKwh: 60.48,
        wltpRangeKm: 420,
        fastChargeKw: 88,
        fastChargeTimeMin: 40,
        acChargeKw: 7,
        acChargeTimeHours: 8.5,
        acChargerType: 'Type 2 - 7 kW',
        dcChargerType: 'CCS2 - 88 kW',
        networkCoverageRatio: '101/105 stations - 96% compatibility',
        motorPowerHp: 201,
        motorTorqueNm: 310,
        driveType: 'FWD',
        warrantyYears: 6,
        batteryWarrantyYears: 8,
        status: 'verified',
      },
    ],
    priceHistory: [
      { pricePkr: 8990000, priceType: 'Ex-Factory Official Tariff', verifiedAt: 'Feb 2026', sourceName: 'Mega Motor Company Official Release' },
    ],
  },
  {
    id: 'v3',
    brandName: 'Deepal',
    brandSlug: 'deepal',
    name: 'Deepal S07',
    slug: 'deepal-s07',
    bodyType: 'SUV',
    powertrain: 'BEV',
    startingPricePkr: 10290000,
    maxRangeKm: 485,
    accelerationSec: 6.7,
    description: 'Mid-size electric crossover SUV assembled in partnership with Master Changan Motors, featuring frameless doors and AR head-up display.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    distributorName: 'Master Changan Motors',
    statusText: 'Verified Distributor Tariff',
    verifiedDate: 'Feb 2026',
    isFeatured: true,
    isUpcoming: false,
    variants: [
      {
        id: 'v3-var1',
        name: 'Deepal S07 Pure Electric',
        slug: 'deepal-s07-pure-ev',
        pricePkr: 10290000,
        batteryCapacityKwh: 66.8,
        wltpRangeKm: 485,
        fastChargeKw: 92,
        fastChargeTimeMin: 35,
        acChargeKw: 7,
        acChargeTimeHours: 9,
        acChargerType: 'Type 2 - 7 kW',
        dcChargerType: 'CCS2 - 92 kW',
        networkCoverageRatio: '101/105 stations - 96% compatibility',
        motorPowerHp: 258,
        motorTorqueNm: 320,
        driveType: 'RWD',
        warrantyYears: 5,
        batteryWarrantyYears: 8,
        status: 'verified',
      },
    ],
    priceHistory: [
      { pricePkr: 10290000, priceType: 'Ex-Factory Official Tariff', verifiedAt: 'Feb 2026', sourceName: 'Master Changan Official Release' },
    ],
  },
  {
    id: 'v4',
    brandName: 'Tesla',
    brandSlug: 'tesla',
    name: 'Tesla Model 3',
    slug: 'tesla-model-3',
    bodyType: 'Sedan',
    powertrain: 'BEV',
    startingPricePkr: 18500000,
    maxRangeKm: 513,
    accelerationSec: 4.4,
    description: 'High efficiency electric sedan featuring Tesla minimalist interior, glass roof, Autopilot suite, and long-range battery pack.',
    imageUrl: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800&q=80',
    distributorName: 'Commercial Import',
    statusText: 'Verified Market Estimate',
    verifiedDate: 'Feb 2026',
    isFeatured: true,
    isUpcoming: false,
    variants: [
      {
        id: 'v4-var1',
        name: 'Tesla Model 3 Long Range',
        slug: 'tesla-model-3-long-range',
        pricePkr: 18500000,
        batteryCapacityKwh: 75,
        wltpRangeKm: 513,
        fastChargeKw: 250,
        fastChargeTimeMin: 20,
        acChargeKw: 11,
        acChargeTimeHours: 6.5,
        acChargerType: 'Type 2 - 11 kW',
        dcChargerType: 'CCS2 Adapter Supported',
        networkCoverageRatio: '101/105 stations - 96% compatibility',
        motorPowerHp: 440,
        motorTorqueNm: 493,
        driveType: 'AWD',
        warrantyYears: 4,
        batteryWarrantyYears: 8,
        status: 'verified',
      },
    ],
    priceHistory: [
      { pricePkr: 18500000, priceType: 'Commercial Import Estimate', verifiedAt: 'Feb 2026', sourceName: 'Automotive Dealer Imports' },
    ],
  },
];

const FAQS: MockFaq[] = [
  {
    id: 'f1',
    category: 'Charging',
    question: 'How long does it take to charge an EV in Pakistan?',
    answer: 'Charging time depends on the charger type. A 7 kW / 11 kW AC home wallbox takes 6 to 8 hours overnight. Public DC fast chargers (60 kW – 150 kW) charge from 10% to 80% in 25 to 40 minutes.',
    slug: 'how-long-does-it-take-to-charge-ev-pakistan',
  },
  {
    id: 'f2',
    category: 'Costs',
    question: 'How much does it cost to charge an EV at home in Pakistan?',
    answer: 'At standard domestic electricity tariffs (50 PKR/kWh), a 60 kWh EV battery costs approximately PKR 3,000 for a full charge, giving 400+ km of driving range (~PKR 7.5 per km).',
    slug: 'how-much-does-it-cost-to-charge-ev-at-home-pakistan',
  },
  {
    id: 'f3',
    category: 'Battery',
    question: 'How long does an EV battery last in Pakistan?',
    answer: 'Modern LFP (Lithium Iron Phosphate) Blade batteries last over 3,000 charge cycles, equivalent to 10 to 15 years or 400,000+ km of driving before capacity degrades below 80%.',
    slug: 'how-long-does-ev-battery-last-pakistan',
  },
];

export function getAllVehicles(): MockVehicle[] {
  return VEHICLES;
}

export function getVehicleBySlug(slug: string): MockVehicle | undefined {
  return VEHICLES.find((v) => v.slug === slug);
}

export function getVehiclesByBrand(brandSlug: string): MockVehicle[] {
  return VEHICLES.filter((v) => v.brandSlug === brandSlug);
}

export function getAllBrands(): MockBrand[] {
  return BRANDS;
}

export function getBrandBySlug(slug: string): MockBrand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

export function getAllFaqs(): MockFaq[] {
  return FAQS;
}

export interface MockChargingStation {
  id: string;
  name: string;
  operator: string;
  cityName: string;
  citySlug: string;
  address: string;
  connectors: string[];
  powerKw: number;
  pricePerKwh: number;
  status: string;
}

export const CHARGING_STATIONS: MockChargingStation[] = [
  {
    id: 'cs-1',
    name: 'BYD Mega Motors Fast Charging Hub',
    operator: 'Hubco Green / BYD',
    cityName: 'Karachi',
    citySlug: 'karachi',
    address: 'Shahrah-e-Faisal, Near Nursery',
    connectors: ['CCS2', 'GB/T'],
    powerKw: 120,
    pricePerKwh: 85,
    status: 'Verified Active',
  },
  {
    id: 'cs-2',
    name: 'Deepal Master Motors 3S Charging Station',
    operator: 'Master Motors',
    cityName: 'Lahore',
    citySlug: 'lahore',
    address: 'Main Boulevard Gulberg III',
    connectors: ['CCS2', 'Type 2'],
    powerKw: 100,
    pricePerKwh: 80,
    status: 'Verified Active',
  },
  {
    id: 'cs-3',
    name: 'Bera Motorway M-2 Fast Charger',
    operator: 'FWO / Hubco Green',
    cityName: 'Motorway M-2',
    citySlug: 'islamabad',
    address: 'Bera Rest Area (Northbound)',
    connectors: ['CCS2', 'GB/T'],
    powerKw: 180,
    pricePerKwh: 95,
    status: 'Verified Active',
  },
  {
    id: 'cs-4',
    name: 'MG Capital DC Fast Charger',
    operator: 'MG Pakistan',
    cityName: 'Islamabad',
    citySlug: 'islamabad',
    address: 'Blue Area, Jinnah Avenue',
    connectors: ['CCS2'],
    powerKw: 60,
    pricePerKwh: 75,
    status: 'Verified Active',
  },
];

export function getAllChargingStations(): MockChargingStation[] {
  return CHARGING_STATIONS;
}

