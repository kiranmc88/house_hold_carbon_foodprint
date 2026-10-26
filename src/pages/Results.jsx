import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, 
  Calculator, 
  ArrowRight, 
  Fuel, 
  Gauge, 
  RotateCcw,
  ShieldCheck,
  GitCompare,
  Info,
  Layers,
  ClipboardList
} from 'lucide-react';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useCarbon } from '../context/useCarbon';
import { formatNumber } from '../utils/formatters';

export default function Results() {
  const navigate = useNavigate();
  const { results, isCalculated, resetData } = useCarbon();

  const handleStartNew = () => {
    resetData();
    navigate('/calculator');
  };

  const isMultiVehicle = Boolean(results && results.isFleet && results.vehicles && results.vehicles.length > 1);

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-[calc(100vh-140px)]">
      <Container size="default">
        {/* Page Header */}
        <div className="max-w-3xl mb-8 space-y-2">
          <Badge variant="blue" size="sm" icon={BarChart3}>
            {isMultiVehicle ? 'Multi-Vehicle Fleet Analytics' : 'Vehicle Analytics Dashboard'}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            {isMultiVehicle ? 'Fleet Carbon Emission Results' : 'Vehicle Carbon Emission Results'}
          </h1>
          <p className="text-base text-slate-600">
            {isMultiVehicle
              ? `Estimated emissions across your fleet of ${results.vehicleCount} vehicles, including aggregate metrics and individual vehicle breakdowns.`
              : 'Estimated monthly and annual carbon footprint based on your vehicle specifications, travel distance, and fuel accounting.'}
          </p>
        </div>

        {/* When NO calculation has been performed */}
        {(!isCalculated || !results) && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-xs space-y-6 my-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <Calculator className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Complete the vehicle calculator to view your emission results.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Provide your vehicle type, fuel or powertrain, and monthly travel metrics to generate your verified carbon footprint report.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                to="/calculator"
                variant="primary"
                size="lg"
                icon={Calculator}
                iconPosition="left"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Go to Calculator
              </Button>
              <Button
                to="/comparison"
                variant="secondary"
                size="lg"
                icon={GitCompare}
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                View Vehicle Comparison
              </Button>
            </div>
          </div>
        )}

        {/* When CALCULATION IS ACTIVE */}
        {isCalculated && results && (
          <div className="space-y-8">
            {/* 4 Core Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Monthly CO2 */}
              <Card padding="md" className="border-emerald-200/90 bg-white shadow-2xs hover:border-emerald-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {isMultiVehicle ? 'Total Fleet Monthly CO₂' : 'Monthly CO₂ Emissions'}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {formatNumber(results.monthlyCO2Kg, 1)} <span className="text-base font-semibold text-slate-500">kg</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    For {formatNumber(results.distanceKm)} km travelled
                  </p>
                </div>
              </Card>

              {/* Metric 2: Annual CO2 */}
              <Card padding="md" className="border-blue-200/90 bg-white shadow-2xs hover:border-blue-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {isMultiVehicle ? 'Annual Fleet Projected CO₂' : 'Annual Projected CO₂'}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {formatNumber(results.annualCO2Tonnes, 2)} <span className="text-base font-semibold text-slate-500">tonnes</span>
                  </div>
                  <p className="text-xs text-slate-500">{formatNumber(results.annualCO2Kg, 0)} kg / year</p>
                </div>
              </Card>

              {/* Metric 3: Fuel Consumed */}
              <Card padding="md" className="border-amber-200/90 bg-white shadow-2xs hover:border-amber-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {isMultiVehicle ? 'Active Primary Fuel' : 'Fuel / Energy Consumed'}
                    </span>
                    <Fuel className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {formatNumber(results.fuelConsumed, 1)} <span className="text-base font-semibold text-slate-500">{results.fuelUnit}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {results.calculationMethod === 'actual_consumption' 
                      ? 'Actual monthly consumption' 
                      : `Derived at ${results.efficiency} ${results.efficiencyUnit}`}
                  </p>
                </div>
              </Card>

              {/* Metric 4: Emissions per km */}
              <Card padding="md" className="border-purple-200/90 bg-white shadow-2xs hover:border-purple-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Emissions Intensity
                    </span>
                    <Gauge className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {formatNumber(results.emissionsPerKmGrams, 0)} <span className="text-base font-semibold text-slate-500">g / km</span>
                  </div>
                  <p className="text-xs text-purple-700 font-medium">
                    {results.emissionsPerKmKg} kg CO₂ per km
                  </p>
                </div>
              </Card>
            </div>

            {/* MULTI-VEHICLE FLEET BREAKDOWN SECTION */}
            {isMultiVehicle && results.vehicles && (
              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="space-y-0.5">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-emerald-600" />
                      Fleet Vehicle Breakdown ({results.vehicleCount} Vehicles)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Individual contribution of each vehicle toward total monthly greenhouse gas emissions.
                    </p>
                  </div>
                  <Badge variant="emerald" size="sm">Multi-Vehicle Fleet</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.vehicles.map((veh, idx) => (
                    <div
                      key={veh.id || idx}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">{veh.name}</h3>
                            {veh.registrationYear && (
                              <Badge variant="slate" size="sm">{veh.registrationYear}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {veh.vehicleLabel} • {veh.fuelLabel}
                          </p>
                        </div>
                        <Badge variant="emerald" size="sm">
                          {veh.sharePercentage}% of Fleet
                        </Badge>
                      </div>

                      {/* Progress share bar */}
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(2, veh.sharePercentage))}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-200/80">
                        <div>
                          <span className="text-slate-500 block text-[11px]">Monthly Emissions</span>
                          <span className="text-lg font-extrabold text-slate-900">
                            {veh.monthlyCO2Kg} <span className="text-xs font-normal text-slate-500">kg CO₂</span>
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Annual Impact</span>
                          <span className="text-lg font-extrabold text-slate-900">
                            {veh.annualCO2Tonnes} <span className="text-xs font-normal text-slate-500">tonnes</span>
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Distance Travelled</span>
                          <span className="font-semibold text-slate-800">
                            {formatNumber(veh.distanceKm)} km
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Fuel / Energy Consumed</span>
                          <span className="font-semibold text-slate-800">
                            {veh.fuelConsumed} {veh.fuelUnit}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white border border-slate-200/70 text-[11px] text-slate-600 space-y-0.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Method:</span>
                          <span className="font-semibold text-slate-800">
                            {veh.calculationMethod === 'actual_consumption' ? 'Actual Fuel Slips' : 'Distance & Efficiency'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Intensity:</span>
                          <span className="font-bold text-slate-900">
                            {veh.emissionsPerKmGrams} g CO₂/km
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Factor:</span>
                          <span className="text-emerald-700 font-semibold">
                            {veh.emissionFactor?.factor ?? veh.emissionFactor} {veh.emissionFactor?.unit ?? veh.emissionFactorUnit}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Vehicle & Calculation Specification Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Detailed Breakdown Card (2 cols) */}
              <Card className="lg:col-span-2 p-6 sm:p-8 space-y-6 bg-white border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Vehicle & Calculation Accounting
                    </h2>
                    <p className="text-xs text-slate-500">
                      Parameters used in computing your vehicle carbon footprint.
                    </p>
                  </div>
                  <Badge variant="emerald" size="sm">
                    Verified Formula
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-500 font-medium">Vehicle Category & Nickname</span>
                    <div className="text-base font-bold text-slate-900">
                      {results.vehicleLabel} {results.nickname && results.nickname !== 'Vehicle' ? `("${results.nickname}")` : ''}
                    </div>
                    <span className="text-slate-400">
                      {results.registrationYear ? `Registration year: ${results.registrationYear}` : 'Classified passenger/commercial category'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-500 font-medium">Fuel / Powertrain</span>
                    <div className="text-base font-bold text-slate-900">{results.fuelLabel}</div>
                    <span className="text-slate-400">Combustion or electric battery storage</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-500 font-medium">Calculation Method</span>
                    <div className="text-base font-bold text-slate-900">
                      {results.calculationMethod === 'distance_efficiency' 
                        ? 'Method A: Distance & Efficiency' 
                        : 'Method B: Actual Consumption'}
                    </div>
                    <span className="text-slate-400">Zero double-counting applied</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-slate-500 font-medium">Fuel Economy / Efficiency</span>
                    <div className="text-base font-bold text-slate-900">
                      {results.efficiency} {results.efficiencyUnit}
                    </div>
                    <span className="text-slate-400">Tested or specified consumption rate</span>
                  </div>
                </div>

                {/* Applied Emission Factor & Reference Block */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/90 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      Applied Emission Factor: {results.emissionFactor?.factor ?? results.emissionFactor} {results.emissionFactor?.unit ?? results.emissionFactorUnit}
                    </span>
                    <Badge variant="emerald" size="sm">{results.emissionFactor?.scope ?? results.emissionsBoundary}</Badge>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Standard Source:</strong> {results.emissionFactor?.source ?? results.emissionFactorSource}. {results.emissionFactor?.description ?? results.notesAndAssumptions}.
                  </p>
                </div>

                {/* Scope Note */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Scope Clarification:</strong> {results.fuelType === 'electric' 
                      ? 'Electric vehicles produce 0 tailpipe direct emissions at point of operation. Emissions shown reflect Scope 2 indirect power plant emissions based on the regional electrical grid mix.' 
                      : 'Petrol, diesel, and CNG emissions represent Scope 1 direct combustion released from the vehicle tailpipe.'}
                  </p>
                </div>
              </Card>

              {/* Benchmark Context & Alternatives Card (1 col) */}
              <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200">
                <div className="border-b border-slate-100 pb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-900">
                      Powertrain Comparison
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Monthly emissions for {formatNumber(results.distanceKm)} km across alternatives.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Current Vehicle */}
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between font-bold text-emerald-950">
                      <span>Your Vehicle ({results.fuelLabel})</span>
                      <span>{results.monthlyCO2Kg} kg CO₂</span>
                    </div>
                    <p className="text-[11px] text-emerald-700">Current evaluation</p>
                  </div>

                  {/* Standard Petrol Car */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>Standard Petrol Car (15 km/L)</span>
                      <span>{results.alternatives.standardPetrolCarMonthlyKg} kg CO₂</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Conventional baseline</p>
                  </div>

                  {/* Electric Car */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>Electric Car (7 km/kWh)</span>
                      <span>{results.alternatives.electricMonthlyKg} kg CO₂</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Grid electricity emissions</p>
                  </div>

                  {/* Public Bus Share */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>Public Transit Bus (Per Passenger)</span>
                      <span>{results.alternatives.publicBusMonthlyKg} kg CO₂</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Shared mass transit</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Link
                    to="/comparison"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center justify-between group"
                  >
                    <span>Explore full vehicle comparison</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </Card>
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-sm font-bold text-slate-900">
                  Next Step: Discover Actionable Decarbonization Tips
                </h3>
                <p className="text-xs text-slate-500">
                  Explore practical eco-driving, maintenance, and transit recommendations to lower your vehicle footprint.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  icon={RotateCcw}
                  iconPosition="left"
                  onClick={handleStartNew}
                >
                  Start New
                </Button>
                <Button
                  to="/calculator"
                  variant="secondary"
                  size="md"
                  icon={Calculator}
                  iconPosition="left"
                >
                  Edit Inputs
                </Button>
                <Button
                  to="/survey"
                  variant="outline"
                  size="md"
                  icon={ClipboardList}
                  iconPosition="left"
                >
                  Contribute to Survey
                </Button>
                <Button
                  to="/recommendations"
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  View Recommendations
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
