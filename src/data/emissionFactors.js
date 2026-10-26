/**
 * TerraTrace Drive — Vehicle Emission Factors
 * 
 * Re-exports canonical emission factors from vehicleEmissionFactors.js,
 * with legacy fallbacks maintained to prevent breaking imports.
 */

import { 
  VEHICLE_EMISSION_FACTORS as CANONICAL_FACTORS,
  SUPPORTED_VEHICLE_COMBINATIONS,
  UNSUPPORTED_COMBINATIONS,
  getVehicleEmissionFactor,
  isVehicleFuelSupported,
  getUnsupportedReason
} from './vehicleEmissionFactors.js';

export { 
  CANONICAL_FACTORS,
  SUPPORTED_VEHICLE_COMBINATIONS,
  UNSUPPORTED_COMBINATIONS,
  getVehicleEmissionFactor,
  isVehicleFuelSupported,
  getUnsupportedReason
};

export const VEHICLE_EMISSION_FACTORS = {
  // Fuel-based factors
  fuelCombustion: {
    petrol: CANONICAL_FACTORS.petrol,
    diesel: CANONICAL_FACTORS.diesel,
    cng: CANONICAL_FACTORS.cng,
    electric: CANONICAL_FACTORS.electric,
  },

  // Distance-based fleet averages (kg CO2 / km)
  averagePerKm: {
    car: {
      petrol: 0.154,
      diesel: 0.149,
      cng: 0.125,
      electric: 0.117,
    },
    motorcycle: {
      petrol: 0.055,
      electric: 0.033,
    },
    scooter: {
      petrol: 0.051,
      electric: 0.027,
    },
    bus: {
      diesel: 0.766,
      cng: 0.917,
      electric: 0.911,
    },
    other: {
      petrol: 0.193,
      diesel: 0.191,
      cng: 0.172,
      electric: 0.182,
    },
  },
};

// Benchmarks
export const VEHICLE_BENCHMARKS = {
  averageCommuteDistanceKm: 600,
  averagePassengerCarAnnualTonnes: 1.6,
  twoWheelerAnnualTonnes: 0.35,
  busCommuteAnnualTonnes: 0.22,
};

// Legacy exports
export const EMISSION_FACTORS = {
  ...VEHICLE_EMISSION_FACTORS,
  electricity: {
    gridAverage: 0.82,
    renewable: 0,
  },
  transportation: {
    petrolCar: 0.18,
    dieselCar: 0.17,
    electricVehicle: 0.053,
    twoWheelerPetrol: 0.055,
    twoWheelerElectric: 0.018,
    cityBus: 0.035,
    metroTrain: 0.018,
    autoRickshaw: 0.065,
    walkingOrCycling: 0,
  },
  lpg: {
    perCylinder14_2kg: 42.5,
    perKg: 2.983,
    pipedNaturalGas: 2.0,
  },
  food: {
    meatHeavy: 240,
    mediumMeat: 145,
    pescatarian: 120,
    vegetarian: 85,
    vegan: 55,
  },
  waste: {
    organicLandfill: 0.50,
    generalLandfill: 0.65,
    recycledPaper: 0.05,
    recycledPlastic: 0.05,
    compostedOrganic: 0.02,
  },
};

export const BENCHMARKS = {
  globalAverageAnnual: 4.7,
  nationalAverageAnnual: 1.9,
  parisAgreementTarget: 2.0,
};
