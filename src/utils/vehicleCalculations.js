/**
 * TerraTrace Drive — Vehicle CO2 Emission Calculation Engine
 * 
 * Independent, scientifically verified calculation functions for vehicle greenhouse gas emissions.
 * 
 * CORE SCIENTIFIC FORMULAS AND BOUNDARIES:
 * 
 * 1. DISTANCE-BASED CALCULATION (METHOD A):
 *    - Liquid fuels (petrol, diesel):
 *        fuelConsumedLitres = distanceKm / efficiencyKmPerLitre
 *        directCO2Kg = fuelConsumedLitres * emissionFactorKgCO2PerLitre
 *        Scientific Basis: Complete stoichiometric oxidation of hydrocarbons generates direct
 *        tailpipe carbon dioxide emissions (Scope 1).
 *    - CNG:
 *        fuelConsumedKg = distanceKm / efficiencyKmPerKg
 *        directCO2Kg = fuelConsumedKg * emissionFactorKgCO2PerKg
 *        Scientific Basis: Compressed Natural Gas is measured by mass (kg) because gas density
 *        varies under pressure (200–250 bar). Methane combustion produces direct tailpipe CO2 (Scope 1).
 *    - Electric Vehicles (EV):
 *        electricityConsumedKWh = distanceKm / efficiencyKmPerKWh
 *        electricityCO2Kg = electricityConsumedKWh * gridEmissionFactorKgCO2ePerKWh
 *        Scientific Basis: Battery electric vehicles (BEVs) produce 0 g/km tailpipe emissions
 *        at the point of operation. Emissions shown reflect Scope 2 indirect power generation
 *        emissions at regional electrical utilities supplying the charging grid.
 * 
 * 2. ACTUAL-CONSUMPTION CALCULATION (METHOD B):
 *    - Liquid fuels & CNG:
 *        directCO2Kg = actualFuelConsumed * correspondingEmissionFactor
 *    - Electric Vehicles (EV):
 *        electricityCO2Kg = actualChargingElectricityConsumed * applicableElectricityEmissionFactor
 *    - Double-Counting Prevention:
 *        When actual consumption is provided, it serves as the sole energy volume source.
 *        Distance is never used to derive duplicate fuel consumption.
 * 
 * 3. ANNUALIZATION:
 *    yearlyEmissionsKg = monthlyEmissionsKg * 12
 *    yearlyEmissionsTonnes = yearlyEmissionsKg / 1000
 *    Full precision is preserved throughout calculations; rounding is reserved for UI display.
 * 
 * 4. EMISSIONS INTENSITY PER KM:
 *    emissionsPerKm = distanceKm > 0 ? (monthlyEmissionsKg / distanceKm) : 0
 *    emissionsPerKmGrams = emissionsPerKm * 1000
 *    Division by zero is strictly guarded to avoid NaN or Infinity.
 * 
 * 5. VALIDATION AND SAFE NUMERIC BOUNDS:
 *    Handles missing, zero, negative, string, and extreme values safely.
 *    Unsupported vehicle-fuel combinations are clearly identified and calculations disabled.
 */

import { 
  getVehicleEmissionFactor, 
  isVehicleFuelSupported, 
  getUnsupportedReason 
} from '../data/vehicleEmissionFactors.js';

export {
  isVehicleFuelSupported,
  getUnsupportedReason,
  getVehicleEmissionFactor
};

/**
 * Sanitize and validate numeric inputs to prevent NaN, Infinity, negative values, and overflows.
 * 
 * @param {any} val - The input value to sanitize
 * @param {number} fallback - The fallback value if invalid (default: 0)
 * @param {number} min - Minimum allowed value (default: 0)
 * @param {number} max - Maximum allowed value (default: 1e9)
 * @returns {number} Sanitized safe finite number
 */
export function sanitizeNumber(val, fallback = 0, min = 0, max = 1e9) {
  if (val === null || val === undefined || val === '') {
    return fallback;
  }
  const num = Number(val);
  if (!Number.isFinite(num) || isNaN(num)) {
    return fallback;
  }
  if (num < min) {
    return min;
  }
  if (num > max) {
    return max;
  }
  return num;
}

/**
 * Executes a Distance-Based CO2 Calculation (Method A).
 * 
 * Mathematical Formulas:
 * 1. Liquid Fuels (Petrol & Diesel):
 *    fuelConsumedLitres = distanceKm / efficiencyKmPerLitre
 *    directCO2Kg = fuelConsumedLitres * emissionFactorKgCO2PerLitre
 * 
 * 2. CNG:
 *    fuelConsumedKg = distanceKm / efficiencyKmPerKg
 *    directCO2Kg = fuelConsumedKg * emissionFactorKgCO2PerKg
 * 
 * 3. Electric Vehicles (EV):
 *    electricityConsumedKWh = distanceKm / efficiencyKmPerKWh
 *    electricityCO2Kg = electricityConsumedKWh * gridEmissionFactorKgCO2ePerKWh
 * 
 * @param {Object} params
 * @param {string} params.vehicleType - Vehicle classification ('car', 'motorcycle', 'scooter', 'bus', 'other')
 * @param {string} params.fuelType - Powertrain ('petrol', 'diesel', 'cng', 'electric')
 * @param {number} params.distanceKm - Distance travelled in kilometres
 * @param {number} params.efficiency - Efficiency (km/L, km/kg, or km/kWh)
 * @returns {Object} Standardized calculation result
 */
export function calculateDistanceBasedEmissions({
  vehicleType = 'car',
  fuelType = 'petrol',
  distanceKm = 0,
  efficiency = 0,
} = {}) {
  const normVeh = String(vehicleType || '').toLowerCase().trim();
  const normFuel = String(fuelType || '').toLowerCase().trim();

  // 1. Verify factor availability and vehicle-fuel compatibility
  if (!isVehicleFuelSupported(normVeh, normFuel)) {
    return createUnsupportedResult({
      vehicleType: normVeh,
      fuelType: normFuel,
      calculationMethod: 'distance_efficiency',
      distanceKm,
    });
  }

  const factorObj = getVehicleEmissionFactor(normVeh, normFuel);
  if (!factorObj) {
    return createUnsupportedResult({
      vehicleType: normVeh,
      fuelType: normFuel,
      calculationMethod: 'distance_efficiency',
      distanceKm,
    });
  }

  // 2. Validate and sanitize distance (clamp safely between 0 and 10,000,000 km)
  const sanitizedDistance = sanitizeNumber(distanceKm, 0, 0, 1e7);

  // 3. Validate efficiency (must be strictly positive to avoid division by zero / Infinity)
  const rawEfficiency = Number(efficiency);
  if (!Number.isFinite(rawEfficiency) || isNaN(rawEfficiency) || rawEfficiency <= 0) {
    return createInvalidResult({
      vehicleType: normVeh,
      fuelType: normFuel,
      calculationMethod: 'distance_efficiency',
      distanceKm: sanitizedDistance,
      error: 'Invalid efficiency: Fuel efficiency must be a positive number greater than 0.',
      factorObj,
    });
  }
  const sanitizedEfficiency = sanitizeNumber(rawEfficiency, 1, 1e-4, 1e5);

  // 4. Calculate fuel or electricity consumed
  // Formula: fuelConsumed = distanceKm / efficiency
  const fuelConsumed = sanitizedDistance > 0 
    ? (sanitizedDistance / sanitizedEfficiency) 
    : 0;

  // 5. Calculate monthly emissions using verified factor
  // Formula: emissionsKg = fuelConsumed * emissionFactor
  // Petrol & Diesel: directCO2Kg = fuelConsumedLitres * emissionFactorKgCO2PerLitre (Scope 1)
  // CNG: directCO2Kg = fuelConsumedKg * emissionFactorKgCO2PerKg (Scope 1)
  // EV: electricityCO2Kg = electricityConsumedKWh * gridEmissionFactorKgCO2ePerKWh (Scope 2)
  const monthlyEmissionsKg = fuelConsumed * factorObj.value;

  // 6. Annualize (12 months per calendar year)
  // Formula: yearlyEmissionsKg = monthlyEmissionsKg * 12
  // Formula: yearlyEmissionsTonnes = yearlyEmissionsKg / 1000
  const yearlyEmissionsKg = monthlyEmissionsKg * 12;
  const yearlyEmissionsTonnes = yearlyEmissionsKg / 1000;

  // 7. Calculate emissions intensity per kilometre
  // Formula: emissionsPerKm = distanceKm > 0 ? (monthlyEmissionsKg / distanceKm) : 0
  const emissionsPerKm = sanitizedDistance > 0 
    ? (monthlyEmissionsKg / sanitizedDistance) 
    : 0;

  return buildStandardResult({
    vehicleType: normVeh,
    fuelType: normFuel,
    monthlyDistanceKm: sanitizedDistance,
    monthlyFuelConsumed: fuelConsumed,
    monthlyEmissionsKg,
    yearlyEmissionsKg,
    yearlyEmissionsTonnes,
    emissionsPerKm,
    calculationMethod: 'distance_efficiency',
    factorObj,
    efficiency: sanitizedEfficiency,
    isValid: true,
  });
}

/**
 * Executes an Actual-Consumption CO2 Calculation (Method B).
 * 
 * Mathematical Formulas:
 * 1. Liquid Fuels & CNG:
 *    emissions = actualFuelConsumed * correspondingEmissionFactor
 * 
 * 2. Electric Vehicles (EV):
 *    emissions = actualChargingElectricityConsumed * applicableElectricityEmissionFactor
 * 
 * Strict Double-Counting Prevention:
 * When actual consumption is provided, it serves as the sole energy volume source.
 * Distance is not used to calculate duplicate fuel; it is only used optionally to
 * calculate emissions intensity per kilometre (emissionsPerKm) if provided.
 * 
 * @param {Object} params
 * @param {string} params.vehicleType - Vehicle classification ('car', 'motorcycle', 'scooter', 'bus', 'other')
 * @param {string} params.fuelType - Powertrain ('petrol', 'diesel', 'cng', 'electric')
 * @param {number} params.actualConsumption - Physical consumption (litres, kg, or kWh)
 * @param {number} [params.distanceKm] - Optional distance for intensity normalization (km)
 * @returns {Object} Standardized calculation result
 */
export function calculateActualConsumptionEmissions({
  vehicleType = 'car',
  fuelType = 'petrol',
  actualConsumption = 0,
  distanceKm = 0,
} = {}) {
  const normVeh = String(vehicleType || '').toLowerCase().trim();
  const normFuel = String(fuelType || '').toLowerCase().trim();

  // 1. Verify factor availability and vehicle-fuel compatibility
  if (!isVehicleFuelSupported(normVeh, normFuel)) {
    return createUnsupportedResult({
      vehicleType: normVeh,
      fuelType: normFuel,
      calculationMethod: 'actual_consumption',
      distanceKm,
    });
  }

  const factorObj = getVehicleEmissionFactor(normVeh, normFuel);
  if (!factorObj) {
    return createUnsupportedResult({
      vehicleType: normVeh,
      fuelType: normFuel,
      calculationMethod: 'actual_consumption',
      distanceKm,
    });
  }

  // 2. Validate and sanitize actual consumption (cannot be negative or non-finite)
  const rawConsumption = Number(actualConsumption);
  if (!Number.isFinite(rawConsumption) || isNaN(rawConsumption) || rawConsumption < 0) {
    return createInvalidResult({
      vehicleType: normVeh,
      fuelType: normFuel,
      calculationMethod: 'actual_consumption',
      distanceKm,
      error: 'Invalid consumption: Actual fuel or electricity consumed cannot be negative or invalid.',
      factorObj,
    });
  }
  const sanitizedConsumption = sanitizeNumber(rawConsumption, 0, 0, 1e7);

  // 3. Sanitize optional distance (used strictly for per-km metric normalization, NOT to add fuel)
  const sanitizedDistance = sanitizeNumber(distanceKm, 0, 0, 1e7);

  // 4. Calculate monthly emissions directly from consumption
  // Formula: emissions = actualFuelOrElectricityConsumed * correspondingEmissionFactor
  const monthlyEmissionsKg = sanitizedConsumption * factorObj.value;

  // 5. Annualize (12 months per calendar year)
  // Formula: yearlyEmissionsKg = monthlyEmissionsKg * 12
  // Formula: yearlyEmissionsTonnes = yearlyEmissionsKg / 1000
  const yearlyEmissionsKg = monthlyEmissionsKg * 12;
  const yearlyEmissionsTonnes = yearlyEmissionsKg / 1000;

  // 6. Calculate emissions intensity per km (only if distance is provided and > 0)
  // Formula: emissionsPerKm = distanceKm > 0 ? (monthlyEmissionsKg / distanceKm) : 0
  const emissionsPerKm = sanitizedDistance > 0 
    ? (monthlyEmissionsKg / sanitizedDistance) 
    : 0;

  return buildStandardResult({
    vehicleType: normVeh,
    fuelType: normFuel,
    monthlyDistanceKm: sanitizedDistance,
    monthlyFuelConsumed: sanitizedConsumption,
    monthlyEmissionsKg,
    yearlyEmissionsKg,
    yearlyEmissionsTonnes,
    emissionsPerKm,
    calculationMethod: 'actual_consumption',
    factorObj,
    efficiency: null,
    isValid: true,
  });
}

/**
 * Universal calculation entry-point for a single vehicle.
 * Safely routes to Method A (Distance & Efficiency) or Method B (Actual Consumption).
 * Enforces strict prevention of double-counting: only the selected method is executed.
 * 
 * @param {Object} vehicleInput - Input parameters
 * @returns {Object} Structured standardized calculation result
 */
export function calculateVehicleEmissions(vehicleInput = {}) {
  if (!vehicleInput || typeof vehicleInput !== 'object') {
    return createInvalidResult({
      error: 'Vehicle input must be a valid object.',
    });
  }

  const method = String(vehicleInput.calculationMethod || 'distance_efficiency').toLowerCase().trim();
  const isActualMethod = method === 'actual_consumption' || method === 'direct_consumption';

  if (isActualMethod) {
    // Method B: Actual fuel or electricity consumption
    // Double counting prevention: fuelEfficiency is NOT passed, and distance is only for intensity
    const consumption = vehicleInput.actualConsumption ?? vehicleInput.directConsumption ?? 0;
    return calculateActualConsumptionEmissions({
      vehicleType: vehicleInput.vehicleType,
      fuelType: vehicleInput.fuelType,
      actualConsumption: consumption,
      distanceKm: vehicleInput.monthlyDistanceKm,
    });
  }

  // Method A: Distance and fuel efficiency
  // Double counting prevention: actualConsumption is completely ignored
  return calculateDistanceBasedEmissions({
    vehicleType: vehicleInput.vehicleType,
    fuelType: vehicleInput.fuelType,
    distanceKm: vehicleInput.monthlyDistanceKm,
    efficiency: vehicleInput.fuelEfficiency,
  });
}

/**
 * Standard Result Builder
 * Constructs the exact requested result schema with full floating-point precision,
 * explicit boundary labeling, and backward-compatible project properties.
 * 
 * Schema matches the 13 required fields:
 * - vehicleType
 * - fuelType
 * - monthlyDistanceKm
 * - monthlyFuelConsumed
 * - monthlyEmissionsKg
 * - yearlyEmissionsKg
 * - yearlyEmissionsTonnes
 * - emissionsPerKm
 * - calculationMethod
 * - emissionFactor
 * - emissionFactorUnit
 * - emissionFactorSource
 * - emissionsBoundary
 */
function buildStandardResult({
  vehicleType,
  fuelType,
  monthlyDistanceKm,
  monthlyFuelConsumed,
  monthlyEmissionsKg,
  yearlyEmissionsKg,
  yearlyEmissionsTonnes,
  emissionsPerKm,
  calculationMethod,
  factorObj,
  efficiency = null,
  isValid = true,
}) {
  const isElectric = fuelType === 'electric';
  const fuelUnit = factorObj.unit.split('/')[1]?.trim() || 'units';
  const efficiencyUnit = fuelType === 'cng' 
    ? 'km/kg' 
    : isElectric 
      ? 'km/kWh' 
      : 'km/litre';
  const vehicleLabel = vehicleType ? (vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)) : 'Vehicle';
  const fuelLabel = factorObj.label || (fuelType.charAt(0).toUpperCase() + fuelType.slice(1));
  const emissionsPerKmKg = Number(emissionsPerKm.toFixed(4));

  // Powertrain alternatives comparison baselines for display in UI
  const alternatives = {
    standardPetrolCarMonthlyKg: Number(((monthlyDistanceKm / 15.0) * 2.3149).toFixed(1)),
    electricMonthlyKg: Number(((monthlyDistanceKm / 7.0) * 0.82).toFixed(1)),
    publicBusMonthlyKg: Number((monthlyDistanceKm * 0.035).toFixed(1)),
  };

  return {
    // 1. Exact 13 requested fields from prompt:
    vehicleType,
    fuelType,
    monthlyDistanceKm,
    monthlyFuelConsumed,
    monthlyEmissionsKg,
    yearlyEmissionsKg,
    yearlyEmissionsTonnes,
    emissionsPerKm,
    calculationMethod,
    emissionFactor: factorObj.value,
    emissionFactorUnit: factorObj.unit,
    emissionFactorSource: factorObj.source,
    emissionsBoundary: factorObj.emissionsBoundary,

    // 2. Scientific metadata & scope labeling:
    isSupported: true,
    isValid,
    error: null,
    isElectric,
    isTailpipe: factorObj.isTailpipe,
    emissionsLabel: isElectric 
      ? 'Electricity-Related Indirect Emissions (Scope 2)' 
      : 'Tailpipe Direct Combustion Emissions (Scope 1)',
    notesAndAssumptions: factorObj.notesAndAssumptions,
    publicationYear: factorObj.publicationYear,
    geographicApplicability: factorObj.geographicApplicability,
    emissionFactorDetails: factorObj,

    // 3. Backward-compatibility & UI presentation helpers:
    monthlyCO2Kg: monthlyEmissionsKg,
    annualCO2Tonnes: yearlyEmissionsTonnes,
    annualCO2Kg: yearlyEmissionsKg,
    distanceKm: monthlyDistanceKm,
    fuelConsumed: monthlyFuelConsumed,
    fuelUnit,
    efficiency,
    efficiencyUnit,
    emissionsPerKmGrams: emissionsPerKm * 1000,
    emissionsPerKmKg,
    vehicleLabel,
    fuelLabel,
    alternatives,
    isCalculated: true,
  };
}

/**
 * Constructs a safe result object when an unsupported vehicle-fuel combination is requested.
 */
function createUnsupportedResult({
  vehicleType = 'unknown',
  fuelType = 'unknown',
  calculationMethod = 'distance_efficiency',
  distanceKm = 0,
}) {
  const reason = getUnsupportedReason(vehicleType, fuelType);
  const safeDistance = sanitizeNumber(distanceKm, 0);

  return {
    vehicleType,
    fuelType,
    monthlyDistanceKm: safeDistance,
    monthlyFuelConsumed: 0,
    monthlyEmissionsKg: 0,
    yearlyEmissionsKg: 0,
    yearlyEmissionsTonnes: 0,
    emissionsPerKm: 0,
    calculationMethod,
    emissionFactor: null,
    emissionFactorUnit: null,
    emissionFactorSource: null,
    emissionsBoundary: 'Unsupported Combination',
    isSupported: false,
    isValid: false,
    error: reason,
    isElectric: fuelType === 'electric',
    isTailpipe: false,
    emissionsLabel: 'Unsupported Calculation',
    notesAndAssumptions: reason,
    publicationYear: null,
    geographicApplicability: null,
    emissionFactorDetails: null,
    monthlyCO2Kg: 0,
    annualCO2Tonnes: 0,
    annualCO2Kg: 0,
    distanceKm: safeDistance,
    fuelConsumed: 0,
    fuelUnit: 'units',
    efficiency: null,
    efficiencyUnit: 'km/litre',
    emissionsPerKmGrams: 0,
    emissionsPerKmKg: 0,
    vehicleLabel: vehicleType || 'Vehicle',
    fuelLabel: fuelType || 'Fuel',
    alternatives: {
      standardPetrolCarMonthlyKg: 0,
      electricMonthlyKg: 0,
      publicBusMonthlyKg: 0,
    },
    isCalculated: false,
  };
}

/**
 * Constructs a safe result object when invalid parameters (e.g., negative or zero efficiency) are provided.
 */
function createInvalidResult({
  vehicleType = 'car',
  fuelType = 'petrol',
  calculationMethod = 'distance_efficiency',
  distanceKm = 0,
  error = 'Invalid calculation parameters',
  factorObj = null,
}) {
  const safeDistance = sanitizeNumber(distanceKm, 0);

  return {
    vehicleType,
    fuelType,
    monthlyDistanceKm: safeDistance,
    monthlyFuelConsumed: 0,
    monthlyEmissionsKg: 0,
    yearlyEmissionsKg: 0,
    yearlyEmissionsTonnes: 0,
    emissionsPerKm: 0,
    calculationMethod,
    emissionFactor: factorObj ? factorObj.value : null,
    emissionFactorUnit: factorObj ? factorObj.unit : null,
    emissionFactorSource: factorObj ? factorObj.source : null,
    emissionsBoundary: factorObj ? factorObj.emissionsBoundary : 'Invalid Parameters',
    isSupported: Boolean(factorObj),
    isValid: false,
    error,
    isElectric: fuelType === 'electric',
    isTailpipe: factorObj ? factorObj.isTailpipe : false,
    emissionsLabel: 'Invalid Parameters',
    notesAndAssumptions: factorObj ? factorObj.notesAndAssumptions : error,
    publicationYear: factorObj ? factorObj.publicationYear : null,
    geographicApplicability: factorObj ? factorObj.geographicApplicability : null,
    emissionFactorDetails: factorObj,
    monthlyCO2Kg: 0,
    annualCO2Tonnes: 0,
    annualCO2Kg: 0,
    distanceKm: safeDistance,
    fuelConsumed: 0,
    fuelUnit: factorObj ? factorObj.unit.split('/')[1]?.trim() : 'units',
    efficiency: null,
    efficiencyUnit: 'km/litre',
    emissionsPerKmGrams: 0,
    emissionsPerKmKg: 0,
    vehicleLabel: vehicleType || 'Vehicle',
    fuelLabel: factorObj?.label || fuelType || 'Fuel',
    alternatives: {
      standardPetrolCarMonthlyKg: 0,
      electricMonthlyKg: 0,
      publicBusMonthlyKg: 0,
    },
    isCalculated: false,
  };
}

/**
 * Calculates emissions for a fleet of vehicles and provides aggregated totals.
 * 
 * @param {Array} vehicles - Array of vehicle input objects
 * @returns {Object|null} Fleet emission totals and vehicle breakdown
 */
export function calculateFleetEmissions(vehicles = []) {
  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    return null;
  }

  const individualResults = vehicles.map((v) => calculateVehicleEmissions(v));
  const validResults = individualResults.filter((r) => r.isValid && r.isSupported);

  const totalMonthlyCO2Kg = validResults.reduce((sum, r) => sum + r.monthlyEmissionsKg, 0);
  const totalAnnualCO2Tonnes = (totalMonthlyCO2Kg * 12) / 1000;
  const totalAnnualCO2Kg = totalMonthlyCO2Kg * 12;
  const totalDistanceKm = validResults.reduce((sum, r) => sum + r.monthlyDistanceKm, 0);
  const totalFuelConsumed = validResults.reduce((sum, r) => sum + r.monthlyFuelConsumed, 0);
  const avgEmissionsPerKm = totalDistanceKm > 0 ? (totalMonthlyCO2Kg / totalDistanceKm) : 0;

  // Compute share percentages of each vehicle relative to fleet total
  const vehiclesWithShare = individualResults.map((v) => ({
    ...v,
    sharePercentage: (v.isValid && totalMonthlyCO2Kg > 0)
      ? Number(((v.monthlyEmissionsKg / totalMonthlyCO2Kg) * 100).toFixed(1))
      : 0,
  }));

  const primary = vehiclesWithShare[0] || createUnsupportedResult({});

  return {
    ...primary,
    monthlyTotalKg: totalMonthlyCO2Kg,
    monthlyCO2Kg: totalMonthlyCO2Kg,
    monthlyEmissionsKg: totalMonthlyCO2Kg,
    annualTotalTonnes: totalAnnualCO2Tonnes,
    annualCO2Tonnes: totalAnnualCO2Tonnes,
    yearlyEmissionsTonnes: totalAnnualCO2Tonnes,
    annualCO2Kg: totalAnnualCO2Kg,
    yearlyEmissionsKg: totalAnnualCO2Kg,
    totalDistanceKm,
    totalFuelConsumed,
    distanceKm: totalDistanceKm,
    monthlyDistanceKm: totalDistanceKm,
    emissionsPerKm: avgEmissionsPerKm,
    emissionsPerKmGrams: avgEmissionsPerKm * 1000,
    emissionsPerKmKg: Number(avgEmissionsPerKm.toFixed(4)),
    vehicles: vehiclesWithShare,
    vehicleCount: vehiclesWithShare.length,
    isFleet: vehiclesWithShare.length > 1,
    isCalculated: validResults.length > 0,
  };
}
