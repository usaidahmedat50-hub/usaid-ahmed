export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  country: string;
  officialDistributor: string;
  website?: string;
  description: string;
}

export interface Variant {
  id: string;
  vehicleId: string;
  name: string;
  slug: string;
  pricePkr: number;
  batteryCapacityKwh: number;
  usableBatteryKwh: number;
  wltpRangeKm?: number;
  nedcRangeKm?: number;
  motorPowerHp: number;
  motorTorqueNm: number;
  driveType: 'FWD' | 'RWD' | 'AWD';
  fastChargeKw: number;
  acChargeKw: number;
  fastChargeTimeMin: number;
  acChargeTimeHours: number;
  seatingCapacity: number;
  groundClearanceMm: number;
  bootSpaceLiters: number;
  warrantyYears: number;
  batteryWarrantyYears: number;
}

export interface Vehicle {
  id: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  name: string;
  slug: string;
  bodyType: 'SUV' | 'Sedan' | 'Hatchback' | 'Crossover';
  tagline: string;
  description: string;
  startingPricePkr: number;
  maxRangeKm: number;
  topSpeedKmh: number;
  accelerationSec: number;
  isFeatured: boolean;
  imageUrl: string;
  distributorName: string;
  distributorIsOfficial: boolean;
  statusText: string;
  verifiedDate: string;
  variants: Variant[];
  priceHistory: {
    pricePkr: number;
    priceType: string;
    sourceName: string;
    verifiedAt: string;
  }[];
}

export interface ChargingStation {
  id: string;
  name: string;
  operator: string;
  city: string;
  locationName: string;
  latitude: number;
  longitude: number;
  address: string;
  totalPorts: number;
  ccs2Ports: number;
  gbtPorts: number;
  type2Ports: number;
  maxPowerKw: number;
  isFastCharger: boolean;
  pricingPerUnitPkr: number;
  operationalHours: string;
  googleMapsUrl?: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  entityType?: string;
  entityId?: string;
}

export const BRANDS_DATA: Brand[] = [
  {
    id: 'b-byd',
    name: 'BYD',
    slug: 'byd',
    country: 'China',
    officialDistributor: 'Mega Motor Company (Hubco Subsidiary)',
    website: 'https://byd.com.pk',
    description: 'BYD (Build Your Dreams) is the world leader in new energy vehicles, official entry in Pakistan managed by Hubco subsidiary Mega Motor Company.'
  },
  {
    id: 'b-deepal',
    name: 'Deepal',
    slug: 'deepal',
    country: 'China',
    officialDistributor: 'Master Changan Motors Limited',
    website: 'https://changan.com.pk',
    description: 'Deepal is Changan Auto\'s futuristic premium EV sub-brand offering state-of-the-art electric SUVs and sports sedans in Pakistan.'
  },
  {
    id: 'b-mg',
    name: 'MG',
    slug: 'mg',
    country: 'UK / China',
    officialDistributor: 'JW Auto Park / MG Motors Pakistan',
    website: 'https://mgmotors.com.pk',
    description: 'MG Motor Pakistan introduced EV motoring to Pakistan with ZS EV and MG4 hatchback series.'
  },
  {
    id: 'b-kia',
    name: 'KIA',
    slug: 'kia',
    country: 'South Korea',
    officialDistributor: 'Lucky Motor Corporation (LMC)',
    website: 'https://kia-pakistan.com',
    description: 'KIA Pakistan brings global Electric-Global Modular Platform (E-GMP) electric vehicles like EV5 and EV9 flagship SUVs.'
  },
  {
    id: 'b-honri',
    name: 'Honri',
    slug: 'honri',
    country: 'China',
    officialDistributor: 'Eco-Green Motors / Dewan Farooque Motors',
    website: 'https://honripakistan.com',
    description: 'Honri VE is Pakistan\'s most accessible urban electric hatchback, pioneering affordable city commuting.'
  },
  {
    id: 'b-dongfeng',
    name: 'Dongfeng',
    slug: 'dongfeng',
    country: 'China',
    officialDistributor: 'GuGo Motors Pakistan',
    website: 'https://gugomotors.com',
    description: 'Dongfeng Nammi / Box series offers versatile, smart compact EVs tailored for urban Pakistani drivers.'
  },
  {
    id: 'b-omoda-jaecoo',
    name: 'Omoda & JAECOO',
    slug: 'omoda-jaecoo',
    country: 'China',
    officialDistributor: 'Chery / Ghandhara Automobiles',
    website: 'https://omodajaecoo.pk',
    description: 'Chery Group\'s global exports Omoda E5 and JAECOO J6 rugged electric SUV for urban and off-road mobility.'
  },
  {
    id: 'b-hyundai',
    name: 'Hyundai',
    slug: 'hyundai',
    country: 'South Korea',
    officialDistributor: 'Hyundai Nishat Motor (Pvt) Limited',
    website: 'https://hyundai-nishat.com',
    description: 'Hyundai\'s award-winning IONIQ line brings ultra-fast 800V charging architectures to Pakistan.'
  },
  {
    id: 'b-audi',
    name: 'Audi',
    slug: 'audi',
    country: 'Germany',
    officialDistributor: 'Premier Systems (Pvt) Ltd (Audi Pakistan)',
    website: 'https://audi.com.pk',
    description: 'Audi Pakistan leads the luxury EV segment with high-performance e-tron GT and Q8 e-tron luxury SUVs.'
  }
];

export const VEHICLES_DATA: Vehicle[] = [
  {
    id: 'v-byd-atto-3',
    brandId: 'b-byd',
    brandName: 'BYD',
    brandSlug: 'byd',
    name: 'BYD Atto 3',
    slug: 'byd-atto-3',
    bodyType: 'SUV',
    tagline: 'Pakistan\'s premier compact electric SUV with LFP Blade Battery.',
    description: 'Built on BYD\'s advanced e-Platform 3.0, the Atto 3 features ultra-safe Blade Battery technology, rotating 15.6-inch console, and panoramic glass roof.',
    startingPricePkr: 8990000,
    maxRangeKm: 420,
    topSpeedKmh: 160,
    accelerationSec: 7.3,
    isFeatured: true,
    imageUrl: '/images/vehicles/byd-atto-3.jpg',
    distributorName: 'Mega Motor Company (Hubco)',
    distributorIsOfficial: true,
    statusText: 'Officially Available',
    verifiedDate: 'Feb 2026',
    variants: [
      {
        id: 'var-atto3-dynamic',
        vehicleId: 'v-byd-atto-3',
        name: 'BYD Atto 3 Dynamic',
        slug: 'atto-3-dynamic',
        pricePkr: 8990000,
        batteryCapacityKwh: 49.92,
        usableBatteryKwh: 49.92,
        wltpRangeKm: 345,
        nedcRangeKm: 410,
        motorPowerHp: 201,
        motorTorqueNm: 310,
        driveType: 'FWD',
        fastChargeKw: 70,
        acChargeKw: 7,
        fastChargeTimeMin: 45,
        acChargeTimeHours: 7.5,
        seatingCapacity: 5,
        groundClearanceMm: 175,
        bootSpaceLiters: 440,
        warrantyYears: 5,
        batteryWarrantyYears: 8
      },
      {
        id: 'var-atto3-superior',
        vehicleId: 'v-byd-atto-3',
        name: 'BYD Atto 3 Superior',
        slug: 'atto-3-superior',
        pricePkr: 9890000,
        batteryCapacityKwh: 60.48,
        usableBatteryKwh: 60.48,
        wltpRangeKm: 420,
        nedcRangeKm: 480,
        motorPowerHp: 201,
        motorTorqueNm: 310,
        driveType: 'FWD',
        fastChargeKw: 88,
        acChargeKw: 7,
        fastChargeTimeMin: 40,
        acChargeTimeHours: 9.0,
        seatingCapacity: 5,
        groundClearanceMm: 175,
        bootSpaceLiters: 440,
        warrantyYears: 5,
        batteryWarrantyYears: 8
      }
    ],
    priceHistory: [
      {
        pricePkr: 8990000,
        priceType: 'EX_FACTORY',
        sourceName: 'Mega Motor Company Official Price List',
        verifiedAt: '2026-02-01'
      }
    ]
  },
  {
    id: 'v-byd-seal',
    brandId: 'b-byd',
    brandName: 'BYD',
    brandSlug: 'byd',
    name: 'BYD Seal',
    slug: 'byd-seal',
    bodyType: 'Sedan',
    tagline: '0 to 100 km/h in 3.8s with Cell-to-Body (CTB) chassis integration.',
    description: 'The BYD Seal sports sedan delivers ocean-aesthetic styling, double-wishbone suspension, and up to 523 HP in Performance AWD trim.',
    startingPricePkr: 14790000,
    maxRangeKm: 520,
    topSpeedKmh: 180,
    accelerationSec: 3.8,
    isFeatured: true,
    imageUrl: '/images/vehicles/byd-seal.webp',
    distributorName: 'Mega Motor Company (Hubco)',
    distributorIsOfficial: true,
    statusText: 'Officially Available',
    verifiedDate: 'Feb 2026',
    variants: [
      {
        id: 'var-seal-dynamic',
        vehicleId: 'v-byd-seal',
        name: 'BYD Seal Dynamic RWD',
        slug: 'seal-dynamic-rwd',
        pricePkr: 14790000,
        batteryCapacityKwh: 61.4,
        usableBatteryKwh: 61.4,
        wltpRangeKm: 460,
        nedcRangeKm: 510,
        motorPowerHp: 201,
        motorTorqueNm: 310,
        driveType: 'RWD',
        fastChargeKw: 110,
        acChargeKw: 7,
        fastChargeTimeMin: 32,
        acChargeTimeHours: 9.0,
        seatingCapacity: 5,
        groundClearanceMm: 145,
        bootSpaceLiters: 400,
        warrantyYears: 5,
        batteryWarrantyYears: 8
      },
      {
        id: 'var-seal-performance',
        vehicleId: 'v-byd-seal',
        name: 'BYD Seal Performance AWD',
        slug: 'seal-performance-awd',
        pricePkr: 16990000,
        batteryCapacityKwh: 82.5,
        usableBatteryKwh: 82.5,
        wltpRangeKm: 520,
        nedcRangeKm: 570,
        motorPowerHp: 523,
        motorTorqueNm: 670,
        driveType: 'AWD',
        fastChargeKw: 150,
        acChargeKw: 11,
        fastChargeTimeMin: 26,
        acChargeTimeHours: 8.0,
        seatingCapacity: 5,
        groundClearanceMm: 145,
        bootSpaceLiters: 400,
        warrantyYears: 5,
        batteryWarrantyYears: 8
      }
    ],
    priceHistory: [
      {
        pricePkr: 14790000,
        priceType: 'EX_FACTORY',
        sourceName: 'BYD Pakistan Official Tariff',
        verifiedAt: '2026-02-01'
      }
    ]
  },
  {
    id: 'v-deepal-s07',
    brandId: 'b-deepal',
    brandName: 'Deepal',
    brandSlug: 'deepal',
    name: 'Deepal S07',
    slug: 'deepal-s07',
    bodyType: 'SUV',
    tagline: 'Futuristic Intelligent Electric SUV with frameless doors and AR-HUD.',
    description: 'Deepal S07 combines sleek luxury styling, gesture control, Qualcomm Snapdragon 8155 cockpit, and 66.8 kWh battery capacity.',
    startingPricePkr: 14999000,
    maxRangeKm: 485,
    topSpeedKmh: 180,
    accelerationSec: 7.5,
    isFeatured: true,
    imageUrl: '/images/vehicles/deepal-s07.webp',
    distributorName: 'Master Changan Motors Limited',
    distributorIsOfficial: true,
    statusText: 'Officially Available',
    verifiedDate: 'Feb 2026',
    variants: [
      {
        id: 'var-deepal-s07-pure',
        vehicleId: 'v-deepal-s07',
        name: 'Deepal S07 Pure Electric',
        slug: 'deepal-s07-pure',
        pricePkr: 14999000,
        batteryCapacityKwh: 66.8,
        usableBatteryKwh: 66.8,
        wltpRangeKm: 485,
        nedcRangeKm: 520,
        motorPowerHp: 215,
        motorTorqueNm: 320,
        driveType: 'RWD',
        fastChargeKw: 92,
        acChargeKw: 7,
        fastChargeTimeMin: 35,
        acChargeTimeHours: 9.5,
        seatingCapacity: 5,
        groundClearanceMm: 165,
        bootSpaceLiters: 435,
        warrantyYears: 5,
        batteryWarrantyYears: 8
      }
    ],
    priceHistory: [
      {
        pricePkr: 16500000,
        priceType: 'EX_FACTORY',
        sourceName: 'Master Changan Motors Official Notice',
        verifiedAt: '2026-01-20'
      }
    ]
  },
  {
    id: 'v-deepal-l07',
    brandId: 'b-deepal',
    brandName: 'Deepal',
    brandSlug: 'deepal',
    name: 'Deepal L07',
    slug: 'deepal-l07',
    bodyType: 'Sedan',
    tagline: 'Aerodynamic electric fastback sedan with active rear wing.',
    description: 'Boasting an ultra-low drag coefficient of 0.23 Cd, the Deepal L07 offers 0 to 100 km/h in 5.9 seconds and 530 km range.',
    startingPricePkr: 13999000,
    maxRangeKm: 530,
    topSpeedKmh: 180,
    accelerationSec: 5.9,
    isFeatured: true,
    imageUrl: '/images/vehicles/deepal-l07.webp',
    distributorName: 'Master Changan Motors Limited',
    distributorIsOfficial: true,
    statusText: 'Officially Available',
    verifiedDate: 'Feb 2026',
    variants: [
      {
        id: 'var-deepal-l07-pure',
        vehicleId: 'v-deepal-l07',
        name: 'Deepal L07 Pure Electric',
        slug: 'deepal-l07-pure',
        pricePkr: 13999000,
        batteryCapacityKwh: 66.8,
        usableBatteryKwh: 66.8,
        wltpRangeKm: 530,
        nedcRangeKm: 560,
        motorPowerHp: 215,
        motorTorqueNm: 320,
        driveType: 'RWD',
        fastChargeKw: 92,
        acChargeKw: 7,
        fastChargeTimeMin: 35,
        acChargeTimeHours: 9.5,
        seatingCapacity: 5,
        groundClearanceMm: 150,
        bootSpaceLiters: 470,
        warrantyYears: 5,
        batteryWarrantyYears: 8
      }
    ],
    priceHistory: [
      {
        pricePkr: 15500000,
        priceType: 'EX_FACTORY',
        sourceName: 'Master Changan Tariff Gazette',
        verifiedAt: '2026-01-20'
      }
    ]
  },
  {
    id: 'v-mg4-ev',
    brandId: 'b-mg',
    brandName: 'MG',
    brandSlug: 'mg',
    name: 'MG4 EV',
    slug: 'mg4-ev',
    bodyType: 'Hatchback',
    tagline: '50:50 weight distribution electric hot hatchback.',
    description: 'Engineered on MG\'s Modular Scalable Platform (MSP), featuring thin battery cell design and sharp futuristic European styling.',
    startingPricePkr: 6949000,
    maxRangeKm: 435,
    topSpeedKmh: 160,
    accelerationSec: 7.7,
    isFeatured: true,
    imageUrl: '/images/vehicles/mg4-ev.webp',
    distributorName: 'JW Auto Park / MG Pakistan',
    distributorIsOfficial: true,
    statusText: 'Officially Available',
    verifiedDate: 'Feb 2026',
    variants: [
      {
        id: 'var-mg4-excite',
        vehicleId: 'v-mg4-ev',
        name: 'MG4 EV Urban / Excite',
        slug: 'mg4-ev-excite',
        pricePkr: 6949000,
        batteryCapacityKwh: 51.0,
        usableBatteryKwh: 50.8,
        wltpRangeKm: 350,
        nedcRangeKm: 380,
        motorPowerHp: 170,
        motorTorqueNm: 250,
        driveType: 'RWD',
        fastChargeKw: 88,
        acChargeKw: 6.6,
        fastChargeTimeMin: 40,
        acChargeTimeHours: 7.5,
        seatingCapacity: 5,
        groundClearanceMm: 150,
        bootSpaceLiters: 363,
        warrantyYears: 5,
        batteryWarrantyYears: 8
      },
      {
        id: 'var-mg4-essence',
        vehicleId: 'v-mg4-ev',
        name: 'MG4 EV Essence',
        slug: 'mg4-ev-essence',
        pricePkr: 12990000,
        batteryCapacityKwh: 64.0,
        usableBatteryKwh: 61.7,
        wltpRangeKm: 435,
        nedcRangeKm: 460,
        motorPowerHp: 201,
        motorTorqueNm: 250,
        driveType: 'RWD',
        fastChargeKw: 140,
        acChargeKw: 11,
        fastChargeTimeMin: 28,
        acChargeTimeHours: 6.5,
        seatingCapacity: 5,
        groundClearanceMm: 150,
        bootSpaceLiters: 363,
        warrantyYears: 5,
        batteryWarrantyYears: 8
      }
    ],
    priceHistory: [
      {
        pricePkr: 10990000,
        priceType: 'EX_FACTORY',
        sourceName: 'JW Auto Park MG Price Sheet',
        verifiedAt: '2026-01-15'
      }
    ]
  },
  {
    id: 'v-honri-ve',
    brandId: 'b-honri',
    brandName: 'Honri',
    brandSlug: 'honri',
    name: 'Honri VE',
    slug: 'honri-ve',
    bodyType: 'Hatchback',
    tagline: 'Pakistan\'s most affordable city EV starting under 40 Lakhs.',
    description: 'An ultra-compact 4-door urban commuter offering zero emissions, air conditioning, digital gauge cluster, and home socket charging compatibility.',
    startingPricePkr: 3599000,
    maxRangeKm: 300,
    topSpeedKmh: 100,
    accelerationSec: 12.0,
    isFeatured: true,
    imageUrl: '/images/vehicles/honri-ve.webp',
    distributorName: 'Eco-Green Motors / Dewan',
    distributorIsOfficial: true,
    statusText: 'Officially Available',
    verifiedDate: 'Feb 2026',
    variants: [
      {
        id: 'var-honri-ve-20',
        vehicleId: 'v-honri-ve',
        name: 'Honri VE 2.0',
        slug: 'honri-ve-20',
        pricePkr: 3599000,
        batteryCapacityKwh: 18.5,
        usableBatteryKwh: 18.5,
        wltpRangeKm: 170,
        nedcRangeKm: 200,
        motorPowerHp: 40,
        motorTorqueNm: 84,
        driveType: 'FWD',
        fastChargeKw: 0,
        acChargeKw: 3.3,
        fastChargeTimeMin: 0,
        acChargeTimeHours: 7.0,
        seatingCapacity: 4,
        groundClearanceMm: 130,
        bootSpaceLiters: 150,
        warrantyYears: 3,
        batteryWarrantyYears: 5
      },
      {
        id: 'var-honri-ve-30',
        vehicleId: 'v-honri-ve',
        name: 'Honri VE 3.0',
        slug: 'honri-ve-30',
        pricePkr: 4399000,
        batteryCapacityKwh: 29.9,
        usableBatteryKwh: 29.9,
        wltpRangeKm: 260,
        nedcRangeKm: 300,
        motorPowerHp: 48,
        motorTorqueNm: 102,
        driveType: 'FWD',
        fastChargeKw: 30,
        acChargeKw: 3.3,
        fastChargeTimeMin: 45,
        acChargeTimeHours: 9.0,
        seatingCapacity: 4,
        groundClearanceMm: 130,
        bootSpaceLiters: 150,
        warrantyYears: 3,
        batteryWarrantyYears: 5
      }
    ],
    priceHistory: [
      {
        pricePkr: 3999000,
        priceType: 'EX_FACTORY',
        sourceName: 'Eco-Green Motors Official Brochure',
        verifiedAt: '2026-01-10'
      }
    ]
  },
  {
    id: 'v-omoda-e5',
    brandId: 'b-omoda-jaecoo',
    brandName: 'Omoda & JAECOO',
    brandSlug: 'omoda-jaecoo',
    name: 'Omoda E5 / JAECOO J6',
    slug: 'omoda-e5',
    bodyType: 'Crossover',
    tagline: 'Cyberpunk fastback electric crossover SUV with Sony Audio.',
    description: 'Omoda E5 boasts 61 kWh LFP battery, Sony premium sound system, curved 24.6-inch dual screens, and efficient power consumption of 15.5 kWh / 100 km.',
    startingPricePkr: 8990000,
    maxRangeKm: 430,
    topSpeedKmh: 172,
    accelerationSec: 7.6,
    isFeatured: false,
    imageUrl: '/images/vehicles/omoda e5.webp',
    distributorName: 'Chery / Ghandhara Automobiles',
    distributorIsOfficial: true,
    statusText: 'Officially Available',
    verifiedDate: 'Feb 2026',
    variants: [
      {
        id: 'var-omoda-e5-luxury',
        vehicleId: 'v-omoda-e5',
        name: 'Omoda E5 Luxury EV',
        slug: 'omoda-e5-luxury',
        pricePkr: 8990000,
        batteryCapacityKwh: 61.0,
        usableBatteryKwh: 61.0,
        wltpRangeKm: 430,
        nedcRangeKm: 470,
        motorPowerHp: 201,
        motorTorqueNm: 340,
        driveType: 'FWD',
        fastChargeKw: 80,
        acChargeKw: 9.6,
        fastChargeTimeMin: 28,
        acChargeTimeHours: 7.0,
        seatingCapacity: 5,
        groundClearanceMm: 180,
        bootSpaceLiters: 410,
        warrantyYears: 5,
        batteryWarrantyYears: 8
      }
    ],
    priceHistory: [
      {
        pricePkr: 13900000,
        priceType: 'EX_FACTORY',
        sourceName: 'Ghandhara Automobiles Tariff Notice',
        verifiedAt: '2026-01-05'
      }
    ]
  },
  {
    id: 'v-dongfeng-box',
    brandId: 'b-dongfeng',
    brandName: 'Dongfeng',
    brandSlug: 'dongfeng',
    name: 'Dongfeng Box',
    slug: 'dongfeng-box',
    bodyType: 'Hatchback',
    tagline: 'Chic urban electric car with frameless doors and auto-parking.',
    description: 'Dongfeng Box (Nammi 01) features frameless doors, flush handles, 12.8-inch screen, wireless charging, and L2 ADAS driver safety suite.',
    startingPricePkr: 5650000,
    maxRangeKm: 430,
    topSpeedKmh: 140,
    accelerationSec: 9.5,
    isFeatured: false,
    imageUrl: '/images/vehicles/dongfeng box.webp',
    distributorName: 'GuGo Motors Pakistan',
    distributorIsOfficial: true,
    statusText: 'Officially Available',
    verifiedDate: 'Feb 2026',
    variants: [
      {
        id: 'var-dongfeng-e1',
        vehicleId: 'v-dongfeng-box',
        name: 'Dongfeng Box E1 (330 km)',
        slug: 'dongfeng-box-e1',
        pricePkr: 5650000,
        batteryCapacityKwh: 31.4,
        usableBatteryKwh: 31.4,
        wltpRangeKm: 270,
        nedcRangeKm: 330,
        motorPowerHp: 94,
        motorTorqueNm: 160,
        driveType: 'FWD',
        fastChargeKw: 50,
        acChargeKw: 6.6,
        fastChargeTimeMin: 30,
        acChargeTimeHours: 5.5,
        seatingCapacity: 5,
        groundClearanceMm: 155,
        bootSpaceLiters: 326,
        warrantyYears: 3,
        batteryWarrantyYears: 8
      }
    ],
    priceHistory: [
      {
        pricePkr: 6600000,
        priceType: 'EX_FACTORY',
        sourceName: 'GuGo Motors Price Sheet',
        verifiedAt: '2026-01-05'
      }
    ]
  },
  {
    id: 'v-kia-ev5',
    brandId: 'b-kia',
    brandName: 'KIA',
    brandSlug: 'kia',
    name: 'KIA EV5',
    slug: 'kia-ev5',
    bodyType: 'SUV',
    tagline: 'Versatile E-GMP electric family crossover SUV.',
    description: 'Designed on Hyundai Motor Group\'s dedicated E-GMP platform, KIA EV5 delivers spacious modular seating, 800V multi-charging system, and V2L vehicle-to-load power.',
    startingPricePkr: 18500000,
    maxRangeKm: 530,
    topSpeedKmh: 185,
    accelerationSec: 7.2,
    isFeatured: false,
    imageUrl: '/images/vehicles/kia-ev5.webp',
    distributorName: 'Lucky Motor Corporation (LMC)',
    distributorIsOfficial: true,
    statusText: 'Officially Available',
    verifiedDate: 'Feb 2026',
    variants: [
      {
        id: 'var-kia-ev5-air',
        vehicleId: 'v-kia-ev5',
        name: 'KIA EV5 Air Standard',
        slug: 'kia-ev5-air',
        pricePkr: 18500000,
        batteryCapacityKwh: 64.2,
        usableBatteryKwh: 64.2,
        wltpRangeKm: 400,
        nedcRangeKm: 530,
        motorPowerHp: 215,
        motorTorqueNm: 310,
        driveType: 'FWD',
        fastChargeKw: 102,
        acChargeKw: 11,
        fastChargeTimeMin: 27,
        acChargeTimeHours: 6.5,
        seatingCapacity: 5,
        groundClearanceMm: 166,
        bootSpaceLiters: 513,
        warrantyYears: 4,
        batteryWarrantyYears: 8
      },
      {
        id: 'var-kia-ev5-earth',
        vehicleId: 'v-kia-ev5',
        name: 'KIA EV5 Earth AWD Long Range',
        slug: 'kia-ev5-earth',
        pricePkr: 23500000,
        batteryCapacityKwh: 88.1,
        usableBatteryKwh: 88.1,
        wltpRangeKm: 530,
        nedcRangeKm: 600,
        motorPowerHp: 308,
        motorTorqueNm: 480,
        driveType: 'AWD',
        fastChargeKw: 140,
        acChargeKw: 11,
        fastChargeTimeMin: 27,
        acChargeTimeHours: 8.5,
        seatingCapacity: 5,
        groundClearanceMm: 166,
        bootSpaceLiters: 513,
        warrantyYears: 4,
        batteryWarrantyYears: 8
      }
    ],
    priceHistory: [
      {
        pricePkr: 18500000,
        priceType: 'EX_FACTORY',
        sourceName: 'Lucky Motor Corporation Rate Card',
        verifiedAt: '2026-02-01'
      }
    ]
  },
  {
    id: 'v-audi-q8-etron',
    brandId: 'b-audi',
    brandName: 'Audi',
    brandSlug: 'audi',
    name: 'Audi Q8 e-tron',
    slug: 'audi-q8-etron',
    bodyType: 'SUV',
    tagline: 'Flagship German luxury electric SUV with 114 kWh battery.',
    description: 'The Audi Q8 e-tron sets standards in luxury electric mobility with virtual exterior mirrors, matrix LED lighting, and adaptive air suspension.',
    startingPricePkr: 48000000,
    maxRangeKm: 582,
    topSpeedKmh: 200,
    accelerationSec: 5.6,
    isFeatured: false,
    imageUrl: '/images/vehicles/Audi Q8 e-tron.webp',
    distributorName: 'Premier Systems (Audi Pakistan)',
    distributorIsOfficial: true,
    statusText: 'Official / Import',
    verifiedDate: 'Feb 2026',
    variants: [
      {
        id: 'var-audi-q8-55',
        vehicleId: 'v-audi-q8-etron',
        name: 'Audi Q8 e-tron 55 quattro',
        slug: 'audi-q8-etron-55',
        pricePkr: 48000000,
        batteryCapacityKwh: 114.0,
        usableBatteryKwh: 106.0,
        wltpRangeKm: 582,
        nedcRangeKm: 600,
        motorPowerHp: 402,
        motorTorqueNm: 664,
        driveType: 'AWD',
        fastChargeKw: 170,
        acChargeKw: 22,
        fastChargeTimeMin: 31,
        acChargeTimeHours: 6.0,
        seatingCapacity: 5,
        groundClearanceMm: 176,
        bootSpaceLiters: 569,
        warrantyYears: 2,
        batteryWarrantyYears: 8
      }
    ],
    priceHistory: [
      {
        pricePkr: 48000000,
        priceType: 'LISTED',
        sourceName: 'Audi Pakistan Showroom Tariff',
        verifiedAt: '2026-01-10'
      }
    ]
  }
];

export const CHARGING_STATIONS_DATA: ChargingStation[] = [
  {
    id: 'cs-khi-1',
    name: 'Mega Motors Fast DC Hub - CLIFTON',
    operator: 'BYD / Mega Motor Company',
    city: 'Karachi',
    locationName: 'Clifton Block 4 near Park Towers',
    latitude: 24.8215,
    longitude: 67.0310,
    address: 'Plot 14/A, Block 4, Clifton, Karachi, Sindh',
    totalPorts: 4,
    ccs2Ports: 4,
    gbtPorts: 0,
    type2Ports: 2,
    maxPowerKw: 120,
    isFastCharger: true,
    pricingPerUnitPkr: 85,
    operationalHours: '24/7',
    googleMapsUrl: 'https://maps.google.com/?q=24.8215,67.0310'
  },
  {
    id: 'cs-khi-2',
    name: 'Dewan ChargeUp DC Station - DHA PHASE 6',
    operator: 'ChargeUp Pakistan',
    city: 'Karachi',
    locationName: 'DHA Phase 6 Shahbaz Commercial',
    latitude: 24.8012,
    longitude: 67.0654,
    address: 'Main Khayaban-e-Seher, Phase 6 DHA, Karachi',
    totalPorts: 2,
    ccs2Ports: 2,
    gbtPorts: 2,
    type2Ports: 0,
    maxPowerKw: 60,
    isFastCharger: true,
    pricingPerUnitPkr: 80,
    operationalHours: '24/7',
    googleMapsUrl: 'https://maps.google.com/?q=24.8012,67.0654'
  },
  {
    id: 'cs-lhr-1',
    name: 'Master Changan Deepal Station - GULBERG III',
    operator: 'Deepal / Master Changan',
    city: 'Lahore',
    locationName: 'MM Alam Road, Gulberg III',
    latitude: 31.5102,
    longitude: 74.3512,
    address: 'MM Alam Rd, Block B2, Gulberg III, Lahore, Punjab',
    totalPorts: 4,
    ccs2Ports: 4,
    gbtPorts: 2,
    type2Ports: 2,
    maxPowerKw: 120,
    isFastCharger: true,
    pricingPerUnitPkr: 85,
    operationalHours: '24/7',
    googleMapsUrl: 'https://maps.google.com/?q=31.5102,74.3512'
  },
  {
    id: 'cs-lhr-2',
    name: 'Shell Recharge Fast Charger - DHA PHASE 5',
    operator: 'Shell Recharge',
    city: 'Lahore',
    locationName: 'DHA Phase 5 Commercial',
    latitude: 31.4711,
    longitude: 74.4105,
    address: 'Bedian Road, DHA Phase 5, Lahore, Punjab',
    totalPorts: 2,
    ccs2Ports: 2,
    gbtPorts: 0,
    type2Ports: 1,
    maxPowerKw: 60,
    isFastCharger: true,
    pricingPerUnitPkr: 90,
    operationalHours: '24/7',
    googleMapsUrl: 'https://maps.google.com/?q=31.4711,74.4105'
  },
  {
    id: 'cs-isb-1',
    name: 'Tesla Industries Fast DC Charger - F-7 MARKAZ',
    operator: 'Tesla Industries Pakistan',
    city: 'Islamabad',
    locationName: 'F-7 Markaz Jinnah Super',
    latitude: 33.7214,
    longitude: 73.0583,
    address: 'F-7 Markaz Plaza, Islamabad, ICT',
    totalPorts: 4,
    ccs2Ports: 2,
    gbtPorts: 2,
    type2Ports: 2,
    maxPowerKw: 120,
    isFastCharger: true,
    pricingPerUnitPkr: 85,
    operationalHours: '24/7',
    googleMapsUrl: 'https://maps.google.com/?q=33.7214,73.0583'
  },
  {
    id: 'cs-m2-1',
    name: 'M2 Motorway Bhera Rest Area Fast Charger',
    operator: 'NHA / ChargeUp',
    city: 'M2 Motorway',
    locationName: 'Bhera Rest Area (Northbound & Southbound)',
    latitude: 32.4820,
    longitude: 72.8830,
    address: 'M-2 Motorway Bhera Service Station',
    totalPorts: 4,
    ccs2Ports: 4,
    gbtPorts: 2,
    type2Ports: 0,
    maxPowerKw: 120,
    isFastCharger: true,
    pricingPerUnitPkr: 95,
    operationalHours: '24/7',
    googleMapsUrl: 'https://maps.google.com/?q=32.4820,72.8830'
  }
];

export const FAQS_DATA: FAQ[] = [
  {
    id: 'faq-1',
    category: 'EV_BASICS',
    question: 'What is the cheapest electric car available in Pakistan?',
    answer: 'As of 2026, the Honri VE 2.0 is Pakistan\'s cheapest electric car with an ex-factory price starting at PKR 3,999,000 (39.99 Lakhs), followed by the Honri VE 3.0 at PKR 4,999,000 and the Dongfeng Box E2 starting at PKR 6,600,000.'
  },
  {
    id: 'faq-2',
    category: 'CHARGING',
    question: 'How much does it cost to charge an electric car at home in Pakistan?',
    answer: 'Charging a typical 50 kWh electric car (like BYD Atto 3 Dynamic or MG4 Excite) at home using off-peak domestic tariffs (~PKR 45/kWh) costs approximately PKR 2,250 per full charge, yielding a driving range of 350-400 km.'
  },
  {
    id: 'faq-3',
    category: 'TAX_POLICY',
    question: 'What tax concessions apply to EVs under the Pakistan NEV Policy 2025-2030?',
    answer: 'Under Pakistan\'s National EV Policy, electric vehicles enjoy 1% customs duty on CBU EV imports up to 50kWh battery capacity, 1% sales tax (compared to 18% on petrol cars), and full exemption from provincial road tax and registration fees in Sindh and Islamabad.'
  },
  {
    id: 'faq-4',
    category: 'EV_BASICS',
    question: 'What is the per kilometer running cost of an EV compared to petrol in Pakistan?',
    answer: 'At PKR 45-65/kWh electricity tariff, an electric car costs approximately PKR 5.5 to PKR 7.1 per km to run in Pakistan. In comparison, a 1.8L petrol car (like Corolla or Civic) achieving 12 km/L at PKR 280/L costs approximately PKR 23.3 per km, generating savings of over PKR 17 per km.'
  }
];

export function getAllVehicles(): Vehicle[] {
  return VEHICLES_DATA;
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return VEHICLES_DATA.find((v) => v.slug === slug);
}

export function getVehiclesByBrand(brandSlug: string): Vehicle[] {
  return VEHICLES_DATA.filter((v) => v.brandSlug === brandSlug);
}

export function getAllBrands(): Brand[] {
  return BRANDS_DATA;
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return BRANDS_DATA.find((b) => b.slug === slug);
}

export function getAllChargingStations(): ChargingStation[] {
  return CHARGING_STATIONS_DATA;
}

export function getChargingStationsByCity(city: string): ChargingStation[] {
  return CHARGING_STATIONS_DATA.filter(
    (cs) => cs.city.toLowerCase() === city.toLowerCase()
  );
}

export function getAllFAQs(): FAQ[] {
  return FAQS_DATA;
}
