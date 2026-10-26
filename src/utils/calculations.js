/**
 * TerraTrace Drive — Vehicle Calculation Gateway
 * 
 * Re-exports calculation engine functions from vehicleCalculations.js
 * while providing legacy compatibility functions for older modules.
 */

import { 
  calculateVehicleEmissions, 
  calculateFleetEmissions, 
  calculateDistanceBasedEmissions,
  calculateActualConsumptionEmissions,
  sanitizeNumber 
} from './vehicleCalculations.js';

import { EMISSION_FACTORS, VEHICLE_BENCHMARKS } from '../data/emissionFactors.js';

export {
  calculateVehicleEmissions,
  calculateFleetEmissions,
  calculateDistanceBasedEmissions,
  calculateActualConsumptionEmissions,
  sanitizeNumber,
};

/**
 * Legacy total footprint calculation maintained for backwards compatibility
 */
export function calculateTotalFootprint(formData = {}) {
  const vehicles = formData?.vehicles?.length 
    ? formData.vehicles 
    : [formData?.vehicle || {}];

  const fleetResults = calculateFleetEmissions(vehicles) || {};
  const members = Math.max(1, Number(formData?.household?.members || 1));

  // Compute pillar breakdown
  const elecKg = calculateElectricityEmissions(formData?.electricity);
  const lpgKg = calculateLpgEmissions(formData?.lpg);
  const transKg = calculateTransportationEmissions(formData?.transport);
  const foodKg = calculateFoodEmissions(formData?.food, members);
  const wasteKg = calculateWasteEmissions(formData?.waste);

  const hasHouseholdPillars = elecKg > 0 || lpgKg > 0 || foodKg > 0 || wasteKg > 0;
  const vehicleMonthlyKg = fleetResults.monthlyCO2Kg || 0;
  const transportationMonthlyKg = transKg > 0 ? transKg : vehicleMonthlyKg;
  const monthlyTotalKg = hasHouseholdPillars 
    ? (elecKg + lpgKg + transportationMonthlyKg + foodKg + wasteKg)
    : vehicleMonthlyKg;

  const annualTotalTonnes = Number(((monthlyTotalKg * 12) / 1000).toFixed(2));
  const perCapitaAnnualTonnes = Number((annualTotalTonnes / members).toFixed(2));

  const categories = {
    electricity: {
      monthlyKg: elecKg,
      percentage: monthlyTotalKg > 0 ? Number(((elecKg / monthlyTotalKg) * 100).toFixed(1)) : 0,
      title: 'Electricity & Home Energy',
    },
    transportation: {
      monthlyKg: transportationMonthlyKg,
      percentage: monthlyTotalKg > 0 ? Number(((transportationMonthlyKg / monthlyTotalKg) * 100).toFixed(1)) : 100,
      title: 'Vehicle Travel & Transport',
    },
    lpg: {
      monthlyKg: lpgKg,
      percentage: monthlyTotalKg > 0 ? Number(((lpgKg / monthlyTotalKg) * 100).toFixed(1)) : 0,
      title: 'Cooking Fuel & LPG',
    },
    food: {
      monthlyKg: foodKg,
      percentage: monthlyTotalKg > 0 ? Number(((foodKg / monthlyTotalKg) * 100).toFixed(1)) : 0,
      title: 'Food & Diet',
    },
    waste: {
      monthlyKg: wasteKg,
      percentage: monthlyTotalKg > 0 ? Number(((wasteKg / monthlyTotalKg) * 100).toFixed(1)) : 0,
      title: 'Waste & Consumption',
    },
  };

  const primaryKey = Object.keys(categories).reduce((top, key) => 
    (categories[key].monthlyKg > (categories[top]?.monthlyKg || 0) ? key : top), 'transportation');

  return {
    ...fleetResults,
    monthlyTotalKg,
    annualTotalTonnes,
    perCapitaAnnualTonnes,
    primaryDriver: {
      key: primaryKey,
      title: primaryKey === 'transportation' && fleetResults.vehicleCount > 1
        ? `Vehicle Fleet (${fleetResults.vehicleCount} vehicles)`
        : categories[primaryKey]?.title || 'Vehicle Travel',
      monthlyKg: categories[primaryKey]?.monthlyKg || monthlyTotalKg,
      percentage: categories[primaryKey]?.percentage || 100,
    },
    categories,
    benchmarks: VEHICLE_BENCHMARKS,
    isCalculated: true,
  };
}

export function calculateElectricityEmissions(data = {}) {
  const kwh = Math.max(0, Number(data.kwhMonthly || 0));
  const solar = Math.max(0, Number(data.solarGenerationKwh || 0));
  if (data.usesRenewable) return 0;
  const netKwh = Math.max(0, kwh - solar);
  return Number((netKwh * EMISSION_FACTORS.electricity.gridAverage).toFixed(2));
}

export function calculateLpgEmissions(data = {}) {
  const fuelType = data.fuelType || 'cylinder';
  let emissions = 0;
  if (fuelType === 'cylinder') {
    const cylinders = Math.max(0, Number(data.cylinderCount || 0));
    emissions = cylinders * EMISSION_FACTORS.lpg.perCylinder14_2kg;
  } else if (fuelType === 'png') {
    const pngScm = Math.max(0, Number(data.pngScm || 0));
    emissions = pngScm * EMISSION_FACTORS.lpg.pipedNaturalGas;
  }
  return Number(emissions.toFixed(2));
}

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

  return Number((carEmissions + twoWheelerEmissions + busEmissions + metroEmissions).toFixed(2));
}

export function calculateFoodEmissions(data = {}, householdMembers = 1) {
  const members = Math.max(1, Number(householdMembers || 1));
  const dietType = data.dietType || 'vegetarian';
  const baseFactor = EMISSION_FACTORS.food[dietType] ?? EMISSION_FACTORS.food.vegetarian;
  return Number((baseFactor * members).toFixed(2));
}

export function calculateWasteEmissions(data = {}) {
  const weeklyKg = Math.max(0, Number(data.wasteKgWeekly || 0));
  return Number((weeklyKg * 4.33 * EMISSION_FACTORS.waste.generalLandfill).toFixed(2));
}
