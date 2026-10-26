import React, { useState, useEffect } from 'react';
import { calculateFleetEmissions } from '../utils/calculations';
import { DEFAULT_FORM_DATA, DEFAULT_VEHICLE_DATA, createDefaultVehicle, STORAGE_KEYS } from './constants';
import { CarbonContext } from './carbonContextDefinition';

export function CarbonProvider({ children }) {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORM);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure vehicles array exists and has at least one valid vehicle
        if (!Array.isArray(parsed.vehicles) || parsed.vehicles.length === 0) {
          const fallbackVeh = parsed.vehicle || DEFAULT_VEHICLE_DATA;
          parsed.vehicles = [fallbackVeh];
          parsed.activeVehicleId = fallbackVeh.id;
        }
        if (!parsed.activeVehicleId) {
          parsed.activeVehicleId = parsed.vehicles[0].id;
        }
        parsed.vehicle = parsed.vehicles.find((v) => v.id === parsed.activeVehicleId) || parsed.vehicles[0];
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read form data from localStorage:', e);
    }
    return DEFAULT_FORM_DATA;
  });

  const [results, setResults] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESULTS);
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
      localStorage.setItem(STORAGE_KEYS.FORM, JSON.stringify(formData));
    } catch (e) {
      console.warn('Could not save form data to localStorage:', e);
    }
  }, [formData]);

  // Persist results on change
  useEffect(() => {
    try {
      if (results) {
        localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
      } else {
        localStorage.removeItem(STORAGE_KEYS.RESULTS);
      }
    } catch (e) {
      console.warn('Could not update results in localStorage:', e);
    }
  }, [results]);

  // Active vehicle reference
  const vehicles = formData.vehicles || [DEFAULT_VEHICLE_DATA];
  const activeVehicleId = formData.activeVehicleId || vehicles[0].id;
  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];

  // Set the active vehicle by id
  const setActiveVehicleId = (id) => {
    const target = vehicles.find((v) => v.id === id) || vehicles[0];
    setFormData((prev) => ({
      ...prev,
      activeVehicleId: id,
      vehicle: target,
    }));
  };

  // Update a field in the currently active vehicle
  const updateActiveVehicleField = (field, value) => {
    setFormData((prev) => {
      const currentList = prev.vehicles || [DEFAULT_VEHICLE_DATA];
      const targetId = prev.activeVehicleId || currentList[0].id;

      const updatedVehicles = currentList.map((veh) => {
        if (veh.id === targetId) {
          return {
            ...veh,
            [field]: value,
          };
        }
        return veh;
      });

      const updatedActive = updatedVehicles.find((v) => v.id === targetId) || updatedVehicles[0];

      return {
        ...prev,
        vehicles: updatedVehicles,
        vehicle: updatedActive,
      };
    });
  };

  // Update multiple fields for active vehicle
  const updateVehicleData = (newVehicleData) => {
    setFormData((prev) => {
      const currentList = prev.vehicles || [DEFAULT_VEHICLE_DATA];
      const targetId = prev.activeVehicleId || currentList[0].id;

      const updatedVehicles = currentList.map((veh) => {
        if (veh.id === targetId) {
          return {
            ...veh,
            ...newVehicleData,
          };
        }
        return veh;
      });

      const updatedActive = updatedVehicles.find((v) => v.id === targetId) || updatedVehicles[0];

      return {
        ...prev,
        vehicles: updatedVehicles,
        vehicle: updatedActive,
      };
    });
  };

  // Add another vehicle to the fleet
  const addVehicle = () => {
    const nextIndex = vehicles.length + 1;
    // Alternate default: if vehicle 1 is car, make vehicle 2 scooter or bike
    const defaultType = nextIndex === 2 ? 'scooter' : 'car';
    const defaultFuel = 'petrol';
    const newVehicle = createDefaultVehicle(nextIndex, defaultType, defaultFuel);

    setFormData((prev) => {
      const updatedList = [...(prev.vehicles || []), newVehicle];
      return {
        ...prev,
        vehicles: updatedList,
        activeVehicleId: newVehicle.id,
        vehicle: newVehicle,
      };
    });

    return newVehicle;
  };

  // Remove a vehicle from the fleet
  const removeVehicle = (idToRemove) => {
    if (vehicles.length <= 1) return; // Keep at least 1 vehicle

    setFormData((prev) => {
      const updatedList = prev.vehicles.filter((v) => v.id !== idToRemove);
      const newActive = updatedList[0];
      return {
        ...prev,
        vehicles: updatedList,
        activeVehicleId: newActive.id,
        vehicle: newActive,
      };
    });
  };

  // Backwards compatible updateField
  const updateField = (category, field, value) => {
    if (category === 'vehicle') {
      updateActiveVehicleField(field, value);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const updateCategory = (category, data) => {
    if (category === 'vehicle') {
      updateVehicleData(data);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...data,
      },
    }));
  };

  // Execute emissions calculation for all vehicles
  const calculateFootprint = () => {
    const vehicleList = formData.vehicles?.length ? formData.vehicles : [activeVehicle];
    const computedResults = calculateFleetEmissions(vehicleList);
    setResults(computedResults);
    return computedResults;
  };

  // Reset data to defaults
  const resetData = () => {
    setFormData(DEFAULT_FORM_DATA);
    setResults(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.FORM);
      localStorage.removeItem(STORAGE_KEYS.RESULTS);
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
  };

  // Load rich sample fleet (Car + Scooter)
  const loadSampleData = () => {
    const sampleCar = {
      id: 'veh_sample_car',
      name: 'Family Sedan',
      vehicleType: 'car',
      fuelType: 'petrol',
      registrationYear: 2021,
      monthlyDistanceKm: 850,
      calculationMethod: 'distance_efficiency',
      fuelEfficiency: 14.5,
      actualConsumption: 58.6,
      passengers: 1,
    };

    const sampleScooter = {
      id: 'veh_sample_scooter',
      name: 'Daily Commute Scooter',
      vehicleType: 'scooter',
      fuelType: 'electric',
      registrationYear: 2023,
      monthlyDistanceKm: 320,
      calculationMethod: 'distance_efficiency',
      fuelEfficiency: 30.0,
      actualConsumption: 10.7,
      passengers: 1,
    };

    const sampleFormData = {
      ...DEFAULT_FORM_DATA,
      activeVehicleId: sampleCar.id,
      vehicles: [sampleCar, sampleScooter],
      vehicle: sampleCar,
    };

    setFormData(sampleFormData);
    const computed = calculateFleetEmissions([sampleCar, sampleScooter]);
    setResults(computed);
    return computed;
  };

  const isCalculated = Boolean(results && results.isCalculated);

  const value = {
    formData,
    vehicles,
    activeVehicleId,
    activeVehicle,
    vehicleData: activeVehicle, // alias for backwards compatibility
    results,
    isCalculated,
    setActiveVehicleId,
    addVehicle,
    removeVehicle,
    updateActiveVehicleField,
    updateVehicleField: updateActiveVehicleField,
    updateField,
    updateVehicleData,
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
