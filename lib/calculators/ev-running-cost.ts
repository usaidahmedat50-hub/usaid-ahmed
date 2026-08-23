export interface RunningCostInputs {
  dailyKm: number;
  discoName: 'KElectric' | 'LESCO' | 'IESCO' | 'FESCO' | 'PESCO' | 'Custom';
  tariffOffPeakPkr: number; // default: 45
  tariffPeakPkr: number;    // default: 65
  offPeakChargingPercentage: number; // default: 80% off-peak, 20% peak
  batteryCapacityKwh: number; // e.g. 60
  realWorldRangeKm: number;  // e.g. 400
}

export interface RunningCostResult {
  dailyCostPkr: number;
  weeklyCostPkr: number;
  monthlyCostPkr: number;
  annualCostPkr: number;
  blendedTariffPkr: number;
  costPerKmPkr: number;
  unitsConsumedPerMonthKwh: number;
}

export function calculateEvRunningCost(inputs: RunningCostInputs): RunningCostResult {
  const dailyKm = inputs.dailyKm || 50;
  const offPeakTariff = inputs.tariffOffPeakPkr || 45;
  const peakTariff = inputs.tariffPeakPkr || 65;
  const offPeakPct = (inputs.offPeakChargingPercentage ?? 80) / 100;
  const peakPct = 1 - offPeakPct;

  const blendedTariffPkr = Math.round((offPeakTariff * offPeakPct + peakTariff * peakPct) * 100) / 100;

  const range = inputs.realWorldRangeKm || 380;
  const battery = inputs.batteryCapacityKwh || 60;
  const kwhPerKm = (battery / range) * 1.10; // 10% AC charge loss included

  const costPerKmPkr = Math.round((kwhPerKm * blendedTariffPkr) * 100) / 100;

  const dailyCostPkr = Math.round(dailyKm * costPerKmPkr);
  const weeklyCostPkr = Math.round(dailyCostPkr * 7);
  const monthlyCostPkr = Math.round(dailyCostPkr * 30);
  const annualCostPkr = Math.round(dailyCostPkr * 365);
  const unitsConsumedPerMonthKwh = Math.round(dailyKm * 30 * kwhPerKm);

  return {
    dailyCostPkr,
    weeklyCostPkr,
    monthlyCostPkr,
    annualCostPkr,
    blendedTariffPkr,
    costPerKmPkr,
    unitsConsumedPerMonthKwh,
  };
}
