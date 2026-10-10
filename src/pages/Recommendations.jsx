import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, 
  Zap, 
  Car, 
  Flame, 
  Utensils, 
  Trash2, 
  Calculator,
  Sparkles,
  CheckCircle,
  BarChart3,
  RotateCcw
} from 'lucide-react';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useCarbon } from '../context/useCarbon';
import { formatKgCO2e } from '../utils/formatters';

export default function Recommendations() {
  const navigate = useNavigate();
  const { results, isCalculated, resetData } = useCarbon();

  const handleStartNew = () => {
    resetData();
    navigate('/calculator');
  };

  const recommendationPillars = [
    {
      id: 'electricity',
      categoryKey: 'electricity',
      title: 'Electricity & Energy Efficiency',
      icon: Zap,
      badgeVariant: 'amber',
      defaultImpact: 'High Impact',
      summary: 'Up to 30-40% reduction in electricity emissions through energy-star appliances, smart cooling, and rooftop solar adoption.',
      potentialSavingsPct: '30-40%',
      sampleActions: [
        'Set AC thermostats to optimal 24°C - 26°C (saves 6% per degree)',
        'Transition 100% of lighting fixtures to 5-star LEDs',
        'Explore rooftop solar net-metering to offset grid consumption',
      ],
    },
    {
      id: 'transport',
      categoryKey: 'transportation',
      title: 'Sustainable Mobility & Transit',
      icon: Car,
      badgeVariant: 'blue',
      defaultImpact: 'High Impact',
      summary: 'Transportation is often the largest single variable in household carbon profiles. Shifting commute modes delivers immediate drops.',
      potentialSavingsPct: '25-50%',
      sampleActions: [
        'Shift 2 days/week to public metro or carpooling',
        'Maintain correct tire pressure to optimize fuel economy by 3-5%',
        'Evaluate Electric Vehicles (EV) for daily city commutes',
      ],
    },
    {
      id: 'lpg',
      categoryKey: 'lpg',
      title: 'Cooking Fuel & Kitchen Efficiency',
      icon: Flame,
      badgeVariant: 'orange',
      defaultImpact: 'Moderate Impact',
      summary: 'Optimize cooking gas usage with energy-efficient induction cooktops, pressure cooking, and regular burner maintenance.',
      potentialSavingsPct: '15-25%',
      sampleActions: [
        'Utilize pressure cookers and covered vessels to trap heat',
        'Adopt induction cooktops powered by clean electricity',
        'Ensure timely servicing of gas regulators and burners',
      ],
    },
    {
      id: 'food',
      categoryKey: 'food',
      title: 'Dietary Shifts & Waste Reduction',
      icon: Utensils,
      badgeVariant: 'emerald',
      defaultImpact: 'High Impact',
      summary: 'Dietary habits influence global agricultural emissions. Incorporating more plant-forward meals significantly reduces footprint.',
      potentialSavingsPct: '20-35%',
      sampleActions: [
        'Introduce plant-forward meals 2-3 times per week',
        'Prioritize locally grown, seasonal produce to cut food miles',
        'Practice meal planning to eliminate kitchen food waste',
      ],
    },
    {
      id: 'waste',
      categoryKey: 'waste',
      title: 'Waste Segregation & Composting',
      icon: Trash2,
      badgeVariant: 'slate',
      defaultImpact: 'Moderate Impact',
      summary: 'Prevent methane generation in landfills by separating organic waste for home or community composting.',
      potentialSavingsPct: '50-70%',
      sampleActions: [
        'Segregate wet and dry waste at the source for recycling',
        'Initiate home composting for organic kitchen scraps',
        'Recycle paper, cardboard, and clean plastics responsibly',
      ],
    },
  ];

  // Dynamic ranking based on user emissions if calculated
  const sortedPillars = [...recommendationPillars].sort((a, b) => {
    if (!isCalculated || !results) return 0;
    const aEmissions = results.categories[a.categoryKey]?.monthlyKg || 0;
    const bEmissions = results.categories[b.categoryKey]?.monthlyKg || 0;
    return bEmissions - aEmissions;
  });

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-[calc(100vh-140px)]">
      <Container size="default">
        {/* Page Header */}
        <div className="max-w-3xl mb-8 space-y-3">
          <Badge variant="amber" size="sm" icon={Lightbulb}>
            Action Plan Engine
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Tailored Carbon Reduction Strategies
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Recommendations are dynamically prioritized based on your household's largest emission sources. 
            Once you calculate your footprint, the system highlights the highest-leverage actions to maximize your reduction.
          </p>
        </div>

        {/* Dynamic Status Banner */}
        {isCalculated && results ? (
          <div className="mb-10 bg-white rounded-2xl border border-emerald-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Prioritized for Your Household Profile
                  </h3>
                  <Badge variant="emerald" size="sm">Active</Badge>
                </div>
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                  Your primary driver is <strong className="text-slate-900">{results.primaryDriver.title}</strong>, contributing <strong className="text-emerald-700">{results.primaryDriver.percentage}%</strong> ({formatKgCO2e(results.primaryDriver.monthlyKg, 1)}) of your monthly emissions. Interventions below are ranked from highest to lowest potential leverage.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <Button
                to="/results"
                variant="secondary"
                size="md"
                icon={BarChart3}
                iconPosition="left"
                className="w-full md:w-auto"
              >
                View Results
              </Button>
              <Button
                to="/calculator"
                variant="primary"
                size="md"
                icon={Calculator}
                iconPosition="left"
                className="w-full md:w-auto"
              >
                Recalculate
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-10 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Awaiting Footprint Data for Priority Ranking
                </h3>
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                  Run the calculator to generate an automated recommendation rank order tailored to your specific household consumption numbers.
                </p>
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <Button
                to="/calculator"
                variant="primary"
                size="md"
                icon={Calculator}
                iconPosition="left"
                className="w-full md:w-auto"
              >
                Start Calculator
              </Button>
            </div>
          </div>
        )}

        {/* Core Recommendations Pillars */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {isCalculated ? 'Ranked Impact Interventions' : 'Recommendation Categories Overview'}
            </h2>
            <span className="text-xs text-slate-500 font-medium">5 Core Impact Areas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const categoryData = results?.categories?.[pillar.categoryKey];
              const isTopDriver = isCalculated && results?.primaryDriver?.key === pillar.categoryKey;

              return (
                <Card 
                  key={pillar.id} 
                  hover 
                  className={`flex flex-col justify-between p-6 transition-all ${
                    isTopDriver 
                      ? 'border-emerald-300 ring-2 ring-emerald-500/10 shadow-sm' 
                      : 'border-slate-200/90'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isTopDriver && (
                          <Badge variant="emerald" size="sm">
                            #1 Top Driver
                          </Badge>
                        )}
                        <Badge variant="slate" size="sm">
                          {isCalculated ? `Rank #${idx + 1}` : pillar.defaultImpact}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-slate-900">
                        {pillar.title}
                      </h3>
                      {categoryData && (
                        <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
                          <span>Current: {formatKgCO2e(categoryData.monthlyKg, 1)} ({categoryData.percentage}%)</span>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {pillar.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Key Interventions</span>
                        <span className="text-emerald-700 font-semibold">Est. {pillar.potentialSavingsPct} cut</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {pillar.sampleActions.map((action, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Toolbar */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-900">Need to update your consumption numbers?</h4>
            <p className="text-xs text-slate-500">You can return to the calculator at any time to test different reduction scenarios.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              size="md"
              icon={RotateCcw}
              iconPosition="left"
              onClick={handleStartNew}
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
            <Button
              to="/calculator"
              variant="primary"
              size="md"
              icon={Calculator}
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Back to Calculator
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
