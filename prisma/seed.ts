import { PrismaClient } from '@prisma/client';
import { BRANDS_DATA, VEHICLES_DATA, CHARGING_STATIONS_DATA, FAQS_DATA } from '../lib/data/mock-db';

const prisma = new PrismaClient();

const vehiclesData = [
  {
    name: "BYD Atto 3",
    slug: "byd-atto-3",
    brand: "BYD",
    bodyType: "SUV",
    price: 8990000,
    battery: 49.92,
    range: 410,
    imageUrl: "/images/vehicles/byd-atto-3.webp"
  },
  {
    name: "BYD Seal",
    slug: "byd-seal",
    brand: "BYD",
    bodyType: "Sedan",
    price: 14790000,
    battery: 82.56,
    range: 570,
    imageUrl: "/images/vehicles/byd-seal.webp"
  },
  {
    name: "Deepal S07",
    slug: "deepal-s07",
    brand: "Deepal",
    bodyType: "SUV",
    price: 13990000,
    battery: 66.8,
    range: 485,
    imageUrl: "/images/vehicles/deepal-s07.webp"
  },
  {
    name: "Deepal L07",
    slug: "deepal-l07",
    brand: "Deepal",
    bodyType: "Sedan",
    price: 13990000,
    battery: 66.8,
    range: 530,
    imageUrl: "/images/vehicles/deepal-l07.webp"
  },
  {
    name: "MG4 EV",
    slug: "mg4-ev",
    brand: "MG",
    bodyType: "Hatchback",
    price: 10990000,
    battery: 51.0,
    range: 350,
    imageUrl: "/images/vehicles/mg4-ev.webp"
  },
  {
    name: "MG ZS EV",
    slug: "mg-zs-ev",
    brand: "MG",
    bodyType: "SUV",
    price: 12990000,
    battery: 51.1,
    range: 320,
    imageUrl: "/images/vehicles/mg-zs-ev.webp"
  },
  {
    name: "Honri VE 2.0",
    slug: "honri-ve",
    brand: "Honri",
    bodyType: "City Hatchback",
    price: 3999000,
    battery: 18.5,
    range: 200,
    imageUrl: "/images/vehicles/honri-ve.webp"
  },
  {
    name: "KIA EV5",
    slug: "kia-ev5",
    brand: "KIA",
    bodyType: "SUV",
    price: 18500000,
    battery: 88.1,
    range: 530,
    imageUrl: "/images/vehicles/kia-ev5.webp"
  }
];

async function main() {
  console.log('Seeding PakEVFinder Database with strict local image mappings...');

  // 1. Seed Brands
  const brandMap = new Map<string, string>();
  for (const b of BRANDS_DATA) {
    const createdBrand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        country: b.country,
        officialDistributor: b.officialDistributor,
        website: b.website,
        description: b.description,
      },
      create: {
        id: b.id,
        name: b.name,
        slug: b.slug,
        country: b.country,
        officialDistributor: b.officialDistributor,
        website: b.website,
        description: b.description,
      },
    });
    brandMap.set(b.name.toLowerCase(), createdBrand.id);
    brandMap.set(b.slug.toLowerCase(), createdBrand.id);
  }

  // 2. Seed Strict vehiclesData Dictionary
  for (const item of vehiclesData) {
    const brandId = brandMap.get(item.brand.toLowerCase()) || Array.from(brandMap.values())[0];
    
    // Find rich metadata from mock-db if available
    const mockMatch = VEHICLES_DATA.find((v) => v.slug === item.slug);
    const tagline = mockMatch?.tagline || `${item.name} electric vehicle in Pakistan.`;
    const description = mockMatch?.description || `${item.name} delivers zero-emission driving with a ${item.battery} kWh battery and ${item.range} km range.`;
    const topSpeedKmh = mockMatch?.topSpeedKmh || 160;
    const accelerationSec = mockMatch?.accelerationSec || 7.5;
    const isFeatured = mockMatch?.isFeatured ?? true;

    const createdVehicle = await prisma.vehicle.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        bodyType: item.bodyType,
        startingPricePkr: item.price,
        maxRangeKm: item.range,
        imageUrl: item.imageUrl,
        tagline: tagline,
        description: description,
        topSpeedKmh: topSpeedKmh,
        accelerationSec: accelerationSec,
        isFeatured: isFeatured,
      },
      create: {
        brandId: brandId,
        name: item.name,
        slug: item.slug,
        bodyType: item.bodyType,
        tagline: tagline,
        description: description,
        startingPricePkr: item.price,
        maxRangeKm: item.range,
        topSpeedKmh: topSpeedKmh,
        accelerationSec: accelerationSec,
        isFeatured: isFeatured,
        imageUrl: item.imageUrl,
      },
    });

    // Seed variant if present in mockMatch
    if (mockMatch && mockMatch.variants && mockMatch.variants.length > 0) {
      for (const variant of mockMatch.variants) {
        await prisma.variant.upsert({
          where: { slug: variant.slug },
          update: {
            name: variant.name,
            pricePkr: variant.pricePkr,
            batteryCapacityKwh: variant.batteryCapacityKwh,
            usableBatteryKwh: variant.usableBatteryKwh,
            wltpRangeKm: variant.wltpRangeKm,
            nedcRangeKm: variant.nedcRangeKm,
            motorPowerHp: variant.motorPowerHp,
            motorTorqueNm: variant.motorTorqueNm,
            driveType: variant.driveType,
            fastChargeKw: variant.fastChargeKw,
            acChargeKw: variant.acChargeKw,
            fastChargeTimeMin: variant.fastChargeTimeMin,
            acChargeTimeHours: variant.acChargeTimeHours,
          },
          create: {
            id: variant.id,
            vehicleId: createdVehicle.id,
            name: variant.name,
            slug: variant.slug,
            pricePkr: variant.pricePkr,
            batteryCapacityKwh: variant.batteryCapacityKwh,
            usableBatteryKwh: variant.usableBatteryKwh,
            wltpRangeKm: variant.wltpRangeKm,
            nedcRangeKm: variant.nedcRangeKm,
            motorPowerHp: variant.motorPowerHp,
            motorTorqueNm: variant.motorTorqueNm,
            driveType: variant.driveType,
            fastChargeKw: variant.fastChargeKw,
            acChargeKw: variant.acChargeKw,
            fastChargeTimeMin: variant.fastChargeTimeMin,
            acChargeTimeHours: variant.acChargeTimeHours,
          },
        });

        await prisma.vehicleSpecification.upsert({
          where: { variantId: variant.id },
          update: {
            seatingCapacity: variant.seatingCapacity,
            groundClearanceMm: variant.groundClearanceMm,
            bootSpaceLiters: variant.bootSpaceLiters,
            warrantyYears: variant.warrantyYears,
            batteryWarrantyYears: variant.batteryWarrantyYears,
          },
          create: {
            variantId: variant.id,
            seatingCapacity: variant.seatingCapacity,
            groundClearanceMm: variant.groundClearanceMm,
            bootSpaceLiters: variant.bootSpaceLiters,
            kerbWeightKg: 1600,
            dimensionsMm: '4455 x 1875 x 1615 mm',
            tireSize: '215/60 R18',
            warrantyYears: variant.warrantyYears,
            batteryWarrantyYears: variant.batteryWarrantyYears,
            warrantyKm: 150000,
            warrantyBatteryKm: 160000,
            featuresJson: JSON.stringify(['ADAS L2 Safety', 'Panoramic Glass Roof', '360 HD Camera', 'V2L Power Output']),
          },
        });
      }
    } else {
      // Default Variant for items without pre-existing mock variants
      const variantSlug = `${item.slug}-standard`;
      const createdVariant = await prisma.variant.upsert({
        where: { slug: variantSlug },
        update: {
          pricePkr: item.price,
          batteryCapacityKwh: item.battery,
          usableBatteryKwh: item.battery,
          wltpRangeKm: item.range,
        },
        create: {
          vehicleId: createdVehicle.id,
          name: `${item.name} Standard`,
          slug: variantSlug,
          pricePkr: item.price,
          batteryCapacityKwh: item.battery,
          usableBatteryKwh: item.battery,
          wltpRangeKm: item.range,
          nedcRangeKm: item.range + 40,
          motorPowerHp: 200,
          motorTorqueNm: 310,
          driveType: 'FWD',
          fastChargeKw: 80,
          acChargeKw: 7,
          fastChargeTimeMin: 40,
          acChargeTimeHours: 7.5,
        },
      });

      await prisma.vehicleSpecification.upsert({
        where: { variantId: createdVariant.id },
        update: {
          seatingCapacity: 5,
        },
        create: {
          variantId: createdVariant.id,
          seatingCapacity: 5,
          groundClearanceMm: 165,
          bootSpaceLiters: 400,
          kerbWeightKg: 1600,
          dimensionsMm: '4455 x 1875 x 1615 mm',
          tireSize: '215/60 R18',
          warrantyYears: 5,
          batteryWarrantyYears: 8,
          warrantyKm: 150000,
          warrantyBatteryKm: 160000,
          featuresJson: JSON.stringify(['L2 ADAS', 'Touchscreen Console', 'V2L Capability']),
        },
      });
    }
  }

  // 3. Seed Charging Stations
  for (const cs of CHARGING_STATIONS_DATA) {
    await prisma.chargingStation.upsert({
      where: { id: cs.id },
      update: {
        name: cs.name,
        operator: cs.operator,
        city: cs.city,
        maxPowerKw: cs.maxPowerKw,
        pricingPerUnitPkr: cs.pricingPerUnitPkr,
      },
      create: {
        id: cs.id,
        name: cs.name,
        operator: cs.operator,
        city: cs.city,
        locationName: cs.locationName,
        latitude: cs.latitude,
        longitude: cs.longitude,
        address: cs.address,
        totalPorts: cs.totalPorts,
        ccs2Ports: cs.ccs2Ports,
        gbtPorts: cs.gbtPorts,
        type2Ports: cs.type2Ports,
        maxPowerKw: cs.maxPowerKw,
        isFastCharger: cs.isFastCharger,
        pricingPerUnitPkr: cs.pricingPerUnitPkr,
        operationalHours: cs.operationalHours,
        googleMapsUrl: cs.googleMapsUrl,
      },
    });
  }

  // 4. Seed FAQs
  for (const f of FAQS_DATA) {
    await prisma.fAQ.upsert({
      where: { id: f.id },
      update: {
        question: f.question,
        answer: f.answer,
      },
      create: {
        id: f.id,
        category: f.category,
        question: f.question,
        answer: f.answer,
      },
    });
  }

  console.log('Seeding completed successfully with local vehicle images!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
