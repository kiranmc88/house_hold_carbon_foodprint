export const DEFAULT_FORM_DATA = {
  household: {
    members: 4,
    dwellingType: 'Apartment',
    city: 'Metro / Urban',
  },
  transport: {
    carDistanceKm: 350,
    carFuelType: 'petrolCar',
    twoWheelerDistanceKm: 150,
    twoWheelerType: 'twoWheelerPetrol',
    busDistanceKm: 80,
    metroDistanceKm: 120,
  },
  electricity: {
    kwhMonthly: 280,
    solarGenerationKwh: 0,
    usesRenewable: false,
  },
  lpg: {
    fuelType: 'cylinder',
    cylinderCount: 1,
    pngScm: 0,
  },
  food: {
    dietType: 'vegetarian',
    wasteAwareness: 'moderate',
  },
  waste: {
    wasteKgWeekly: 8,
    segregatesWaste: true,
    compostsOrganics: false,
  },
};
