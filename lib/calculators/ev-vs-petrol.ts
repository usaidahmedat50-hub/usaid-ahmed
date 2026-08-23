export interface EvVsPetrolInputs {
  monthlyKm: number; // e.g. 1500 km/month
  petrolPricePkr: number; // default: 280 PKR/L
  petrolMileageKml: number; // default: 12 km/L (Civic/Corolla urban average)
  electricityTariffPkr: number; // default: 45 PKR/kWh (off-peak domestic) or 65 PKR/kWh
  evEfficiencyKwhPer100Km?: number; // e.g. 15 kWh / 100km
  evRangeKm?: number; // e.g. 400 km
  evBatteryKwh?: number; // e.g. 60 kWh
  chargingLossFactor?: number; // default: 0.10 (10% charger loss)
  evPricePkr?: number; // EV purchase price
  petrolPriceOnRoadPkr?: number; // Equivalent Petrol Car purchase price
}

export interface EvVsPetrolResult {
  evCostPerKm: number;
  petrolCostPerKm: number;
  monthlyEvCost: number;
  monthlyPetrolCost: number;
  monthlySavings: number;
  yearlySavings: number;
  fiveYearSavings: number;
  breakevenMonths: number | null;
  co2SavedTonsPerYear: number;
}

export function calculateEvVsPetrol(inputs: EvVsPetrolInputs): EvVsPetrolResult {
  const petrolPrice = inputs.petrolPricePkr || 280;
  const mileage = inputs.petrolMileageKml || 12;
  const tariff = inputs.electricityTariffPkr || 45;
  const lossFactor = inputs.chargingLossFactor ?? 0.10;
  const monthlyKm = inputs.monthlyKm || 1500;

  // Calculate EV efficiency in kWh/km
  let evKwhPerKm = 0.15; // default 15 kWh per 100 km -> 0.15 kWh/km
  if (inputs.evRangeKm && inputs.evBatteryKwh && inputs.evRangeKm > 0) {
    evKwhPerKm = inputs.evBatteryKwh / inputs.evRangeKm;
  } else if (inputs.evEfficiencyKwhPer100Km && inputs.evEfficiencyKwhPer100Km > 0) {
    evKwhPerKm = inputs.evEfficiencyKwhPer100Km / 100;
  }

  // EV Cost/km = (Tariff PKR/kWh * kWh/km) * (1 + lossFactor)
  const evCostPerKm = Math.round((tariff * evKwhPerKm * (1 + lossFactor)) * 100) / 100;
  
  // Petrol Cost/km = Petrol Price / Mileage
  const petrolCostPerKm = Math.round((petrolPrice / mileage) * 100) / 100;

  const monthlyEvCost = Math.round(monthlyKm * evCostPerKm);
  const monthlyPetrolCost = Math.round(monthlyKm * petrolCostPerKm);
  const monthlySavings = Math.max(0, monthlyPetrolCost - monthlyEvCost);
  const yearlySavings = monthlySavings * 12;
  const fiveYearSavings = yearlySavings * 5;

  let breakevenMonths: number | null = null;
  if (inputs.evPricePkr && inputs.petrolPriceOnRoadPkr && inputs.evPricePkr > inputs.petrolPriceOnRoadPkr) {
    const priceDelta = inputs.evPricePkr - inputs.petrolPriceOnRoadPkr;
    if (monthlySavings > 0) {
      breakevenMonths = Math.ceil(priceDelta / monthlySavings);
    }
  }

  // Petrol vehicle emits approx 2.31 kg CO2 per liter burned
  const monthlyPetrolLiters = monthlyKm / mileage;
  const yearlyPetrolLiters = monthlyPetrolLiters * 12;
  const co2SavedTonsPerYear = Math.round(((yearlyPetrolLiters * 2.31) / 1000) * 100) / 100;

  return {
    evCostPerKm,
    petrolCostPerKm,
    monthlyEvCost,
    monthlyPetrolCost,
    monthlySavings,
    yearlySavings,
    fiveYearSavings,
    breakevenMonths,
    co2SavedTonsPerYear,
  };
}
