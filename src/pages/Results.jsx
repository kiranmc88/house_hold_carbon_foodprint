import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Calculator, 
  ArrowRight, 
  Zap, 
  Car, 
  Flame, 
  Utensils, 
  Trash2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Globe
} from 'lucide-react';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useCarbon } from '../context/useCarbon';
import { formatKgCO2e, formatTonnesCO2e, formatNumber, formatPercentage } from '../utils/formatters';

export default function Results() {
  const navigate = useNavigate();
  const { results, isCalculated, resetData } = useCarbon();

  const handleStartNew = () => {
    resetData();
    navigate('/calculator');
  };

  const categoryIcons = {
    electricity: Zap,
    lpg: Flame,
    transportation: Car,
    food: Utensils,
    waste: Trash2,
  };

  const categoryColors = {
    electricity: { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
    lpg: { bar: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
    transportation: { bar: 'bg-blue-600', text: 'text-blue-700', bg: 'bg-blue-50' },
    food: { bar: 'bg-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    waste: { bar: 'bg-slate-500', text: 'text-slate-700', bg: 'bg-slate-100' },
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-[calc(100vh-140px)]">
      <Container size="default">
        {/* Page Header */}
        <div className="max-w-3xl mb-8 space-y-2">
          <Badge variant="blue" size="sm" icon={BarChart3}>
            Dashboard & Analytics
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Carbon Footprint Analysis
          </h1>
          <p className="text-base text-slate-600">
            View your household's monthly emissions in kg CO₂e and annual impact in tonnes CO₂e.
          </p>
        </div>

        {/* When NO calculation has been performed */}
        {(!isCalculated || !results) && (
          <>
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-xs space-y-6 my-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <Calculator className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Complete the calculator to see your results.
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We haven't received your activity inputs yet. Head over to the calculator to enter your electricity, 
                  transport, fuel, diet, and waste data.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  to="/calculator"
                  variant="primary"
                  size="lg"
                  icon={Calculator}
                  iconPosition="left"
                  className="w-full sm:w-auto"
                >
                  Start Calculator
                </Button>
                <Button
                  to="/methodology"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  View Methodology
                </Button>
              </div>
            </div>

            {/* Preview of Dashboard Architecture */}
            <div className="mt-14 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Dashboard Layout Preview</h3>
                  <p className="text-xs text-slate-500">
                    Below is the planned layout for your future calculated results & charts.
                  </p>
                </div>
                <Badge variant="slate" size="sm">Awaiting Calculation</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 opacity-75">
                <Card padding="md" className="border-dashed border-slate-300 bg-slate-50/70">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Monthly Emissions
                    </span>
                    <div className="text-2xl font-bold text-slate-400">-- kg CO₂e</div>
                    <p className="text-[11px] text-slate-400">Per household monthly rate</p>
                  </div>
                </Card>

                <Card padding="md" className="border-dashed border-slate-300 bg-slate-50/70">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Annualized Total
                    </span>
                    <div className="text-2xl font-bold text-slate-400">-- tonnes CO₂e</div>
                    <p className="text-[11px] text-slate-400">Annual household impact</p>
                  </div>
                </Card>

                <Card padding="md" className="border-dashed border-slate-300 bg-slate-50/70">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Per Capita Footprint
                    </span>
                    <div className="text-2xl font-bold text-slate-400">-- tonnes/person</div>
                    <p className="text-[11px] text-slate-400">Divided by family size</p>
                  </div>
                </Card>

                <Card padding="md" className="border-dashed border-slate-300 bg-slate-50/70">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Primary Emission Driver
                    </span>
                    <div className="text-2xl font-bold text-slate-400">--</div>
                    <p className="text-[11px] text-slate-400">Highest contributing category</p>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* When CALCULATION IS ACTIVE */}
        {isCalculated && results && (
          <div className="space-y-8">
            {/* 4 Core Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <Card padding="md" className="border-emerald-200/80 bg-white shadow-2xs hover:border-emerald-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Monthly Emissions
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {formatKgCO2e(results.monthlyTotalKg, 1)}
                  </div>
                  <p className="text-xs text-slate-500">Per household monthly rate</p>
                </div>
              </Card>

              {/* Metric 2 */}
              <Card padding="md" className="border-blue-200/80 bg-white shadow-2xs hover:border-blue-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Annual Household Total
                    </span>
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {formatTonnesCO2e(results.annualTotalTonnes, 2)}
                  </div>
                  <p className="text-xs text-slate-500">Full year projected impact</p>
                </div>
              </Card>

              {/* Metric 3 */}
              <Card padding="md" className="border-amber-200/80 bg-white shadow-2xs hover:border-amber-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Per Capita Footprint
                    </span>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {formatNumber(results.perCapitaAnnualTonnes, 2)} <span className="text-base font-semibold text-slate-500">t / person</span>
                  </div>
                  <p className="text-xs text-slate-500">Normalized by family size</p>
                </div>
              </Card>

              {/* Metric 4 */}
              <Card padding="md" className="border-purple-200/80 bg-white shadow-2xs hover:border-purple-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Primary Emission Driver
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-purple-950 truncate">
                    {results.primaryDriver.title}
                  </div>
                  <p className="text-xs text-purple-700 font-medium">
                    {results.primaryDriver.percentage}% of total monthly emissions
                  </p>
                </div>
              </Card>
            </div>

            {/* Breakdown & Benchmark Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Breakdown (2 Cols) */}
              <Card className="lg:col-span-2 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Emission Category Distribution
                    </h2>
                    <p className="text-xs text-slate-500">
                      Detailed breakdown of monthly greenhouse gas contributions across activities.
                    </p>
                  </div>
                  <Badge variant="emerald" size="sm">
                    100% Accounted
                  </Badge>
                </div>

                <div className="space-y-5">
                  {Object.entries(results.categories).map(([key, item]) => {
                    const Icon = categoryIcons[key] || Zap;
                    const colors = categoryColors[key] || categoryColors.electricity;
                    return (
                      <div key={key} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-slate-800">{item.title}</span>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <span className="font-mono text-slate-600 font-medium">
                              {formatKgCO2e(item.monthlyKg, 1)}
                            </span>
                            <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${colors.bg} ${colors.text} min-w-[50px] text-center`}>
                              {formatPercentage(item.percentage, 1)}
                            </span>
                          </div>
                        </div>

                        {/* Progress visual bar */}
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                            style={{ width: `${Math.min(100, Math.max(1, item.percentage))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Climate Benchmark Comparison (1 Col) */}
              <Card className="p-6 sm:p-8 space-y-6">
                <div className="border-b border-slate-100 pb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-900">
                      Benchmark Context
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Annual per-capita emission comparison.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Your household */}
                  <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/70 space-y-1">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span>Your Household</span>
                      <span>{formatNumber(results.perCapitaAnnualTonnes, 2)} tonnes</span>
                    </div>
                    <p className="text-[11px] text-emerald-700">Per person per year</p>
                  </div>

                  {/* National Average */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>India National Avg</span>
                      <span>{results.benchmarks.nationalAverageAnnual} tonnes</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {results.perCapitaAnnualTonnes <= results.benchmarks.nationalAverageAnnual ? (
                        <span className="text-emerald-700 font-medium">✓ Below national average footprint</span>
                      ) : (
                        <span className="text-amber-700 font-medium">▲ Above national average</span>
                      )}
                    </p>
                  </div>

                  {/* Paris Agreement Target */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>Paris 2030 Target</span>
                      <span>{results.benchmarks.parisAgreementTarget} tonnes</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Target threshold to limit warming to 1.5°C
                    </p>
                  </div>

                  {/* Global Average */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>Global Average</span>
                      <span>{results.benchmarks.globalAverageAnnual} tonnes</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Worldwide per-capita emission baseline
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>IPCC 2030 global decarbonization alignment</span>
                </div>
              </Card>
            </div>

            {/* Bottom Actions Dashboard Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-sm font-bold text-slate-900">
                  Next Step: Review Tailored Reduction Strategies
                </h3>
                <p className="text-xs text-slate-500">
                  Recommendations are customized based on your primary emission driver ({results.primaryDriver.title}).
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
                  Recalculate / Edit Inputs
                </Button>
                <Button
                  to="/recommendations"
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="shadow-sm shadow-emerald-700/20"
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
