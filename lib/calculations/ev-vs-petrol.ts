export interface EvVsPetrolInput {
  monthlyKm: number;
  petrolPricePkrPerLiter: number; // e.g. 275 PKR / L
  petrolFuelEconomyKmPerLiter: number; // e.g. 12 km / L
  electricityTariffPkrPerKwh: number; // e.g. 50 PKR / kWh
  evEfficiencyKwhPer100Km: number; // e.g. 15 kWh / 100 km
  homeChargingPercent: number; // e.g. 80%
  publicChargingTariffPkrPerKwh: number; // e.g. 90 PKR / kWh
  chargingLossPercent: number; // e.g. 10%
  evPurchasePricePkr: number; // e.g. 9,500,000 PKR
  petrolPurchasePricePkr: number; // e.g. 8,000,000 PKR
  annualPetrolMaintenancePkr: number; // e.g. 120,000 PKR
  annualEvMaintenancePkr: number; // e.g. 45,000 PKR
}

export interface EvVsPetrolResult {
  monthlyPetrolCostPkr: number;
  monthlyEvCostPkr: number;
  monthlySavingsPkr: number;
  annualEnergySavingsPkr: number;
  annualMaintenanceSavingsPkr: number;
  totalAnnualSavingsPkr: number;
  threeYearSavingsPkr: number;
  fiveYearSavingsPkr: number;
  costPerKmPetrolPkr: number;
  costPerKmEvPkr: number;
  breakEvenMonths: number;
}

export function calculateEvVsPetrol(input: EvVsPetrolInput): EvVsPetrolResult {
  const {
    monthlyKm,
    petrolPricePkrPerLiter,
    petrolFuelEconomyKmPerLiter,
    electricityTariffPkrPerKwh,
    evEfficiencyKwhPer100Km,
    homeChargingPercent,
    publicChargingTariffPkrPerKwh,
    chargingLossPercent,
    evPurchasePricePkr,
    petrolPurchasePricePkr,
    annualPetrolMaintenancePkr,
    annualEvMaintenancePkr,
  } = input;

  // Monthly Petrol Cost
  const litersPerMonth = monthlyKm / Math.max(1, petrolFuelEconomyKmPerLiter);
  const monthlyPetrolCostPkr = Math.round(litersPerMonth * petrolPricePkrPerLiter);

  // Monthly EV Cost
  const kwhRequiredNet = (monthlyKm / 100) * evEfficiencyKwhPer100Km;
  const kwhRequiredGross = kwhRequiredNet * (1 + chargingLossPercent / 100);

  const homeRatio = Math.min(100, Math.max(0, homeChargingPercent)) / 100;
  const publicRatio = 1 - homeRatio;

  const blendedTariffPkr = (homeRatio * electricityTariffPkrPerKwh) + (publicRatio * publicChargingTariffPkrPerKwh);
  const monthlyEvCostPkr = Math.round(kwhRequiredGross * blendedTariffPkr);

  const monthlySavingsPkr = Math.max(0, monthlyPetrolCostPkr - monthlyEvCostPkr);
  const annualEnergySavingsPkr = monthlySavingsPkr * 12;

  const annualMaintenanceSavingsPkr = Math.max(0, annualPetrolMaintenancePkr - annualEvMaintenancePkr);
  const totalAnnualSavingsPkr = annualEnergySavingsPkr + annualMaintenanceSavingsPkr;

  const threeYearSavingsPkr = totalAnnualSavingsPkr * 3;
  const fiveYearSavingsPkr = totalAnnualSavingsPkr * 5;

  const costPerKmPetrolPkr = Math.round((monthlyPetrolCostPkr / Math.max(1, monthlyKm)) * 10) / 10;
  const costPerKmEvPkr = Math.round((monthlyEvCostPkr / Math.max(1, monthlyKm)) * 10) / 10;

  const initialPriceDifferencePkr = Math.max(0, evPurchasePricePkr - petrolPurchasePricePkr);
  const monthlyTotalSavingsPkr = totalAnnualSavingsPkr / 12;

  let breakEvenMonths = 0;
  if (monthlyTotalSavingsPkr > 0 && initialPriceDifferencePkr > 0) {
    breakEvenMonths = Math.round(initialPriceDifferencePkr / monthlyTotalSavingsPkr);
  }

  return {
    monthlyPetrolCostPkr,
    monthlyEvCostPkr,
    monthlySavingsPkr,
    annualEnergySavingsPkr,
    annualMaintenanceSavingsPkr,
    totalAnnualSavingsPkr,
    threeYearSavingsPkr,
    fiveYearSavingsPkr,
    costPerKmPetrolPkr,
    costPerKmEvPkr,
    breakEvenMonths,
  };
}
