/**
 * TerraTrace Drive - Vehicle Constants & Configurations
 */

export const STORAGE_KEYS = {
  FORM: 'terratrace_drive_form',
  RESULTS: 'terratrace_drive_results',
};

// Supported Vehicle Types & Powertrain Combinations
export const VEHICLE_CONFIGS = {
  car: {
    id: 'car',
    label: 'Passenger Car',
    description: 'Hatchbacks, sedans, SUVs, and personal four-wheelers',
    allowedFuels: [
      { 
        id: 'petrol', 
        label: 'Petrol', 
        unit: 'litres', 
        efficiencyUnit: 'km/litre', 
        defaultEfficiency: 15.0, 
        defaultConsumption: 53.3,
        typicalRange: '12 – 18 km/litre for urban passenger cars',
      },
      { 
        id: 'diesel', 
        label: 'Diesel', 
        unit: 'litres', 
        efficiencyUnit: 'km/litre', 
        defaultEfficiency: 18.0, 
        defaultConsumption: 44.4,
        typicalRange: '15 – 22 km/litre for diesel cars and utility vehicles',
      },
      { 
        id: 'cng', 
        label: 'CNG (Compressed Natural Gas)', 
        unit: 'kg', 
        efficiencyUnit: 'km/kg', 
        defaultEfficiency: 22.0, 
        defaultConsumption: 36.4,
        typicalRange: '18 – 28 km/kg for factory-fitted CNG passenger cars',
      },
      { 
        id: 'electric', 
        label: 'Electric (EV)', 
        unit: 'kWh', 
        efficiencyUnit: 'km/kWh', 
        defaultEfficiency: 7.0, 
        defaultConsumption: 114.3,
        typicalRange: '6.0 – 8.5 km/kWh (~120 – 160 Wh/km for electric cars)',
      },
    ],
  },
  motorcycle: {
    id: 'motorcycle',
    label: 'Motorcycle',
    description: 'Commuter, sports, and touring motorcycles (100cc to 500cc+)',
    allowedFuels: [
      { 
        id: 'petrol', 
        label: 'Petrol', 
        unit: 'litres', 
        efficiencyUnit: 'km/litre', 
        defaultEfficiency: 42.0, 
        defaultConsumption: 19.0,
        typicalRange: '35 – 55 km/litre for standard commuter motorcycles',
      },
      { 
        id: 'electric', 
        label: 'Electric (EV)', 
        unit: 'kWh', 
        efficiencyUnit: 'km/kWh', 
        defaultEfficiency: 25.0, 
        defaultConsumption: 32.0,
        typicalRange: '20 – 30 km/kWh for electric motorcycles',
      },
    ],
  },
  scooter: {
    id: 'scooter',
    label: 'Scooter',
    description: 'Gearless commuter scooters, mopeds, and city runabouts',
    allowedFuels: [
      { 
        id: 'petrol', 
        label: 'Petrol', 
        unit: 'litres', 
        efficiencyUnit: 'km/litre', 
        defaultEfficiency: 45.0, 
        defaultConsumption: 17.8,
        typicalRange: '40 – 55 km/litre for 110cc–125cc commuter scooters',
      },
      { 
        id: 'electric', 
        label: 'Electric (EV)', 
        unit: 'kWh', 
        efficiencyUnit: 'km/kWh', 
        defaultEfficiency: 30.0, 
        defaultConsumption: 26.7,
        typicalRange: '25 – 35 km/kWh (~30 – 40 Wh/km for electric scooters)',
      },
    ],
  },
  bus: {
    id: 'bus',
    label: 'Public Transit Bus',
    description: 'City commuter buses and suburban transit fleets',
    allowedFuels: [
      { 
        id: 'diesel', 
        label: 'Diesel Bus', 
        unit: 'litres', 
        efficiencyUnit: 'km/litre', 
        defaultEfficiency: 3.5, 
        defaultConsumption: 228.6,
        typicalRange: '3.0 – 4.2 km/litre for standard city transit buses',
      },
      { 
        id: 'cng', 
        label: 'CNG Bus', 
        unit: 'kg', 
        efficiencyUnit: 'km/kg', 
        defaultEfficiency: 3.0, 
        defaultConsumption: 266.7,
        typicalRange: '2.5 – 3.5 km/kg for urban CNG transit buses',
      },
      { 
        id: 'electric', 
        label: 'Electric Bus', 
        unit: 'kWh', 
        efficiencyUnit: 'km/kWh', 
        defaultEfficiency: 0.9, 
        defaultConsumption: 888.9,
        typicalRange: '0.8 – 1.1 km/kWh for battery electric transit buses',
      },
    ],
  },
  other: {
    id: 'other',
    label: 'Other Light Vehicle / Van',
    description: 'Vans, light commercial cargo carriers, and utility delivery vehicles',
    allowedFuels: [
      { 
        id: 'petrol', 
        label: 'Petrol', 
        unit: 'litres', 
        efficiencyUnit: 'km/litre', 
        defaultEfficiency: 12.0, 
        defaultConsumption: 66.7,
        typicalRange: '10 – 14 km/litre for light commercial vehicles',
      },
      { 
        id: 'diesel', 
        label: 'Diesel', 
        unit: 'litres', 
        efficiencyUnit: 'km/litre', 
        defaultEfficiency: 14.0, 
        defaultConsumption: 57.1,
        typicalRange: '12 – 16 km/litre for light commercial diesel vans',
      },
      { 
        id: 'cng', 
        label: 'CNG', 
        unit: 'kg', 
        efficiencyUnit: 'km/kg', 
        defaultEfficiency: 16.0, 
        defaultConsumption: 50.0,
        typicalRange: '14 – 19 km/kg for light commercial CNG vehicles',
      },
      { 
        id: 'electric', 
        label: 'Electric', 
        unit: 'kWh', 
        efficiencyUnit: 'km/kWh', 
        defaultEfficiency: 4.5, 
        defaultConsumption: 177.8,
        typicalRange: '4.0 – 5.5 km/kWh for electric delivery vans',
      },
    ],
  },
};

/**
 * Factory helper to instantiate a default vehicle
 */
export const createDefaultVehicle = (index = 1, type = 'car', fuel = 'petrol') => ({
  id: `veh_${Date.now()}_${index}`,
  name: index === 1 ? 'Primary Vehicle' : `Vehicle ${index}`,
  vehicleType: type,
  fuelType: fuel,
  registrationYear: 2022,
  monthlyDistanceKm: 800,
  calculationMethod: 'distance_efficiency', // 'distance_efficiency' | 'actual_consumption'
  fuelEfficiency: 15.0, // km/litre, km/kg, or km/kWh
  actualConsumption: 53.3, // litres, kg, or kWh
  passengers: 1,
});

export const DEFAULT_VEHICLE_DATA = {
  id: 'veh_default_1',
  name: 'Primary Vehicle',
  vehicleType: 'car',
  fuelType: 'petrol',
  registrationYear: 2022,
  monthlyDistanceKm: 800,
  calculationMethod: 'distance_efficiency',
  fuelEfficiency: 15.0,
  actualConsumption: 53.3,
  directConsumption: 53.3,
  passengers: 1,
};

// Form data wrapper with vehicles array and fallback keys
export const DEFAULT_FORM_DATA = {
  activeVehicleId: 'veh_default_1',
  vehicles: [DEFAULT_VEHICLE_DATA],
  vehicle: DEFAULT_VEHICLE_DATA,
  household: {
    members: 1,
    dwellingType: 'Apartment',
    city: 'Metro / Urban',
  },
  transport: {
    carDistanceKm: 800,
    carFuelType: 'petrolCar',
    twoWheelerDistanceKm: 0,
    twoWheelerType: 'twoWheelerPetrol',
    busDistanceKm: 0,
    metroDistanceKm: 0,
  },
  electricity: {
    kwhMonthly: 0,
    solarGenerationKwh: 0,
    usesRenewable: false,
  },
  lpg: {
    fuelType: 'cylinder',
    cylinderCount: 0,
    pngScm: 0,
  },
  food: {
    dietType: 'vegetarian',
    wasteAwareness: 'moderate',
  },
  waste: {
    wasteKgWeekly: 0,
    segregatesWaste: true,
    compostsOrganics: false,
  },
};
