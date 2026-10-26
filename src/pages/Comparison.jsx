import React, { useState } from 'react';
import { 
  GitCompare, 
  Car, 
  Bike, 
  Bus, 
  Zap, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useCarbon } from '../context/useCarbon';
import { VEHICLE_EMISSION_FACTORS } from '../data/emissionFactors';
import { formatNumber } from '../utils/formatters';

export default function Comparison() {
  const { vehicleData } = useCarbon();
  const initialDistance = vehicleData?.monthlyDistanceKm || 800;
  const [distanceKm, setDistanceKm] = useState(initialDistance);

  // Vehicle profiles for comparison
  const comparisonVehicles = [
    {
      id: 'petrol_car',
      name: 'Petrol Passenger Car',
      category: 'Four-Wheeler',
      icon: Car,
      fuelType: 'Petrol',
      avgEfficiency: 15,
      unit: 'litres',
      efficiencyUnit: 'km/L',
      emissionFactor: VEHICLE_EMISSION_FACTORS.fuelCombustion.petrol.factor, // 2.31 kg CO2/L
      scope: 'Scope 1 (Tailpipe)',
      isBaseline: true,
      color: 'slate',
    },
    {
      id: 'diesel_car',
      name: 'Diesel Passenger Car',
      category: 'Four-Wheeler',
      icon: Car,
      fuelType: 'Diesel',
      avgEfficiency: 18,
      unit: 'litres',
      efficiencyUnit: 'km/L',
      emissionFactor: VEHICLE_EMISSION_FACTORS.fuelCombustion.diesel.factor, // 2.68 kg CO2/L
      scope: 'Scope 1 (Tailpipe)',
      color: 'blue',
    },
    {
      id: 'cng_car',
      name: 'CNG Passenger Car',
      category: 'Four-Wheeler',
      icon: Car,
      fuelType: 'CNG',
      avgEfficiency: 22,
      unit: 'kg',
      efficiencyUnit: 'km/kg',
      emissionFactor: VEHICLE_EMISSION_FACTORS.fuelCombustion.cng.factor, // 2.75 kg CO2/kg
      scope: 'Scope 1 (Tailpipe)',
      color: 'amber',
    },
    {
      id: 'electric_car',
      name: 'Electric Car (EV)',
      category: 'Four-Wheeler',
      icon: Zap,
      fuelType: 'Grid Electricity',
      avgEfficiency: 7.0,
      unit: 'kWh',
      efficiencyUnit: 'km/kWh',
      emissionFactor: VEHICLE_EMISSION_FACTORS.fuelCombustion.electric.factor, // 0.82 kg CO2/kWh
      scope: 'Scope 2 (Power Grid)',
      color: 'emerald',
    },
    {
      id: 'petrol_motorcycle',
      name: 'Petrol Motorcycle',
      category: 'Two-Wheeler',
      icon: Bike,
      fuelType: 'Petrol',
      avgEfficiency: 42,
      unit: 'litres',
      efficiencyUnit: 'km/L',
      emissionFactor: VEHICLE_EMISSION_FACTORS.fuelCombustion.petrol.factor, // 2.31 kg CO2/L
      scope: 'Scope 1 (Tailpipe)',
      color: 'purple',
    },
    {
      id: 'electric_scooter',
      name: 'Electric Scooter (EV)',
      category: 'Two-Wheeler',
      icon: Zap,
      fuelType: 'Grid Electricity',
      avgEfficiency: 30,
      unit: 'kWh',
      efficiencyUnit: 'km/kWh',
      emissionFactor: VEHICLE_EMISSION_FACTORS.fuelCombustion.electric.factor, // 0.82 kg CO2/kWh
      scope: 'Scope 2 (Power Grid)',
      color: 'teal',
    },
    {
      id: 'public_bus',
      name: 'City Transit Bus (Per Passenger)',
      category: 'Public Transit',
      icon: Bus,
      fuelType: 'Diesel / CNG Blend',
      avgEfficiency: 3.5,
      unit: 'passenger-km',
      efficiencyUnit: 'shared transit',
      perKmFactor: 0.035, // Average passenger share based on 25 passenger load factor
      scope: 'Scope 1 Shared',
      color: 'indigo',
    },
  ];

  // Baseline is petrol car
  const baselineFuelNeeded = distanceKm / 15;
  const baselineMonthlyKg = baselineFuelNeeded * (VEHICLE_EMISSION_FACTORS.fuelCombustion.petrol.factor || 2.3149);

  const vehicleStats = comparisonVehicles.map((v) => {
    let monthlyKg = 0;
    let fuelConsumed = 0;

    if (v.perKmFactor) {
      monthlyKg = distanceKm * v.perKmFactor;
      fuelConsumed = distanceKm;
    } else {
      fuelConsumed = distanceKm / v.avgEfficiency;
      monthlyKg = fuelConsumed * v.emissionFactor;
    }

    const annualTonnes = (monthlyKg * 12) / 1000;
    const emissionsPerKmGrams = distanceKm > 0 ? (monthlyKg / distanceKm) * 1000 : 0;
    const diffPct = baselineMonthlyKg > 0 ? Math.round(((baselineMonthlyKg - monthlyKg) / baselineMonthlyKg) * 100) : 0;
    const savingsKg = baselineMonthlyKg - monthlyKg;

    return {
      ...v,
      fuelConsumed: Number(fuelConsumed.toFixed(1)),
      monthlyKg: Number(monthlyKg.toFixed(1)),
      annualTonnes: Number(annualTonnes.toFixed(2)),
      emissionsPerKmGrams: Number(emissionsPerKmGrams.toFixed(0)),
      diffPct,
      savingsKg: Number(savingsKg.toFixed(1)),
    };
  });

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-[calc(100vh-140px)]">
      <Container size="default">
        {/* Header */}
        <div className="max-w-3xl mb-10 space-y-3">
          <Badge variant="blue" size="sm" icon={GitCompare}>
            Vehicle Powertrain Analysis
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Vehicle Emission Comparison
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Evaluate how different vehicle categories, powertrains, and fuel types compare over identical journey distances.
            Understand the tangible environmental benefits of transitioning to electric mobility or public transit.
          </p>
        </div>

        {/* Distance Control Slider */}
        <Card className="p-6 sm:p-8 mb-8 border-slate-200/90 shadow-2xs bg-white">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label htmlFor="distance-slider" className="text-base font-bold text-slate-900 block">
                  Simulated Monthly Travel Distance
                </label>
                <p className="text-xs text-slate-500">
                  Adjust the monthly distance in kilometres to observe relative emission differences across all vehicle types.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="distance-input"
                  type="number"
                  min="50"
                  max="5000"
                  step="50"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Math.max(10, Number(e.target.value) || 0))}
                  aria-label="Simulated monthly distance in kilometres"
                  className="w-28 px-3 py-1.5 font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold text-slate-600">km / month</span>
              </div>
            </div>

            <input
              id="distance-slider"
              type="range"
              min="100"
              max="3000"
              step="50"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              aria-label="Adjust simulated monthly travel distance"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>100 km (Short Commute)</span>
              <span>800 km (Average Urban)</span>
              <span>1,500 km (Moderate)</span>
              <span>3,000 km (High Mileage)</span>
            </div>
          </div>
        </Card>

        {/* Vehicle Comparison Cards Grid */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Comparative Impact Analysis for {formatNumber(distanceKm)} km / month
            </h2>
            <span className="text-xs text-slate-500">Benchmark: Petrol Car (15 km/L)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicleStats.map((item) => {
              const Icon = item.icon;
              const isBase = item.isBaseline;
              const isSavings = item.diffPct > 0;

              return (
                <Card 
                  key={item.id} 
                  hover 
                  className={`p-6 flex flex-col justify-between border-slate-200 transition-all ${
                    isBase ? 'ring-1 ring-slate-400 bg-slate-50/50' : 'bg-white'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            {item.name}
                          </h3>
                          <span className="text-[11px] text-slate-500">
                            {item.category} • {item.fuelType}
                          </span>
                        </div>
                      </div>

                      {isBase ? (
                        <Badge variant="slate" size="sm">Baseline</Badge>
                      ) : isSavings ? (
                        <Badge variant="emerald" size="sm">
                          ↓ {item.diffPct}% Less CO₂
                        </Badge>
                      ) : (
                        <Badge variant="amber" size="sm">
                          Similar
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Monthly Emissions</span>
                        <span className="text-lg font-extrabold text-slate-900">
                          {item.monthlyKg} <span className="text-xs font-normal text-slate-500">kg CO₂</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Annual Projected</span>
                        <span className="text-lg font-extrabold text-slate-900">
                          {item.annualTonnes} <span className="text-xs font-normal text-slate-500">tonnes</span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fuel Intensity:</span>
                        <span className="font-medium text-slate-800">
                          {item.perKmFactor ? 'Shared transit' : `${item.avgEfficiency} ${item.efficiencyUnit}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Emissions / km:</span>
                        <span className="font-semibold text-slate-800">
                          {item.emissionsPerKmGrams} g CO₂/km
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Emission Scope:</span>
                        <span className="text-slate-700 font-medium">
                          {item.scope}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isBase && (
                    <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Annual Reduction:</span>
                      <span className="font-bold text-emerald-700">
                        {item.diffPct > 0 ? `${formatNumber(((item.savingsKg * 12) / 1000), 2)} tonnes CO₂ saved` : 'Standard'}
                      </span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Scientific Scope Clarification Notice */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Understanding Scope Distinctions in Vehicle Comparisons</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct combustion emissions for petrol and diesel occur directly from the vehicle tailpipe (Scope 1). 
            For electric vehicles (EVs), tailpipe emissions are zero at the point of use; however, electricity consumed for charging causes indirect emissions at upstream power plants (Scope 2) based on the regional electrical grid generation mix (~0.82 kg CO₂/kWh for India average grid). 
            These scopes are accounted for transparently and are not interchangeable with full lifecycle / manufacturing emissions.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
            <Button to="/calculator" variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
              Calculate Your Specific Vehicle
            </Button>
            <Button to="/methodology" variant="secondary" size="sm">
              View Detailed Methodology
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
