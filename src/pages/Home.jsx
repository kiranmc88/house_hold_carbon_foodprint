import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  BarChart3, 
  TrendingDown, 
  ArrowRight, 
  Zap, 
  Flame, 
  Car, 
  Utensils, 
  Trash2, 
  ShieldCheck, 
  Leaf,
  HelpCircle
} from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export default function Home() {
  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-50 pt-12 lg:pt-20 pb-12 border-b border-slate-200/60">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <Badge variant="emerald" size="md" icon={Leaf}>
                Environmental Studies ABL Project
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Understand Your <br className="hidden sm:inline" />
              <span className="text-emerald-700">Carbon Footprint</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Estimate your household carbon emissions in <strong>kg CO₂e/month</strong> and <strong>tonnes CO₂e/year</strong>. 
              Discover where your emissions come from and explore actionable ways to reduce them.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Button
                to="/calculator"
                variant="primary"
                size="lg"
                icon={Calculator}
                iconPosition="left"
                className="w-full sm:w-auto shadow-md shadow-emerald-700/10"
              >
                Calculate My Footprint
              </Button>
              <Button
                href="#how-it-works"
                variant="secondary"
                size="lg"
                icon={HelpCircle}
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                How It Works
              </Button>
            </div>

            {/* Quick Metrics Scope Banner */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-2xl mx-auto text-xs text-slate-600 font-medium">
              <div className="flex items-center justify-center gap-1.5 p-2 bg-white/80 rounded-xl border border-slate-200/70 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Electricity</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2 bg-white/80 rounded-xl border border-slate-200/70 shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>LPG & Gas</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2 bg-white/80 rounded-xl border border-slate-200/70 shadow-2xs">
                <Car className="w-3.5 h-3.5 text-blue-500" />
                <span>Transport</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2 bg-white/80 rounded-xl border border-slate-200/70 shadow-2xs">
                <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                <span>Diet</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 p-2 bg-white/80 rounded-xl border border-slate-200/70 shadow-2xs">
                <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Waste</span>
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
              Three Steps to Environmental Awareness
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              A structured and transparent framework to measure and manage your household ecological footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Calculate */}
            <Card hover className="flex flex-col justify-between p-6 sm:p-8 border-slate-200">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                  <Calculator className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Phase 1</span>
                  <h3 className="text-xl font-bold text-slate-900">1. Calculate</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Enter your monthly household activity across electricity consumption, cooking gas, daily commuting, dietary habits, and waste generation.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center text-xs font-semibold text-emerald-700">
                <span>Simple 6-category input</span>
              </div>
            </Card>

            {/* Card 2: Understand */}
            <Card hover className="flex flex-col justify-between p-6 sm:p-8 border-slate-200">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Phase 2</span>
                  <h3 className="text-xl font-bold text-slate-900">2. Understand</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    View your emissions breakdown in both monthly kg CO₂e and annualized tonnes CO₂e. Compare your numbers with national and global benchmarks.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center text-xs font-semibold text-blue-700">
                <span>Standardized CO₂e metrics</span>
              </div>
            </Card>

            {/* Card 3: Reduce */}
            <Card hover className="flex flex-col justify-between p-6 sm:p-8 border-slate-200">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Phase 3</span>
                  <h3 className="text-xl font-bold text-slate-900">3. Reduce</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Discover practical, high-impact recommendations prioritized according to your household's largest emission contributors to save energy and costs.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center text-xs font-semibold text-amber-800">
                <span>Tailored reduction insights</span>
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
              <Badge variant="slate" size="sm">Methodology Overview</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                How the calculator works
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Our calculator utilizes emission factor modeling to translate tangible household activity into carbon dioxide equivalents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h4 className="text-base font-semibold text-slate-900">Input Household Activity</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Provide regular consumption values such as your monthly electricity bill in kWh, LPG cylinders used, transport kilometers, and diet type.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h4 className="text-base font-semibold text-slate-900">Apply Emission Factors</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Each activity is multiplied by standard emission factors (e.g. kg CO₂e per kWh or per km) to determine greenhouse gas emissions.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h4 className="text-base font-semibold text-slate-900">Explore Results & Actions</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Analyze your interactive carbon dashboard and discover science-backed strategies to systematically lower your household emissions.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>All calculations follow standard IPCC and national emission guidelines.</span>
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

      {/* Quick Launch CTA Banner */}
      <section>
        <Container>
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Start Your Evaluation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Ready to measure your environmental impact?
              </h2>
              <p className="text-sm text-slate-300">
                Takes less than 3 minutes to input your household activities and generate your carbon footprint estimate.
              </p>
            </div>

            <div className="shrink-0">
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
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
