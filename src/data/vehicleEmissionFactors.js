/**
 * TerraTrace Drive — Vehicle Emission Factors Reference Data
 * 
 * Standardized Mobile Combustion and Grid Electricity Emission Factors
 * 
 * References & Primary Scientific Literature:
 * 1. IPCC Guidelines for National Greenhouse Gas Inventories (Volume 2: Energy, Chapter 3: Mobile Combustion)
 * 2. UK Government Department for Energy Security and Net Zero (DESNZ) / DEFRA Greenhouse Gas Conversion Factors for Company Reporting (2023)
 * 3. Central Electricity Authority (CEA) of India, CO2 Baseline Database for the Indian Power Sector (User-end Grid Emission Factor, Version 19, 2023)
 * 4. Automotive Research Association of India (ARAI) standard automotive fuel specifications
 * 
 * SCIENTIFIC BOUNDARY DEFINITIONS:
 * - Scope 1 (Direct Tailpipe): Direct emissions of carbon dioxide from internal combustion of hydrocarbon fuels (petrol, diesel, CNG) inside vehicle engines.
 * - Scope 2 (Indirect Electricity): Off-site emissions occurring during generation at regional electrical power utilities supplying energy to charge electric vehicle batteries. EVs produce 0 g/km tailpipe emissions.
 * - Scope 3 (Lifecycle / Well-to-Wheel): Upstream fuel extraction, refining, transmission, and embodied manufacturing emissions. Not interchangeable with Scope 1 or Scope 2.
 */

export const VEHICLE_EMISSION_FACTORS = {
  petrol: {
    value: 2.3149,
    factor: 2.3149,
    displayFactor: 2.31,
    unit: 'kg CO2 / litre',
    fuelType: 'petrol',
    label: 'Petrol (Motor Gasoline)',
    source: 'UK Government GHG Conversion Factors (DESNZ / DEFRA 2023) / IPCC Mobile Combustion Guidelines',
    publicationYear: 2023,
    geographicApplicability: 'Global / International Standard (100% fossil petrol baseline)',
    emissionsBoundary: 'Scope 1 — Direct Tailpipe Combustion',
    scope: 'Scope 1 (Direct Tailpipe Combustion)',
    isTailpipe: true,
    isElectricity: false,
    notesAndAssumptions: 'Represents direct carbon dioxide produced from complete combustion of 1 litre of motor gasoline. Reflects stoichiometric oxidation of carbon content. Excludes upstream refining (Well-to-Tank) and vehicle manufacturing embodied emissions.',
    description: 'Direct carbon dioxide produced from complete combustion of 1 litre of motor gasoline',
  },

  diesel: {
    value: 2.6878,
    factor: 2.6878,
    displayFactor: 2.68,
    unit: 'kg CO2 / litre',
    fuelType: 'diesel',
    label: 'Diesel (Automotive Gas Oil)',
    source: 'UK Government GHG Conversion Factors (DESNZ / DEFRA 2023) / IPCC Mobile Combustion Guidelines',
    publicationYear: 2023,
    geographicApplicability: 'Global / International Standard',
    emissionsBoundary: 'Scope 1 — Direct Tailpipe Combustion',
    scope: 'Scope 1 (Direct Tailpipe Combustion)',
    isTailpipe: true,
    isElectricity: false,
    notesAndAssumptions: 'Direct carbon dioxide produced from complete combustion of 1 litre of diesel fuel. Higher carbon density per unit volume compared to motor gasoline.',
    description: 'Direct carbon dioxide produced from complete combustion of 1 litre of diesel fuel',
  },

  cng: {
    value: 2.7500,
    factor: 2.7500,
    displayFactor: 2.75,
    unit: 'kg CO2 / kg',
    fuelType: 'cng',
    label: 'CNG (Compressed Natural Gas)',
    source: 'Automotive Research Association of India (ARAI) Fuel Standards / UK DEFRA Conversion Factors 2023',
    publicationYear: 2023,
    geographicApplicability: 'India / International Standard (Methane-dominated compressed gas)',
    emissionsBoundary: 'Scope 1 — Direct Tailpipe Combustion',
    scope: 'Scope 1 (Direct Tailpipe Combustion)',
    isTailpipe: true,
    isElectricity: false,
    notesAndAssumptions: 'Direct carbon dioxide released per kilogram of compressed natural gas burned. Measured in kilograms (mass) rather than volume because gas density varies under pressure (200-250 bar).',
    description: 'Direct carbon dioxide produced from complete combustion of 1 kg of compressed natural gas',
  },

  electric: {
    value: 0.8200,
    factor: 0.8200,
    displayFactor: 0.82,
    unit: 'kg CO2e / kWh',
    fuelType: 'electric',
    label: 'Grid Electricity (EV Charging)',
    source: 'Central Electricity Authority (CEA) of India, CO2 Baseline Database for the Indian Power Sector, User-end Weighted Average Grid Emission Factor v19',
    publicationYear: 2023,
    geographicApplicability: 'India National Average Grid Mix (Coal, Gas, Hydro, Nuclear, Renewables)',
    emissionsBoundary: 'Scope 2 — Indirect Grid Electricity Generation',
    scope: 'Scope 2 (Indirect Power Generation)',
    isTailpipe: false,
    isElectricity: true,
    notesAndAssumptions: 'Electric vehicles have zero direct tailpipe emissions at the point of operation. Emissions shown reflect Scope 2 indirect power plant emissions based on the regional electrical grid mix supplying the charging station. Not interchangeable with Scope 1 tailpipe emissions.',
    description: 'Indirect emissions produced at power generation utilities per kWh supplied to charge battery electric vehicles',
  },
};

/**
 * Valid vehicle types and their scientifically verified powertrain options.
 */
export const SUPPORTED_VEHICLE_COMBINATIONS = {
  car: ['petrol', 'diesel', 'cng', 'electric'],
  motorcycle: ['petrol', 'electric'],
  scooter: ['petrol', 'electric'],
  bus: ['diesel', 'cng', 'electric'],
  other: ['petrol', 'diesel', 'cng', 'electric'],
};

/**
 * Detailed documentation of unsupported vehicle-powertrain combinations.
 */
export const UNSUPPORTED_COMBINATIONS = [
  {
    vehicleType: 'motorcycle',
    fuelType: 'diesel',
    reason: 'Commercial diesel motorcycles are not standard production vehicles and lack standardized automotive emission factors.',
  },
  {
    vehicleType: 'motorcycle',
    fuelType: 'cng',
    reason: 'CNG motorcycle kits lack standardized certified mobile combustion factors.',
  },
  {
    vehicleType: 'scooter',
    fuelType: 'diesel',
    reason: 'Diesel commuter scooters are non-existent in commercial series production.',
  },
  {
    vehicleType: 'scooter',
    fuelType: 'cng',
    reason: 'CNG commuter scooters are not standard production vehicles with verified factors.',
  },
  {
    vehicleType: 'bus',
    fuelType: 'petrol',
    reason: 'Transit buses operate exclusively on diesel, CNG, or electric drivetrains; petrol transit bus factors are not verified or standard.',
  },
];

/**
 * Checks if a specific vehicle-fuel combination has a verified emission factor.
 * 
 * @param {string} vehicleType 
 * @param {string} fuelType 
 * @returns {boolean}
 */
export function isVehicleFuelSupported(vehicleType, fuelType) {
  if (!vehicleType || !fuelType) return false;
  const allowed = SUPPORTED_VEHICLE_COMBINATIONS[String(vehicleType).toLowerCase()];
  if (!allowed) return false;
  return allowed.includes(String(fuelType).toLowerCase());
}

/**
 * Retrieves the full emission factor object for a vehicle-fuel combination.
 * Returns null if the combination is unsupported or unverified.
 * 
 * @param {string} vehicleType 
 * @param {string} fuelType 
 * @returns {Object|null}
 */
export function getVehicleEmissionFactor(vehicleType, fuelType) {
  if (!isVehicleFuelSupported(vehicleType, fuelType)) {
    return null;
  }
  return VEHICLE_EMISSION_FACTORS[String(fuelType).toLowerCase()] || null;
}

/**
 * Retrieves the technical rationale why a combination is unsupported.
 * 
 * @param {string} vehicleType 
 * @param {string} fuelType 
 * @returns {string}
 */
export function getUnsupportedReason(vehicleType, fuelType) {
  const normVeh = String(vehicleType || '').toLowerCase();
  const normFuel = String(fuelType || '').toLowerCase();

  const found = UNSUPPORTED_COMBINATIONS.find(
    (c) => c.vehicleType === normVeh && c.fuelType === normFuel
  );

  if (found) {
    return found.reason;
  }

  if (!SUPPORTED_VEHICLE_COMBINATIONS[normVeh]) {
    return `Vehicle type "${vehicleType}" is unrecognized or unsupported. Supported types: car, motorcycle, scooter, bus, other.`;
  }

  if (!VEHICLE_EMISSION_FACTORS[normFuel]) {
    return `Fuel type "${fuelType}" is unrecognized. Supported fuels: petrol, diesel, cng, electric.`;
  }

  return `The combination of ${vehicleType} with ${fuelType} is not supported by verified mobile combustion standards.`;
}
