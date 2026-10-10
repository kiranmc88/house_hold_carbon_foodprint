/**
 * Utility functions for formatting emission metrics, numbers, and units.
 */

/**
 * Format a number as kg CO₂e with optional decimals
 * @param {number|null} value 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatKgCO2e(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.0 kg CO₂e';
  }
  return `${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} kg CO₂e`;
}

/**
 * Format a number as tonnes CO₂e with optional decimals
 * @param {number|null} value 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatTonnesCO2e(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00 tonnes CO₂e';
  }
  return `${Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} tonnes CO₂e`;
}

/**
 * Format standard number with locale commas
 * @param {number|null} value 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format percentage
 * @param {number|null} value 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${Number(value).toFixed(decimals)}%`;
}
