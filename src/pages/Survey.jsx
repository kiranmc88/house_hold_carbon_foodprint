import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardList, 
  BarChart3, 
  Download, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Car, 
  Bike, 
  Bus, 
  Truck, 
  Fuel, 
  Zap, 
  Info, 
  ArrowRight, 
  Users, 
  Gauge, 
  Layers,
  Sparkles
} from 'lucide-react';

import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { formatNumber } from '../utils/formatters';

import {
  SURVEY_EMISSION_FACTORS,
  SURVEY_SUPPORTED_VEHICLES,
  PARTICIPANT_CATEGORIES,
  VEHICLE_AGE_OPTIONS,
  isSurveyCombinationSupported,
  getSurveyEmissionFactor,
  getSurveyUnsupportedReason,
} from '../data/surveyEmissionFactors';

import {
  calculateSurveyRecordEmissions,
  calculateSurveyAnalytics,
  validateSurveyDistance,
  MAX_MONTHLY_DISTANCE_KM,
} from '../utils/surveyCalculations';

import {
  getActualSurveyRecords,
  saveActualSurveyRecord,
  deleteActualSurveyRecord,
  clearActualSurveyRecords,
  getDemoSurveyRecords,
  clearDemoSurveyRecords,
  getSurveyViewMode,
  setSurveyViewMode,
} from '../utils/surveyStorage';

import { exportSurveyRecordsToCsv } from '../utils/surveyExport';

export default function Survey() {
  // Navigation active tab: 'form' | 'dashboard'
  const [activeTab, setActiveTab] = useState('form');

  // View mode: 'actual' (real survey data) | 'demo' (synthetic benchmark data)
  const [viewMode, setViewMode] = useState(() => getSurveyViewMode());

  // Survey data lists
  const [actualRecords, setActualRecords] = useState(() => getActualSurveyRecords());
  const [demoRecords, setDemoRecords] = useState(() => getDemoSurveyRecords());

  // Feedback notifications
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  // Field interaction tracking for distance
  const [distanceTouched, setDistanceTouched] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    participantCategory: 'student',
    vehicleType: 'car',
    fuelType: 'petrol',
    vehicleAge: 'unknown',
    monthlyDistanceKm: 600,
    dailyDistanceKm: '',
    daysUsedPerMonth: '',
    calculationMethod: 'distance_efficiency', // 'distance_efficiency' | 'actual_consumption'
    fuelEfficiency: 15.0,
    actualConsumption: '',
    consentGiven: false,
  });

  // Keep localStorage mode synced
  useEffect(() => {
    setSurveyViewMode(viewMode);
  }, [viewMode]);

  // Active records depending on mode
  const displayedRecords = viewMode === 'demo' ? demoRecords : actualRecords;

  // Real-time analytics computation
  const analytics = useMemo(() => {
    return calculateSurveyAnalytics(displayedRecords);
  }, [displayedRecords]);

  // Current vehicle configuration
  const currentVehicleConfig = SURVEY_SUPPORTED_VEHICLES[formData.vehicleType] || SURVEY_SUPPORTED_VEHICLES.car;
  const isCombinationSupported = isSurveyCombinationSupported(formData.vehicleType, formData.fuelType);
  const unsupportedReason = !isCombinationSupported 
    ? getSurveyUnsupportedReason(formData.vehicleType, formData.fuelType) 
    : '';

  const activeFactor = isCombinationSupported 
    ? getSurveyEmissionFactor(formData.vehicleType, formData.fuelType) 
    : null;

  // Monthly distance validation
  const isMethodA = formData.calculationMethod === 'distance_efficiency';
  const distanceValidation = useMemo(() => {
    return validateSurveyDistance(formData.monthlyDistanceKm, formData.calculationMethod);
  }, [formData.monthlyDistanceKm, formData.calculationMethod]);

  const distanceError = (!distanceValidation.isValid && distanceTouched) 
    ? distanceValidation.error 
    : '';

  // Real-time live calculation for the active form inputs
  const liveCalculation = useMemo(() => {
    if (!isCombinationSupported) {
      return {
        isValid: false,
        error: unsupportedReason,
      };
    }

    if (!distanceValidation.isValid) {
      return {
        isValid: false,
        error: distanceValidation.error,
      };
    }

    return calculateSurveyRecordEmissions({
      ...formData,
      monthlyDistanceKm: distanceValidation.value !== null ? distanceValidation.value : 0,
      fuelEfficiency: Number(formData.fuelEfficiency) || 0,
      actualConsumption: Number(formData.actualConsumption) || 0,
      requirePositiveDistance: isMethodA,
    });
  }, [formData, isCombinationSupported, unsupportedReason, distanceValidation, isMethodA]);

  // Auto-fill monthly distance from daily distance * days used
  const handleAutoEstimateDistance = () => {
    const daily = parseFloat(formData.dailyDistanceKm);
    const days = parseFloat(formData.daysUsedPerMonth);
    if (daily > 0 && days > 0) {
      const estimated = Math.round(daily * days);
      setFormData((prev) => ({
        ...prev,
        monthlyDistanceKm: estimated,
      }));
      setDistanceTouched(true);
      setFeedback({
        type: 'success',
        message: `Monthly distance auto-calculated as ${estimated} km (${daily} km/day × ${days} days/month).`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({
        type: 'error',
        message: 'Please enter valid numbers for average daily distance and days used per month first.',
      });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Switch vehicle type and adjust fuel if needed
  const handleVehicleTypeChange = (type) => {
    const newConfig = SURVEY_SUPPORTED_VEHICLES[type] || SURVEY_SUPPORTED_VEHICLES.car;
    const isCurrentFuelSupported = newConfig.allowedFuels.includes(formData.fuelType);
    const newFuel = isCurrentFuelSupported ? formData.fuelType : newConfig.allowedFuels[0];
    const defaultEff = newConfig.defaultEfficiencies[newFuel] || 15.0;

    setFormData((prev) => ({
      ...prev,
      vehicleType: type,
      fuelType: newFuel,
      fuelEfficiency: defaultEff,
    }));
  };

  // Switch fuel type and update default efficiency
  const handleFuelTypeChange = (fuel) => {
    const defaultEff = currentVehicleConfig.defaultEfficiencies?.[fuel] || 15.0;
    setFormData((prev) => ({
      ...prev,
      fuelType: fuel,
      fuelEfficiency: defaultEff,
    }));
  };

  // Handle Form Submission
  const handleSubmitSurvey = (e) => {
    e.preventDefault();
    setDistanceTouched(true);

    if (!distanceValidation.isValid) {
      setFeedback({
        type: 'error',
        message: distanceValidation.error || 'Please enter a valid monthly distance greater than 0 km.',
      });
      return;
    }

    if (!formData.consentGiven) {
      setFeedback({
        type: 'error',
        message: 'Consent confirmation is required to submit your anonymous survey record.',
      });
      return;
    }

    if (!isCombinationSupported) {
      setFeedback({
        type: 'error',
        message: `Cannot calculate emissions: ${unsupportedReason}`,
      });
      return;
    }

    if (!liveCalculation.isValid) {
      setFeedback({
        type: 'error',
        message: liveCalculation.error || 'Please correct the highlighted input fields before submitting.',
      });
      return;
    }

    // Build the record
    const validDistanceKm = distanceValidation.value !== null ? distanceValidation.value : 0;
    const newRecord = {
      ...formData,
      ...liveCalculation,
      monthlyDistanceKm: validDistanceKm,
      dailyDistanceKm: formData.dailyDistanceKm ? Number(formData.dailyDistanceKm) : null,
      daysUsedPerMonth: formData.daysUsedPerMonth ? Number(formData.daysUsedPerMonth) : null,
      submittedAt: new Date().toISOString(),
      consentGiven: true,
      isSynthetic: false,
    };

    const updated = saveActualSurveyRecord(newRecord);
    setActualRecords(updated);

    // If currently viewing demo, switch to actual
    if (viewMode === 'demo') {
      setViewMode('actual');
    }

    setFeedback({
      type: 'success',
      message: 'Anonymous survey record successfully recorded! Thank you for participating.',
    });

    // Reset sensitive inputs while keeping participant category
    setFormData((prev) => ({
      ...prev,
      monthlyDistanceKm: 600,
      dailyDistanceKm: '',
      daysUsedPerMonth: '',
      actualConsumption: '',
      consentGiven: false,
    }));
    setDistanceTouched(false);

    // Auto-scroll to feedback
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Delete an individual record
  const handleDeleteRecord = (id) => {
    if (viewMode === 'demo') {
      const updated = demoRecords.filter((r) => r.id !== id);
      setDemoRecords(updated);
    } else {
      const updated = deleteActualSurveyRecord(id);
      setActualRecords(updated);
    }
  };

  // Clear all actual records
  const handleClearAllRecords = () => {
    if (viewMode === 'demo') {
      clearDemoSurveyRecords();
      setDemoRecords([]);
      setFeedback({
        type: 'success',
        message: 'Demonstration records reset.',
      });
    } else {
      const confirmed = window.confirm(
        'Are you sure you want to delete all actual survey records stored in this browser? This action cannot be undone.'
      );
      if (confirmed) {
        clearActualSurveyRecords();
        setActualRecords([]);
        setFeedback({
          type: 'success',
          message: 'All local survey records have been deleted.',
        });
      }
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  // Export CSV
  const handleExportCsv = () => {
    const filename = viewMode === 'demo'
      ? 'terratrace_vehicle_survey_DEMO_benchmark_data.csv'
      : 'terratrace_vehicle_survey_actual_field_data.csv';

    exportSurveyRecordsToCsv(displayedRecords, filename);
    setFeedback({
      type: 'success',
      message: `Survey dataset successfully exported as ${filename}.`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Helper icons
  const getVehicleIcon = (type) => {
    switch (type) {
      case 'car': return Car;
      case 'motorcycle': return Bike;
      case 'scooter': return Bike;
      case 'bus': return Bus;
      default: return Truck;
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-[calc(100vh-140px)]">
      <Container size="default">
        {/* Main Academic Header */}
        <div className="max-w-4xl mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald" size="sm" icon={Gauge}>
              Environmental Studies ABL Project
            </Badge>
            <Badge variant="blue" size="sm" icon={ShieldCheck}>
              100% Anonymous & Local Browser Storage
            </Badge>
            {viewMode === 'demo' && (
              <Badge variant="amber" size="sm" icon={Sparkles}>
                Demonstration Mode Active
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Real-World Vehicle Usage Survey
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            An empirical investigation into real-world vehicular travel patterns and greenhouse gas emissions.
            Submit anonymous vehicle activity data to quantify Scope 1 (Direct Tailpipe) and Scope 2 (EV Grid Electricity) emissions,
            and examine the aggregated sample findings through the research dashboard.
          </p>

          {/* Local Storage & Anonymity Disclosure Notice */}
          <div className="p-4 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Data Storage & Research Privacy Protocol</span>
            </div>
            <p>
              <strong>Local Browser Storage:</strong> In this client-side environment, survey submissions are saved strictly inside your current browser session's local storage and are <em>never</em> automatically shared across devices or external users unless exported via CSV.
            </p>
            <p>
              <strong>Strict Anonymity:</strong> No personal details (names, phone numbers, vehicle registration/plate numbers, or residential addresses) are requested, collected, or stored.
            </p>
          </div>
        </div>

        {/* Global Notifications */}
        {feedback && (
          <div
            className={`p-4 mb-6 rounded-2xl flex items-center justify-between text-sm transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs underline font-medium hover:opacity-80 ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Mode & Action Control Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Tab Switchers */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              <span>Submit Survey</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Analytics Dashboard</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-slate-200 text-slate-700">
                {displayedRecords.length}
              </span>
            </button>
          </div>

          {/* Right: Data Mode & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle: Actual vs Demo */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-500 font-medium">Dataset:</span>
              <button
                type="button"
                onClick={() => setViewMode('actual')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  viewMode === 'actual'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Actual ({actualRecords.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('demo')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  viewMode === 'demo'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View standardized benchmark fleet dataset"
              >
                Demo Benchmark ({demoRecords.length})
              </button>
            </div>

            {/* CSV Export */}
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              iconPosition="left"
              onClick={handleExportCsv}
              disabled={displayedRecords.length === 0}
            >
              Export CSV
            </Button>

            {/* Clear local data */}
            {displayedRecords.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                onClick={handleClearAllRecords}
                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                title={viewMode === 'demo' ? 'Reset demo records' : 'Delete all actual local records'}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: SURVEY FORM */}
        {/* ========================================================================= */}
        {activeTab === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 Cols: Form Container */}
            <div className="lg:col-span-8">
              <form noValidate onSubmit={handleSubmitSurvey} className="space-y-6">
                {/* Section 1: Participant Identity (Anonymous) */}
                <Card className="p-6 bg-white border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <h2 className="text-base font-bold text-slate-900">
                        Participant Category
                      </h2>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Anonymous</span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Select the category that best describes your primary affiliation:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PARTICIPANT_CATEGORIES.map((cat) => {
                      const isSelected = formData.participantCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, participantCategory: cat.id })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <div className="text-xs sm:text-sm">{cat.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </Card>

                {/* Section 2: Vehicle & Powertrain Specifications */}
                <Card className="p-6 bg-white border-slate-200 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <h2 className="text-base font-bold text-slate-900">
                        Vehicle Classification & Powertrain
                      </h2>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Verified Factors</span>
                  </div>

                  {/* Vehicle Type Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Vehicle Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {Object.keys(SURVEY_SUPPORTED_VEHICLES).map((typeKey) => {
                        const veh = SURVEY_SUPPORTED_VEHICLES[typeKey];
                        const isSelected = formData.vehicleType === typeKey;
                        const Icon = getVehicleIcon(typeKey);
                        return (
                          <button
                            key={typeKey}
                            type="button"
                            onClick={() => handleVehicleTypeChange(typeKey)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500'
                                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                              <span className="text-xs sm:text-sm font-semibold">{veh.label}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{veh.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fuel or Powertrain Type */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Fuel or Powertrain Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {['petrol', 'diesel', 'cng', 'electric'].map((fuelKey) => {
                        const isSupported = currentVehicleConfig.allowedFuels.includes(fuelKey);
                        const isSelected = formData.fuelType === fuelKey;
                        const factorInfo = SURVEY_EMISSION_FACTORS[fuelKey];

                        return (
                          <button
                            key={fuelKey}
                            type="button"
                            onClick={() => handleFuelTypeChange(fuelKey)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? isSupported
                                  ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500'
                                  : 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400'
                                : isSupported
                                  ? 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                                  : 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm font-semibold capitalize">
                                {fuelKey === 'cng' ? 'CNG' : fuelKey === 'electric' ? 'Electric (EV)' : fuelKey}
                              </span>
                              {fuelKey === 'electric' ? (
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                              ) : (
                                <Fuel className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-1">
                              {isSupported ? factorInfo.unit : 'Not Standard'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Scientific Unsupported Combination Warning */}
                    {!isCombinationSupported && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 mt-3">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Unsupported Powertrain Combination</span>
                        </div>
                        <p>{unsupportedReason}</p>
                        <p className="text-[11px] text-amber-800">
                          TerraTrace Drive adheres to strict IPCC/DEFRA accounting guidelines: petrol emission factors will <em>never</em> be silently substituted for unsupported configurations.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Approximate Vehicle Age (Optional) */}
                  <div className="space-y-1.5 pt-2">
                    <label htmlFor="vehicleAge" className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Approximate Vehicle Age <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <select
                      id="vehicleAge"
                      value={formData.vehicleAge}
                      onChange={(e) => setFormData({ ...formData, vehicleAge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {VEHICLE_AGE_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </Card>

                {/* Section 3: Usage, Distance & Calculation Method */}
                <Card className="p-6 bg-white border-slate-200 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <h2 className="text-base font-bold text-slate-900">
                        Travel Activity & Calculation Method
                      </h2>
                    </div>
                    <Badge variant="slate" size="sm">Dual Engine</Badge>
                  </div>

                  {/* Method Switcher */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Calculation Formulation
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, calculationMethod: 'distance_efficiency' })}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          formData.calculationMethod === 'distance_efficiency'
                            ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-xs sm:text-sm mb-1">
                          Method A: Distance & Efficiency
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          Calculates fuel consumption from monthly distance travelled divided by vehicle fuel efficiency.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, calculationMethod: 'actual_consumption' })}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          formData.calculationMethod === 'actual_consumption'
                            ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-xs sm:text-sm mb-1">
                          Method B: Actual Direct Consumption
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          Calculates emissions directly from known fuel litres/kg purchased or EV charging kWh.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Monthly Distance (km) */}
                    <div className="space-y-1.5">
                      <label htmlFor="monthlyDistanceKm" className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                        <span>Monthly Distance</span>
                        <span className="text-slate-500 font-semibold lowercase">kilometres (km)</span>
                      </label>
                      <div className="relative">
                        <input
                          id="monthlyDistanceKm"
                          type="number"
                          step="any"
                          min={isMethodA ? "0.01" : "0"}
                          max={MAX_MONTHLY_DISTANCE_KM}
                          value={formData.monthlyDistanceKm}
                          onChange={(e) => {
                            setDistanceTouched(true);
                            setFormData((prev) => ({ ...prev, monthlyDistanceKm: e.target.value }));
                          }}
                          onBlur={() => setDistanceTouched(true)}
                          className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-slate-900 focus:outline-none transition-all pr-12 ${
                            distanceError
                              ? 'border-rose-400 focus:ring-2 focus:ring-rose-500 bg-rose-50/20'
                              : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                          }`}
                          placeholder="e.g. 600"
                          aria-invalid={distanceError ? 'true' : 'false'}
                          aria-describedby="monthlyDistance-desc monthlyDistance-error"
                          required={isMethodA}
                        />
                        <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400 pointer-events-none">
                          km
                        </span>
                      </div>
                      {distanceError && (
                        <p id="monthlyDistance-error" className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{distanceError}</span>
                        </p>
                      )}
                      <p id="monthlyDistance-desc" className="text-[11px] text-slate-500 mt-1">
                        Accepts positive integer or decimal distances in kilometres (km) up to {MAX_MONTHLY_DISTANCE_KM.toLocaleString()} km/month (e.g. 100, 250, 650, 1200, 2500 km).
                        {!isMethodA && ' (Optional reference for intensity calculation in Method B)'}
                      </p>
                    </div>

                    {/* Conditional Input based on Method */}
                    {formData.calculationMethod === 'distance_efficiency' ? (
                      <div className="space-y-1.5">
                        <label htmlFor="fuelEfficiency" className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                          <span>Fuel Efficiency</span>
                          <span className="text-slate-500 font-normal">{activeFactor?.efficiencyUnit || 'km/unit'}</span>
                        </label>
                        <input
                          id="fuelEfficiency"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={formData.fuelEfficiency}
                          onChange={(e) => setFormData({ ...formData, fuelEfficiency: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder="e.g. 15.0"
                          required
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label htmlFor="actualConsumption" className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                          <span>Actual Monthly Consumption</span>
                          <span className="text-slate-500 font-normal">{activeFactor?.fuelUnit || 'units'}</span>
                        </label>
                        <input
                          id="actualConsumption"
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={formData.actualConsumption}
                          onChange={(e) => setFormData({ ...formData, actualConsumption: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          placeholder={`e.g. 40 ${activeFactor?.fuelUnit || ''}`}
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Optional Commute Assist: Daily Distance & Days */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-slate-500" />
                        Commute Distance Calculator (Optional)
                      </span>
                      <button
                        type="button"
                        onClick={handleAutoEstimateDistance}
                        className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline"
                      >
                        Calculate Monthly Distance
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label htmlFor="dailyDistanceKm" className="text-[11px] font-medium text-slate-600 block">
                          Average Daily Distance (km)
                        </label>
                        <input
                          id="dailyDistanceKm"
                          type="number"
                          min="0"
                          step="0.5"
                          value={formData.dailyDistanceKm}
                          onChange={(e) => setFormData({ ...formData, dailyDistanceKm: e.target.value })}
                          placeholder="e.g. 20"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="daysUsedPerMonth" className="text-[11px] font-medium text-slate-600 block">
                          Days Used Per Month (1–31)
                        </label>
                        <input
                          id="daysUsedPerMonth"
                          type="number"
                          min="1"
                          max="31"
                          step="1"
                          value={formData.daysUsedPerMonth}
                          onChange={(e) => setFormData({ ...formData, daysUsedPerMonth: e.target.value })}
                          placeholder="e.g. 22"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Section 4: Consent & Submission */}
                <Card className="p-6 bg-white border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="surveyConsent"
                      checked={formData.consentGiven}
                      onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      required
                    />
                    <label htmlFor="surveyConsent" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                      <strong>Academic Research Consent:</strong> I confirm my consent to voluntarily submit this anonymous vehicle usage record for the Environmental Studies Activity-Based Learning (ABL) vehicle emissions analysis. I understand that my data contains no personally identifying information and is stored locally in this browser.
                    </label>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      icon={CheckCircle2}
                      iconPosition="left"
                      disabled={!formData.consentGiven || !isCombinationSupported || !liveCalculation.isValid}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Submit Anonymous Survey Record
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={() => setActiveTab('dashboard')}
                      icon={ArrowRight}
                      iconPosition="right"
                      className="w-full sm:w-auto text-slate-600"
                    >
                      View Dashboard ({displayedRecords.length})
                    </Button>
                  </div>
                </Card>
              </form>
            </div>

            {/* Right 4 Cols: Live Preview & Factor Reference */}
            <div className="lg:col-span-4 space-y-6">
              {/* Live Preview Card */}
              <Card className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5" />
                    Live Calculation Preview
                  </span>
                  <Badge variant="emerald" size="sm">
                    {liveCalculation.isValid ? 'Valid' : 'Incomplete'}
                  </Badge>
                </div>

                {liveCalculation.isValid ? (
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Estimated Monthly Emissions
                      </span>
                      <div className="text-3xl font-extrabold text-white">
                        {formatNumber(liveCalculation.monthlyEmissionsKg, 2)}{' '}
                        <span className="text-sm font-semibold text-emerald-400">kg CO₂e</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {formatNumber(liveCalculation.yearlyEmissionsTonnes, 3)} tonnes / year
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-700/80 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Intensity</span>
                        <span className="font-bold text-slate-200">
                          {formatNumber(liveCalculation.emissionsPerKmGrams, 0)} g / km
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fuel Used</span>
                        <span className="font-bold text-slate-200">
                          {formatNumber(liveCalculation.monthlyFuelConsumed, 1)} {liveCalculation.fuelUnit}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/80 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Emissions Scope:</span>
                        <span className={`font-semibold ${liveCalculation.isElectricity ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {liveCalculation.scope}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Factor Applied:</span>
                        <span>{liveCalculation.factorValue} {liveCalculation.factorUnit}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                    <AlertCircle className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
                    <p>{liveCalculation.error || 'Enter distance, efficiency, or fuel consumption to view preview.'}</p>
                  </div>
                )}
              </Card>

              {/* Scientific Factor Reference Box */}
              {activeFactor && (
                <Card className="p-5 bg-white border-slate-200 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Fuel className="w-4 h-4 text-emerald-600" />
                    <span>Scientific Factor Specification</span>
                  </div>

                  <div className="space-y-1.5 text-slate-600">
                    <p>
                      <strong className="text-slate-900">Value:</strong> {activeFactor.value} {activeFactor.unit}
                    </p>
                    <p>
                      <strong className="text-slate-900">Boundary:</strong> {activeFactor.emissionsBoundary}
                    </p>
                    <p>
                      <strong className="text-slate-900">Source:</strong> {activeFactor.source} ({activeFactor.publicationYear})
                    </p>
                    <p>
                      <strong className="text-slate-900">Geography:</strong> {activeFactor.geographicApplicability}
                    </p>
                    <p className="text-[11px] text-slate-500 pt-1 leading-relaxed border-t border-slate-100">
                      {activeFactor.notes}
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ANALYTICS DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Academic Sample & Representativeness Disclosure Banner */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant={viewMode === 'demo' ? 'amber' : 'emerald'} size="sm">
                    {viewMode === 'demo' ? 'Synthetic Demonstration Sample' : 'Active Field Sample'}
                  </Badge>
                  <span className="text-xs font-bold text-slate-900">
                    Sample Size: N = {analytics.sampleSize} Valid Responses
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {viewMode === 'demo' ? 'Benchmark Reference' : 'Stored in Local Browser'}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Academic Statistical Disclosure:</strong> The metrics, distributions, and averages presented below describe the 
                <em> collected sample ({analytics.sampleSize} survey records)</em> within this current environment. In accordance with environmental research 
                methodology, these figures should not be extrapolated as representing the entire campus or municipal vehicle population without controlled stratified sampling.
              </p>
            </div>

            {/* When NO records exist in current view */}
            {analytics.sampleSize === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No survey responses recorded in this view
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit your vehicle information using the survey form or switch to Demonstration Mode to explore sample statistics.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setActiveTab('form')}
                    icon={ClipboardList}
                    iconPosition="left"
                  >
                    Submit First Survey
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setViewMode('demo')}
                    icon={Sparkles}
                    iconPosition="left"
                  >
                    Load Demonstration Data
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* 4 Summary Metric KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Sample Size */}
                  <Card padding="md" className="border-slate-200 bg-white shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Sample Responses
                        </span>
                        <Users className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-3xl font-extrabold text-slate-900">
                        {analytics.sampleSize} <span className="text-sm font-medium text-slate-500">records</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {analytics.methodCounts.distance_efficiency} Method A · {analytics.methodCounts.actual_consumption} Method B
                      </p>
                    </div>
                  </Card>

                  {/* Card 2: Average Monthly Distance */}
                  <Card padding="md" className="border-slate-200 bg-white shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Avg Monthly Distance
                        </span>
                        <Gauge className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-3xl font-extrabold text-slate-900">
                        {formatNumber(analytics.avgMonthlyDistance, 0)}{' '}
                        <span className="text-sm font-medium text-slate-500">km</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Total {formatNumber(analytics.totalDistanceKm, 0)} km across sample
                      </p>
                    </div>
                  </Card>

                  {/* Card 3: Average Monthly Emissions */}
                  <Card padding="md" className="border-slate-200 bg-white shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Avg Monthly Emissions
                        </span>
                        <Fuel className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-3xl font-extrabold text-slate-900">
                        {formatNumber(analytics.avgMonthlyEmissions, 1)}{' '}
                        <span className="text-sm font-medium text-slate-500">kg CO₂e</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Total {formatNumber(analytics.totalAnnualEmissionsTonnes, 2)} tonnes / year
                      </p>
                    </div>
                  </Card>

                  {/* Card 4: Average Intensity per km */}
                  <Card padding="md" className="border-slate-200 bg-white shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Avg Intensity per KM
                        </span>
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-3xl font-extrabold text-slate-900">
                        {formatNumber(analytics.avgEmissionsPerKmGrams, 0)}{' '}
                        <span className="text-sm font-medium text-slate-500">g / km</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {analytics.avgEmissionsPerKmKg.toFixed(3)} kg CO₂e / km
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Scope 1 vs Scope 2 Boundary Pill Indicator */}
                <Card className="p-4 bg-white border-slate-200 space-y-2">
                  <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                    <span className="font-bold text-slate-800 uppercase tracking-wider">
                      Emissions Accounting Boundary Breakdown
                    </span>
                    <span className="text-slate-500 font-medium">
                      Scope 1 Direct Tailpipe vs Scope 2 Indirect EV Grid
                    </span>
                  </div>

                  {/* Visual Proportion Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
                    <div
                      style={{ width: `${analytics.scopeBreakdown.scope1Percentage}%` }}
                      className="bg-emerald-600 h-full transition-all duration-300"
                      title={`Scope 1 (Tailpipe): ${analytics.scopeBreakdown.scope1Percentage.toFixed(1)}%`}
                    />
                    <div
                      style={{ width: `${analytics.scopeBreakdown.scope2Percentage}%` }}
                      className="bg-amber-500 h-full transition-all duration-300"
                      title={`Scope 2 (EV Grid): ${analytics.scopeBreakdown.scope2Percentage.toFixed(1)}%`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      <span>
                        Scope 1 Direct Combustion: <strong>{formatNumber(analytics.scopeBreakdown.scope1Kg, 1)} kg</strong> ({analytics.scopeBreakdown.scope1Percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>
                        Scope 2 Indirect EV Grid: <strong>{formatNumber(analytics.scopeBreakdown.scope2Kg, 1)} kg</strong> ({analytics.scopeBreakdown.scope2Percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Charts Grid: Vehicle Type Distribution & Fuel Type Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chart 1: Vehicle Type Distribution */}
                  <Card className="p-6 bg-white border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Car className="w-4 h-4 text-emerald-600" />
                        Vehicle-Type Distribution
                      </h3>
                      <Badge variant="slate" size="sm">
                        {analytics.vehicleDistribution.length} Categories
                      </Badge>
                    </div>

                    <div className="space-y-3.5">
                      {analytics.vehicleDistribution.map((item) => (
                        <div key={item.type} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-800">{item.label}</span>
                            <span className="font-bold text-slate-900">
                              {item.count} ({item.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${item.percentage}%` }}
                              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>Avg {formatNumber(item.avgDistanceKm, 0)} km/mo</span>
                            <span>Avg {formatNumber(item.avgEmissionsKg, 1)} kg CO₂e</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Chart 2: Fuel Type Distribution */}
                  <Card className="p-6 bg-white border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-blue-600" />
                        Fuel / Powertrain Distribution
                      </h3>
                      <Badge variant="slate" size="sm">
                        {analytics.fuelDistribution.length} Fuels
                      </Badge>
                    </div>

                    <div className="space-y-3.5">
                      {analytics.fuelDistribution.map((item) => {
                        const fuelColors = {
                          petrol: 'bg-emerald-600',
                          diesel: 'bg-blue-600',
                          cng: 'bg-teal-600',
                          electric: 'bg-amber-500',
                        };
                        const barColor = fuelColors[item.fuel] || 'bg-slate-600';

                        return (
                          <div key={item.fuel} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-800">{item.label}</span>
                              <span className="font-bold text-slate-900">
                                {item.count} ({item.percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${item.percentage}%` }}
                                className={`${barColor} h-full rounded-full transition-all duration-300`}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>Total {formatNumber(item.totalEmissionsKg, 1)} kg</span>
                              <span>{item.isElectricity ? 'Scope 2 EV' : 'Scope 1 Tailpipe'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* Table: Participant Category Cross-Tabulation Comparison */}
                <Card className="p-6 bg-white border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-600" />
                        Participant Category Comparison Table
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Cross-sectional breakdown of travel distance, emissions, and powertrain choices by respondent role.
                      </p>
                    </div>
                    <Badge variant="blue" size="sm">Cross-Sectional</Badge>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Responses</th>
                          <th className="py-2.5 px-3">Sample Share</th>
                          <th className="py-2.5 px-3">Avg Monthly Dist</th>
                          <th className="py-2.5 px-3">Avg Monthly CO₂</th>
                          <th className="py-2.5 px-3">Avg Intensity</th>
                          <th className="py-2.5 px-3">Dominant Vehicle</th>
                          <th className="py-2.5 px-3">Dominant Fuel</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {analytics.categoryComparison.map((cat) => (
                          <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 font-bold text-slate-900">{cat.label}</td>
                            <td className="py-3 px-3">{cat.count}</td>
                            <td className="py-3 px-3">{cat.sharePercentage.toFixed(1)}%</td>
                            <td className="py-3 px-3">{formatNumber(cat.avgMonthlyDistanceKm, 0)} km</td>
                            <td className="py-3 px-3 font-semibold text-slate-900">
                              {formatNumber(cat.avgMonthlyEmissionsKg, 1)} kg
                            </td>
                            <td className="py-3 px-3">{formatNumber(cat.avgIntensityGrams, 0)} g/km</td>
                            <td className="py-3 px-3 capitalize">{cat.dominantVehicle}</td>
                            <td className="py-3 px-3 capitalize">{cat.dominantFuel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Table: Raw Survey Responses */}
                <Card className="p-6 bg-white border-slate-200 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Layers className="w-4 h-4 text-slate-600" />
                        Survey Submissions Log ({displayedRecords.length})
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Individual anonymous responses stored in this local dataset.
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Download}
                      onClick={handleExportCsv}
                    >
                      Export CSV
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Vehicle</th>
                          <th className="py-2.5 px-3">Fuel</th>
                          <th className="py-2.5 px-3">Method</th>
                          <th className="py-2.5 px-3">Monthly Dist</th>
                          <th className="py-2.5 px-3">Monthly CO₂</th>
                          <th className="py-2.5 px-3">Scope</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayedRecords.map((r, idx) => (
                          <tr key={r.id || idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 text-slate-500">
                              {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-2.5 px-3 capitalize font-medium text-slate-900">
                              {r.participantCategory}
                            </td>
                            <td className="py-2.5 px-3 capitalize">{r.vehicleType}</td>
                            <td className="py-2.5 px-3 capitalize">{r.fuelType}</td>
                            <td className="py-2.5 px-3 text-slate-500">
                              {r.calculationMethod === 'actual_consumption' ? 'Actual Fuel' : 'Distance'}
                            </td>
                            <td className="py-2.5 px-3">{formatNumber(r.monthlyDistanceKm)} km</td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">
                              {formatNumber(r.monthlyEmissionsKg, 2)} kg
                            </td>
                            <td className="py-2.5 px-3">
                              <Badge variant={r.isElectricity ? 'amber' : 'emerald'} size="sm">
                                {r.isElectricity ? 'Scope 2' : 'Scope 1'}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteRecord(r.id)}
                                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
