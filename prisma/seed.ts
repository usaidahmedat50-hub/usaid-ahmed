import { PrismaClient } from '@prisma/client';
import { BRANDS_DATA, VEHICLES_DATA, CHARGING_STATIONS_DATA, FAQS_DATA } from '../lib/data/mock-db';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PakEVFinder MySQL Database with BYD Atto 3 Photography...');

  // Seed Brands
  for (const b of BRANDS_DATA) {
    await prisma.brand.upsert({
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
  }

  // Seed Vehicles & Variants
  for (const v of VEHICLES_DATA) {
    const createdVehicle = await prisma.vehicle.upsert({
      where: { slug: v.slug },
      update: {
        name: v.name,
        bodyType: v.bodyType,
        tagline: v.tagline,
        description: v.description,
        startingPricePkr: v.startingPricePkr,
        maxRangeKm: v.maxRangeKm,
        topSpeedKmh: v.topSpeedKmh,
        accelerationSec: v.accelerationSec,
        isFeatured: v.isFeatured,
        imageUrl: v.imageUrl,
      },
      create: {
        id: v.id,
        brandId: v.brandId,
        name: v.name,
        slug: v.slug,
        bodyType: v.bodyType,
        tagline: v.tagline,
        description: v.description,
        startingPricePkr: v.startingPricePkr,
        maxRangeKm: v.maxRangeKm,
        topSpeedKmh: v.topSpeedKmh,
        accelerationSec: v.accelerationSec,
        isFeatured: v.isFeatured,
        imageUrl: v.imageUrl,
      },
    });

    for (const variant of v.variants) {
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

      // Seed Vehicle Specification
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

    // Seed Price History
    for (const ph of v.priceHistory) {
      await prisma.priceHistory.create({
        data: {
          vehicleId: createdVehicle.id,
          pricePkr: ph.pricePkr,
          priceType: ph.priceType,
          sourceName: ph.sourceName,
          verifiedAt: new Date(ph.verifiedAt),
        },
      });
    }
  }

  // Seed Charging Stations
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

  // Seed FAQs
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

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
