import { EMISSION_FACTORS, BENCHMARKS } from '../data/emissionFactors.js';

/**
 * Calculates electricity carbon emissions.
 * Formula: Net kWh * Emission Factor
 * 
 * @param {Object} data 
 * @returns {number} kg CO2e / month
 */
export function calculateElectricityEmissions(data = {}) {
  const kwh = Math.max(0, Number(data.kwhMonthly || 0));
  const solar = Math.max(0, Number(data.solarGenerationKwh || 0));
  const is100PercentRenewable = Boolean(data.usesRenewable);

  if (is100PercentRenewable) {
    return 0;
  }

  const netKwh = Math.max(0, kwh - solar);
  const factor = EMISSION_FACTORS.electricity.gridAverage;
  return Number((netKwh * factor).toFixed(2));
}

/**
 * Calculates LPG / Cooking fuel carbon emissions.
 * Formula: (cylinders * factor_per_cylinder) OR (SCM * factor_per_scm)
 * 
 * @param {Object} data 
 * @returns {number} kg CO2e / month
 */
export function calculateLpgEmissions(data = {}) {
  const fuelType = data.fuelType || 'cylinder';
  let emissions = 0;

  if (fuelType === 'cylinder') {
    const cylinders = Math.max(0, Number(data.cylinderCount || 0));
    emissions = cylinders * EMISSION_FACTORS.lpg.perCylinder14_2kg;
  } else if (fuelType === 'png') {
    const pngScm = Math.max(0, Number(data.pngScm || 0));
    emissions = pngScm * EMISSION_FACTORS.lpg.pipedNaturalGas;
  } else if (fuelType === 'induction') {
    // Induction electricity is captured under electricity consumption
    emissions = 0;
  }

  return Number(emissions.toFixed(2));
}

/**
 * Calculates Transportation carbon emissions.
 * Formula: Sum(distance_km * modeEmissionFactor)
 * 
 * @param {Object} data 
 * @returns {number} kg CO2e / month
 */
export function calculateTransportationEmissions(data = {}) {
  const carKm = Math.max(0, Number(data.carDistanceKm || 0));
  const carFuelType = data.carFuelType || 'petrolCar';
  const carFactor = carFuelType === 'none' ? 0 : (EMISSION_FACTORS.transportation[carFuelType] ?? EMISSION_FACTORS.transportation.petrolCar);
  const carEmissions = carKm * carFactor;

  const twoWheelerKm = Math.max(0, Number(data.twoWheelerDistanceKm || 0));
  const twoWheelerType = data.twoWheelerType || 'twoWheelerPetrol';
  const twoWheelerFactor = twoWheelerType === 'none' ? 0 : (EMISSION_FACTORS.transportation[twoWheelerType] ?? EMISSION_FACTORS.transportation.twoWheelerPetrol);
  const twoWheelerEmissions = twoWheelerKm * twoWheelerFactor;

  const busKm = Math.max(0, Number(data.busDistanceKm || 0));
  const busEmissions = busKm * EMISSION_FACTORS.transportation.cityBus;

  const metroKm = Math.max(0, Number(data.metroDistanceKm || 0));
  const metroEmissions = metroKm * EMISSION_FACTORS.transportation.metroTrain;

  const total = carEmissions + twoWheelerEmissions + busEmissions + metroEmissions;
  return Number(total.toFixed(2));
}

/**
 * Calculates Food & Dietary carbon emissions.
 * Formula: (dietFactor * householdMembers)
 * 
 * @param {Object} data 
 * @param {number} householdMembers
 * @returns {number} kg CO2e / month
 */
export function calculateFoodEmissions(data = {}, householdMembers = 1) {
  const members = Math.max(1, Number(householdMembers || 1));
  const dietType = data.dietType || 'vegetarian';
  const baseFactor = EMISSION_FACTORS.food[dietType] ?? EMISSION_FACTORS.food.vegetarian;

  // Food waste impact modifier
  let wasteModifier = 1.0;
  if (data.wasteAwareness === 'high') {
    wasteModifier = 0.95; // 5% reduction for zero-food-waste practices
  } else if (data.wasteAwareness === 'low') {
    wasteModifier = 1.05; // 5% increase for heavy food discard
  }

  const total = baseFactor * members * wasteModifier;
  return Number(total.toFixed(2));
}

/**
 * Calculates Waste carbon emissions.
 * Formula: (monthlyKg * netEmissionFactor)
 * 
 * @param {Object} data 
 * @returns {number} kg CO2e / month
 */
export function calculateWasteEmissions(data = {}) {
  const weeklyKg = Math.max(0, Number(data.wasteKgWeekly || 0));
  const monthlyKg = weeklyKg * 4.33; // Average weeks per month

  // Determine effective emission factor based on segregation and composting
  let factor = EMISSION_FACTORS.waste.generalLandfill;
  if (data.compostsOrganics && data.segregatesWaste) {
    factor = 0.15; // Substantial reduction with organic diversion and recycling
  } else if (data.segregatesWaste) {
    factor = 0.35; // Moderate reduction from recycling
  } else if (data.compostsOrganics) {
    factor = 0.30;
  }

  const total = monthlyKg * factor;
  return Number(total.toFixed(2));
}

/**
 * Aggregates all category emissions to compute total monthly and annual footprint.
 * 
 * @param {Object} formData 
 * @returns {Object} Comprehensive footprint results
 */
export function calculateTotalFootprint(formData = {}) {
  const members = Math.max(1, Number(formData?.household?.members || 1));

  const elecMonthly = calculateElectricityEmissions(formData?.electricity || {});
  const lpgMonthly = calculateLpgEmissions(formData?.lpg || {});
  const transportMonthly = calculateTransportationEmissions(formData?.transport || {});
  const foodMonthly = calculateFoodEmissions(formData?.food || {}, members);
  const wasteMonthly = calculateWasteEmissions(formData?.waste || {});

  const monthlyTotalKg = Number((elecMonthly + lpgMonthly + transportMonthly + foodMonthly + wasteMonthly).toFixed(1));
  const annualTotalTonnes = Number(((monthlyTotalKg * 12) / 1000).toFixed(2));
  const perCapitaAnnualTonnes = Number((annualTotalTonnes / members).toFixed(2));

  // Category percentages
  const calcPercentage = (val) => (monthlyTotalKg > 0 ? Number(((val / monthlyTotalKg) * 100).toFixed(1)) : 0);

  const categories = {
    electricity: { monthlyKg: elecMonthly, percentage: calcPercentage(elecMonthly), title: 'Household Electricity' },
    lpg: { monthlyKg: lpgMonthly, percentage: calcPercentage(lpgMonthly), title: 'Cooking Gas (LPG/PNG)' },
    transportation: { monthlyKg: transportMonthly, percentage: calcPercentage(transportMonthly), title: 'Mobility & Transport' },
    food: { monthlyKg: foodMonthly, percentage: calcPercentage(foodMonthly), title: 'Diet & Nutrition' },
    waste: { monthlyKg: wasteMonthly, percentage: calcPercentage(wasteMonthly), title: 'Solid Waste' },
  };

  // Identify highest category (primary driver)
  let highestKey = 'electricity';
  let highestVal = -1;
  Object.entries(categories).forEach(([key, item]) => {
    if (item.monthlyKg > highestVal) {
      highestVal = item.monthlyKg;
      highestKey = key;
    }
  });

  // Benchmark comparisons
  const benchmarkComparison = {
    nationalAvgRatio: BENCHMARKS.nationalAverageAnnual ? Number((perCapitaAnnualTonnes / BENCHMARKS.nationalAverageAnnual).toFixed(2)) : null,
    globalAvgRatio: BENCHMARKS.globalAverageAnnual ? Number((perCapitaAnnualTonnes / BENCHMARKS.globalAverageAnnual).toFixed(2)) : null,
    targetDiff: BENCHMARKS.parisAgreementTarget ? Number((perCapitaAnnualTonnes - BENCHMARKS.parisAgreementTarget).toFixed(2)) : null,
  };

  return {
    monthlyTotalKg,
    annualTotalTonnes,
    perCapitaAnnualTonnes,
    primaryDriver: {
      key: highestKey,
      title: categories[highestKey].title,
      monthlyKg: categories[highestKey].monthlyKg,
      percentage: categories[highestKey].percentage,
    },
    categories,
    benchmarkComparison,
    benchmarks: BENCHMARKS,
    isCalculated: true,
  };
}
