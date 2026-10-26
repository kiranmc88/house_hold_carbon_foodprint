/**
 * TerraTrace Drive — Vehicle Usage Survey CSV Export Utility
 * 
 * Generates RFC 4180 compliant CSV exports of survey datasets for academic
 * research and Environmental Studies Activity-Based Learning (ABL) analysis.
 * 
 * STANDARDS & PRIVACY:
 * 1. RFC 4180 Escaping: Fields containing commas, double quotes, or newlines
 *    are surrounded by double quotes, with internal quotes escaped as `""`.
 * 2. Zero PII: Strictly excludes names, phones, registration plates, or addresses.
 * 3. Transparent Accounting: Documents calculation methods, emissions boundaries,
 *    numerical factors, units, and whether a record is actual or synthetic demo.
 */

/**
 * Escapes an individual cell value according to RFC 4180.
 * 
 * @param {any} val - Value to escape
 * @returns {string} RFC 4180 escaped string
 */
export function escapeCsvField(val) {
  if (val === null || val === undefined) {
    return '';
  }
  const str = String(val);
  // Check if string contains comma, quote, or newline
  if (/[",\r\n]/.test(str)) {
    // Replace all " with "" and wrap in ""
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Formats an array of survey records into an RFC 4180 compliant CSV string.
 * 
 * @param {Array<Object>} records - Survey records
 * @returns {string} CSV formatted content
 */
export function generateSurveyCsv(records = []) {
  const headers = [
    'Response ID',
    'Submission Timestamp',
    'Participant Category',
    'Vehicle Type',
    'Fuel / Powertrain Type',
    'Approximate Vehicle Age',
    'Monthly Distance (km)',
    'Average Daily Distance (km)',
    'Days Used Per Month',
    'Calculation Method',
    'Fuel Efficiency',
    'Efficiency Unit',
    'Actual Monthly Consumption',
    'Consumption Unit',
    'Monthly Emissions (kg CO2e)',
    'Annual Emissions (tonnes CO2e)',
    'Emissions Intensity (g CO2e/km)',
    'Emissions Scope Boundary',
    'Emission Factor Applied',
    'Emission Factor Unit',
    'Scientific Factor Source',
    'Record Nature',
  ];

  const rows = [headers.map(escapeCsvField).join(',')];

  records.forEach((record) => {
    if (!record || record.isValid === false) return;

    const row = [
      record.id || 'N/A',
      record.submittedAt || new Date().toISOString(),
      record.participantCategory || 'Not specified',
      record.vehicleType || 'Not specified',
      record.fuelType || 'Not specified',
      record.vehicleAge || 'Not specified',
      Number.isFinite(record.monthlyDistanceKm) ? Number(record.monthlyDistanceKm).toFixed(1) : '0.0',
      Number.isFinite(record.dailyDistanceKm) && record.dailyDistanceKm > 0 ? Number(record.dailyDistanceKm).toFixed(1) : 'N/A',
      Number.isFinite(record.daysUsedPerMonth) && record.daysUsedPerMonth > 0 ? Number(record.daysUsedPerMonth) : 'N/A',
      record.calculationMethod === 'actual_consumption' ? 'Method B: Actual Consumption' : 'Method A: Distance & Efficiency',
      Number.isFinite(record.fuelEfficiency) && record.fuelEfficiency > 0 ? Number(record.fuelEfficiency).toFixed(2) : 'N/A',
      record.efficiencyUnit || 'N/A',
      Number.isFinite(record.actualConsumption) && record.actualConsumption > 0 ? Number(record.actualConsumption).toFixed(2) : 'N/A',
      record.fuelUnit || 'N/A',
      Number.isFinite(record.monthlyEmissionsKg) ? Number(record.monthlyEmissionsKg).toFixed(3) : '0.000',
      Number.isFinite(record.yearlyEmissionsTonnes) ? Number(record.yearlyEmissionsTonnes).toFixed(4) : '0.0000',
      Number.isFinite(record.emissionsPerKmGrams) ? Number(record.emissionsPerKmGrams).toFixed(1) : '0.0',
      record.emissionsBoundary || record.scope || 'Unspecified',
      Number.isFinite(record.factorValue) ? Number(record.factorValue).toFixed(4) : 'N/A',
      record.factorUnit || 'N/A',
      record.factorSource || 'IPCC / DEFRA / CEA India',
      record.isSynthetic ? 'Demonstration Benchmark (Synthetic)' : 'Actual Field Observation',
    ];

    rows.push(row.map(escapeCsvField).join(','));
  });

  return rows.join('\r\n');
}

/**
 * Triggers a browser download of the survey dataset as a CSV file.
 * Safely falls back if executed in a non-browser environment.
 * 
 * @param {Array<Object>} records - Survey records to export
 * @param {string} [filename] - Target filename
 * @returns {string} The raw CSV text content
 */
export function exportSurveyRecordsToCsv(records = [], filename = 'terratrace_vehicle_survey_dataset.csv') {
  const csvContent = generateSurveyCsv(records);

  // If in browser DOM environment, trigger download
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to trigger CSV download in browser:', err);
    }
  }

  return csvContent;
}
