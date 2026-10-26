/**
 * TerraTrace Drive — Survey Vehicle Emission Factors Reference Data
 * 
 * Verified emission factors, units, sources, reporting years, geographic applicability,
 * and scientific emissions boundaries for the Real-World Vehicle Usage Survey.
 * 
 * SCIENTIFIC BOUNDARIES:
 * - Scope 1 (Direct Tailpipe): Mobile combustion of fossil fuels (petrol, diesel, CNG).
 * - Scope 2 (Indirect Grid): Electricity consumed during charging of battery electric vehicles (BEVs)
 *   generated at regional utility power plants. Zero direct tailpipe emissions.
 * 
 * SOURCES:
 * 1. IPCC Guidelines for National Greenhouse Gas Inventories (Volume 2: Energy, Chapter 3: Mobile Combustion)
 * 2. UK Government Department for Energy Security and Net Zero (DESNZ) / DEFRA GHG Conversion Factors (2023)
 * 3. Central Electricity Authority (CEA) of India, CO2 Baseline Database for the Indian Power Sector, User-end Weighted Average Grid Emission Factor v19 (2023)
 * 4. Automotive Research Association of India (ARAI) Automotive Fuel Standards
 */

export const SURVEY_EMISSION_FACTORS = {
  petrol: {
    value: 2.3149,
    displayFactor: 2.31,
    unit: 'kg CO2 / litre',
    fuelUnit: 'litres',
    efficiencyUnit: 'km/litre',
    label: 'Petrol (Motor Gasoline)',
    source: 'UK DESNZ / DEFRA Greenhouse Gas Conversion Factors 2023 & IPCC Guidelines for National GHG Inventories',
    publicationYear: 2023,
    geographicApplicability: 'Global / International Standard (100% fossil petrol baseline)',
    emissionsBoundary: 'Scope 1 — Direct Tailpipe Combustion',
    scope: 'Scope 1 (Tailpipe)',
    isTailpipe: true,
    isElectricity: false,
    notes: 'Direct carbon dioxide emitted from complete stoichiometric combustion of 1 litre of motor gasoline. Excludes upstream refining (Well-to-Tank) and vehicle manufacturing embodied emissions.',
  },

  diesel: {
    value: 2.6878,
    displayFactor: 2.68,
    unit: 'kg CO2 / litre',
    fuelUnit: 'litres',
    efficiencyUnit: 'km/litre',
    label: 'Diesel (Automotive Gas Oil)',
    source: 'UK DESNZ / DEFRA Greenhouse Gas Conversion Factors 2023 & IPCC Guidelines for National GHG Inventories',
    publicationYear: 2023,
    geographicApplicability: 'Global / International Standard',
    emissionsBoundary: 'Scope 1 — Direct Tailpipe Combustion',
    scope: 'Scope 1 (Tailpipe)',
    isTailpipe: true,
    isElectricity: false,
    notes: 'Direct carbon dioxide produced from complete combustion of 1 litre of automotive gas oil. Higher volumetric energy and carbon density compared to petrol.',
  },

  cng: {
    value: 2.7500,
    displayFactor: 2.75,
    unit: 'kg CO2 / kg',
    fuelUnit: 'kg',
    efficiencyUnit: 'km/kg',
    label: 'CNG (Compressed Natural Gas)',
    source: 'Automotive Research Association of India (ARAI) Fuel Standards / UK DEFRA Conversion Factors 2023',
    publicationYear: 2023,
    geographicApplicability: 'India / International Standard (Methane-dominated compressed gas)',
    emissionsBoundary: 'Scope 1 — Direct Tailpipe Combustion',
    scope: 'Scope 1 (Tailpipe)',
    isTailpipe: true,
    isElectricity: false,
    notes: 'Direct carbon dioxide produced per kilogram of compressed natural gas. Measured in kilograms (mass) rather than volume because gas density varies under storage pressure (200-250 bar).',
  },

  electric: {
    value: 0.8200,
    displayFactor: 0.82,
    unit: 'kg CO2e / kWh',
    fuelUnit: 'kWh',
    efficiencyUnit: 'km/kWh',
    label: 'Grid Electricity (EV Charging)',
    source: 'Central Electricity Authority (CEA) of India, CO2 Baseline Database for the Indian Power Sector, User-end Weighted Average Grid Emission Factor v19',
    publicationYear: 2023,
    geographicApplicability: 'India National Average Grid Mix (Coal, Gas, Hydro, Nuclear, Renewables)',
    emissionsBoundary: 'Scope 2 — Indirect Grid Electricity Generation',
    scope: 'Scope 2 (Indirect Power Generation)',
    isTailpipe: false,
    isElectricity: true,
    notes: 'Electric vehicles produce 0 g/km direct tailpipe emissions. Figures reflect indirect power station emissions per kWh supplied to the vehicle battery.',
  },
};

/**
 * Valid vehicle types and their verified powertrain options.
 */
export const SURVEY_SUPPORTED_VEHICLES = {
  car: {
    id: 'car',
    label: 'Passenger Car',
    description: 'Sedan, hatchback, SUV, personal four-wheeler',
    allowedFuels: ['petrol', 'diesel', 'cng', 'electric'],
    defaultEfficiencies: {
      petrol: 15.0,
      diesel: 18.0,
      cng: 22.0,
      electric: 7.0,
    },
  },
  motorcycle: {
    id: 'motorcycle',
    label: 'Motorcycle',
    description: 'Commuter, sports, and touring motorcycles',
    allowedFuels: ['petrol', 'electric'],
    defaultEfficiencies: {
      petrol: 42.0,
      electric: 25.0,
    },
  },
  scooter: {
    id: 'scooter',
    label: 'Scooter',
    description: 'Gearless commuter scooters and mopeds',
    allowedFuels: ['petrol', 'electric'],
    defaultEfficiencies: {
      petrol: 45.0,
      electric: 30.0,
    },
  },
  bus: {
    id: 'bus',
    label: 'Public Transit Bus',
    description: 'City commuter buses and transit fleets',
    allowedFuels: ['diesel', 'cng', 'electric'],
    defaultEfficiencies: {
      diesel: 3.5,
      cng: 3.0,
      electric: 0.9,
    },
  },
  other: {
    id: 'other',
    label: 'Other Light Vehicle',
    description: 'Delivery vans, light commercial utility vehicles',
    allowedFuels: ['petrol', 'diesel', 'cng', 'electric'],
    defaultEfficiencies: {
      petrol: 12.0,
      diesel: 14.0,
      cng: 16.0,
      electric: 4.5,
    },
  },
};

/**
 * Unsupported combinations and their documented scientific rationales.
 */
export const SURVEY_UNSUPPORTED_COMBINATIONS = [
  {
    vehicleType: 'motorcycle',
    fuelType: 'diesel',
    reason: 'Commercial diesel motorcycles are not standard production vehicles and lack verified automotive emission factors.',
  },
  {
    vehicleType: 'motorcycle',
    fuelType: 'cng',
    reason: 'Aftermarket CNG motorcycle conversions lack standardized, verified mobile combustion factors.',
  },
  {
    vehicleType: 'scooter',
    fuelType: 'diesel',
    reason: 'Diesel commuter scooters are non-existent in commercial production.',
  },
  {
    vehicleType: 'scooter',
    fuelType: 'cng',
    reason: 'CNG commuter scooters are not standard production vehicles with certified factors.',
  },
  {
    vehicleType: 'bus',
    fuelType: 'petrol',
    reason: 'Transit buses operate exclusively on diesel, CNG, or electric drivetrains; petrol bus factors are not verified or standard.',
  },
];

/**
 * Participant categories for survey classification
 */
export const PARTICIPANT_CATEGORIES = [
  { id: 'student', label: 'Student' },
  { id: 'staff', label: 'Staff' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'community', label: 'Community Member' },
  { id: 'other', label: 'Other' },
];

/**
 * Vehicle age categories (optional field)
 */
export const VEHICLE_AGE_OPTIONS = [
  { id: 'unknown', label: 'Not specified' },
  { id: 'under_2', label: 'Under 2 years (New / Modern)' },
  { id: '2_to_5', label: '2 – 5 years' },
  { id: '6_to_10', label: '6 – 10 years' },
  { id: 'over_10', label: 'Over 10 years (Older fleet)' },
];

/**
 * Check if a vehicle-fuel combination is verified and supported.
 */
export function isSurveyCombinationSupported(vehicleType, fuelType) {
  if (!vehicleType || !fuelType) return false;
  const config = SURVEY_SUPPORTED_VEHICLES[String(vehicleType).toLowerCase()];
  if (!config) return false;
  return config.allowedFuels.includes(String(fuelType).toLowerCase());
}

/**
 * Get the emission factor definition for a supported vehicle and fuel combination.
 * Returns null if the combination is unsupported.
 */
export function getSurveyEmissionFactor(vehicleType, fuelType) {
  if (!isSurveyCombinationSupported(vehicleType, fuelType)) {
    return null;
  }
  return SURVEY_EMISSION_FACTORS[String(fuelType).toLowerCase()] || null;
}

/**
 * Get human-readable technical rationale for an unsupported combination.
 */
export function getSurveyUnsupportedReason(vehicleType, fuelType) {
  const normVeh = String(vehicleType || '').toLowerCase();
  const normFuel = String(fuelType || '').toLowerCase();

  const found = SURVEY_UNSUPPORTED_COMBINATIONS.find(
    (c) => c.vehicleType === normVeh && c.fuelType === normFuel
  );
  if (found) {
    return found.reason;
  }

  if (!SURVEY_SUPPORTED_VEHICLES[normVeh]) {
    return `Vehicle classification "${vehicleType}" is unrecognized. Supported options: car, motorcycle, scooter, bus, other.`;
  }

  if (!SURVEY_EMISSION_FACTORS[normFuel]) {
    return `Fuel type "${fuelType}" is unrecognized. Supported options: petrol, diesel, cng, electric.`;
  }

  return `The combination of ${vehicleType} with ${fuelType} has no verified automotive emission factor in current inventories. Calculation cannot proceed.`;
}
