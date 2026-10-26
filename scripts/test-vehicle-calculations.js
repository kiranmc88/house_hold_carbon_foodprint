/**
 * TerraTrace Drive — Vehicle Calculation Engine Comprehensive Test Suite
 * 
 * Verifies all 11 required test categories:
 * 1. Petrol calculations (Method A & B)
 * 2. Diesel calculations (Method A & B)
 * 3. CNG calculations (Method A & B)
 * 4. EV electricity calculations (Scope 2 labeling)
 * 5. Actual-consumption calculations across fuels
 * 6. Zero distance handling (avoiding NaN / division by zero)
 * 7. Invalid efficiency handling (negative, zero, NaN, avoiding Infinity)
 * 8. Missing / unsupported emission factors
 * 9. Unit consistency
 * 10. Annualization (12x monthly, kg to tonnes conversion)
 * 11. Prevention of double-counting
 * 
 * Plus Extended Robustness Suites:
 * 12. Fleet Aggregation & Proportional Breakdown
 * 13. Numeric Sanitization & Boundary Clamping
 */

import { 
  calculateVehicleEmissions, 
  calculateDistanceBasedEmissions, 
  calculateActualConsumptionEmissions,
  calculateFleetEmissions,
  sanitizeNumber,
  isVehicleFuelSupported,
  getUnsupportedReason,
  getVehicleEmissionFactor
} from '../src/utils/vehicleCalculations.js';

import { 
  VEHICLE_EMISSION_FACTORS, 
  SUPPORTED_VEHICLE_COMBINATIONS,
  UNSUPPORTED_COMBINATIONS
} from '../src/data/vehicleEmissionFactors.js';

console.log('======================================================================');
console.log('TERRATRACE DRIVE — VEHICLE CALCULATION ENGINE AUTOMATED TESTS');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${testName} - ${details}`);
    failCount++;
  }
}

// -----------------------------------------------------------------------------
// 1. PETROL CALCULATIONS
// -----------------------------------------------------------------------------
console.log('--- 1. Testing Petrol Calculations ---');
{
  // Distance-based formula:
  // fuelConsumedLitres = distanceKm / efficiencyKmPerLitre
  // directCO2Kg = fuelConsumedLitres * emissionFactorKgCO2PerLitre (2.3149)
  const distanceKm = 900;
  const efficiency = 15.0; // km/L
  const expectedFuel = distanceKm / efficiency; // 60 litres
  const factor = VEHICLE_EMISSION_FACTORS.petrol.value; // 2.3149
  const expectedCO2 = expectedFuel * factor; // 138.894 kg

  const result = calculateDistanceBasedEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    distanceKm,
    efficiency,
  });

  assert(result.isValid === true, 'Petrol result is marked valid');
  assert(result.isSupported === true, 'Petrol car is a supported combination');
  assert(Math.abs(result.monthlyFuelConsumed - expectedFuel) < 1e-9, 'Petrol fuel consumed matches formula (distance / efficiency)');
  assert(Math.abs(result.monthlyEmissionsKg - expectedCO2) < 1e-9, 'Petrol direct emissions match fuelConsumed * 2.3149');
  assert(result.emissionFactor === 2.3149, 'Applied emission factor is exactly 2.3149');
  assert(result.emissionFactorUnit === 'kg CO2 / litre', 'Emission factor unit is kg CO2 / litre');
  assert(result.emissionsBoundary === 'Scope 1 — Direct Tailpipe Combustion', 'Boundary is correctly labeled Scope 1 Direct Tailpipe');
  assert(result.isTailpipe === true, 'isTailpipe flag is true for petrol');
  assert(result.isElectric === false, 'isElectric flag is false for petrol');
  assert(result.vehicleType === 'car' && result.fuelType === 'petrol', 'Vehicle and fuel types match input');
  assert(result.calculationMethod === 'distance_efficiency', 'Method recorded as distance_efficiency');
}

// -----------------------------------------------------------------------------
// 2. DIESEL CALCULATIONS
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing Diesel Calculations ---');
{
  // Distance-based formula:
  // fuelConsumedLitres = distanceKm / efficiencyKmPerLitre
  // directCO2Kg = fuelConsumedLitres * emissionFactorKgCO2PerLitre (2.6878)
  const distanceKm = 1000;
  const efficiency = 20.0; // km/L
  const expectedFuel = 50.0; // litres
  const factor = VEHICLE_EMISSION_FACTORS.diesel.value; // 2.6878
  const expectedCO2 = expectedFuel * factor; // 134.39 kg

  const result = calculateDistanceBasedEmissions({
    vehicleType: 'car',
    fuelType: 'diesel',
    distanceKm,
    efficiency,
  });

  assert(result.isValid === true, 'Diesel result is marked valid');
  assert(result.isSupported === true, 'Diesel car is supported');
  assert(Math.abs(result.monthlyFuelConsumed - expectedFuel) < 1e-9, 'Diesel fuel consumed matches 1000 / 20 = 50 L');
  assert(Math.abs(result.monthlyEmissionsKg - expectedCO2) < 1e-9, 'Diesel emissions match 50 L * 2.6878 = 134.39 kg');
  assert(result.emissionFactor === 2.6878, 'Diesel factor is 2.6878');
  assert(result.emissionFactorUnit === 'kg CO2 / litre', 'Diesel factor unit is kg CO2 / litre');
  assert(result.emissionsBoundary === 'Scope 1 — Direct Tailpipe Combustion', 'Diesel is labeled Scope 1 Direct Tailpipe');
  assert(result.isTailpipe === true, 'isTailpipe is true for diesel');
  assert(result.isElectric === false, 'isElectric is false for diesel');
}

// -----------------------------------------------------------------------------
// 3. CNG CALCULATIONS
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing CNG Calculations ---');
{
  // Distance-based formula:
  // fuelConsumedKg = distanceKm / efficiencyKmPerKg
  // directCO2Kg = fuelConsumedKg * emissionFactorKgCO2PerKg (2.75)
  const distanceKm = 880;
  const efficiency = 22.0; // km/kg
  const expectedFuelKg = 40.0; // kg
  const factor = VEHICLE_EMISSION_FACTORS.cng.value; // 2.75
  const expectedCO2 = expectedFuelKg * factor; // 110.0 kg

  const result = calculateDistanceBasedEmissions({
    vehicleType: 'car',
    fuelType: 'cng',
    distanceKm,
    efficiency,
  });

  assert(result.isValid === true, 'CNG result is marked valid');
  assert(result.isSupported === true, 'CNG car is supported');
  assert(Math.abs(result.monthlyFuelConsumed - expectedFuelKg) < 1e-9, 'CNG fuel consumed matches 880 / 22 = 40 kg');
  assert(Math.abs(result.monthlyEmissionsKg - expectedCO2) < 1e-9, 'CNG emissions match 40 kg * 2.75 = 110 kg');
  assert(result.emissionFactor === 2.7500, 'CNG factor is 2.7500');
  assert(result.emissionFactorUnit === 'kg CO2 / kg', 'CNG unit is kg CO2 / kg');
  assert(result.emissionsBoundary === 'Scope 1 — Direct Tailpipe Combustion', 'CNG is labeled Scope 1 Direct Tailpipe');
  assert(result.isTailpipe === true, 'CNG isTailpipe is true');
  assert(result.isElectric === false, 'CNG isElectric is false');
}

// -----------------------------------------------------------------------------
// 4. EV ELECTRICITY CALCULATIONS (SCOPE 2 INDIRECT LABELING)
// -----------------------------------------------------------------------------
console.log('\n--- 4. Testing EV Electricity Calculations ---');
{
  // Distance-based formula:
  // electricityConsumedKWh = distanceKm / efficiencyKmPerKWh
  // electricityCO2Kg = electricityConsumedKWh * gridEmissionFactorKgCO2ePerKWh (0.82)
  const distanceKm = 700;
  const efficiency = 7.0; // km/kWh
  const expectedElectricity = 100.0; // kWh
  const gridFactor = VEHICLE_EMISSION_FACTORS.electric.value; // 0.82
  const expectedCO2 = expectedElectricity * gridFactor; // 82.0 kg

  const result = calculateDistanceBasedEmissions({
    vehicleType: 'car',
    fuelType: 'electric',
    distanceKm,
    efficiency,
  });

  assert(result.isValid === true, 'EV result is marked valid');
  assert(result.isSupported === true, 'EV car is supported');
  assert(Math.abs(result.monthlyFuelConsumed - expectedElectricity) < 1e-9, 'EV energy consumed matches 700 / 7 = 100 kWh');
  assert(Math.abs(result.monthlyEmissionsKg - expectedCO2) < 1e-9, 'EV indirect emissions match 100 kWh * 0.82 = 82 kg');
  assert(result.emissionFactor === 0.8200, 'EV grid factor is 0.8200');
  assert(result.emissionFactorUnit === 'kg CO2e / kWh', 'EV emission factor unit is kg CO2e / kWh');
  assert(result.emissionsBoundary === 'Scope 2 — Indirect Grid Electricity Generation', 'EV boundary is strictly Scope 2 Indirect Grid Electricity');
  assert(result.isTailpipe === false, 'EV isTailpipe is strictly false (zero tailpipe emissions at point of use)');
  assert(result.isElectric === true, 'isElectric flag is true');
  assert(result.emissionsLabel.includes('Electricity-Related'), 'Emissions label explicitly identifies electricity-related emissions');
  assert(!result.emissionsLabel.includes('Tailpipe Direct'), 'EV label does NOT claim tailpipe direct emissions');
}

// -----------------------------------------------------------------------------
// 5. ACTUAL-CONSUMPTION CALCULATIONS
// -----------------------------------------------------------------------------
console.log('\n--- 5. Testing Actual-Consumption Calculations across fuels ---');
{
  // Liquid Petrol: 45 litres * 2.3149 = 104.1705 kg
  const actualPetrol = calculateActualConsumptionEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    actualConsumption: 45.0,
    distanceKm: 600,
  });
  assert(actualPetrol.isValid === true, 'Actual petrol calculation is valid');
  assert(Math.abs(actualPetrol.monthlyEmissionsKg - (45.0 * 2.3149)) < 1e-9, 'Actual petrol: 45 L * 2.3149 = 104.1705 kg');
  assert(actualPetrol.calculationMethod === 'actual_consumption', 'Method correctly recorded as actual_consumption');
  assert(actualPetrol.monthlyFuelConsumed === 45.0, 'monthlyFuelConsumed matches actual input 45 L');
  assert(Math.abs(actualPetrol.emissionsPerKm - (104.1705 / 600)) < 1e-9, 'Intensity derived from optional distance');

  // Liquid Diesel: 60 litres * 2.6878 = 161.268 kg
  const actualDiesel = calculateActualConsumptionEmissions({
    vehicleType: 'car',
    fuelType: 'diesel',
    actualConsumption: 60.0,
  });
  assert(actualDiesel.isValid === true, 'Actual diesel calculation is valid');
  assert(Math.abs(actualDiesel.monthlyEmissionsKg - (60.0 * 2.6878)) < 1e-9, 'Actual diesel: 60 L * 2.6878 = 161.268 kg');

  // CNG: 25 kg * 2.75 = 68.75 kg
  const actualCng = calculateActualConsumptionEmissions({
    vehicleType: 'car',
    fuelType: 'cng',
    actualConsumption: 25.0,
  });
  assert(actualCng.isValid === true, 'Actual CNG calculation is valid');
  assert(Math.abs(actualCng.monthlyEmissionsKg - (25.0 * 2.75)) < 1e-9, 'Actual CNG: 25 kg * 2.75 = 68.75 kg');

  // EV: 150 kWh * 0.82 = 123.0 kg
  const actualEV = calculateActualConsumptionEmissions({
    vehicleType: 'car',
    fuelType: 'electric',
    actualConsumption: 150.0,
  });
  assert(actualEV.isValid === true, 'Actual EV calculation is valid');
  assert(Math.abs(actualEV.monthlyEmissionsKg - (150.0 * 0.82)) < 1e-9, 'Actual EV electricity: 150 kWh * 0.82 = 123 kg');
  assert(actualEV.isElectric === true, 'Actual EV marks isElectric true');
  assert(actualEV.isTailpipe === false, 'Actual EV marks isTailpipe false');
}

// -----------------------------------------------------------------------------
// 6. ZERO DISTANCE HANDLING
// -----------------------------------------------------------------------------
console.log('\n--- 6. Testing Zero Distance Handling ---');
{
  const resultZero = calculateDistanceBasedEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    distanceKm: 0,
    efficiency: 15.0,
  });

  assert(resultZero.monthlyDistanceKm === 0, 'Distance is 0');
  assert(resultZero.monthlyFuelConsumed === 0, 'Fuel consumed is exactly 0 for zero distance');
  assert(resultZero.monthlyEmissionsKg === 0, 'Monthly emissions are exactly 0');
  assert(resultZero.yearlyEmissionsKg === 0, 'Yearly emissions are exactly 0');
  assert(resultZero.yearlyEmissionsTonnes === 0, 'Yearly tonnes are exactly 0');
  assert(resultZero.emissionsPerKm === 0, 'emissionsPerKm is 0 (division by zero avoided, no NaN)');
  assert(!isNaN(resultZero.emissionsPerKm), 'emissionsPerKm is not NaN');
  assert(Number.isFinite(resultZero.emissionsPerKm), 'emissionsPerKm is finite');
  assert(resultZero.emissionsPerKmGrams === 0, 'emissionsPerKmGrams is 0');

  // Zero actual consumption
  const resultZeroActual = calculateActualConsumptionEmissions({
    vehicleType: 'car',
    fuelType: 'diesel',
    actualConsumption: 0,
    distanceKm: 0,
  });
  assert(resultZeroActual.monthlyEmissionsKg === 0, 'Zero actual consumption yields 0 emissions');
  assert(resultZeroActual.emissionsPerKm === 0, 'Zero actual consumption yields 0 emissionsPerKm');
}

// -----------------------------------------------------------------------------
// 7. INVALID EFFICIENCY HANDLING
// -----------------------------------------------------------------------------
console.log('\n--- 7. Testing Invalid Efficiency Handling ---');
{
  // Zero efficiency (would cause distance / 0 = Infinity if unguarded)
  const resultZeroEff = calculateDistanceBasedEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    distanceKm: 800,
    efficiency: 0,
  });
  assert(resultZeroEff.isValid === false, 'Zero efficiency is flagged as invalid (isValid: false)');
  assert(resultZeroEff.monthlyFuelConsumed === 0, 'Zero efficiency results in 0 fuel (avoids Infinity)');
  assert(resultZeroEff.monthlyEmissionsKg === 0, 'Zero efficiency results in 0 emissions');
  assert(resultZeroEff.error.includes('positive number'), 'Helpful error message returned for zero efficiency');

  // Negative efficiency
  const resultNegEff = calculateDistanceBasedEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    distanceKm: 800,
    efficiency: -15,
  });
  assert(resultNegEff.isValid === false, 'Negative efficiency is flagged as invalid');
  assert(resultNegEff.monthlyEmissionsKg === 0, 'Negative efficiency does not produce negative emissions');

  // String / NaN efficiency
  const resultNaNEff = calculateDistanceBasedEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    distanceKm: 800,
    efficiency: 'abc',
  });
  assert(resultNaNEff.isValid === false, 'String/NaN efficiency is flagged as invalid');
  assert(!isNaN(resultNaNEff.monthlyEmissionsKg), 'Emissions are safe finite number, not NaN');

  // Null efficiency
  const resultNullEff = calculateDistanceBasedEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    distanceKm: 800,
    efficiency: null,
  });
  assert(resultNullEff.isValid === false, 'Null efficiency is flagged as invalid');

  // Negative actual consumption
  const resultNegActual = calculateActualConsumptionEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    actualConsumption: -50,
  });
  assert(resultNegActual.isValid === false, 'Negative actual consumption is flagged as invalid');
  assert(resultNegActual.monthlyEmissionsKg === 0, 'Negative actual consumption yields 0 emissions');
}

// -----------------------------------------------------------------------------
// 8. MISSING / UNSUPPORTED EMISSION FACTORS
// -----------------------------------------------------------------------------
console.log('\n--- 8. Testing Missing / Unsupported Emission Factors ---');
{
  // Check metadata definitions
  assert(SUPPORTED_VEHICLE_COMBINATIONS.car.includes('petrol'), 'SUPPORTED_VEHICLE_COMBINATIONS configures petrol for car');
  assert(UNSUPPORTED_COMBINATIONS.some(c => c.vehicleType === 'scooter' && c.fuelType === 'diesel'), 'UNSUPPORTED_COMBINATIONS records scooter diesel');

  // Check helper isVehicleFuelSupported
  assert(isVehicleFuelSupported('car', 'petrol') === true, 'Car + Petrol is supported');
  assert(isVehicleFuelSupported('car', 'diesel') === true, 'Car + Diesel is supported');
  assert(isVehicleFuelSupported('car', 'cng') === true, 'Car + CNG is supported');
  assert(isVehicleFuelSupported('car', 'electric') === true, 'Car + Electric is supported');

  assert(isVehicleFuelSupported('motorcycle', 'petrol') === true, 'Motorcycle + Petrol is supported');
  assert(isVehicleFuelSupported('motorcycle', 'electric') === true, 'Motorcycle + Electric is supported');
  assert(isVehicleFuelSupported('motorcycle', 'diesel') === false, 'Motorcycle + Diesel is unsupported');
  assert(isVehicleFuelSupported('motorcycle', 'cng') === false, 'Motorcycle + CNG is unsupported');

  assert(isVehicleFuelSupported('scooter', 'petrol') === true, 'Scooter + Petrol is supported');
  assert(isVehicleFuelSupported('scooter', 'electric') === true, 'Scooter + Electric is supported');
  assert(isVehicleFuelSupported('scooter', 'diesel') === false, 'Scooter + Diesel is unsupported');
  assert(isVehicleFuelSupported('scooter', 'cng') === false, 'Scooter + CNG is unsupported');

  assert(isVehicleFuelSupported('bus', 'diesel') === true, 'Bus + Diesel is supported');
  assert(isVehicleFuelSupported('bus', 'cng') === true, 'Bus + CNG is supported');
  assert(isVehicleFuelSupported('bus', 'electric') === true, 'Bus + Electric is supported');
  assert(isVehicleFuelSupported('bus', 'petrol') === false, 'Bus + Petrol is unsupported');

  // Check getVehicleEmissionFactor returns null for unsupported pairs
  assert(getVehicleEmissionFactor('scooter', 'diesel') === null, 'getVehicleEmissionFactor returns null for scooter diesel');
  assert(getVehicleEmissionFactor('bus', 'petrol') === null, 'getVehicleEmissionFactor returns null for bus petrol');

  // Check getUnsupportedReason
  const reasonScooter = getUnsupportedReason('scooter', 'diesel');
  assert(reasonScooter.includes('Diesel commuter scooters are non-existent'), 'Technical reason for scooter diesel provided');

  // Scooter + Diesel (unsupported combination in engine)
  const resultScooterDiesel = calculateVehicleEmissions({
    vehicleType: 'scooter',
    fuelType: 'diesel',
    monthlyDistanceKm: 300,
    fuelEfficiency: 40,
  });
  assert(resultScooterDiesel.isSupported === false, 'Scooter + Diesel is identified as unsupported');
  assert(resultScooterDiesel.isValid === false, 'Scooter + Diesel isValid is false');
  assert(resultScooterDiesel.emissionFactor === null, 'Emission factor is null for unsupported combination');
  assert(resultScooterDiesel.monthlyEmissionsKg === 0, 'Emissions are 0 for unsupported calculation');
  assert(resultScooterDiesel.error.includes('Diesel commuter scooters'), 'Technical reason for unsupported combination is present');

  // Motorcycle + CNG (unsupported combination in engine)
  const resultMotoCNG = calculateVehicleEmissions({
    vehicleType: 'motorcycle',
    fuelType: 'cng',
    monthlyDistanceKm: 400,
    fuelEfficiency: 50,
  });
  assert(resultMotoCNG.isSupported === false, 'Motorcycle + CNG is identified as unsupported');
  assert(resultMotoCNG.emissionFactor === null, 'Motorcycle + CNG emission factor is null');

  // Transit Bus + Petrol (unsupported combination in engine)
  const resultBusPetrol = calculateVehicleEmissions({
    vehicleType: 'bus',
    fuelType: 'petrol',
    monthlyDistanceKm: 1000,
    fuelEfficiency: 3.5,
  });
  assert(resultBusPetrol.isSupported === false, 'Transit Bus + Petrol is identified as unsupported');

  // Unknown vehicle type
  const resultUnknownVeh = calculateVehicleEmissions({
    vehicleType: 'rocketship',
    fuelType: 'petrol',
    monthlyDistanceKm: 500,
    fuelEfficiency: 10,
  });
  assert(resultUnknownVeh.isSupported === false, 'Unknown vehicle type is rejected safely');
  assert(resultUnknownVeh.error.includes('unrecognized or unsupported'), 'Clear error message for unknown vehicle');

  // Unknown fuel type
  const resultUnknownFuel = calculateVehicleEmissions({
    vehicleType: 'car',
    fuelType: 'uranium',
    monthlyDistanceKm: 500,
    fuelEfficiency: 10,
  });
  assert(resultUnknownFuel.isSupported === false, 'Unknown fuel type is rejected safely');
  assert(resultUnknownFuel.error.includes('unrecognized'), 'Clear error message for unknown fuel');
}

// -----------------------------------------------------------------------------
// 9. UNIT CONSISTENCY
// -----------------------------------------------------------------------------
console.log('\n--- 9. Testing Unit Consistency ---');
{
  const petrolResult = calculateVehicleEmissions({ vehicleType: 'car', fuelType: 'petrol', monthlyDistanceKm: 600, fuelEfficiency: 15 });
  assert(petrolResult.emissionFactorUnit === 'kg CO2 / litre', 'Petrol factor unit is kg CO2 / litre');
  assert(petrolResult.fuelUnit === 'litre', 'Petrol fuelUnit is litre');
  assert(petrolResult.efficiencyUnit === 'km/litre', 'Petrol efficiencyUnit is km/litre');

  const dieselResult = calculateVehicleEmissions({ vehicleType: 'car', fuelType: 'diesel', monthlyDistanceKm: 600, fuelEfficiency: 15 });
  assert(dieselResult.emissionFactorUnit === 'kg CO2 / litre', 'Diesel factor unit is kg CO2 / litre');
  assert(dieselResult.fuelUnit === 'litre', 'Diesel fuelUnit is litre');
  assert(dieselResult.efficiencyUnit === 'km/litre', 'Diesel efficiencyUnit is km/litre');

  const cngResult = calculateVehicleEmissions({ vehicleType: 'car', fuelType: 'cng', monthlyDistanceKm: 600, fuelEfficiency: 20 });
  assert(cngResult.emissionFactorUnit === 'kg CO2 / kg', 'CNG factor unit is kg CO2 / kg');
  assert(cngResult.fuelUnit === 'kg', 'CNG fuelUnit is kg');
  assert(cngResult.efficiencyUnit === 'km/kg', 'CNG efficiencyUnit is km/kg');

  const evResult = calculateVehicleEmissions({ vehicleType: 'car', fuelType: 'electric', monthlyDistanceKm: 600, fuelEfficiency: 6 });
  assert(evResult.emissionFactorUnit === 'kg CO2e / kWh', 'EV factor unit is kg CO2e / kWh');
  assert(evResult.fuelUnit === 'kWh', 'EV fuelUnit is kWh');
  assert(evResult.efficiencyUnit === 'km/kWh', 'EV efficiencyUnit is km/kWh');

  // Intensity unit consistency: emissionsPerKm = monthlyEmissionsKg / distanceKm
  const expectedPerKm = petrolResult.monthlyEmissionsKg / petrolResult.monthlyDistanceKm;
  assert(Math.abs(petrolResult.emissionsPerKm - expectedPerKm) < 1e-9, 'emissionsPerKm equals monthlyEmissionsKg / monthlyDistanceKm');
  assert(Math.abs(petrolResult.emissionsPerKmGrams - (expectedPerKm * 1000)) < 1e-9, 'emissionsPerKmGrams equals emissionsPerKm * 1000');
  assert(petrolResult.emissionsPerKmKg === Number(expectedPerKm.toFixed(4)), 'emissionsPerKmKg formatted consistently');
}

// -----------------------------------------------------------------------------
// 10. ANNUALIZATION
// -----------------------------------------------------------------------------
console.log('\n--- 10. Testing Annualization ---');
{
  const res = calculateVehicleEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    monthlyDistanceKm: 1000,
    fuelEfficiency: 16.0,
  });

  const expectedMonthly = (1000 / 16.0) * 2.3149; // 144.68125 kg
  const expectedAnnualKg = expectedMonthly * 12; // 1736.175 kg
  const expectedAnnualTonnes = expectedAnnualKg / 1000; // 1.736175 tonnes

  assert(Math.abs(res.monthlyEmissionsKg - expectedMonthly) < 1e-9, 'Monthly emissions calculated with full precision');
  assert(Math.abs(res.yearlyEmissionsKg - expectedAnnualKg) < 1e-9, 'yearlyEmissionsKg strictly equals monthlyEmissionsKg * 12');
  assert(Math.abs(res.yearlyEmissionsTonnes - expectedAnnualTonnes) < 1e-9, 'yearlyEmissionsTonnes strictly equals yearlyEmissionsKg / 1000');
  assert(res.yearlyEmissionsTonnes === res.annualCO2Tonnes, 'yearlyEmissionsTonnes matches annualCO2Tonnes backward-compatible alias');
  assert(res.yearlyEmissionsKg === res.annualCO2Kg, 'yearlyEmissionsKg matches annualCO2Kg alias');
}

// -----------------------------------------------------------------------------
// 11. PREVENTION OF DOUBLE-COUNTING
// -----------------------------------------------------------------------------
console.log('\n--- 11. Testing Prevention of Double-Counting ---');
{
  // Test A: User inputs Method A with both distance and accidental actualConsumption
  const resMethodAWithActual = calculateVehicleEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    calculationMethod: 'distance_efficiency',
    monthlyDistanceKm: 750,
    fuelEfficiency: 15.0, // Should strictly compute 750 / 15 = 50 L => 50 * 2.3149 = 115.745 kg
    actualConsumption: 80.0, // MUST BE IGNORED
  });

  const pureMethodA = calculateVehicleEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    calculationMethod: 'distance_efficiency',
    monthlyDistanceKm: 750,
    fuelEfficiency: 15.0,
  });

  assert(
    Math.abs(resMethodAWithActual.monthlyEmissionsKg - pureMethodA.monthlyEmissionsKg) < 1e-9,
    'Method A ignores actualConsumption: no double-counting occurs'
  );
  assert(resMethodAWithActual.monthlyFuelConsumed === 50.0, 'Fuel consumed in Method A is strictly derived from distance / efficiency');

  // Test B: User inputs Method B with actualConsumption and distance
  const resMethodBWithDistance = calculateVehicleEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    calculationMethod: 'actual_consumption',
    actualConsumption: 40.0, // 40 * 2.3149 = 92.596 kg
    monthlyDistanceKm: 2000, // Distance must NOT calculate additional fuel!
    fuelEfficiency: 10.0,
  });

  const pureMethodB = calculateVehicleEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    calculationMethod: 'actual_consumption',
    actualConsumption: 40.0,
  });

  assert(
    Math.abs(resMethodBWithDistance.monthlyEmissionsKg - pureMethodB.monthlyEmissionsKg) < 1e-9,
    'Method B strictly uses actualConsumption: distance does NOT add duplicate emissions'
  );
  assert(resMethodBWithDistance.monthlyFuelConsumed === 40.0, 'Fuel consumed in Method B is strictly 40.0 litres');
  assert(resMethodBWithDistance.monthlyEmissionsKg === 40.0 * 2.3149, 'Emissions in Method B strictly equal 40 * 2.3149');
}

// -----------------------------------------------------------------------------
// 12. FLEET AGGREGATION & BREAKDOWN
// -----------------------------------------------------------------------------
console.log('\n--- 12. Testing Fleet Aggregation & Proportional Breakdown ---');
{
  const car = {
    id: 'veh_1',
    name: 'Primary Car',
    vehicleType: 'car',
    fuelType: 'petrol',
    monthlyDistanceKm: 800,
    fuelEfficiency: 16.0, // 50 L => 50 * 2.3149 = 115.745 kg
  };

  const scooter = {
    id: 'veh_2',
    name: 'City Scooter',
    vehicleType: 'scooter',
    fuelType: 'electric',
    monthlyDistanceKm: 400,
    fuelEfficiency: 25.0, // 16 kWh => 16 * 0.82 = 13.12 kg
  };

  const fleet = calculateFleetEmissions([car, scooter]);
  const expectedTotalKg = 115.745 + 13.12;

  assert(fleet.isFleet === true, 'Fleet with 2 vehicles is identified as fleet');
  assert(fleet.vehicleCount === 2, 'Fleet vehicle count is 2');
  assert(Math.abs(fleet.monthlyEmissionsKg - expectedTotalKg) < 1e-9, 'Fleet monthly emissions strictly equal sum of individual vehicles');
  assert(Math.abs(fleet.yearlyEmissionsKg - (expectedTotalKg * 12)) < 1e-9, 'Fleet yearly kg strictly equals 12x monthly total');
  assert(Math.abs(fleet.yearlyEmissionsTonnes - ((expectedTotalKg * 12) / 1000)) < 1e-9, 'Fleet yearly tonnes strictly equals yearlyKg / 1000');
  assert(fleet.totalDistanceKm === 1200, 'Fleet total distance is sum of individual distances (800 + 400)');
  assert(fleet.totalFuelConsumed === 66, 'Fleet total fuel is 50 + 16');

  // Verify share percentages
  const carShare = (115.745 / expectedTotalKg) * 100;
  const scooterShare = (13.12 / expectedTotalKg) * 100;
  assert(Math.abs(fleet.vehicles[0].sharePercentage - Number(carShare.toFixed(1))) < 0.2, 'Car fleet share percentage matches');
  assert(Math.abs(fleet.vehicles[1].sharePercentage - Number(scooterShare.toFixed(1))) < 0.2, 'Scooter fleet share percentage matches');

  // Empty fleet safety
  assert(calculateFleetEmissions([]) === null, 'Empty fleet returns null safely');
}

// -----------------------------------------------------------------------------
// 13. NUMERIC SANITIZATION & BOUNDARY CLAMPING
// -----------------------------------------------------------------------------
console.log('\n--- 13. Testing Numeric Sanitization & Boundary Clamping ---');
{
  assert(sanitizeNumber(undefined, 42) === 42, 'Undefined falls back to fallback value');
  assert(sanitizeNumber(null, 10) === 10, 'Null falls back to fallback value');
  assert(sanitizeNumber('', 5) === 5, 'Empty string falls back to fallback value');
  assert(sanitizeNumber('not-a-number', 0) === 0, 'NaN string falls back to fallback value');
  assert(sanitizeNumber(NaN, 99) === 99, 'NaN falls back to fallback value');
  assert(sanitizeNumber(Infinity, 0) === 0, 'Infinity falls back to fallback value');
  assert(sanitizeNumber(-Infinity, 0) === 0, '-Infinity falls back to fallback value');
  assert(sanitizeNumber(-50, 0, 0, 100) === 0, 'Negative value clamped to min');
  assert(sanitizeNumber(250, 0, 0, 100) === 100, 'Large value clamped to max');
  assert(sanitizeNumber(45.5, 0, 0, 100) === 45.5, 'Valid float returned accurately');
}

// -----------------------------------------------------------------------------
// FINAL SUMMARY
// -----------------------------------------------------------------------------
console.log('\n======================================================================');
console.log(`TOTAL TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
