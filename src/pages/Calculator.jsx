import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Car, 
  Zap, 
  Flame, 
  Utensils, 
  Trash2, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Calculator as CalcIcon,
  CheckCircle2
} from 'lucide-react';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useCarbon } from '../context/useCarbon';

export default function Calculator() {
  const navigate = useNavigate();
  const { 
    formData, 
    updateField, 
    calculateFootprint, 
    resetData, 
    loadSampleData, 
    isCalculated 
  } = useCarbon();

  const [activeTab, setActiveTab] = useState('all'); // 'all' or category id
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const categories = [
    {
      id: 'household',
      title: '1. Household Information',
      icon: Users,
      badge: 'Base Profile',
      badgeVariant: 'emerald',
      description: 'Household size, dwelling type, and occupancy details used for per-capita normalizations.',
    },
    {
      id: 'transport',
      title: '2. Transportation & Mobility',
      icon: Car,
      badge: 'Direct Emissions',
      badgeVariant: 'blue',
      description: 'Daily commuting distances, private vehicle fuel usage, two-wheeler travel, and public transit frequency.',
    },
    {
      id: 'electricity',
      title: '3. Electricity Consumption',
      icon: Zap,
      badge: 'Scope 2 Energy',
      badgeVariant: 'amber',
      description: 'Monthly electricity consumption in kWh and rooftop solar or green energy offsets.',
    },
    {
      id: 'lpg',
      title: '4. LPG & Cooking Fuel',
      icon: Flame,
      badge: 'Direct Fuel',
      badgeVariant: 'orange',
      description: 'LPG cylinders used per month or Piped Natural Gas (PNG) / induction cooking patterns.',
    },
    {
      id: 'food',
      title: '5. Food & Dietary Habits',
      icon: Utensils,
      badge: 'Lifestyle & Diet',
      badgeVariant: 'emerald',
      description: 'Dietary habits, meat/dairy consumption frequency, and food waste management.',
    },
    {
      id: 'waste',
      title: '6. Solid Waste & Recycling',
      icon: Trash2,
      badge: 'Municipal Waste',
      badgeVariant: 'slate',
      description: 'Estimated weekly municipal waste generation, segregation habits, and recycling participation.',
    },
  ];

  const categoryOrder = ['household', 'transport', 'electricity', 'lpg', 'food', 'waste'];

  const validateInputs = () => {
    if (!formData.household.members || Number(formData.household.members) < 1) {
      return 'Please enter at least 1 household member.';
    }
    if (Number(formData.household.members) > 30) {
      return 'Household member count exceeds expected limit (max 30).';
    }
    if (Number(formData.transport.carDistanceKm) < 0 || Number(formData.transport.twoWheelerDistanceKm) < 0) {
      return 'Commute distances cannot be negative numbers.';
    }
    if (Number(formData.electricity.kwhMonthly) < 0) {
      return 'Electricity consumption cannot be negative.';
    }
    if (Number(formData.waste.wasteKgWeekly) < 0) {
      return 'Waste generation cannot be negative.';
    }
    return '';
  };

  const handleCalculate = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const error = validateInputs();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
    calculateFootprint();
    navigate('/results');
  };

  const handleReset = () => {
    resetData();
    setValidationError('');
    setSuccessMessage('Inputs have been reset to defaults.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleFillSample = () => {
    loadSampleData();
    setValidationError('');
    setSuccessMessage('Sample household data loaded.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleNextTab = () => {
    if (activeTab === 'all') {
      setActiveTab('household');
      return;
    }
    const currentIndex = categoryOrder.indexOf(activeTab);
    if (currentIndex < categoryOrder.length - 1) {
      setActiveTab(categoryOrder[currentIndex + 1]);
    } else {
      setActiveTab('all');
    }
  };

  const handlePrevTab = () => {
    if (activeTab === 'all') {
      setActiveTab(categoryOrder[categoryOrder.length - 1]);
      return;
    }
    const currentIndex = categoryOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(categoryOrder[currentIndex - 1]);
    } else {
      setActiveTab('all');
    }
  };

  // Render individual form category fields
  const renderCategoryFields = (categoryId) => {
    switch (categoryId) {
      case 'household':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label htmlFor="members-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Household Members *
              </label>
              <input
                id="members-input"
                type="number"
                min="1"
                max="30"
                value={formData.household.members}
                onChange={(e) => updateField('household', 'members', Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Family members living in home</span>
            </div>

            <div>
              <label htmlFor="dwelling-type" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Dwelling Type
              </label>
              <select
                id="dwelling-type"
                value={formData.household.dwellingType}
                onChange={(e) => updateField('household', 'dwellingType', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Apartment">Apartment / Flat</option>
                <option value="Independent House">Independent House</option>
                <option value="Villa">Villa / Row House</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">Building structure type</span>
            </div>

            <div>
              <label htmlFor="city-region" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Geographic Region
              </label>
              <select
                id="city-region"
                value={formData.household.city}
                onChange={(e) => updateField('household', 'city', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Metro / Urban">Tier 1 Metro (Delhi, Mumbai, Bengaluru...)</option>
                <option value="Tier 2 Urban">Tier 2 Urban / Emerging City</option>
                <option value="Semi-Urban / Rural">Semi-Urban / Rural District</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">Regional grid & density context</span>
            </div>
          </div>
        );

      case 'transport':
        return (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="car-fuel" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Four-Wheeler / Car Type
                </label>
                <select
                  id="car-fuel"
                  value={formData.transport.carFuelType}
                  onChange={(e) => updateField('transport', 'carFuelType', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="petrolCar">Petrol Car (~0.18 kg CO₂e/km)</option>
                  <option value="dieselCar">Diesel Car (~0.17 kg CO₂e/km)</option>
                  <option value="electricVehicle">Electric Car (EV) (~0.053 kg CO₂e/km)</option>
                  <option value="none">No Four-Wheeler Owned</option>
                </select>
              </div>

              <div>
                <label htmlFor="car-km" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Car Distance (km / month)
                </label>
                <input
                  id="car-km"
                  type="number"
                  min="0"
                  step="20"
                  disabled={formData.transport.carFuelType === 'none'}
                  value={formData.transport.carFuelType === 'none' ? 0 : formData.transport.carDistanceKm}
                  onChange={(e) => updateField('transport', 'carDistanceKm', Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="two-wheeler-type" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Two-Wheeler Type
                </label>
                <select
                  id="two-wheeler-type"
                  value={formData.transport.twoWheelerType}
                  onChange={(e) => updateField('transport', 'twoWheelerType', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="twoWheelerPetrol">Petrol Scooter / Motorcycle (~0.055 kg/km)</option>
                  <option value="twoWheelerElectric">Electric Two-Wheeler (~0.018 kg/km)</option>
                  <option value="none">No Two-Wheeler</option>
                </select>
              </div>

              <div>
                <label htmlFor="two-wheeler-km" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Two-Wheeler Distance (km / month)
                </label>
                <input
                  id="two-wheeler-km"
                  type="number"
                  min="0"
                  step="10"
                  disabled={formData.transport.twoWheelerType === 'none'}
                  value={formData.transport.twoWheelerType === 'none' ? 0 : formData.transport.twoWheelerDistanceKm}
                  onChange={(e) => updateField('transport', 'twoWheelerDistanceKm', Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bus-km" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Public City Bus (km / month)
                </label>
                <input
                  id="bus-km"
                  type="number"
                  min="0"
                  step="10"
                  value={formData.transport.busDistanceKm}
                  onChange={(e) => updateField('transport', 'busDistanceKm', Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label htmlFor="metro-km" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Metro / Train Transit (km / month)
                </label>
                <input
                  id="metro-km"
                  type="number"
                  min="0"
                  step="10"
                  value={formData.transport.metroDistanceKm}
                  onChange={(e) => updateField('transport', 'metroDistanceKm', Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        );

      case 'electricity':
        return (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="kwh-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Monthly Grid Consumption (kWh units) *
                </label>
                <input
                  id="kwh-input"
                  type="number"
                  min="0"
                  step="10"
                  value={formData.electricity.kwhMonthly}
                  onChange={(e) => updateField('electricity', 'kwhMonthly', Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Check your latest electricity utility bill</span>
              </div>

              <div>
                <label htmlFor="solar-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Rooftop Solar Generation Offset (kWh / month)
                </label>
                <input
                  id="solar-input"
                  type="number"
                  min="0"
                  step="10"
                  value={formData.electricity.solarGenerationKwh}
                  onChange={(e) => updateField('electricity', 'solarGenerationKwh', Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Zero emissions clean solar generation</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.electricity.usesRenewable}
                  onChange={(e) => updateField('electricity', 'usesRenewable', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">100% Certified Renewable Energy Tariff</span>
                  <span className="text-slate-500">Household runs fully on off-site green energy certificate / solar tariff</span>
                </div>
              </label>
            </div>
          </div>
        );

      case 'lpg':
        return (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cooking-fuel-type" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Cooking Fuel Mode
                </label>
                <select
                  id="cooking-fuel-type"
                  value={formData.lpg.fuelType}
                  onChange={(e) => updateField('lpg', 'fuelType', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="cylinder">Standard LPG Cylinder (14.2 kg)</option>
                  <option value="png">Piped Natural Gas (PNG)</option>
                  <option value="induction">Electric Induction / Solar Cooker</option>
                </select>
              </div>

              {formData.lpg.fuelType === 'cylinder' && (
                <div>
                  <label htmlFor="cylinder-count" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    14.2 kg LPG Cylinders (per month)
                  </label>
                  <input
                    id="cylinder-count"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.lpg.cylinderCount}
                    onChange={(e) => updateField('lpg', 'cylinderCount', Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Typical: 0.8 to 1.5 cylinders per household</span>
                </div>
              )}

              {formData.lpg.fuelType === 'png' && (
                <div>
                  <label htmlFor="png-scm" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    PNG Consumption (Standard Cubic Meters / month)
                  </label>
                  <input
                    id="png-scm"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.lpg.pngScm}
                    onChange={(e) => updateField('lpg', 'pngScm', Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Check piped gas meter reading</span>
                </div>
              )}

              {formData.lpg.fuelType === 'induction' && (
                <div className="flex items-center text-xs text-emerald-700 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200/80">
                  <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
                  <span>Zero direct burner emissions! Induction energy is accounted for under your electricity tab.</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'food':
        return (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="diet-pattern" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Dietary Pattern
                </label>
                <select
                  id="diet-pattern"
                  value={formData.food.dietType}
                  onChange={(e) => updateField('food', 'dietType', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="meatHeavy">High Meat (Daily red/white meat) ~240 kg/person</option>
                  <option value="mediumMeat">Moderate Meat (2-3 times/week) ~145 kg/person</option>
                  <option value="pescatarian">Pescatarian (Fish & Vegetarian) ~120 kg/person</option>
                  <option value="vegetarian">Vegetarian (Lacto-Ovo) ~85 kg/person</option>
                  <option value="vegan">Vegan (100% Plant-Based) ~55 kg/person</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">Average monthly impact per member</span>
              </div>

              <div>
                <label htmlFor="food-waste-habit" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Food Waste & Kitchen Discipline
                </label>
                <select
                  id="food-waste-habit"
                  value={formData.food.wasteAwareness}
                  onChange={(e) => updateField('food', 'wasteAwareness', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="high">High Awareness (Zero food waste, planned meals) [-5%]</option>
                  <option value="moderate">Average Kitchen Waste [Standard]</option>
                  <option value="low">Frequent Leftover Waste [+5%]</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">Kitchen food discard awareness</span>
              </div>
            </div>
          </div>
        );

      case 'waste':
        return (
          <div className="space-y-4 pt-2">
            <div>
              <label htmlFor="waste-weekly" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Estimated Weekly Waste Generation (kg / week)
              </label>
              <input
                id="waste-weekly"
                type="number"
                min="0"
                step="1"
                value={formData.waste.wasteKgWeekly}
                onChange={(e) => updateField('waste', 'wasteKgWeekly', Math.max(0, Number(e.target.value) || 0))}
                className="w-full sm:w-1/2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Average Indian household generates ~7-12 kg/week</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.waste.segregatesWaste}
                  onChange={(e) => updateField('waste', 'segregatesWaste', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">Wet / Dry Waste Segregation</span>
                  <span className="text-slate-500">Recyclables (paper, plastic) separated from municipal waste</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.waste.compostsOrganics}
                  onChange={(e) => updateField('waste', 'compostsOrganics', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-800 block">Home / Community Composting</span>
                  <span className="text-slate-500">Wet food scraps composted, preventing landfill methane</span>
                </div>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const visibleCategories = activeTab === 'all'
    ? categories
    : categories.filter((c) => c.id === activeTab);

  return (
    <div className="py-10 sm:py-14 bg-slate-50 min-h-[calc(100vh-140px)]">
      <Container size="default">
        {/* Page Header */}
        <div className="max-w-3xl mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald" size="sm" icon={CalcIcon}>
              Interactive Calculator
            </Badge>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> Est. 2-3 minutes
            </span>
            {isCalculated && (
              <Badge variant="blue" size="sm">
                Recalculating Existing Inputs
              </Badge>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Household Carbon Footprint Calculator
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Fill in your typical monthly activity data across the 6 categories below. Adjust values to reflect 
            your actual household consumption and compute your footprint.
          </p>
        </div>

        {/* Validation and Success Banners */}
        {validationError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Navigation & Tab Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveTab(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === c.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{c.badge}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
            <button
              type="button"
              onClick={handleFillSample}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
              title="Populate standard representative household consumption"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Sample Data</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Reset all fields to blank / default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Category Sections Grid */}
        <form onSubmit={handleCalculate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {visibleCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.id} 
                  id={`section-${category.id}`}
                  className="border-slate-200/90 shadow-2xs transition-colors"
                >
                  <div className="space-y-4">
                    {/* Category Card Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-base sm:text-lg font-bold text-slate-900">
                            {category.title}
                          </h2>
                          <span className="text-xs font-medium text-slate-500">
                            {category.badge}
                          </span>
                        </div>
                      </div>
                      <Badge variant={category.badgeVariant} size="sm">
                        Active
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Interactive Category Form Fields */}
                    {renderCategoryFields(category.id)}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Tab Next / Prev Helper when viewing single tab */}
          {activeTab !== 'all' && (
            <div className="flex items-center justify-between mb-8 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={ChevronLeft}
                iconPosition="left"
                onClick={handlePrevTab}
              >
                Previous Step
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={ChevronRight}
                iconPosition="right"
                onClick={handleNextTab}
              >
                Next Step
              </Button>
            </div>
          )}

          {/* Footer Action Bar with Calculate and Reset */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-slate-900">Ready to compute your carbon footprint?</h3>
              <p className="text-xs text-slate-500">
                Calculations apply standardized IPCC & CEA grid emission factors across all 6 categories.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                size="md"
                icon={RotateCcw}
                iconPosition="left"
                onClick={handleReset}
                className="w-full sm:w-auto"
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={CalcIcon}
                iconPosition="left"
                className="w-full sm:w-auto shadow-sm shadow-emerald-700/20"
              >
                Calculate Footprint
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
