import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  BarChart3, 
  TrendingDown, 
  ArrowRight, 
  Car, 
  Bike, 
  Bus, 
  Fuel, 
  ShieldCheck, 
  GitCompare,
  Gauge,
  ClipboardList
} from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export default function Home() {
  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-slate-50 to-slate-50 pt-12 lg:pt-20 pb-12 border-b border-slate-200/60">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <Badge variant="emerald" size="md" icon={Gauge}>
                Environmental Studies Academic Project
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                TerraTrace <span className="text-emerald-700">Drive</span>
              </h1>
              <p className="text-lg sm:text-xl font-semibold text-slate-700 tracking-tight">
                Vehicle Carbon Emission Calculator
              </p>
              <p className="text-sm sm:text-base font-medium italic text-emerald-800">
                "Measure Every Journey. Understand Your Impact."
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Development of a Web-Based Vehicle Carbon Emission Calculator and Environmental Impact Analysis System.
              Estimate vehicle-related carbon dioxide emissions using real-world vehicle information, fuel consumption, distance travelled, and verified emission factors.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Button
                to="/calculator"
                variant="primary"
                size="lg"
                icon={Calculator}
                iconPosition="left"
                className="w-full sm:w-auto shadow-md shadow-emerald-700/10 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Launch Vehicle Calculator
              </Button>
              <Button
                to="/survey"
                variant="secondary"
                size="lg"
                icon={ClipboardList}
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                Vehicle Usage Survey
              </Button>
              <Button
                to="/comparison"
                variant="outline"
                size="lg"
                icon={GitCompare}
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                Compare Powertrains
              </Button>
            </div>

            {/* Supported Vehicle Scope Badges */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto text-xs text-slate-700 font-medium">
              <div className="flex items-center justify-center gap-1.5 p-2.5 bg-white/90 rounded-xl border border-slate-200 shadow-2xs">
                <Car className="w-4 h-4 text-emerald-600" />
                <span>Cars (Petrol, Diesel, CNG, EV)</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2.5 bg-white/90 rounded-xl border border-slate-200 shadow-2xs">
                <Bike className="w-4 h-4 text-blue-600" />
                <span>Motorcycles & Scooters</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2.5 bg-white/90 rounded-xl border border-slate-200 shadow-2xs">
                <Bus className="w-4 h-4 text-amber-600" />
                <span>Public Transit & Buses</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2.5 bg-white/90 rounded-xl border border-slate-200 shadow-2xs">
                <Fuel className="w-4 h-4 text-purple-600" />
                <span>Distance & Direct Fuel Modes</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Three Core Feature Cards */}
      <section>
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Three-Tier Vehicle Impact Analysis
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              A transparent, scientific framework to quantify and reduce vehicular greenhouse gas emissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Calculate */}
            <Card hover className="flex flex-col justify-between p-6 sm:p-8 border-slate-200 bg-white">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                  <Calculator className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Phase 1</span>
                  <h3 className="text-xl font-bold text-slate-900">1. Calculate Emissions</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Enter vehicle type, fuel or powertrain (petrol, diesel, CNG, electric), and choose your preferred calculation method: distance & efficiency or actual fuel/kWh consumed.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center text-xs font-semibold text-emerald-700">
                <span>Dual calculation models with zero double-counting</span>
              </div>
            </Card>

            {/* Card 2: Understand & Compare */}
            <Card hover className="flex flex-col justify-between p-6 sm:p-8 border-slate-200 bg-white">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Phase 2</span>
                  <h3 className="text-xl font-bold text-slate-900">2. Real-World Analytics</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View monthly kg CO₂ and annualized tonnes CO₂. Inspect emissions per kilometre and understand the exact emission factor and scope applied.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center text-xs font-semibold text-blue-700">
                <span>Transparent IPCC & DEFRA factors</span>
              </div>
            </Card>

            {/* Card 3: Reduce */}
            <Card hover className="flex flex-col justify-between p-6 sm:p-8 border-slate-200 bg-white">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Phase 3</span>
                  <h3 className="text-xl font-bold text-slate-900">3. Optimize & Decarbonize</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Compare powertrains side-by-side. Explore actionable eco-driving tips, maintenance guidelines, and public transit shifts to systematically cut travel emissions.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center text-xs font-semibold text-amber-800">
                <span>Data-driven mitigation strategies</span>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* How the Calculator Works Section */}
      <section id="how-it-works" className="scroll-mt-24">
        <Container>
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs">
            <div className="max-w-2xl mb-10 space-y-2">
              <Badge variant="slate" size="sm">Scientific Methodology</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                How the Vehicle Calculator Works
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Emissions are calculated using standard mobile combustion accounting protocols, distinguishing between direct fuel combustion and electricity grid intensity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Method 1: Direct Fuel / Energy Accounting
                </span>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs text-center">
                  Fuel Consumption × Fuel Emission Factor = Direct CO₂ Emissions
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Best when exact litres of fuel, kg of CNG, or kWh of charging electricity are known from monthly bills or odometer logs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Method 2: Distance & Efficiency Modeling
                </span>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs text-center">
                  (Distance Travelled ÷ Vehicle Fuel Efficiency) × Emission Factor = Emissions
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Derives fuel consumption from distance travelled (km) and tested vehicle efficiency (km/L, km/kg, or km/kWh).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h4 className="text-base font-semibold text-slate-900">Select Vehicle & Fuel</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pick your vehicle category (car, motorcycle, scooter, bus) and compatible powertrain (petrol, diesel, CNG, electric).
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h4 className="text-base font-semibold text-slate-900">Provide Travel Metrics</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter monthly distance and fuel economy, or directly input fuel/electricity consumed. The system prevents double-counting.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h4 className="text-base font-semibold text-slate-900">Review & Decarbonize</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Analyze total emissions, grams per km, applied emission factors, and examine potential savings from EV switching or modal transit shifts.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Adheres to IPCC Mobile Combustion Guidelines, UK DEFRA, and CEA India Power Sector Baseline.</span>
              </div>
              <Link
                to="/methodology"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
              >
                <span>Read detailed methodology</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Vehicle Usage Survey ABL Callout Banner */}
      <section>
        <Container>
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-emerald-800/40 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <Badge variant="emerald" size="sm" icon={Gauge}>
                Activity-Based Learning (ABL) Field Study
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Participate in the Real-World Vehicle Usage Survey
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Contribute anonymous vehicle travel and fuel data to our environmental research.
                Analyze campus and community travel patterns, calculate Scope 1 & 2 carbon footprints, and export open datasets for academic analysis.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button
                to="/survey"
                variant="primary"
                size="lg"
                icon={ClipboardList}
                iconPosition="left"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Take the Survey
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Quick Launch CTA Banner */}
      <section>
        <Container>
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                TerraTrace Drive
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Ready to measure your vehicle carbon emissions?
              </h2>
              <p className="text-sm text-slate-300">
                Select your vehicle type, enter your monthly distance or fuel usage, and get transparent emission metrics in seconds.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Button
                to="/calculator"
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold border-none"
              >
                Launch Calculator
              </Button>
              <Button
                to="/comparison"
                variant="secondary"
                size="lg"
                icon={GitCompare}
                iconPosition="left"
                className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
              >
                Compare Vehicles
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
