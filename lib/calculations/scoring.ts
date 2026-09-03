export interface VehicleScoringInput {
  startingPricePkr: number;
  maxRangeKm: number;
  batteryCapacityKwh: number;
  fastChargeKw: number;
  motorPowerHp: number;
  motorTorqueNm: number;
  accelerationSec: number;
  warrantyYears: number;
  batteryWarrantyYears: number;
}

export interface CategoryScore {
  category: string;
  score: number; // 0 to 10 scale
  label: string;
  explanation: string;
}

export interface VehicleScoreResult {
  overallScore: number;
  categoryScores: Record<string, CategoryScore>;
}

/**
 * Transparent calculation engine for vehicle value and performance scoring.
 * Scores are calculated independently from UI layout.
 */
export function calculateVehicleScore(input: VehicleScoringInput): VehicleScoreResult {
  const {
    startingPricePkr,
    maxRangeKm,
    batteryCapacityKwh,
    fastChargeKw,
    motorPowerHp,
    motorTorqueNm,
    accelerationSec,
    warrantyYears,
    batteryWarrantyYears,
  } = input;

  // 1. Range Score (Target 600km = 10/10)
  const rangeScore = Math.min(10, Math.max(1, (maxRangeKm / 600) * 10));

  // 2. Charging Score (Target 200 kW = 10/10)
  const chargingScore = Math.min(10, Math.max(1, (fastChargeKw / 200) * 10));

  // 3. Performance Score (Hp + Acceleration bonus)
  const accelBonus = accelerationSec > 0 ? Math.max(0, (10 - accelerationSec)) : 3;
  const powerScore = Math.min(10, Math.max(1, (motorPowerHp / 500) * 7 + (accelBonus / 10) * 3));

  // 4. Value Score (Range per PKR Million)
  const priceMillions = startingPricePkr > 0 ? startingPricePkr / 1000000 : 10;
  const rangePerMillion = priceMillions > 0 ? maxRangeKm / priceMillions : 30;
  const valueScore = Math.min(10, Math.max(1, (rangePerMillion / 50) * 10));

  // 5. Ownership & Warranty Score
  const warrantyScore = Math.min(10, Math.max(1, ((warrantyYears + batteryWarrantyYears) / 16) * 10));

  const categoryScores: Record<string, CategoryScore> = {
    range: {
      category: 'Range Efficiency',
      score: Math.round(rangeScore * 10) / 10,
      label: rangeScore >= 8 ? 'Excellent Range' : rangeScore >= 5 ? 'Good City/Intercity Range' : 'Urban Range',
      explanation: `${maxRangeKm} km WLTP/NEDC range evaluated against intercity driving needs.`,
    },
    charging: {
      category: 'Fast Charging',
      score: Math.round(chargingScore * 10) / 10,
      label: chargingScore >= 8 ? 'Ultra-Fast DC Charging' : chargingScore >= 5 ? 'Fast DC Charging' : 'Standard DC Charging',
      explanation: `${fastChargeKw} kW DC peak charging power.`,
    },
    performance: {
      category: 'Performance',
      score: Math.round(powerScore * 10) / 10,
      label: powerScore >= 8 ? 'High Performance' : 'Balanced Performance',
      explanation: `${motorPowerHp} HP, ${motorTorqueNm} Nm torque, 0-100 km/h in ${accelerationSec}s.`,
    },
    value: {
      category: 'Value for Money',
      score: Math.round(valueScore * 10) / 10,
      label: valueScore >= 7 ? 'High Value per PKR' : 'Standard Market Value',
      explanation: `Range and battery capacity provided relative to ex-factory pricing.`,
    },
    ownership: {
      category: 'Ownership & Warranty',
      score: Math.round(warrantyScore * 10) / 10,
      label: warrantyScore >= 8 ? 'Comprehensive Warranty' : 'Standard Warranty Coverage',
      explanation: `${warrantyYears} Yrs Vehicle / ${batteryWarrantyYears} Yrs Battery Warranty.`,
    },
  };

  const scoresArray = Object.values(categoryScores).map((c) => c.score);
  const overallScore = Math.round((scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length) * 10) / 10;

  return {
    overallScore,
    categoryScores,
  };
}

/**
 * Compare two vehicles side-by-side and highlight the category winner.
 */
export function compareVehicleScores(
  v1Input: VehicleScoringInput,
  v2Input: VehicleScoringInput
) {
  const v1Score = calculateVehicleScore(v1Input);
  const v2Score = calculateVehicleScore(v2Input);

  return {
    vehicle1: v1Score,
    vehicle2: v2Score,
    winnerRange: v1Score.categoryScores.range.score >= v2Score.categoryScores.range.score ? 1 : 2,
    winnerCharging: v1Score.categoryScores.charging.score >= v2Score.categoryScores.charging.score ? 1 : 2,
    winnerPerformance: v1Score.categoryScores.performance.score >= v2Score.categoryScores.performance.score ? 1 : 2,
    winnerValue: v1Score.categoryScores.value.score >= v2Score.categoryScores.value.score ? 1 : 2,
    winnerOverall: v1Score.overallScore >= v2Score.overallScore ? 1 : 2,
  };
}
