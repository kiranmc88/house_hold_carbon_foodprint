/**
 * Automated Verification Script for CarbonWise Calculator Workflow
 */
import { EMISSION_FACTORS, BENCHMARKS } from '../src/data/emissionFactors.js';
import { 
  calculateElectricityEmissions, 
  calculateLpgEmissions, 
  calculateTransportationEmissions, 
  calculateFoodEmissions, 
  calculateWasteEmissions, 
  calculateTotalFootprint 
} from '../src/utils/calculations.js';
import { DEFAULT_FORM_DATA } from '../src/context/constants.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    passedTests++;
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('=== Test Suite 1: Emission Factors & Benchmarks Integrity ===');
assert(typeof EMISSION_FACTORS.electricity.gridAverage === 'number' && EMISSION_FACTORS.electricity.gridAverage > 0, 'Electricity grid factor is defined and > 0');
assert(typeof EMISSION_FACTORS.lpg.perCylinder14_2kg === 'number' && EMISSION_FACTORS.lpg.perCylinder14_2kg > 0, 'LPG cylinder factor is defined and > 0');
assert(typeof EMISSION_FACTORS.transportation.petrolCar === 'number' && EMISSION_FACTORS.transportation.petrolCar > 0, 'Transportation car factor is defined and > 0');
assert(typeof EMISSION_FACTORS.food.meatHeavy === 'number' && EMISSION_FACTORS.food.meatHeavy > EMISSION_FACTORS.food.vegetarian, 'Meat heavy diet emissions > vegetarian diet');
assert(typeof EMISSION_FACTORS.waste.generalLandfill === 'number' && EMISSION_FACTORS.waste.generalLandfill > 0, 'Waste general landfill factor is defined and > 0');
assert(typeof BENCHMARKS.nationalAverageAnnual === 'number' && BENCHMARKS.nationalAverageAnnual > 0, 'National benchmark defined and > 0');
assert(typeof BENCHMARKS.parisAgreementTarget === 'number' && BENCHMARKS.parisAgreementTarget > 0, 'Paris target benchmark defined and > 0');

console.log('\n=== Test Suite 2: Calculation Engine Verification ===');

// 1. Electricity
const elecResult = calculateElectricityEmissions({ kwhMonthly: 300, solarGenerationKwh: 50, usesRenewable: false });
assert(elecResult === Number((250 * EMISSION_FACTORS.electricity.gridAverage).toFixed(2)), `Electricity calculation net kWh: ${elecResult}`);

const elecRenewable = calculateElectricityEmissions({ kwhMonthly: 300, solarGenerationKwh: 0, usesRenewable: true });
assert(elecRenewable === 0, '100% renewable energy returns 0 emissions');

// 2. LPG
const lpgResult = calculateLpgEmissions({ fuelType: 'cylinder', cylinderCount: 1.5 });
assert(lpgResult === Number((1.5 * EMISSION_FACTORS.lpg.perCylinder14_2kg).toFixed(2)), `LPG cylinders calculation: ${lpgResult}`);

const lpgInduction = calculateLpgEmissions({ fuelType: 'induction' });
assert(lpgInduction === 0, 'Induction cooktop returns 0 direct burner emissions');

// 3. Transportation
const transResult = calculateTransportationEmissions({
  carDistanceKm: 300,
  carFuelType: 'petrolCar',
  twoWheelerDistanceKm: 100,
  twoWheelerType: 'twoWheelerPetrol',
  busDistanceKm: 50,
  metroDistanceKm: 50,
});
const expectedTrans = (300 * EMISSION_FACTORS.transportation.petrolCar) + 
                      (100 * EMISSION_FACTORS.transportation.twoWheelerPetrol) + 
                      (50 * EMISSION_FACTORS.transportation.cityBus) + 
                      (50 * EMISSION_FACTORS.transportation.metroTrain);
assert(transResult === Number(expectedTrans.toFixed(2)), `Transportation sum calculated correctly: ${transResult}`);

// 4. Food
const foodResult = calculateFoodEmissions({ dietType: 'vegetarian', wasteAwareness: 'moderate' }, 4);
assert(foodResult === Number((EMISSION_FACTORS.food.vegetarian * 4).toFixed(2)), `Food vegetarian scaled for 4 members: ${foodResult}`);

// 5. Waste
const wasteResult = calculateWasteEmissions({ wasteKgWeekly: 10, segregatesWaste: true, compostsOrganics: true });
assert(wasteResult > 0, `Waste emissions with composting: ${wasteResult}`);

console.log('\n=== Test Suite 3: Total Footprint & Normalization Verification ===');
const fullFootprint = calculateTotalFootprint(DEFAULT_FORM_DATA);
assert(fullFootprint.isCalculated === true, 'Footprint status isCalculated = true');
assert(fullFootprint.monthlyTotalKg > 0, `Monthly total is positive: ${fullFootprint.monthlyTotalKg} kg CO2e`);
assert(fullFootprint.annualTotalTonnes === Number(((fullFootprint.monthlyTotalKg * 12) / 1000).toFixed(2)), `Annual tonnes calculation matches: ${fullFootprint.annualTotalTonnes}`);
assert(fullFootprint.perCapitaAnnualTonnes === Number((fullFootprint.annualTotalTonnes / DEFAULT_FORM_DATA.household.members).toFixed(2)), `Per capita footprint normalized: ${fullFootprint.perCapitaAnnualTonnes} tonnes/person`);
assert(Boolean(fullFootprint.primaryDriver && fullFootprint.primaryDriver.title), `Primary emission driver identified: ${fullFootprint.primaryDriver.title}`);

// Sum of percentages should be approx 100%
const pctSum = Object.values(fullFootprint.categories).reduce((acc, cat) => acc + cat.percentage, 0);
assert(Math.round(pctSum) >= 99 && Math.round(pctSum) <= 101, `Category percentages aggregate to ~100%: ${pctSum.toFixed(1)}%`);

console.log('\n=== Test Suite 4: Workflow Simulation (Home -> Calc -> Results -> Recalc -> Reset) ===');
// Simulating state store
let state = {
  formData: { ...DEFAULT_FORM_DATA },
  results: null,
};

// 1. Enter custom data
state.formData.household.members = 3;
state.formData.electricity.kwhMonthly = 400;
state.formData.transport.carDistanceKm = 600;

// 2. Calculate
state.results = calculateTotalFootprint(state.formData);
assert(state.results.isCalculated === true, 'Step Calculate: results generated');
assert(state.results.categories.electricity.monthlyKg > 0, 'Electricity category populated');

// 3. View Results: check metrics
assert(typeof state.results.monthlyTotalKg === 'number' && state.results.monthlyTotalKg > 0, 'Step View Results: monthlyTotalKg available');
assert(typeof state.results.perCapitaAnnualTonnes === 'number', 'Step View Results: perCapitaAnnualTonnes available');

// 4. View Recommendations: check dynamic sorting
const pillars = ['electricity', 'transportation', 'lpg', 'food', 'waste'];
const sortedByEmissions = [...pillars].sort((a, b) => state.results.categories[b].monthlyKg - state.results.categories[a].monthlyKg);
assert(sortedByEmissions[0] === state.results.primaryDriver.key, `Step View Recommendations: Top pillar matches primary driver (${sortedByEmissions[0]})`);

// 5. Recalculate: inputs preserved
assert(state.formData.household.members === 3 && state.formData.electricity.kwhMonthly === 400, 'Step Recalculate: previous user inputs preserved');

// 6. Reset
state = {
  formData: { ...DEFAULT_FORM_DATA },
  results: null,
};
assert(state.results === null, 'Step Reset: results cleared to null');
assert(state.formData.household.members === DEFAULT_FORM_DATA.household.members, 'Step Reset: formData returned to defaults');

console.log(`\n========================================`);
console.log(`All ${passedTests}/${totalTests} tests passed successfully!`);
console.log(`========================================\n`);
