/**
 * TerraTrace Drive — Vehicle Usage Survey Local Storage Manager
 * 
 * Provides resilient, privacy-preserving persistence for anonymous survey responses.
 * 
 * DESIGN PRINCIPLES:
 * 1. Anonymity: No personal identifiers (names, registration numbers, IP, address) are ever stored.
 * 2. Strict Partitioning: Actual field observations are saved in a separate localStorage key from
 *    demonstration benchmark data. Synthetic records are NEVER mixed into actual statistics.
 * 3. Resilience: Gracefully handles malformed JSON, corrupted data, and browser storage quota exceptions.
 * 4. Local-only Boundary: Explicit disclosure that data resides exclusively in the client's current browser.
 */

import { calculateSurveyRecordEmissions } from './surveyCalculations.js';

export const SURVEY_STORAGE_KEYS = {
  ACTUAL_RECORDS: 'terratrace_vehicle_survey_actual',
  DEMO_RECORDS: 'terratrace_vehicle_survey_demo',
  ACTIVE_VIEW_MODE: 'terratrace_vehicle_survey_view_mode', // 'actual' | 'demo'
};

/**
 * Retrieve actual survey records from localStorage.
 * Always returns a validated array of sanitized survey responses.
 * 
 * @returns {Array<Object>}
 */
export function getActualSurveyRecords() {
  try {
    const raw = localStorage.getItem(SURVEY_STORAGE_KEYS.ACTUAL_RECORDS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Survey storage format invalid; expected array. Resetting.');
      return [];
    }
    // Filter out corrupted or incomplete entries
    return parsed.filter(isValidRecordShape);
  } catch (err) {
    console.error('Failed to read survey records from localStorage:', err);
    return [];
  }
}

/**
 * Save a new actual survey record to localStorage.
 * 
 * @param {Object} record - The validated survey record with calculations
 * @returns {Array<Object>} Updated list of survey records
 */
export function saveActualSurveyRecord(record) {
  try {
    const current = getActualSurveyRecords();
    const validatedRecord = sanitizeRecordForStorage({
      ...record,
      id: record.id || `survey_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      submittedAt: record.submittedAt || new Date().toISOString(),
      isSynthetic: false,
      recordType: 'Actual Field Observation',
    });

    const updated = [validatedRecord, ...current];
    localStorage.setItem(SURVEY_STORAGE_KEYS.ACTUAL_RECORDS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save survey record to localStorage:', err);
    return getActualSurveyRecords();
  }
}

/**
 * Delete a specific survey record by ID.
 * 
 * @param {string} id - Record ID to remove
 * @returns {Array<Object>} Updated list
 */
export function deleteActualSurveyRecord(id) {
  try {
    const current = getActualSurveyRecords();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(SURVEY_STORAGE_KEYS.ACTUAL_RECORDS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete survey record:', err);
    return getActualSurveyRecords();
  }
}

/**
 * Clear all actual survey records.
 */
export function clearActualSurveyRecords() {
  try {
    localStorage.removeItem(SURVEY_STORAGE_KEYS.ACTUAL_RECORDS);
    return [];
  } catch (err) {
    console.error('Failed to clear survey records:', err);
    return [];
  }
}

/**
 * Benchmark synthetic sample fleet records for educational demonstration.
 * These are strictly flagged `isSynthetic: true` and kept in a dedicated storage key.
 */
export function generateBenchmarkDemoRecords() {
  const benchmarkFleet = [
    {
      id: 'demo_01',
      submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      participantCategory: 'student',
      vehicleType: 'motorcycle',
      fuelType: 'petrol',
      vehicleAge: '2_to_5',
      monthlyDistanceKm: 450,
      dailyDistanceKm: 18,
      daysUsedPerMonth: 25,
      calculationMethod: 'distance_efficiency',
      fuelEfficiency: 42.0,
      actualConsumption: null,
      consentGiven: true,
      notes: 'Urban student daily college commute',
    },
    {
      id: 'demo_02',
      submittedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      participantCategory: 'student',
      vehicleType: 'scooter',
      fuelType: 'electric',
      vehicleAge: 'under_2',
      monthlyDistanceKm: 300,
      dailyDistanceKm: 15,
      daysUsedPerMonth: 20,
      calculationMethod: 'distance_efficiency',
      fuelEfficiency: 30.0,
      actualConsumption: null,
      consentGiven: true,
      notes: 'Campus battery electric scooter',
    },
    {
      id: 'demo_03',
      submittedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      participantCategory: 'student',
      vehicleType: 'car',
      fuelType: 'petrol',
      vehicleAge: '6_to_10',
      monthlyDistanceKm: 600,
      dailyDistanceKm: 25,
      daysUsedPerMonth: 24,
      calculationMethod: 'distance_efficiency',
      fuelEfficiency: 14.5,
      actualConsumption: null,
      consentGiven: true,
      notes: 'Shared student carpool',
    },
    {
      id: 'demo_04',
      submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      participantCategory: 'staff',
      vehicleType: 'car',
      fuelType: 'diesel',
      vehicleAge: '2_to_5',
      monthlyDistanceKm: 1200,
      dailyDistanceKm: 50,
      daysUsedPerMonth: 24,
      calculationMethod: 'distance_efficiency',
      fuelEfficiency: 17.5,
      actualConsumption: null,
      consentGiven: true,
      notes: 'Suburban staff daily commute',
    },
    {
      id: 'demo_05',
      submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      participantCategory: 'faculty',
      vehicleType: 'car',
      fuelType: 'electric',
      vehicleAge: 'under_2',
      monthlyDistanceKm: 850,
      dailyDistanceKm: 35,
      daysUsedPerMonth: 24,
      calculationMethod: 'actual_consumption',
      fuelEfficiency: null,
      actualConsumption: 120.0,
      consentGiven: true,
      notes: 'Faculty home-metered EV charging',
    },
    {
      id: 'demo_06',
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      participantCategory: 'faculty',
      vehicleType: 'car',
      fuelType: 'cng',
      vehicleAge: '2_to_5',
      monthlyDistanceKm: 750,
      dailyDistanceKm: 30,
      daysUsedPerMonth: 25,
      calculationMethod: 'distance_efficiency',
      fuelEfficiency: 21.0,
      actualConsumption: null,
      consentGiven: true,
      notes: 'Factory-fitted CNG sedan',
    },
    {
      id: 'demo_07',
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      participantCategory: 'staff',
      vehicleType: 'scooter',
      fuelType: 'petrol',
      vehicleAge: '6_to_10',
      monthlyDistanceKm: 520,
      dailyDistanceKm: 20,
      daysUsedPerMonth: 26,
      calculationMethod: 'actual_consumption',
      fuelEfficiency: null,
      actualConsumption: 12.0,
      consentGiven: true,
      notes: '110cc commuter scooter',
    },
    {
      id: 'demo_08',
      submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      participantCategory: 'community',
      vehicleType: 'bus',
      fuelType: 'cng',
      vehicleAge: 'over_10',
      monthlyDistanceKm: 900,
      dailyDistanceKm: 30,
      daysUsedPerMonth: 30,
      calculationMethod: 'distance_efficiency',
      fuelEfficiency: 2.8,
      actualConsumption: null,
      consentGiven: true,
      notes: 'Municipal CNG feeder bus route',
    },
    {
      id: 'demo_09',
      submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      participantCategory: 'community',
      vehicleType: 'car',
      fuelType: 'petrol',
      vehicleAge: '2_to_5',
      monthlyDistanceKm: 650,
      dailyDistanceKm: 22,
      daysUsedPerMonth: 28,
      calculationMethod: 'distance_efficiency',
      fuelEfficiency: 15.0,
      actualConsumption: null,
      consentGiven: true,
      notes: 'Neighborhood weekend and utility car',
    },
    {
      id: 'demo_10',
      submittedAt: new Date().toISOString(),
      participantCategory: 'other',
      vehicleType: 'other',
      fuelType: 'diesel',
      vehicleAge: '2_to_5',
      monthlyDistanceKm: 1400,
      dailyDistanceKm: 55,
      daysUsedPerMonth: 26,
      calculationMethod: 'actual_consumption',
      fuelEfficiency: null,
      actualConsumption: 95.0,
      consentGiven: true,
      notes: 'Campus supply delivery van',
    },
  ];

  // Enrich each demo record with standardized emissions calculations
  return benchmarkFleet.map((record) => {
    const calc = calculateSurveyRecordEmissions(record);
    return {
      ...record,
      ...calc,
      isSynthetic: true,
      recordType: 'Demonstration Benchmark',
    };
  });
}

/**
 * Get demo survey records from storage, or generate and store them if not present.
 */
export function getDemoSurveyRecords() {
  try {
    const raw = localStorage.getItem(SURVEY_STORAGE_KEYS.DEMO_RECORDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(isValidRecordShape);
      }
    }
    const freshDemo = generateBenchmarkDemoRecords();
    localStorage.setItem(SURVEY_STORAGE_KEYS.DEMO_RECORDS, JSON.stringify(freshDemo));
    return freshDemo;
  } catch (err) {
    console.error('Failed to get demo survey records:', err);
    return generateBenchmarkDemoRecords();
  }
}

/**
 * Clear stored demo records.
 */
export function clearDemoSurveyRecords() {
  try {
    localStorage.removeItem(SURVEY_STORAGE_KEYS.DEMO_RECORDS);
    return [];
  } catch (err) {
    console.error('Failed to clear demo records:', err);
    return [];
  }
}

/**
 * Retrieve the current view mode ('actual' vs 'demo').
 */
export function getSurveyViewMode() {
  try {
    const mode = localStorage.getItem(SURVEY_STORAGE_KEYS.ACTIVE_VIEW_MODE);
    return mode === 'demo' ? 'demo' : 'actual';
  } catch {
    return 'actual';
  }
}

/**
 * Set the current view mode ('actual' vs 'demo').
 */
export function setSurveyViewMode(mode) {
  try {
    const normalized = mode === 'demo' ? 'demo' : 'actual';
    localStorage.setItem(SURVEY_STORAGE_KEYS.ACTIVE_VIEW_MODE, normalized);
    return normalized;
  } catch {
    return 'actual';
  }
}

/**
 * Validation predicate for stored record shape
 */
function isValidRecordShape(r) {
  return (
    r &&
    typeof r === 'object' &&
    typeof r.vehicleType === 'string' &&
    typeof r.fuelType === 'string' &&
    Number.isFinite(Number(r.monthlyEmissionsKg)) &&
    r.isValid !== false
  );
}

/**
 * Ensure record contains no PII and fields conform to standard schema
 */
const PII_DISALLOWED_KEYS = [
  'name',
  'fullName',
  'email',
  'phone',
  'phoneNumber',
  'plate',
  'registrationNumber',
  'licensePlate',
  'address',
  'residentialAddress',
];

function sanitizeRecordForStorage(record) {
  const clean = { ...record };
  for (const key of PII_DISALLOWED_KEYS) {
    delete clean[key];
  }
  return clean;
}
