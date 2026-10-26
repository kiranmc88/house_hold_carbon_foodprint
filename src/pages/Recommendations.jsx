import React from 'react';
import { 
  Lightbulb, 
  Car, 
  Gauge, 
  Wrench, 
  Bus, 
  Zap, 
  Users, 
  Calculator,
  Sparkles,
  CheckCircle,
  BarChart3,
  GitCompare,
  ArrowRight
} from 'lucide-react';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useCarbon } from '../context/useCarbon';
import { formatNumber } from '../utils/formatters';

export default function Recommendations() {
  const { results, isCalculated } = useCarbon();

  const vehicleRecommendations = [
    {
      id: 'eco_driving',
      title: 'Eco-Driving Techniques & Speed Management',
      icon: Gauge,
      badgeVariant: 'emerald',
      defaultImpact: 'High Impact (Immediate)',
      summary: 'Adopting smooth acceleration and maintaining steady speeds delivers immediate 10% to 15% reductions in fuel consumption without any vehicle modification.',
      potentialSavingsPct: '10-15%',
      sampleActions: [
        'Avoid rapid acceleration and harsh braking; anticipate traffic flow smoothly',
        'Maintain highway speeds around 80-90 km/h; driving at 110+ km/h increases fuel consumption by up to 25%',
        'Turn off the engine during idling intervals exceeding 20 seconds (e.g., long traffic lights or railway crossings)',
      ],
    },
    {
      id: 'tire_maintenance',
      title: 'Tire Pressure & Aerodynamic Optimization',
      icon: Wrench,
      badgeVariant: 'blue',
      defaultImpact: 'Moderate Impact',
      summary: 'Proper tire pressure minimizes rolling resistance, extending tire life and maintaining optimal fuel economy.',
      potentialSavingsPct: '3-6%',
      sampleActions: [
        'Inspect and inflate tires to manufacturer-specified cold PSI at least twice monthly',
        'Under-inflated tires by just 5 PSI increase fuel consumption by 2% to 3%',
        'Remove empty rooftop cargo boxes or bike racks when not in use to eliminate aerodynamic drag',
      ],
    },
    {
      id: 'vehicle_servicing',
      title: 'Preventative Maintenance & Engine Tuning',
      icon: Car,
      badgeVariant: 'amber',
      defaultImpact: 'Moderate Impact',
      summary: 'Regular engine diagnostics, air filter replacements, and fresh motor oil ensure complete fuel combustion with minimal emissions.',
      potentialSavingsPct: '5-10%',
      sampleActions: [
        'Replace clogged engine air filters to prevent rich fuel-air mixtures and incomplete combustion',
        'Use the manufacturer-recommended motor oil viscosity grade for lower frictional drag',
        'Ensure wheel alignment and suspension servicing to prevent drag resistance',
      ],
    },
    {
      id: 'modal_shift',
      title: 'Modal Shift & Mass Transit Integration',
      icon: Bus,
      badgeVariant: 'emerald',
      defaultImpact: 'Very High Impact',
      summary: 'Substituting private car trips with public buses, metro rail, or active mobility (walking/cycling) provides the highest per-kilometer emission cuts.',
      potentialSavingsPct: '40-70%',
      sampleActions: [
        'Shift 1 or 2 commuting days per week to rapid transit metro or city buses',
        'Utilize park-and-ride facilities at transit hubs for long-distance suburban trips',
        'Adopt cycling or walking for short-distance trips under 2 km where engine cold-starts burn excess fuel',
      ],
    },
    {
      id: 'powertrain_ev',
      title: 'Powertrain Transition & EV Adoption',
      icon: Zap,
      badgeVariant: 'teal',
      defaultImpact: 'Long-Term Impact',
      summary: 'Transitioning to battery electric vehicles (EVs) eliminates tailpipe emissions and significantly lowers operational greenhouse gas emissions.',
      potentialSavingsPct: '25-50%',
      sampleActions: [
        'Evaluate electric two-wheelers or electric cars for urban stop-and-go commuting',
        'Charge EVs during daylight solar hours or off-peak grid hours where green tariffs exist',
        'Consider CNG as a lower-emission transition fuel over conventional diesel',
      ],
    },
    {
      id: 'carpooling',
      title: 'Carpooling & Trip Consolidation',
      icon: Users,
      badgeVariant: 'purple',
      defaultImpact: 'High Impact',
      summary: 'Increasing vehicle occupancy directly divides per-person emissions, while trip chaining prevents repeated cold-engine cycles.',
      potentialSavingsPct: '30-50%',
      sampleActions: [
        'Form workplace carpools or utilize community ride-sharing for daily office commutes',
        'Consolidate multiple separate shopping errands into a single chained circular route',
        'Avoid single-occupancy driving during peak congestion gridlocks',
      ],
    },
  ];

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-[calc(100vh-140px)]">
      <Container size="default">
        {/* Page Header */}
        <div className="max-w-3xl mb-8 space-y-3">
          <Badge variant="amber" size="sm" icon={Lightbulb}>
            Decarbonization Action Plan
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Vehicle Carbon Reduction Recommendations
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Science-backed strategies to optimize fuel efficiency, lower emissions per kilometre, and transition toward sustainable mobility.
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
                    Active Profile: {results.vehicleLabel} ({results.fuelLabel})
                  </h3>
                  <Badge variant="emerald" size="sm">Calculated</Badge>
                </div>
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                  Your vehicle generates an estimated <strong className="text-slate-900">{results.monthlyCO2Kg} kg CO₂ / month</strong> ({formatNumber(results.annualCO2Tonnes, 2)} tonnes/year) at <strong className="text-emerald-700">{results.emissionsPerKmGrams} g CO₂/km</strong>. Applying the recommendations below can reduce your travel footprint significantly.
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
                to="/comparison"
                variant="primary"
                size="md"
                icon={GitCompare}
                iconPosition="left"
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Compare Vehicles
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
                  Ready to personalize your reduction potential?
                </h3>
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                  Run the vehicle calculator with your monthly distance and vehicle details to calculate exact fuel savings and carbon reduction estimates.
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
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Launch Calculator
              </Button>
            </div>
          </div>
        )}

        {/* Recommendations Cards Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              High-Impact Decarbonization Interventions
            </h2>
            <span className="text-xs text-slate-500 font-medium">6 Strategic Focus Areas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicleRecommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <Card 
                  key={rec.id} 
                  hover 
                  className="flex flex-col justify-between p-6 border-slate-200 bg-white"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="slate" size="sm">
                        {rec.defaultImpact}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-slate-900">
                        {rec.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rec.summary}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Actionable Measures:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {rec.sampleActions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Estimated Reduction:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Up to {rec.potentialSavingsPct}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-8 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold">Want to see alternative powertrain savings?</h3>
            <p className="text-xs text-slate-300">Compare petrol, diesel, CNG, and electric powertrains side-by-side.</p>
          </div>
          <Button
            to="/comparison"
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
          >
            Go to Vehicle Comparison
          </Button>
        </div>
      </Container>
    </div>
  );
}
