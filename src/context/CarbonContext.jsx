import React, { useState, useEffect } from 'react';
import { calculateTotalFootprint } from '../utils/calculations';
import { DEFAULT_FORM_DATA } from './constants';
import { CarbonContext } from './carbonContextDefinition';

export function CarbonProvider({ children }) {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FORM);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read form data from localStorage:', e);
    }
    return DEFAULT_FORM_DATA;
  });

  const [results, setResults] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESULTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read results from localStorage:', e);
    }
    return null;
  });

  // Persist form data on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(formData));
    } catch (e) {
      console.warn('Could not save form data to localStorage:', e);
    }
  }, [formData]);

  // Persist results on change
  useEffect(() => {
    try {
      if (results) {
        localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(results));
      } else {
        localStorage.removeItem(STORAGE_KEY_RESULTS);
      }
    } catch (e) {
      console.warn('Could not update results in localStorage:', e);
    }
  }, [results]);

  const updateField = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const updateCategory = (category, data) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...data,
      },
    }));
  };

  const calculateFootprint = () => {
    const computedResults = calculateTotalFootprint(formData);
    setResults(computedResults);
    return computedResults;
  };

  const resetData = () => {
    setFormData(DEFAULT_FORM_DATA);
    setResults(null);
    try {
      localStorage.removeItem(STORAGE_KEY_FORM);
      localStorage.removeItem(STORAGE_KEY_RESULTS);
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
  };

  const loadSampleData = () => {
    setFormData(DEFAULT_FORM_DATA);
    const computed = calculateTotalFootprint(DEFAULT_FORM_DATA);
    setResults(computed);
    return computed;
  };

  const isCalculated = Boolean(results && results.isCalculated);

  const value = {
    formData,
    results,
    isCalculated,
    updateField,
    updateCategory,
    setFormData,
    calculateFootprint,
    resetData,
    loadSampleData,
  };

  return (
    <CarbonContext.Provider value={value}>
      {children}
    </CarbonContext.Provider>
  );
}
