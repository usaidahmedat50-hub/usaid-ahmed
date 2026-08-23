export interface TcoInputs {
  ownershipYears: 3 | 5 | 7;
  annualKm: number; // default: 18000
  evPurchasePricePkr: number; // e.g. 8,990,000
  petrolPurchasePricePkr: number; // e.g. 8,500,000
  electricityTariffPkr: number; // default: 45
  petrolPricePkr: number; // default: 280
  petrolKmPerLiter: number; // default: 12
  evKwhPer100Km: number; // default: 15
  evAnnualMaintenancePkr?: number; // default: 25000
  petrolAnnualMaintenancePkr?: number; // default: 85000
  insuranceRatePercent?: number; // default: 2.5%
}

export interface TcoYearBreakdown {
  year: number;
  evEnergyCost: number;
  evMaintenanceCost: number;
  evInsuranceCost: number;
  evCumulativeTotal: number;
  petrolFuelCost: number;
  petrolMaintenanceCost: number;
  petrolInsuranceCost: number;
  petrolCumulativeTotal: number;
  netSavings: number;
}

export interface TcoResult {
  ownershipYears: number;
  evTotalCostOfOwnership: number;
  petrolTotalCostOfOwnership: number;
  totalNetSavingsPkr: number;
  evResaleValuePkr: number;
  petrolResaleValuePkr: number;
  yearlyBreakdown: TcoYearBreakdown[];
}

export function calculateTco(inputs: TcoInputs): TcoResult {
  const years = inputs.ownershipYears || 5;
  const annualKm = inputs.annualKm || 18000;
  const evPrice = inputs.evPurchasePricePkr || 8990000;
  const petrolPrice = inputs.petrolPurchasePricePkr || 8500000;
  const electricityTariff = inputs.electricityTariffPkr || 45;
  const petrolPriceL = inputs.petrolPricePkr || 280;
  const mileage = inputs.petrolKmPerLiter || 12;
  const kwhPerKm = (inputs.evKwhPer100Km || 15) / 100 * 1.10; // 10% charging loss

  const evMaintBase = inputs.evAnnualMaintenancePkr ?? 25000;
  const petrolMaintBase = inputs.petrolAnnualMaintenancePkr ?? 85000;
  const insRate = (inputs.insuranceRatePercent ?? 2.5) / 100;

  // Annual Energy / Fuel
  const annualEvEnergy = Math.round(annualKm * kwhPerKm * electricityTariff);
  const annualPetrolFuel = Math.round((annualKm / mileage) * petrolPriceL);

  let evCumCost = evPrice;
  let petrolCumCost = petrolPrice;

  // Depreciation models:
  // EV drops ~12% year 1, then ~8% per year
  // Petrol drops ~10% year 1, then ~7% per year
  let evCurrentVal = evPrice;
  let petrolCurrentVal = petrolPrice;

  const yearlyBreakdown: TcoYearBreakdown[] = [];

  for (let yr = 1; yr <= years; yr++) {
    // Depreciation
    const evDepRate = yr === 1 ? 0.12 : 0.08;
    const petrolDepRate = yr === 1 ? 0.10 : 0.07;

    evCurrentVal = evCurrentVal * (1 - evDepRate);
    petrolCurrentVal = petrolCurrentVal * (1 - petrolDepRate);

    // Maintenance escalates 5% per year
    const evMaint = Math.round(evMaintBase * Math.pow(1.05, yr - 1));
    const petrolMaint = Math.round(petrolMaintBase * Math.pow(1.08, yr - 1));

    // Insurance calculated on current vehicle residual value
    const evIns = Math.round(evCurrentVal * insRate);
    const petrolIns = Math.round(petrolCurrentVal * insRate);

    evCumCost += annualEvEnergy + evMaint + evIns;
    petrolCumCost += annualPetrolFuel + petrolMaint + petrolIns;

    yearlyBreakdown.push({
      year: yr,
      evEnergyCost: annualEvEnergy,
      evMaintenanceCost: evMaint,
      evInsuranceCost: evIns,
      evCumulativeTotal: Math.round(evCumCost),
      petrolFuelCost: annualPetrolFuel,
      petrolMaintenanceCost: petrolMaint,
      petrolInsuranceCost: petrolIns,
      petrolCumulativeTotal: Math.round(petrolCumCost),
      netSavings: Math.round(petrolCumCost - evCumCost),
    });
  }

  // Net TCO = Initial + Total Running + Maintenance + Insurance - Final Resale Value
  const evResaleValuePkr = Math.round(evCurrentVal);
  const petrolResaleValuePkr = Math.round(petrolCurrentVal);

  const evTotalCostOfOwnership = Math.round(evCumCost - evResaleValuePkr);
  const petrolTotalCostOfOwnership = Math.round(petrolCumCost - petrolResaleValuePkr);

  const totalNetSavingsPkr = Math.max(0, petrolTotalCostOfOwnership - evTotalCostOfOwnership);

  return {
    ownershipYears: years,
    evTotalCostOfOwnership,
    petrolTotalCostOfOwnership,
    totalNetSavingsPkr,
    evResaleValuePkr,
    petrolResaleValuePkr,
    yearlyBreakdown,
  };
}
