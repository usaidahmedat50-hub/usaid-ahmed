export interface TcoInput {
  purchasePricePkr: number;
  downPaymentPercent: number;
  interestRatePercent: number;
  loanTermYears: number;
  monthlyKm: number;
  evEfficiencyKwhPer100Km: number; // e.g. 15 kWh / 100 km
  electricityPricePkrPerKwh: number; // e.g. 50 PKR / kWh
  annualMaintenancePkr: number; // e.g. 45,000 PKR / yr
  annualInsurancePkr: number; // e.g. 120,000 PKR / yr
  annualTaxPkr: number; // e.g. 15,000 PKR / yr
  homeWallboxPricePkr: number; // e.g. 180,000 PKR
  ownershipYears: 3 | 5 | 7;
  estimatedResalePercent: number; // e.g. 60% after 5 years
}

export interface TcoResult {
  totalPurchaseOutlayPkr: number;
  totalFinancingCostPkr: number;
  totalEnergyCostPkr: number;
  totalMaintenanceCostPkr: number;
  totalInsuranceCostPkr: number;
  totalTaxCostPkr: number;
  chargingEquipmentCostPkr: number;
  estimatedResaleValuePkr: number;
  netTcoPkr: number;
  costPerKmPkr: number;
  monthlyEquivalentPkr: number;
}

export function calculateTco(input: TcoInput): TcoResult {
  const {
    purchasePricePkr,
    downPaymentPercent,
    interestRatePercent,
    loanTermYears,
    monthlyKm,
    evEfficiencyKwhPer100Km,
    electricityPricePkrPerKwh,
    annualMaintenancePkr,
    annualInsurancePkr,
    annualTaxPkr,
    homeWallboxPricePkr,
    ownershipYears,
    estimatedResalePercent,
  } = input;

  const totalKm = monthlyKm * 12 * ownershipYears;
  const downPaymentAmount = purchasePricePkr * (downPaymentPercent / 100);
  const loanPrincipal = purchasePricePkr - downPaymentAmount;

  // Simple amortized loan interest estimation over loan term
  const annualInterestRate = interestRatePercent / 100;
  const monthlyRate = annualInterestRate / 12;
  const totalMonths = loanTermYears * 12;
  
  let monthlyLoanPayment = 0;
  if (monthlyRate > 0 && loanPrincipal > 0) {
    monthlyLoanPayment = (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else if (loanPrincipal > 0) {
    monthlyLoanPayment = loanPrincipal / totalMonths;
  }

  const totalFinancingCostPkr = Math.max(0, (monthlyLoanPayment * totalMonths) - loanPrincipal);
  const totalEnergyCostPkr = Math.round((totalKm / 100) * evEfficiencyKwhPer100Km * electricityPricePkrPerKwh);
  const totalMaintenanceCostPkr = Math.round(annualMaintenancePkr * ownershipYears);
  const totalInsuranceCostPkr = Math.round(annualInsurancePkr * ownershipYears);
  const totalTaxCostPkr = Math.round(annualTaxPkr * ownershipYears);
  const estimatedResaleValuePkr = Math.round(purchasePricePkr * (estimatedResalePercent / 100));

  const netTcoPkr = Math.round(
    purchasePricePkr +
    totalFinancingCostPkr +
    totalEnergyCostPkr +
    totalMaintenanceCostPkr +
    totalInsuranceCostPkr +
    totalTaxCostPkr +
    homeWallboxPricePkr -
    estimatedResaleValuePkr
  );

  const costPerKmPkr = Math.round((netTcoPkr / Math.max(1, totalKm)) * 10) / 10;
  const monthlyEquivalentPkr = Math.round(netTcoPkr / (ownershipYears * 12));

  return {
    totalPurchaseOutlayPkr: purchasePricePkr,
    totalFinancingCostPkr: Math.round(totalFinancingCostPkr),
    totalEnergyCostPkr,
    totalMaintenanceCostPkr,
    totalInsuranceCostPkr,
    totalTaxCostPkr,
    chargingEquipmentCostPkr: homeWallboxPricePkr,
    estimatedResaleValuePkr,
    netTcoPkr,
    costPerKmPkr,
    monthlyEquivalentPkr,
  };
}
