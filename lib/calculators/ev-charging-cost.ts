export interface ChargingCostInputs {
  batteryCapacityKwh: number;
  startSocPercent: number; // e.g. 10%
  targetSocPercent: number; // e.g. 80% or 100%
  chargerType: 'HOME_AC_7KW' | 'HOME_AC_11KW' | 'COMMERCIAL_DC_60KW' | 'COMMERCIAL_DC_120KW';
  tariffPerUnitPkr: number; // default: 45 for Home, 85-95 for Commercial DC
  chargerEfficiency: number; // default 90%
}

export interface ChargingCostResult {
  energyNeededKwh: number;
  totalEnergyBilledKwh: number;
  totalCostPkr: number;
  estimatedTimeMinutes: number;
  effectiveCostPerKwh: number;
}

export function calculateEvChargingCost(inputs: ChargingCostInputs): ChargingCostResult {
  const battery = inputs.batteryCapacityKwh || 60;
  const startSoc = Math.max(0, inputs.startSocPercent || 10);
  const targetSoc = Math.min(100, inputs.targetSocPercent || 80);
  const efficiency = (inputs.chargerEfficiency || 90) / 100;
  const tariff = inputs.tariffPerUnitPkr || 45;

  const socDeltaPercent = Math.max(0, targetSoc - startSoc);
  const energyNeededKwh = (battery * socDeltaPercent) / 100;
  const totalEnergyBilledKwh = energyNeededKwh / efficiency;

  const totalCostPkr = Math.round(totalEnergyBilledKwh * tariff);

  let chargerPowerKw = 7;
  if (inputs.chargerType === 'HOME_AC_11KW') chargerPowerKw = 11;
  else if (inputs.chargerType === 'COMMERCIAL_DC_60KW') chargerPowerKw = 55; // real-world power curve
  else if (inputs.chargerType === 'COMMERCIAL_DC_120KW') chargerPowerKw = 95; // real-world power curve

  const hoursNeeded = energyNeededKwh / chargerPowerKw;
  const estimatedTimeMinutes = Math.round(hoursNeeded * 60);

  const effectiveCostPerKwh = Math.round((totalCostPkr / (energyNeededKwh || 1)) * 100) / 100;

  return {
    energyNeededKwh: Math.round(energyNeededKwh * 10) / 10,
    totalEnergyBilledKwh: Math.round(totalEnergyBilledKwh * 10) / 10,
    totalCostPkr,
    estimatedTimeMinutes,
    effectiveCostPerKwh,
  };
}
