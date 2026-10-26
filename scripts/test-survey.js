/**
 * TerraTrace Drive — Vehicle Usage Survey Comprehensive Automated Test Suite
 * 
 * Verifies all required survey capabilities:
 * 1. Form validation & input sanitization
 * 2. Method A (Distance & Efficiency) calculations
 * 3. Method B (Actual Consumption) calculations & double-counting prevention
 * 4. Unsupported powertrain combinations & strict no-fallback verification
 * 5. Data persistence & malformed storage resilience
 * 6. Synthetic demonstration mode isolation
 * 7. Statistical analytics engine & empty-state resilience
 * 8. Participant category cross-tabulation
 * 9. RFC 4180 compliant CSV export with proper escaping and zero PII
 * 10. Scientific factor accuracy, citations, and emissions boundaries
 */

import {
  SURVEY_EMISSION_FACTORS,
  isSurveyCombinationSupported,
  getSurveyEmissionFactor,
  getSurveyUnsupportedReason,
} from '../src/data/surveyEmissionFactors.js';

import {
  calculateSurveyRecordEmissions,
  calculateSurveyAnalytics,
} from '../src/utils/surveyCalculations.js';

import {
  getActualSurveyRecords,
  saveActualSurveyRecord,
  deleteActualSurveyRecord,
  clearActualSurveyRecords,
  generateBenchmarkDemoRecords,
  SURVEY_STORAGE_KEYS,
} from '../src/utils/surveyStorage.js';

import {
  escapeCsvField,
  generateSurveyCsv,
} from '../src/utils/surveyExport.js';

console.log('======================================================================');
console.log('TERRATRACE DRIVE — VEHICLE USAGE SURVEY AUTOMATED TEST SUITE');
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
    process.exitCode = 1;
  }
}

// =============================================================================
// SUITE 1: SCIENTIFIC EMISSION FACTORS & METADATA INTEGRITY
// =============================================================================
console.log('--- Suite 1: Scientific Emission Factors & Metadata ---');
{
  // Petrol
  const petrol = SURVEY_EMISSION_FACTORS.petrol;
  assert(petrol.value === 2.3149, 'Petrol factor value is 2.3149 kg CO2/L');
  assert(petrol.unit === 'kg CO2 / litre', 'Petrol factor unit is kg CO2 / litre');
  assert(petrol.scope === 'Scope 1 (Tailpipe)', 'Petrol scope is Scope 1 (Tailpipe)');
  assert(petrol.isTailpipe === true, 'Petrol isTailpipe is true');
  assert(petrol.isElectricity === false, 'Petrol isElectricity is false');
  assert(petrol.publicationYear === 2023, 'Petrol factor reporting year is 2023');

  // Diesel
  const diesel = SURVEY_EMISSION_FACTORS.diesel;
  assert(diesel.value === 2.6878, 'Diesel factor value is 2.6878 kg CO2/L');
  assert(diesel.scope === 'Scope 1 (Tailpipe)', 'Diesel scope is Scope 1');
  assert(diesel.isTailpipe === true, 'Diesel isTailpipe is true');

  // CNG
  const cng = SURVEY_EMISSION_FACTORS.cng;
  assert(cng.value === 2.7500, 'CNG factor value is 2.7500 kg CO2/kg');
  assert(cng.fuelUnit === 'kg', 'CNG unit is kg (mass-based)');
  assert(cng.scope === 'Scope 1 (Tailpipe)', 'CNG scope is Scope 1');

  // Electric
  const ev = SURVEY_EMISSION_FACTORS.electric;
  assert(ev.value === 0.8200, 'Electric factor value is 0.8200 kg CO2e/kWh');
  assert(ev.isTailpipe === false, 'Electric vehicles have ZERO direct tailpipe emissions');
  assert(ev.isElectricity === true, 'Electric is marked isElectricity true');
  assert(ev.scope === 'Scope 2 (Indirect Power Generation)', 'Electric scope is Scope 2 Indirect Grid');
  assert(ev.source.includes('Central Electricity Authority'), 'Electric factor source cites CEA India v19');
}

// =============================================================================
// SUITE 2: METHOD A (DISTANCE & EFFICIENCY) CALCULATIONS
// =============================================================================
console.log('\n--- Suite 2: Method A (Distance & Efficiency) ---');
{
  // 1. Petrol Car: 600 km, 15 km/L -> 40 L * 2.3149 = 92.596 kg CO2e
  const petrolResult = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    calculationMethod: 'distance_efficiency',
    monthlyDistanceKm: 600,
    fuelEfficiency: 15.0,
  });
  assert(petrolResult.isValid === true, 'Method A: Petrol car calculation is valid');
  assert(Math.abs(petrolResult.monthlyFuelConsumed - 40.0) < 1e-6, 'Method A: Fuel consumed is 40.0 litres');
  assert(Math.abs(petrolResult.monthlyEmissionsKg - 92.596) < 1e-4, 'Method A: Petrol emissions match 92.596 kg');
  assert(Math.abs(petrolResult.yearlyEmissionsKg - 92.596 * 12) < 1e-4, 'Method A: Yearly emissions are 12x monthly');
  assert(Math.abs(petrolResult.emissionsPerKmGrams - (92.596 / 600) * 1000) < 1e-2, 'Method A: Intensity is ~154.3 g/km');

  // 2. Diesel Car: 900 km, 18 km/L -> 50 L * 2.6878 = 134.39 kg CO2e
  const dieselResult = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'diesel',
    calculationMethod: 'distance_efficiency',
    monthlyDistanceKm: 900,
    fuelEfficiency: 18.0,
  });
  assert(dieselResult.isValid === true, 'Method A: Diesel car calculation is valid');
  assert(Math.abs(dieselResult.monthlyFuelConsumed - 50.0) < 1e-6, 'Method A: Diesel fuel consumed is 50.0 L');
  assert(Math.abs(dieselResult.monthlyEmissionsKg - 134.39) < 1e-4, 'Method A: Diesel emissions match 134.39 kg');

  // 3. CNG Car: 660 km, 22 km/kg -> 30 kg * 2.7500 = 82.5 kg CO2e
  const cngResult = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'cng',
    calculationMethod: 'distance_efficiency',
    monthlyDistanceKm: 660,
    fuelEfficiency: 22.0,
  });
  assert(cngResult.isValid === true, 'Method A: CNG car calculation is valid');
  assert(Math.abs(cngResult.monthlyFuelConsumed - 30.0) < 1e-6, 'Method A: CNG fuel consumed is 30.0 kg');
  assert(Math.abs(cngResult.monthlyEmissionsKg - 82.5) < 1e-4, 'Method A: CNG emissions match 82.5 kg');

  // 4. Electric Car: 700 km, 7 km/kWh -> 100 kWh * 0.82 = 82.0 kg CO2e
  const evResult = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'electric',
    calculationMethod: 'distance_efficiency',
    monthlyDistanceKm: 700,
    fuelEfficiency: 7.0,
  });
  assert(evResult.isValid === true, 'Method A: EV car calculation is valid');
  assert(Math.abs(evResult.monthlyFuelConsumed - 100.0) < 1e-6, 'Method A: EV electricity consumed is 100 kWh');
  assert(Math.abs(evResult.monthlyEmissionsKg - 82.0) < 1e-4, 'Method A: EV emissions match 82.0 kg CO2e');
  assert(evResult.isElectricity === true, 'Method A: EV is marked isElectricity true');
}

// =============================================================================
// SUITE 3: METHOD B (ACTUAL CONSUMPTION) & DOUBLE-COUNTING PREVENTION
// =============================================================================
console.log('\n--- Suite 3: Method B (Actual Consumption) & Double-Counting ---');
{
  // 1. Direct Petrol: 45 L, distance 500 km, efficiency null/omitted
  const actualPetrol = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    calculationMethod: 'actual_consumption',
    actualConsumption: 45.0,
    monthlyDistanceKm: 500,
    fuelEfficiency: null, // NOT required
  });
  assert(actualPetrol.isValid === true, 'Method B: Calculation is valid without fuel efficiency');
  assert(Math.abs(actualPetrol.monthlyFuelConsumed - 45.0) < 1e-6, 'Method B: Fuel consumed strictly equals actual input (45 L)');
  assert(Math.abs(actualPetrol.monthlyEmissionsKg - 45.0 * 2.3149) < 1e-4, 'Method B: Emissions strictly equal 45 L * 2.3149');
  assert(Math.abs(actualPetrol.emissionsPerKmGrams - ((45.0 * 2.3149) / 500) * 1000) < 1e-2, 'Method B: Intensity computed from optional distance');

  // 2. Double-counting test: distance variation must NOT change emissions in Method B
  const actualPetrolHighDist = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    calculationMethod: 'actual_consumption',
    actualConsumption: 45.0,
    monthlyDistanceKm: 1500, // 3x distance
  });
  assert(
    Math.abs(actualPetrol.monthlyEmissionsKg - actualPetrolHighDist.monthlyEmissionsKg) < 1e-9,
    'Method B: Changing distance does NOT alter emissions (Double-counting prevented)'
  );

  // 3. Direct EV Charging: 120 kWh -> 120 * 0.82 = 98.4 kg CO2e
  const actualEv = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'electric',
    calculationMethod: 'actual_consumption',
    actualConsumption: 120.0,
  });
  assert(actualEv.isValid === true, 'Method B: Actual EV consumption is valid');
  assert(Math.abs(actualEv.monthlyEmissionsKg - 98.4) < 1e-4, 'Method B: EV emissions match 120 * 0.82 = 98.4 kg');
  assert(actualEv.scope === 'Scope 2 (Indirect Power Generation)', 'Method B: EV labeled Scope 2');
}

// =============================================================================
// SUITE 4: UNSUPPORTED COMBINATIONS & STRICT NO-FALLBACK VERIFICATION
// =============================================================================
console.log('\n--- Suite 4: Unsupported Combinations & Factor Integrity ---');
{
  // 1. Motorcycle + Diesel (Non-existent production vehicle)
  const mcDieselSupported = isSurveyCombinationSupported('motorcycle', 'diesel');
  assert(mcDieselSupported === false, 'Motorcycle + Diesel is correctly identified as unsupported');

  const mcDieselFactor = getSurveyEmissionFactor('motorcycle', 'diesel');
  assert(mcDieselFactor === null, 'getSurveyEmissionFactor returns null for Motorcycle + Diesel');

  const mcDieselReason = getSurveyUnsupportedReason('motorcycle', 'diesel');
  assert(mcDieselReason.includes('diesel motorcycles are not standard'), 'Technical reason for diesel motorcycle documented');

  const mcDieselCalc = calculateSurveyRecordEmissions({
    vehicleType: 'motorcycle',
    fuelType: 'diesel',
    monthlyDistanceKm: 500,
    fuelEfficiency: 40,
  });
  assert(mcDieselCalc.isValid === false, 'Motorcycle + Diesel calculation marked invalid');
  assert(mcDieselCalc.isSupported === false, 'Motorcycle + Diesel marked isSupported false');
  assert(mcDieselCalc.monthlyEmissionsKg === 0, 'No emissions produced for unsupported pair');
  assert(mcDieselCalc.error.length > 0, 'Clear error message returned for unsupported pair');

  // 2. Scooter + CNG
  const scooterCng = calculateSurveyRecordEmissions({
    vehicleType: 'scooter',
    fuelType: 'cng',
    monthlyDistanceKm: 300,
    fuelEfficiency: 40,
  });
  assert(scooterCng.isValid === false, 'Scooter + CNG is rejected');

  // 3. Bus + Petrol
  const busPetrol = calculateSurveyRecordEmissions({
    vehicleType: 'bus',
    fuelType: 'petrol',
    monthlyDistanceKm: 1000,
    fuelEfficiency: 3,
  });
  assert(busPetrol.isValid === false, 'Transit Bus + Petrol is rejected');

  // 4. Unknown vehicle type
  const unknownVeh = calculateSurveyRecordEmissions({
    vehicleType: 'hovercraft',
    fuelType: 'petrol',
    monthlyDistanceKm: 200,
    fuelEfficiency: 10,
  });
  assert(unknownVeh.isValid === false, 'Unknown vehicle type rejected');

  // 5. Unknown fuel type
  const unknownFuel = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'hydrogen',
    monthlyDistanceKm: 200,
    fuelEfficiency: 10,
  });
  assert(unknownFuel.isValid === false, 'Unknown fuel type rejected');
}

// =============================================================================
// SUITE 5: FORM VALIDATION & SANITIZATION
// =============================================================================
console.log('\n--- Suite 5: Form Validation & Sanitization ---');
{
  // 1. Zero efficiency in Method A
  const zeroEff = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    calculationMethod: 'distance_efficiency',
    monthlyDistanceKm: 500,
    fuelEfficiency: 0,
  });
  assert(zeroEff.isValid === false, 'Zero efficiency rejected');
  assert(zeroEff.monthlyEmissionsKg === 0, 'Zero efficiency does not produce NaN or Infinity');

  // 2. Negative efficiency in Method A
  const negEff = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    calculationMethod: 'distance_efficiency',
    monthlyDistanceKm: 500,
    fuelEfficiency: -15,
  });
  assert(negEff.isValid === false, 'Negative efficiency rejected');

  // 3. Zero actual consumption in Method B
  const zeroActual = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    calculationMethod: 'actual_consumption',
    actualConsumption: 0,
  });
  assert(zeroActual.isValid === false, 'Zero actual consumption rejected');

  // 4. Zero distance handling (Method A)
  const zeroDist = calculateSurveyRecordEmissions({
    vehicleType: 'car',
    fuelType: 'petrol',
    calculationMethod: 'distance_efficiency',
    monthlyDistanceKm: 0,
    fuelEfficiency: 15,
  });
  assert(zeroDist.isValid === true, 'Zero distance is mathematically valid');
  assert(zeroDist.monthlyEmissionsKg === 0, 'Zero distance yields 0 emissions');
  assert(zeroDist.emissionsPerKmGrams === 0, 'Zero distance does not trigger division by zero / NaN');
  assert(Number.isFinite(zeroDist.emissionsPerKmGrams), 'emissionsPerKm is finite');
}

// =============================================================================
// SUITE 6: DATA PERSISTENCE & STORAGE SAFETY
// =============================================================================
console.log('\n--- Suite 6: Storage Persistence & Malformed Data Safety ---');
{
  // Set up mock localStorage in Node.js environment
  const mockStorage = {};
  global.localStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, val) => { mockStorage[key] = String(val); },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
  };

  // 1. Empty storage returns empty array
  const initial = getActualSurveyRecords();
  assert(Array.isArray(initial) && initial.length === 0, 'Empty storage returns empty array');

  // 2. Save valid record
  const sample = {
    participantCategory: 'student',
    vehicleType: 'car',
    fuelType: 'petrol',
    monthlyDistanceKm: 500,
    monthlyEmissionsKg: 77.16,
    calculationMethod: 'distance_efficiency',
    consentGiven: true,
    isValid: true,
  };
  const savedList = saveActualSurveyRecord(sample);
  assert(savedList.length === 1, 'Record successfully persisted');
  assert(savedList[0].id.startsWith('survey_'), 'Record assigned auto ID');
  assert(savedList[0].isSynthetic === false, 'Record marked isSynthetic: false');
  assert(savedList[0].recordType === 'Actual Field Observation', 'Record categorized as Actual Field Observation');

  // 3. PII stripping check
  const piiAttempt = {
    ...sample,
    name: 'John Doe',
    phone: '555-1234',
    registrationNumber: 'AB12CD3456',
    address: '123 College St',
  };
  const withPii = saveActualSurveyRecord(piiAttempt);
  assert(withPii[0].name === undefined, 'Name field strictly stripped from stored record');
  assert(withPii[0].phone === undefined, 'Phone field strictly stripped');
  assert(withPii[0].registrationNumber === undefined, 'Registration plate strictly stripped');
  assert(withPii[0].address === undefined, 'Residential address strictly stripped');

  // 4. Malformed JSON handling: simulate corrupted localStorage entry
  mockStorage[SURVEY_STORAGE_KEYS.ACTUAL_RECORDS] = 'INVALID_JSON_CORRUPTED{]';
  const corruptResult = getActualSurveyRecords();
  assert(Array.isArray(corruptResult) && corruptResult.length === 0, 'Corrupted JSON handled safely without throwing');

  // 5. Non-array JSON handling
  mockStorage[SURVEY_STORAGE_KEYS.ACTUAL_RECORDS] = JSON.stringify({ error: 'not an array' });
  const nonArrayResult = getActualSurveyRecords();
  assert(Array.isArray(nonArrayResult) && nonArrayResult.length === 0, 'Non-array storage value handled safely');

  // 6. Delete record
  mockStorage[SURVEY_STORAGE_KEYS.ACTUAL_RECORDS] = JSON.stringify([
    { id: 'rec_1', vehicleType: 'car', fuelType: 'petrol', monthlyEmissionsKg: 50, isValid: true },
    { id: 'rec_2', vehicleType: 'scooter', fuelType: 'petrol', monthlyEmissionsKg: 20, isValid: true },
  ]);
  const afterDelete = deleteActualSurveyRecord('rec_1');
  assert(afterDelete.length === 1 && afterDelete[0].id === 'rec_2', 'Delete record by ID works cleanly');

  // 7. Clear all records
  const afterClear = clearActualSurveyRecords();
  assert(afterClear.length === 0, 'Clear records empties storage');
}

// =============================================================================
// SUITE 7: SYNTHETIC DEMONSTRATION DATA ISOLATION
// =============================================================================
console.log('\n--- Suite 7: Synthetic Demonstration Data Isolation ---');
{
  const demoFleet = generateBenchmarkDemoRecords();
  assert(Array.isArray(demoFleet) && demoFleet.length === 10, 'Benchmark demo fleet contains 10 records');

  demoFleet.forEach((rec) => {
    assert(rec.isSynthetic === true, `Demo record ${rec.id} explicitly flagged isSynthetic: true`);
    assert(rec.recordType === 'Demonstration Benchmark', `Demo record ${rec.id} flagged Demonstration Benchmark`);
    assert(rec.isValid === true, `Demo record ${rec.id} has valid calculation`);
    assert(rec.monthlyEmissionsKg > 0, `Demo record ${rec.id} has positive monthly emissions`);
  });

  // Verify that getting actual survey records does NOT return demo records
  const actualList = getActualSurveyRecords();
  const hasDemoInActual = actualList.some((r) => r.isSynthetic === true);
  assert(hasDemoInActual === false, 'Actual survey records strictly isolated from synthetic benchmark records');
}

// =============================================================================
// SUITE 8: STATISTICAL ANALYTICS ENGINE & EMPTY-STATE RESILIENCE
// =============================================================================
console.log('\n--- Suite 8: Statistical Analytics Engine ---');
{
  // 1. Empty dataset handling
  const emptyAnalytics = calculateSurveyAnalytics([]);
  assert(emptyAnalytics.sampleSize === 0, 'Empty analytics returns sampleSize 0');
  assert(emptyAnalytics.avgMonthlyDistance === 0, 'Empty analytics returns avgMonthlyDistance 0');
  assert(emptyAnalytics.avgMonthlyEmissions === 0, 'Empty analytics returns avgMonthlyEmissions 0');
  assert(emptyAnalytics.avgEmissionsPerKmGrams === 0, 'Empty analytics returns avgEmissionsPerKmGrams 0');
  assert(emptyAnalytics.vehicleDistribution.length === 0, 'Empty vehicle distribution');
  assert(emptyAnalytics.fuelDistribution.length === 0, 'Empty fuel distribution');
  assert(emptyAnalytics.categoryComparison.length === 0, 'Empty category comparison');

  // 2. Known sample aggregation
  const testSample = [
    {
      participantCategory: 'student',
      vehicleType: 'car',
      fuelType: 'petrol',
      monthlyDistanceKm: 600,
      monthlyEmissionsKg: 92.596,
      isElectricity: false,
      isValid: true,
      consentGiven: true,
    },
    {
      participantCategory: 'student',
      vehicleType: 'scooter',
      fuelType: 'electric',
      monthlyDistanceKm: 400,
      monthlyEmissionsKg: 10.933,
      isElectricity: true,
      isValid: true,
      consentGiven: true,
    },
    {
      participantCategory: 'faculty',
      vehicleType: 'car',
      fuelType: 'diesel',
      monthlyDistanceKm: 1000,
      monthlyEmissionsKg: 149.322,
      isElectricity: false,
      isValid: true,
      consentGiven: true,
    },
  ];

  const analytics = calculateSurveyAnalytics(testSample);
  assert(analytics.sampleSize === 3, 'Sample size is 3');
  assert(analytics.totalDistanceKm === 2000, 'Total distance is 2000 km');
  assert(Math.abs(analytics.avgMonthlyDistance - (2000 / 3)) < 1e-4, 'Avg monthly distance is 666.67 km');
  
  const expectedTotalEm = 92.596 + 10.933 + 149.322; // 252.851 kg
  assert(Math.abs(analytics.totalMonthlyEmissionsKg - expectedTotalEm) < 1e-3, 'Total emissions match sum');
  assert(Math.abs(analytics.avgMonthlyEmissions - (expectedTotalEm / 3)) < 1e-3, 'Avg emissions match total/3');

  // Intensity: 252.851 kg / 2000 km * 1000 = ~126.4 g/km
  const expectedIntensity = (expectedTotalEm / 2000) * 1000;
  assert(Math.abs(analytics.avgEmissionsPerKmGrams - expectedIntensity) < 1e-2, 'Avg intensity matches formula');

  // Scope 1 vs Scope 2
  assert(Math.abs(analytics.scopeBreakdown.scope2Kg - 10.933) < 1e-3, 'Scope 2 EV emissions isolated correctly');
  assert(Math.abs(analytics.scopeBreakdown.scope1Kg - (92.596 + 149.322)) < 1e-3, 'Scope 1 tailpipe emissions isolated correctly');

  // Vehicle Distribution
  assert(analytics.vehicleDistribution.length === 2, 'Vehicle distribution has 2 types (car and scooter)');
  const carDist = analytics.vehicleDistribution.find((v) => v.type === 'car');
  assert(carDist && carDist.count === 2, 'Car count is 2 (66.7%)');

  // Category cross-tabulation
  assert(analytics.categoryComparison.length === 2, 'Category comparison has 2 categories (student and faculty)');
  const studentCat = analytics.categoryComparison.find((c) => c.id === 'student');
  assert(studentCat && studentCat.count === 2, 'Student category count is 2');
  assert(studentCat.avgMonthlyDistanceKm === 500, 'Student avg monthly distance is (600+400)/2 = 500 km');
}

// =============================================================================
// SUITE 9: RFC 4180 CSV EXPORT & ESCAPING INTEGRITY
// =============================================================================
console.log('\n--- Suite 9: RFC 4180 CSV Export & Escaping ---');
{
  // 1. Escaping rules
  assert(escapeCsvField('normal') === 'normal', 'Normal string unquoted');
  assert(escapeCsvField('has,comma') === '"has,comma"', 'String with comma quoted');
  assert(escapeCsvField('has "quotes"') === '"has ""quotes"""', 'String with quotes escaped with double quotes');
  assert(escapeCsvField('has\nnewline') === '"has\nnewline"', 'String with newline quoted');
  assert(escapeCsvField(123.45) === '123.45', 'Numbers formatted cleanly');
  assert(escapeCsvField(null) === '', 'Null converts to empty string');

  // 2. Full CSV dataset generation
  const recordsToExport = [
    {
      id: 'resp_01',
      submittedAt: '2026-10-25T12:00:00.000Z',
      participantCategory: 'student',
      vehicleType: 'car',
      fuelType: 'petrol',
      vehicleAge: '2_to_5',
      monthlyDistanceKm: 600,
      dailyDistanceKm: 25,
      daysUsedPerMonth: 24,
      calculationMethod: 'distance_efficiency',
      fuelEfficiency: 15.0,
      efficiencyUnit: 'km/litre',
      actualConsumption: null,
      fuelUnit: 'litres',
      monthlyEmissionsKg: 92.596,
      yearlyEmissionsTonnes: 1.111,
      emissionsPerKmGrams: 154.3,
      emissionsBoundary: 'Scope 1 — Direct Tailpipe Combustion',
      factorValue: 2.3149,
      factorUnit: 'kg CO2 / litre',
      factorSource: 'DEFRA 2023, IPCC',
      isSynthetic: false,
      isValid: true,
    },
    {
      id: 'resp_02',
      submittedAt: '2026-10-25T13:00:00.000Z',
      participantCategory: 'faculty, senior', // contains comma
      vehicleType: 'car "EV" edition', // contains quotes
      fuelType: 'electric',
      vehicleAge: 'under_2',
      monthlyDistanceKm: 800,
      dailyDistanceKm: null,
      daysUsedPerMonth: null,
      calculationMethod: 'actual_consumption',
      fuelEfficiency: null,
      efficiencyUnit: 'km/kWh',
      actualConsumption: 114.3,
      fuelUnit: 'kWh',
      monthlyEmissionsKg: 93.726,
      yearlyEmissionsTonnes: 1.1247,
      emissionsPerKmGrams: 117.2,
      emissionsBoundary: 'Scope 2 — Indirect Grid Electricity',
      factorValue: 0.8200,
      factorUnit: 'kg CO2e / kWh',
      factorSource: 'CEA India v19 (2023)',
      isSynthetic: true,
      isValid: true,
    },
  ];

  const csvOutput = generateSurveyCsv(recordsToExport);
  const lines = csvOutput.split('\r\n');

  assert(lines.length === 3, 'CSV output contains header + 2 record rows');
  assert(lines[0].startsWith('Response ID,Submission Timestamp'), 'Header row begins with standard columns');
  assert(lines[0].includes('Emissions Scope Boundary'), 'Header row documents emissions scope boundary');
  assert(lines[0].includes('Record Nature'), 'Header row documents record nature');

  // Verify escaping in row 2
  assert(lines[2].includes('"faculty, senior"'), 'Field with comma is quoted in CSV');
  assert(lines[2].includes('"car ""EV"" edition"'), 'Quotes are doubled inside quotes in CSV');
  assert(lines[2].includes('Demonstration Benchmark (Synthetic)'), 'Synthetic record labeled in CSV');
  assert(lines[1].includes('Actual Field Observation'), 'Actual record labeled in CSV');

  // 3. Test record with newlines and multiple special characters
  const multilineRecord = {
    id: 'resp_03',
    submittedAt: '2026-10-25T14:00:00.000Z',
    participantCategory: 'Staff\n(Facilities & Transport, "Fleet")',
    vehicleType: 'Delivery\nVan',
    fuelType: 'diesel',
    monthlyDistanceKm: 1500,
    calculationMethod: 'distance_efficiency',
    fuelEfficiency: 14.0,
    monthlyEmissionsKg: 287.978,
    yearlyEmissionsTonnes: 3.4557,
    emissionsPerKmGrams: 192.0,
    emissionsBoundary: 'Scope 1 — Direct Tailpipe Combustion',
    factorValue: 2.6878,
    factorUnit: 'kg CO2 / litre',
    factorSource: 'UK DEFRA 2023\nIPCC Volume 2',
    isSynthetic: false,
    isValid: true,
  };

  const multilineCsv = generateSurveyCsv([multilineRecord]);
  assert(multilineCsv.includes('"Staff\n(Facilities & Transport, ""Fleet"")"'), 'Field with newlines, commas, and quotes is escaped according to RFC 4180');
  assert(multilineCsv.includes('"Delivery\nVan"'), 'Field with embedded newline is wrapped in quotes');
  assert(multilineCsv.includes('"UK DEFRA 2023\nIPCC Volume 2"'), 'Multilined factor source is wrapped in quotes');

  // Verify absence of PII columns
  assert(!lines[0].includes('Name'), 'No Name column in CSV');
  assert(!lines[0].includes('Phone'), 'No Phone column in CSV');
  assert(!lines[0].includes('Registration'), 'No Registration/Plate column in CSV');
  assert(!lines[0].includes('Address'), 'No Address column in CSV');
}

// =============================================================================
// SUMMARY
// =============================================================================
console.log('\n======================================================================');
console.log(`SURVEY TEST SUITE RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
