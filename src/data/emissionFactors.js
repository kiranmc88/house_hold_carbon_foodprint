/**
 * CarbonWise Emission Factors Reference Data
 * 
 * Note: Baseline structure and standard unit references.
 * Specific localized/vetted emission coefficients will be finalized in the calculation phase.
 */

export const EMISSION_FACTORS = {
  // Electricity emission factors (kg CO2e per kWh)
  electricity: {
    gridAverage: 0.82, // Standard grid intensity (kg CO2e / kWh)
    renewable: 0,      // Pure solar/wind (kg CO2e / kWh)
  },

  // Cooking Fuel emission factors
  lpg: {
    perCylinder14_2kg: 42.5, // Standard 14.2 kg LPG cylinder (kg CO2e / cylinder)
    perKg: 2.983,            // Liquefied Petroleum Gas (kg CO2e / kg)
    pipedNaturalGas: 2.0,    // Piped Natural Gas (kg CO2e / SCM)
  },

  // Transportation emission factors (kg CO2e per passenger-km)
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

  // Dietary pattern emission factors (kg CO2e per person per month)
  food: {
    meatHeavy: 240,
    mediumMeat: 145,
    pescatarian: 120,
    vegetarian: 85,
    vegan: 55,
  },

  // Waste emission factors (kg CO2e per kg of waste)
  waste: {
    organicLandfill: 0.50,
    generalLandfill: 0.65,
    recycledPaper: 0.05,
    recycledPlastic: 0.05,
    compostedOrganic: 0.02,
  },
};

export const BENCHMARKS = {
  globalAverageAnnual: 4.7,    // tonnes CO2e / capita / year
  nationalAverageAnnual: 1.9,  // tonnes CO2e / capita / year (India baseline)
  parisAgreementTarget: 2.0,   // target tonnes CO2e / capita / year by 2030
};

