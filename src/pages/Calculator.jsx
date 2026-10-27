import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  Bike, 
  Bus, 
  Truck, 
  Zap, 
  RotateCcw, 
  Plus,
  Trash2,
  AlertCircle,
  Calculator as CalcIcon,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Fuel,
  SlidersHorizontal
} from 'lucide-react';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useCarbon } from '../context/useCarbon';
import { VEHICLE_CONFIGS } from '../context/constants';
import { VEHICLE_EMISSION_FACTORS } from '../data/emissionFactors';

// Available registration year options (from current year down to 1995, plus older)
const CURRENT_YEAR = new Date().getFullYear();
const REGISTRATION_YEARS = Array.from({ length: CURRENT_YEAR - 1994 }, (_, i) => CURRENT_YEAR - i);

export default function Calculator() {
  const navigate = useNavigate();
  const { 
    vehicles,
    activeVehicleId,
    activeVehicle,
    setActiveVehicleId,
    addVehicle,
    removeVehicle,
    updateActiveVehicleField,
    updateVehicleData, 
    calculateFootprint, 
    resetData, 
    loadSampleData 
  } = useCarbon();

  // Multi-step wizard state: 1 = Vehicle Details, 2 = Fuel & Efficiency
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Current active vehicle configuration
  const currentVehicleType = activeVehicle.vehicleType || 'car';
  const vehicleConfig = VEHICLE_CONFIGS[currentVehicleType] || VEHICLE_CONFIGS.car;

  // Available fuels for the chosen vehicle type
  const availableFuels = vehicleConfig.allowedFuels;
  const currentFuelType = availableFuels.some((f) => f.id === activeVehicle.fuelType) 
    ? activeVehicle.fuelType 
    : availableFuels[0].id;

  const currentFuelConfig = availableFuels.find((f) => f.id === currentFuelType) || availableFuels[0];
  const activeFactor = VEHICLE_EMISSION_FACTORS.fuelCombustion[currentFuelConfig.id] || VEHICLE_EMISSION_FACTORS.fuelCombustion.petrol;

  // Handle vehicle type change and automatically adjust fuel if current fuel is not supported
  const handleVehicleTypeChange = (newType) => {
    const newConfig = VEHICLE_CONFIGS[newType] || VEHICLE_CONFIGS.car;
    const isFuelAllowed = newConfig.allowedFuels.some((f) => f.id === activeVehicle.fuelType);
    const newFuel = isFuelAllowed ? activeVehicle.fuelType : newConfig.allowedFuels[0].id;
    const targetFuelConfig = newConfig.allowedFuels.find((f) => f.id === newFuel) || newConfig.allowedFuels[0];

    updateVehicleData({
      vehicleType: newType,
      fuelType: newFuel,
      fuelEfficiency: targetFuelConfig.defaultEfficiency,
      actualConsumption: targetFuelConfig.defaultConsumption,
    });
  };

  // Handle fuel type change and populate default efficiency/consumption
  const handleFuelChange = (newFuel) => {
    const targetFuelConfig = availableFuels.find((f) => f.id === newFuel) || availableFuels[0];
    updateVehicleData({
      fuelType: newFuel,
      fuelEfficiency: targetFuelConfig.defaultEfficiency,
      actualConsumption: targetFuelConfig.defaultConsumption,
    });
  };

  // Switch active vehicle
  const handleSelectVehicleTab = (vehId) => {
    setValidationError('');
    setActiveVehicleId(vehId);
  };

  // Add another vehicle to fleet
  const handleAddVehicle = () => {
    setValidationError('');
    const newVeh = addVehicle();
    setSuccessMessage(`Added "${newVeh.name}". You can now configure its details.`);
    setCurrentStep(1);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Remove vehicle
  const handleRemoveVehicle = (e, vehId) => {
    e.stopPropagation();
    if (vehicles.length <= 1) return;
    removeVehicle(vehId);
    setSuccessMessage('Vehicle removed from fleet.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Validation function
  const validateVehicle = (veh) => {
    const method = veh.calculationMethod || 'distance_efficiency';
    const isActual = method === 'actual_consumption' || method === 'direct_consumption';

    if (isActual) {
      const consumption = Number(veh.actualConsumption);
      if (isNaN(consumption) || consumption <= 0) {
        return `Please enter a valid monthly consumption greater than 0 for "${veh.name || 'Vehicle'}".`;
      }
      if (Number(veh.monthlyDistanceKm) < 0) {
        return `Monthly distance cannot be negative for "${veh.name || 'Vehicle'}".`;
      }
    } else {
      const distance = Number(veh.monthlyDistanceKm);
      const efficiency = Number(veh.fuelEfficiency);

      if (isNaN(distance) || distance <= 0) {
        return `Monthly distance travelled must be greater than 0 km for "${veh.name || 'Vehicle'}".`;
      }
      if (isNaN(efficiency) || efficiency <= 0) {
        return `Fuel efficiency must be greater than 0 for "${veh.name || 'Vehicle'}".`;
      }
    }
    return '';
  };

  // Validate step 1 before proceeding to step 2
  const handleNextStep = () => {
    const distance = Number(activeVehicle.monthlyDistanceKm);
    if (isNaN(distance) || distance <= 0) {
      setValidationError('Please enter a valid monthly distance greater than 0 km.');
      return;
    }
    setValidationError('');
    setCurrentStep(2);
  };

  // Trigger calculation
  const handleCalculate = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Validate all vehicles in fleet
    for (const veh of vehicles) {
      const err = validateVehicle(veh);
      if (err) {
        setActiveVehicleId(veh.id);
        setValidationError(err);
        return;
      }
    }

    setValidationError('');
    calculateFootprint();
    navigate('/results');
  };

  // Reset form
  const handleReset = () => {
    resetData();
    setCurrentStep(1);
    setValidationError('');
    setSuccessMessage('Calculator reset to default settings.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Load sample data
  const handleFillSample = () => {
    loadSampleData();
    setCurrentStep(1);
    setValidationError('');
    setSuccessMessage('Loaded sample multi-vehicle fleet (Family Sedan + Electric Scooter).');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Real-time calculation preview
  const isActualMethod = activeVehicle.calculationMethod === 'actual_consumption' || activeVehicle.calculationMethod === 'direct_consumption';
  const previewDistance = Number(activeVehicle.monthlyDistanceKm) || 0;
  const previewEfficiency = Number(activeVehicle.fuelEfficiency) || currentFuelConfig.defaultEfficiency;
  const previewActualConsumption = Number(activeVehicle.actualConsumption) || 0;

  const previewFuelUsed = isActualMethod
    ? previewActualConsumption
    : (previewEfficiency > 0 ? previewDistance / previewEfficiency : 0);

  const previewMonthlyKg = (previewFuelUsed * activeFactor.factor).toFixed(1);
  const previewPerKmGrams = previewDistance > 0 ? ((previewMonthlyKg / previewDistance) * 1000).toFixed(0) : '--';

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-[calc(100vh-140px)]">
      <Container size="default">
        {/* Header */}
        <div className="max-w-3xl mb-8 space-y-3">
          <Badge variant="emerald" size="sm" icon={CalcIcon}>
            Vehicle Carbon Emission Calculator
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Estimate Your Vehicle Carbon Emissions
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Quantify real-world CO₂ emissions using standard mobile combustion accounting. 
            Choose between distance-efficiency modeling or actual fuel slips, with zero double-counting.
          </p>
        </div>

        {/* Multi-Vehicle Fleet Management Bar */}
        <div className="mb-6 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Vehicles ({vehicles.length}):
            </span>
            {vehicles.map((v, idx) => {
              const isActive = v.id === activeVehicleId;
              const typeConfig = VEHICLE_CONFIGS[v.vehicleType] || VEHICLE_CONFIGS.car;
              const fuelItem = typeConfig.allowedFuels.find((f) => f.id === v.fuelType) || typeConfig.allowedFuels[0];

              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVehicleTab(v.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{v.name || `Vehicle ${idx + 1}`}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-emerald-700/80 text-emerald-100' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {fuelItem.label}
                  </span>
                  {vehicles.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveVehicle(e, v.id)}
                      className={`p-0.5 rounded-md hover:bg-red-500 hover:text-white transition-colors ${
                        isActive ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                      title="Remove this vehicle"
                      aria-label={`Remove ${v.name || 'vehicle'}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAddVehicle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Vehicle</span>
          </button>
        </div>

        {/* Wizard Step Progress Tracker */}
        <div className="mb-8 grid grid-cols-2 gap-3 max-w-xl">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              currentStep === 1
                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                currentStep === 1 ? 'text-emerald-700' : 'text-slate-500'
              }`}>
                Section 1
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-sm font-bold text-slate-900">Vehicle Details</div>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              currentStep === 2
                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                currentStep === 2 ? 'text-emerald-700' : 'text-slate-500'
              }`}>
                Section 2
              </span>
              <span className={`w-2 h-2 rounded-full ${currentStep === 2 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
            </div>
            <div className="text-sm font-bold text-slate-900">Fuel & Efficiency</div>
          </button>
        </div>

        {/* Status / Alert Messages */}
        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span>{validationError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <form noValidate onSubmit={handleCalculate} className="space-y-8">
          {/* ========================================================================= */}
          {/* SECTION 1: VEHICLE DETAILS */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <Card className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-2xs space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Section 1</span>
                  <h2 className="text-xl font-bold text-slate-900">Vehicle Profile Details</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure the vehicle category, fuel/powertrain, and regular travel metrics for <strong>{activeVehicle.name || 'Vehicle'}</strong>.
                  </p>
                </div>
                <Badge variant="slate" size="sm">Step 1 of 2</Badge>
              </div>

              {/* Vehicle Nickname & Registration Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vehicle-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Vehicle Name or Nickname <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="vehicle-name"
                    type="text"
                    value={activeVehicle.name || ''}
                    onChange={(e) => updateActiveVehicleField('name', e.target.value)}
                    placeholder="e.g. Daily Commuter, Family Sedan, Office Bike"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Helps distinguish vehicles when analyzing multiple vehicles.
                  </span>
                </div>

                <div>
                  <label htmlFor="reg-year" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Vehicle Registration Year <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      id="reg-year"
                      value={activeVehicle.registrationYear || ''}
                      onChange={(e) => updateActiveVehicleField('registrationYear', e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">Select manufacturing / registration year</option>
                      {REGISTRATION_YEARS.map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                      <option value="1994">1994 or earlier</option>
                    </select>
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Provides vehicle emission technology context.
                  </span>
                </div>
              </div>

              {/* Vehicle Type Selection */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Vehicle Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'car', label: 'Car', icon: Car, desc: 'Four-Wheeler' },
                    { id: 'motorcycle', label: 'Motorcycle', icon: Bike, desc: 'Commuter/Sport' },
                    { id: 'scooter', label: 'Scooter', icon: Zap, desc: 'Scooter/Moped' },
                    { id: 'bus', label: 'Bus', icon: Bus, desc: 'Public Transit' },
                    { id: 'other', label: 'Other', icon: Truck, desc: 'Van/Utility' },
                  ].map((v) => {
                    const Icon = v.icon;
                    const isSelected = currentVehicleType === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleVehicleTypeChange(v.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs ring-1 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{v.label}</div>
                          <div className="text-[10px] text-slate-500">{v.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {vehicleConfig.description}. Selecting a vehicle type automatically activates its supported powertrains.
                </span>
              </div>

              {/* Fuel / Powertrain Type Selection */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Fuel or Powertrain Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {availableFuels.map((fuel) => {
                    const isSelected = currentFuelType === fuel.id;
                    const factorObj = VEHICLE_EMISSION_FACTORS.fuelCombustion[fuel.id];
                    return (
                      <button
                        key={fuel.id}
                        type="button"
                        onClick={() => handleFuelChange(fuel.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-bold text-slate-900">{fuel.label}</span>
                          {fuel.id === 'electric' ? (
                            <Badge variant="emerald" size="sm">EV</Badge>
                          ) : (
                            <Badge variant="slate" size="sm">{fuel.unit}</Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 space-y-0.5">
                          <div>Efficiency: <strong className="text-slate-700">{fuel.efficiencyUnit}</strong></div>
                          <div>Factor: <strong className="text-slate-700">{factorObj?.factor} {factorObj?.unit}</strong></div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500">
                  * Note: Only realistic, verified powertrains for a <strong>{vehicleConfig.label}</strong> are enabled.
                </p>
              </div>

              {/* Monthly Distance Travelled */}
              <div className="pt-2">
                <label htmlFor="distance-step1" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Monthly Distance Travelled (km) *
                </label>
                <div className="relative max-w-md">
                  <input
                    id="distance-step1"
                    type="number"
                    min="1"
                    step="any"
                    value={activeVehicle.monthlyDistanceKm || ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                      updateActiveVehicleField('monthlyDistanceKm', val);
                    }}
                    placeholder="e.g. 800"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    required
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">km / month</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Typical daily commute of 25 km equates to ~750 km per month.
                </span>
              </div>

              {/* Step 1 Footer Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  icon={RotateCcw}
                  iconPosition="left"
                  onClick={handleReset}
                >
                  Reset Form
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={handleNextStep}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Next: Fuel & Efficiency
                </Button>
              </div>
            </Card>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: FUEL AND EFFICIENCY */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <Card className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-2xs space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Section 2</span>
                  <h2 className="text-xl font-bold text-slate-900">Fuel & Efficiency Configuration</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vehicle: <strong>{activeVehicle.name || 'Vehicle'}</strong> ({vehicleConfig.label} • {currentFuelConfig.label})
                  </p>
                </div>
                <Badge variant="blue" size="sm">Step 2 of 2</Badge>
              </div>

              {/* Calculation Method Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Select Calculation Method *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* METHOD A */}
                  <div
                    onClick={() => updateActiveVehicleField('calculationMethod', 'distance_efficiency')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      !isActualMethod
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-slate-900">
                        Method A — Distance and Efficiency
                      </span>
                      {!isActualMethod && (
                        <Badge variant="emerald" size="sm">Active</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Derives fuel consumption from distance travelled ({previewDistance} km) and vehicle efficiency rating ({currentFuelConfig.efficiencyUnit}).
                    </p>
                  </div>

                  {/* METHOD B */}
                  <div
                    onClick={() => updateActiveVehicleField('calculationMethod', 'actual_consumption')}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isActualMethod
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-slate-900">
                        Method B — Actual Consumption
                      </span>
                      {isActualMethod && (
                        <Badge variant="emerald" size="sm">Active</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Enter direct physical consumption in {currentFuelConfig.unit} (from fuel pump receipts, tank logs, or EV charger meters).
                    </p>
                  </div>
                </div>
              </div>

              {/* METHOD A FIELDS */}
              {!isActualMethod && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                    <span>Inputs for Method A: Distance and Efficiency</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Monthly Distance */}
                    <div>
                      <label htmlFor="distance-method-a" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Monthly Distance Travelled (km) *
                      </label>
                      <div className="relative">
                        <input
                          id="distance-method-a"
                          type="number"
                          min="1"
                          step="any"
                          value={activeVehicle.monthlyDistanceKm || ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                            updateActiveVehicleField('monthlyDistanceKm', val);
                          }}
                          placeholder="e.g. 800"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          required
                        />
                        <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">km</span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Monthly mileage accumulated by this vehicle.
                      </span>
                    </div>

                    {/* Fuel Efficiency / Energy Efficiency */}
                    <div>
                      <label htmlFor="efficiency-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {currentFuelType === 'electric' 
                          ? 'Energy Efficiency (km/kWh) *'
                          : currentFuelType === 'cng'
                          ? 'Fuel Efficiency (km/kg) *'
                          : 'Fuel Efficiency (km/litre) *'}
                      </label>
                      <div className="relative">
                        <input
                          id="efficiency-input"
                          type="number"
                          min="0.1"
                          step="0.5"
                          value={activeVehicle.fuelEfficiency || ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Math.max(0.1, Number(e.target.value));
                            updateActiveVehicleField('fuelEfficiency', val);
                          }}
                          placeholder={`e.g. ${currentFuelConfig.defaultEfficiency}`}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          required
                        />
                        <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">
                          {currentFuelConfig.efficiencyUnit}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {currentFuelConfig.typicalRange}. Tested ARAI or real-world average.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span className="text-slate-500">Derived Fuel Consumption:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {previewFuelUsed.toFixed(1)} {currentFuelConfig.unit} / month
                    </span>
                  </div>
                </div>
              )}

              {/* METHOD B FIELDS (DISPLAY ONLY RELEVANT FIELD FOR FUEL TYPE) */}
              {isActualMethod && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <Fuel className="w-4 h-4 text-blue-600" />
                    <span>Inputs for Method B: Actual Monthly Consumption</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* ONLY DISPLAY RELEVANT FIELD FOR CURRENT FUEL TYPE */}
                    {currentFuelType === 'petrol' && (
                      <div>
                        <label htmlFor="petrol-consumption" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Actual Monthly Petrol Consumption (litres) *
                        </label>
                        <div className="relative">
                          <input
                            id="petrol-consumption"
                            type="number"
                            min="0.1"
                            step="0.5"
                            value={activeVehicle.actualConsumption || ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                              updateActiveVehicleField('actualConsumption', val);
                            }}
                            placeholder="e.g. 53.3"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            required
                          />
                          <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">litres</span>
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Total litres filled across monthly fuel station receipts.
                        </span>
                      </div>
                    )}

                    {currentFuelType === 'diesel' && (
                      <div>
                        <label htmlFor="diesel-consumption" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Actual Monthly Diesel Consumption (litres) *
                        </label>
                        <div className="relative">
                          <input
                            id="diesel-consumption"
                            type="number"
                            min="0.1"
                            step="0.5"
                            value={activeVehicle.actualConsumption || ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                              updateActiveVehicleField('actualConsumption', val);
                            }}
                            placeholder="e.g. 44.4"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            required
                          />
                          <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">litres</span>
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Total litres of diesel fuel consumed in the month.
                        </span>
                      </div>
                    )}

                    {currentFuelType === 'cng' && (
                      <div>
                        <label htmlFor="cng-consumption" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Actual Monthly CNG Consumption (kg) *
                        </label>
                        <div className="relative">
                          <input
                            id="cng-consumption"
                            type="number"
                            min="0.1"
                            step="0.5"
                            value={activeVehicle.actualConsumption || ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                              updateActiveVehicleField('actualConsumption', val);
                            }}
                            placeholder="e.g. 36.4"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            required
                          />
                          <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">kg</span>
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Total kilograms of compressed natural gas filled.
                        </span>
                      </div>
                    )}

                    {currentFuelType === 'electric' && (
                      <div>
                        <label htmlFor="ev-consumption" className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Actual Monthly Electricity Consumption for EV Charging (kWh) *
                        </label>
                        <div className="relative">
                          <input
                            id="ev-consumption"
                            type="number"
                            min="0.1"
                            step="1.0"
                            value={activeVehicle.actualConsumption || ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                              updateActiveVehicleField('actualConsumption', val);
                            }}
                            placeholder="e.g. 114.3"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            required
                          />
                          <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">kWh</span>
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Kilowatt-hours billed from EV home wallbox or public fast charger.
                        </span>
                      </div>
                    )}

                    {/* Distance for per-km normalization in Method B */}
                    <div>
                      <label htmlFor="distance-method-b" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Monthly Distance Travelled (km) <span className="text-slate-400 font-normal">(Optional reference)</span>
                      </label>
                      <div className="relative">
                        <input
                          id="distance-method-b"
                          type="number"
                          min="0"
                          step="any"
                          value={activeVehicle.monthlyDistanceKm || ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                            updateActiveVehicleField('monthlyDistanceKm', val);
                          }}
                          placeholder="e.g. 800"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                        <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">km</span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Used solely to compute intensity (g CO₂/km). Does NOT alter fuel calculation.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Safeguard & Double-Counting Banner */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Double-counting prevention active:</strong> Calculation strictly applies {
                      isActualMethod ? 'Method B (Actual Consumption)' : 'Method A (Distance & Efficiency)'
                    }. No duplicate fuel values are added.
                  </span>
                </div>
                <div className="shrink-0 font-mono font-bold bg-white px-3 py-1 rounded-lg border border-emerald-200 text-emerald-700 text-right">
                  Preview: ~{previewMonthlyKg} kg CO₂ / mo ({previewPerKmGrams} g/km)
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    icon={ArrowLeft}
                    iconPosition="left"
                    onClick={() => setCurrentStep(1)}
                  >
                    Previous: Details
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    icon={Plus}
                    iconPosition="left"
                    onClick={handleAddVehicle}
                  >
                    Add Another Vehicle
                  </Button>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    icon={RotateCcw}
                    iconPosition="left"
                    onClick={handleReset}
                  >
                    Reset Form
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-700/10"
                  >
                    Calculate Emissions
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </form>

        {/* Quick Sample Data Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Need sample vehicle parameters for quick verification?</span>
          </div>
          <button
            type="button"
            onClick={handleFillSample}
            className="font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
          >
            Load Sample Fleet (Car + Scooter)
          </button>
        </div>
      </Container>
    </div>
  );
}
