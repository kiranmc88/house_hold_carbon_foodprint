/**
 * TerraTrace Drive — Vehicle Usage Survey Calculation & Statistical Analytics Engine
 * 
 * Implements:
 * 1. Dual-method emissions calculation (Method A: Distance & Efficiency; Method B: Direct Actual Consumption)
 * 2. Strict unsupported combination detection and technical rationale reporting
 * 3. Prevention of duplicate counting between distance and consumption
 * 4. Sample aggregation, averages, distribution modeling, and category cross-tabulation
 * 5. Safe handling of empty datasets, corrupted values, zero distances, and invalid efficiencies
 */

import {
  SURVEY_EMISSION_FACTORS,
  SURVEY_SUPPORTED_VEHICLES,
  isSurveyCombinationSupported,
  getSurveyEmissionFactor,
  getSurveyUnsupportedReason,
  PARTICIPANT_CATEGORIES,
} from '../data/surveyEmissionFactors.js';

import { sanitizeNumber } from './vehicleCalculations.js';

/**
 * Documented upper safety limit for monthly distance (in km).
 * 100,000 km/month corresponds to ~3,333 km/day, which exceeds realistic single-vehicle usage
 * while preventing numerical overflow, infinite intensity loops, or malformed inputs.
 */
export const MAX_MONTHLY_DISTANCE_KM = 100000;

/**
 * Validate a user-entered monthly distance for the vehicle usage survey.
 * 
 * Rules:
 * - Accepts any valid positive integer or decimal distance (e.g. 100, 250, 650, 1200, 2500 km or decimals).
 * - Does not restrict the input to predefined options or dropdown values.
 * - In Method A (Distance & Efficiency): distance is required to be > 0 and <= MAX_MONTHLY_DISTANCE_KM.
 * - In Method B (Actual Consumption): distance is optional (used for intensity per km).
 *   If supplied, it must be >= 0 and <= MAX_MONTHLY_DISTANCE_KM.
 * - Rejects empty, non-numeric, zero (when required), negative, and unreasonably large inputs.
 * 
 * @param {any} val - Raw distance input
 * @param {string} calculationMethod - 'distance_efficiency' | 'actual_consumption'
 * @param {boolean|null} isRequired - Force required status (defaults to true for Method A, false for Method B)
 * @returns {{ isValid: boolean, error: string|null, value: number|null }}
 */
export function validateSurveyDistance(val, calculationMethod = 'distance_efficiency', isRequired = null) {
  const method = calculationMethod === 'actual_consumption' ? 'actual_consumption' : 'distance_efficiency';
  const required = isRequired !== null ? Boolean(isRequired) : (method === 'distance_efficiency');

  // Check empty / null / undefined / whitespace
  if (val === '' || val === null || val === undefined) {
    if (required) {
      return { isValid: false, error: 'Please enter a valid monthly distance greater than 0 km.', value: null };
    }
    return { isValid: true, error: null, value: null };
  }

  if (typeof val === 'string' && val.trim() === '') {
    if (required) {
      return { isValid: false, error: 'Please enter a valid monthly distance greater than 0 km.', value: null };
    }
    return { isValid: true, error: null, value: null };
  }

  const num = Number(val);
  if (!Number.isFinite(num) || isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid monthly distance greater than 0 km.', value: null };
  }

  if (required) {
    if (num <= 0) {
      return { isValid: false, error: 'Please enter a valid monthly distance greater than 0 km.', value: null };
    }
  } else {
    if (num < 0) {
      return { isValid: false, error: 'Monthly distance cannot be negative.', value: null };
    }
  }

  if (num > MAX_MONTHLY_DISTANCE_KM) {
    return { isValid: false, error: `Monthly distance cannot exceed ${MAX_MONTHLY_DISTANCE_KM.toLocaleString()} km.`, value: null };
  }

  return { isValid: true, error: null, value: num };
}

/**
 * Execute calculation for an individual survey response.
 * 
 * Supports:
 * - Method A: Distance and Fuel Efficiency
 * - Method B: Actual Monthly Fuel or EV Electricity Consumption
 * 
 * @param {Object} input - Survey response inputs
 * @returns {Object} Comprehensive calculation result with metadata and boundary
 */
export function calculateSurveyRecordEmissions(input = {}) {
  const normVeh = String(input.vehicleType || 'car').toLowerCase().trim();
  const normFuel = String(input.fuelType || 'petrol').toLowerCase().trim();
  const calculationMethod = input.calculationMethod === 'actual_consumption' 
    ? 'actual_consumption' 
    : 'distance_efficiency';

  // 1. Check verified factor availability
  if (!isSurveyCombinationSupported(normVeh, normFuel)) {
    return {
      isValid: false,
      isSupported: false,
      error: getSurveyUnsupportedReason(normVeh, normFuel),
      vehicleType: normVeh,
      fuelType: normFuel,
      calculationMethod,
      monthlyEmissionsKg: 0,
      yearlyEmissionsKg: 0,
      yearlyEmissionsTonnes: 0,
      monthlyFuelConsumed: 0,
      emissionsPerKmGrams: 0,
      emissionsPerKm: 0,
      factorApplied: null,
      scope: 'Unsupported',
    };
  }

  const factor = getSurveyEmissionFactor(normVeh, normFuel);
  if (!factor) {
    return {
      isValid: false,
      isSupported: false,
      error: `Emission factor unavailable for ${normVeh} running on ${normFuel}.`,
      vehicleType: normVeh,
      fuelType: normFuel,
      calculationMethod,
      monthlyEmissionsKg: 0,
      yearlyEmissionsKg: 0,
      yearlyEmissionsTonnes: 0,
      monthlyFuelConsumed: 0,
      emissionsPerKmGrams: 0,
      emissionsPerKm: 0,
      factorApplied: null,
      scope: 'Unsupported',
    };
  }

  // 2. Validate distance when required
  const shouldValidateDistance = input.requirePositiveDistance === true;
  if (shouldValidateDistance) {
    const distValidation = validateSurveyDistance(
      input.monthlyDistanceKm,
      calculationMethod,
      calculationMethod === 'distance_efficiency'
    );
    if (!distValidation.isValid) {
      return {
        isValid: false,
        isSupported: true,
        error: distValidation.error,
        vehicleType: normVeh,
        fuelType: normFuel,
        calculationMethod,
        monthlyEmissionsKg: 0,
        yearlyEmissionsKg: 0,
        yearlyEmissionsTonnes: 0,
        monthlyFuelConsumed: 0,
        emissionsPerKmGrams: 0,
        emissionsPerKm: 0,
        factorApplied: factor,
        scope: factor.scope,
      };
    }
  }

  // Sanitize distance safely (optional or required depending on method)
  const distanceKm = sanitizeNumber(input.monthlyDistanceKm, 0, 0, MAX_MONTHLY_DISTANCE_KM);
  let fuelConsumed = 0;
  let monthlyEmissionsKg = 0;
  let sanitizedEfficiency = null;

  // 3. Execute calculation according to selected method
  if (calculationMethod === 'actual_consumption') {
    // METHOD B: Direct Actual Fuel or Electricity Consumption
    // Efficiency is NOT required
    const rawConsumption = Number(input.actualConsumption);
    if (!Number.isFinite(rawConsumption) || isNaN(rawConsumption) || rawConsumption <= 0) {
      return {
        isValid: false,
        isSupported: true,
        error: `Please enter a valid actual consumption value greater than 0 (${factor.fuelUnit}).`,
        vehicleType: normVeh,
        fuelType: normFuel,
        calculationMethod,
        monthlyEmissionsKg: 0,
        yearlyEmissionsKg: 0,
        yearlyEmissionsTonnes: 0,
        monthlyFuelConsumed: 0,
        emissionsPerKmGrams: 0,
        emissionsPerKm: 0,
        factorApplied: factor,
        scope: factor.scope,
      };
    }

    fuelConsumed = sanitizeNumber(rawConsumption, 0, 1e-4, 1e7);
    // Formula: emissions = actualConsumption * emissionFactor
    monthlyEmissionsKg = fuelConsumed * factor.value;

  } else {
    // METHOD A: Distance and Fuel Efficiency
    const rawEfficiency = Number(input.fuelEfficiency);
    if (!Number.isFinite(rawEfficiency) || isNaN(rawEfficiency) || rawEfficiency <= 0) {
      return {
        isValid: false,
        isSupported: true,
        error: `Please enter a positive fuel efficiency greater than 0 (${factor.efficiencyUnit}).`,
        vehicleType: normVeh,
        fuelType: normFuel,
        calculationMethod,
        monthlyEmissionsKg: 0,
        yearlyEmissionsKg: 0,
        yearlyEmissionsTonnes: 0,
        monthlyFuelConsumed: 0,
        emissionsPerKmGrams: 0,
        emissionsPerKm: 0,
        factorApplied: factor,
        scope: factor.scope,
      };
    }

    sanitizedEfficiency = sanitizeNumber(rawEfficiency, 1, 1e-4, 1e5);
    // Formula: fuelConsumed = distanceKm / efficiency
    fuelConsumed = distanceKm > 0 ? (distanceKm / sanitizedEfficiency) : 0;
    // Formula: emissions = fuelConsumed * emissionFactor
    monthlyEmissionsKg = fuelConsumed * factor.value;
  }

  // 3. Annualize
  const yearlyEmissionsKg = monthlyEmissionsKg * 12;
  const yearlyEmissionsTonnes = yearlyEmissionsKg / 1000;

  // 4. Calculate Intensity per km (prevent division by zero)
  const emissionsPerKm = distanceKm > 0 ? (monthlyEmissionsKg / distanceKm) : 0;
  const emissionsPerKmGrams = emissionsPerKm * 1000;

  return {
    isValid: true,
    isSupported: true,
    error: null,
    vehicleType: normVeh,
    fuelType: normFuel,
    calculationMethod,
    monthlyDistanceKm: distanceKm,
    monthlyFuelConsumed: fuelConsumed,
    fuelUnit: factor.fuelUnit,
    efficiencyUnit: factor.efficiencyUnit,
    fuelEfficiency: sanitizedEfficiency,
    actualConsumption: calculationMethod === 'actual_consumption' ? fuelConsumed : null,
    monthlyEmissionsKg,
    yearlyEmissionsKg,
    yearlyEmissionsTonnes,
    emissionsPerKm,
    emissionsPerKmGrams,
    factorValue: factor.value,
    factorUnit: factor.unit,
    factorSource: factor.source,
    geographicApplicability: factor.geographicApplicability,
    emissionsBoundary: factor.emissionsBoundary,
    scope: factor.scope,
    isTailpipe: factor.isTailpipe,
    isElectricity: factor.isElectricity,
  };
}

/**
 * Calculate statistical aggregates and distributions across an array of survey records.
 * 
 * Handles empty datasets, outliers, and corrupted records safely.
 * 
 * @param {Array<Object>} records - Array of stored survey responses
 * @returns {Object} Comprehensive statistical summary
 */
export function calculateSurveyAnalytics(records = []) {
  if (!Array.isArray(records) || records.length === 0) {
    return createEmptyAnalytics();
  }

  // Filter only valid, consented responses with verified valid distance
  const validRecords = records.filter((r) => {
    if (!r || r.isValid === false || r.consentGiven === false) return false;
    const dist = Number(r.monthlyDistanceKm);
    if (r.calculationMethod === 'actual_consumption') {
      if (Number.isFinite(dist) && (dist < 0 || dist > MAX_MONTHLY_DISTANCE_KM)) return false;
    } else {
      if (!Number.isFinite(dist) || dist <= 0 || dist > MAX_MONTHLY_DISTANCE_KM) return false;
    }
    return true;
  });
  const sampleSize = validRecords.length;

  if (sampleSize === 0) {
    return createEmptyAnalytics();
  }

  // Aggregate distance and emissions
  let totalDistanceKm = 0;
  let totalMonthlyEmissionsKg = 0;
  let totalScope1Kg = 0;
  let totalScope2Kg = 0;

  const vehicleCounts = {};
  const vehicleEmissions = {};
  const vehicleDistances = {};

  const fuelCounts = {};
  const fuelEmissions = {};

  const categoryMap = {};
  PARTICIPANT_CATEGORIES.forEach((c) => {
    categoryMap[c.id] = {
      id: c.id,
      label: c.label,
      count: 0,
      totalDistanceKm: 0,
      totalMonthlyEmissionsKg: 0,
      vehicles: {},
      fuels: {},
    };
  });

  const methodCounts = {
    distance_efficiency: 0,
    actual_consumption: 0,
  };

  validRecords.forEach((record) => {
    const dist = Number(record.monthlyDistanceKm) || 0;
    const emKg = Number(record.monthlyEmissionsKg) || 0;
    const vType = String(record.vehicleType || 'car').toLowerCase();
    const fType = String(record.fuelType || 'petrol').toLowerCase();
    const pCat = String(record.participantCategory || 'other').toLowerCase();
    const mMethod = record.calculationMethod === 'actual_consumption' 
      ? 'actual_consumption' 
      : 'distance_efficiency';

    totalDistanceKm += dist;
    totalMonthlyEmissionsKg += emKg;

    if (record.isElectricity) {
      totalScope2Kg += emKg;
    } else {
      totalScope1Kg += emKg;
    }

    // Vehicle breakdown
    vehicleCounts[vType] = (vehicleCounts[vType] || 0) + 1;
    vehicleEmissions[vType] = (vehicleEmissions[vType] || 0) + emKg;
    vehicleDistances[vType] = (vehicleDistances[vType] || 0) + dist;

    // Fuel breakdown
    fuelCounts[fType] = (fuelCounts[fType] || 0) + 1;
    fuelEmissions[fType] = (fuelEmissions[fType] || 0) + emKg;

    // Method breakdown
    methodCounts[mMethod] = (methodCounts[mMethod] || 0) + 1;

    // Participant category breakdown
    if (!categoryMap[pCat]) {
      categoryMap[pCat] = {
        id: pCat,
        label: pCat.charAt(0).toUpperCase() + pCat.slice(1),
        count: 0,
        totalDistanceKm: 0,
        totalMonthlyEmissionsKg: 0,
        vehicles: {},
        fuels: {},
      };
    }
    const cat = categoryMap[pCat];
    cat.count += 1;
    cat.totalDistanceKm += dist;
    cat.totalMonthlyEmissionsKg += emKg;
    cat.vehicles[vType] = (cat.vehicles[vType] || 0) + 1;
    cat.fuels[fType] = (cat.fuels[fType] || 0) + 1;
  });

  // Calculate global averages
  const avgMonthlyDistance = totalDistanceKm / sampleSize;
  const avgMonthlyEmissions = totalMonthlyEmissionsKg / sampleSize;
  const avgEmissionsPerKmGrams = totalDistanceKm > 0 
    ? (totalMonthlyEmissionsKg / totalDistanceKm) * 1000 
    : 0;
  const totalAnnualEmissionsTonnes = (totalMonthlyEmissionsKg * 12) / 1000;

  // Vehicle type distribution array
  const vehicleDistribution = Object.keys(SURVEY_SUPPORTED_VEHICLES).map((typeKey) => {
    const count = vehicleCounts[typeKey] || 0;
    const em = vehicleEmissions[typeKey] || 0;
    const dist = vehicleDistances[typeKey] || 0;
    return {
      type: typeKey,
      label: SURVEY_SUPPORTED_VEHICLES[typeKey]?.label || typeKey,
      count,
      percentage: sampleSize > 0 ? (count / sampleSize) * 100 : 0,
      totalEmissionsKg: em,
      avgDistanceKm: count > 0 ? dist / count : 0,
      avgEmissionsKg: count > 0 ? em / count : 0,
    };
  }).filter((v) => v.count > 0);

  // Fuel type distribution array
  const fuelDistribution = Object.keys(SURVEY_EMISSION_FACTORS).map((fuelKey) => {
    const count = fuelCounts[fuelKey] || 0;
    const em = fuelEmissions[fuelKey] || 0;
    return {
      fuel: fuelKey,
      label: SURVEY_EMISSION_FACTORS[fuelKey]?.label || fuelKey,
      count,
      percentage: sampleSize > 0 ? (count / sampleSize) * 100 : 0,
      totalEmissionsKg: em,
      avgEmissionsKg: count > 0 ? em / count : 0,
      isElectricity: fuelKey === 'electric',
    };
  }).filter((f) => f.count > 0);

  // Category comparison table rows
  const categoryComparison = Object.values(categoryMap).map((cat) => {
    const count = cat.count;
    const avgDist = count > 0 ? cat.totalDistanceKm / count : 0;
    const avgEm = count > 0 ? cat.totalMonthlyEmissionsKg / count : 0;
    const avgIntensityGrams = cat.totalDistanceKm > 0 
      ? (cat.totalMonthlyEmissionsKg / cat.totalDistanceKm) * 1000 
      : 0;

    // Find top vehicle and fuel
    const topVehicle = Object.keys(cat.vehicles).reduce((a, b) => 
      (cat.vehicles[a] > cat.vehicles[b] ? a : b), Object.keys(cat.vehicles)[0] || 'car');
    const topFuel = Object.keys(cat.fuels).reduce((a, b) => 
      (cat.fuels[a] > cat.fuels[b] ? a : b), Object.keys(cat.fuels)[0] || 'petrol');

    return {
      id: cat.id,
      label: cat.label,
      count,
      sharePercentage: sampleSize > 0 ? (count / sampleSize) * 100 : 0,
      avgMonthlyDistanceKm: avgDist,
      avgMonthlyEmissionsKg: avgEm,
      avgIntensityGrams,
      dominantVehicle: topVehicle,
      dominantFuel: topFuel,
    };
  }).filter((c) => c.count > 0);

  // Scope breakdown
  const scopeBreakdown = {
    scope1Kg: totalScope1Kg,
    scope2Kg: totalScope2Kg,
    scope1Percentage: totalMonthlyEmissionsKg > 0 ? (totalScope1Kg / totalMonthlyEmissionsKg) * 100 : 0,
    scope2Percentage: totalMonthlyEmissionsKg > 0 ? (totalScope2Kg / totalMonthlyEmissionsKg) * 100 : 0,
  };

  return {
    sampleSize,
    totalDistanceKm,
    totalMonthlyEmissionsKg,
    totalAnnualEmissionsTonnes,
    avgMonthlyDistance,
    avgMonthlyEmissions,
    avgEmissionsPerKmGrams,
    avgEmissionsPerKmKg: avgEmissionsPerKmGrams / 1000,
    vehicleDistribution,
    fuelDistribution,
    categoryComparison,
    methodCounts,
    scopeBreakdown,
  };
}

/**
 * Empty analytics state fallback
 */
function createEmptyAnalytics() {
  return {
    sampleSize: 0,
    totalDistanceKm: 0,
    totalMonthlyEmissionsKg: 0,
    totalAnnualEmissionsTonnes: 0,
    avgMonthlyDistance: 0,
    avgMonthlyEmissions: 0,
    avgEmissionsPerKmGrams: 0,
    avgEmissionsPerKmKg: 0,
    vehicleDistribution: [],
    fuelDistribution: [],
    categoryComparison: [],
    methodCounts: {
      distance_efficiency: 0,
      actual_consumption: 0,
    },
    scopeBreakdown: {
      scope1Kg: 0,
      scope2Kg: 0,
      scope1Percentage: 0,
      scope2Percentage: 0,
    },
  };
}
