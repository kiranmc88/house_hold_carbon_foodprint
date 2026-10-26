import React from 'react';
import { 
  BookOpen, 
  Layers, 
  Atom, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck,
  Fuel,
  Zap,
  Gauge
} from 'lucide-react';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export default function Methodology() {
  const sections = [
    {
      id: 'vehicle-principles',
      icon: Gauge,
      title: '1. Vehicle Carbon Accounting Principles',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            Vehicular greenhouse gas (GHG) accounting evaluates the carbon dioxide released as a consequence of motorized travel. 
            Vehicles powered by internal combustion engines (ICE) burn carbon-based fossil fuels (gasoline, diesel, CNG), liberating carbon dioxide 
            directly into the atmosphere via exhaust manifolds. Electric vehicles (EVs) utilize battery power, shifting emissions upstream to electrical generation plants.
          </p>
          <p>
            TerraTrace Drive applies standard international methodologies from the <strong>Intergovernmental Panel on Climate Change (IPCC)</strong> and 
            the <strong>GHG Protocol Mobile Combustion Guidance</strong> to calculate precise emissions based on user activity data.
          </p>
        </div>
      ),
    },
    {
      id: 'calculation-formulas',
      icon: Layers,
      title: '2. Mathematical Formulation & Calculation Modes',
      content: (
        <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
          <p>
            Depending on data availability, vehicular carbon dioxide emissions are calculated through two verified mathematical formulations:
          </p>

          {/* Formula 1: Direct Fuel */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Formula 1: Direct Fuel / Energy Accounting
            </span>
            <div className="p-3 bg-slate-800 rounded-lg font-mono text-xs sm:text-sm text-center text-emerald-200">
              Direct CO₂ Emissions (kg) = Fuel Consumption × Fuel Emission Factor
            </div>
            <p className="text-xs text-slate-300">
              Where Fuel Consumption is measured in litres (petrol/diesel), kilograms (CNG), or kilowatt-hours (EV charging electricity), and Fuel Emission Factor is the carbon coefficient per physical unit.
            </p>
          </div>

          {/* Formula 2: Distance & Efficiency */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              Formula 2: Distance & Efficiency Modeling
            </span>
            <div className="p-3 bg-slate-800 rounded-lg font-mono text-xs sm:text-sm text-center text-blue-200">
              Fuel Consumption = Distance Travelled (km) ÷ Vehicle Fuel Efficiency (km/unit)
            </div>
            <div className="p-3 bg-slate-800 rounded-lg font-mono text-xs sm:text-sm text-center text-blue-200">
              Estimated Emissions (kg CO₂) = Fuel Consumption × Fuel Emission Factor
            </div>
            <p className="text-xs text-slate-300">
              Where Vehicle Fuel Efficiency represents tested or real-world fuel economy (km/L, km/kg, or km/kWh).
            </p>
          </div>

          {/* Distance-based per km */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Formula 3: Distance-Based Fleet Factor Estimation
            </span>
            <div className="p-2.5 bg-white border border-slate-300 rounded-lg font-mono text-xs text-center text-slate-800">
              Estimated Emissions (kg CO₂) = Distance Travelled (km) × Emission Factor per kilometre (kg CO₂ / km)
            </div>
            <p className="text-xs text-slate-600">
              Utilized for benchmark fleet averages when vehicle-specific fuel consumption data is unavailable.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'scopes-distinction',
      icon: Scale,
      title: '3. Critical Scope Distinctions: Tailpipe vs Grid vs Lifecycle',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Mandatory Scientific Distinction</span>
            </div>
            <p>
              Tailpipe emissions, electricity-related emissions, and full lifecycle emissions are distinct scientific measurements and are <strong>NOT interchangeable</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                <Fuel className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Scope 1: Direct Tailpipe</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Emissions released directly through the vehicle exhaust from internal combustion of petrol, diesel, or natural gas. 
                Electric vehicles produce <strong>0 g CO₂/km</strong> at the tailpipe.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Scope 2: Grid Electricity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Emissions occurring off-site at electrical power utilities supplying energy to charge EV batteries. 
                Directly tied to the national/regional grid generation mix (e.g. ~0.82 kg CO₂/kWh for India average grid).
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Scope 3: Lifecycle / WTW</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Well-to-Wheel (WTW) includes upstream crude extraction, refining, transport, plus embodied emissions from vehicle and lithium battery manufacturing. 
                Not conflated with operational carbon.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'factors-table',
      icon: Atom,
      title: '4. Verified Emission Factors & Academic Citations',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            The table below documents the verified fuel emission coefficients implemented in TerraTrace Drive, along with their scientific citations:
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Fuel / Energy Source</th>
                  <th className="p-3">Emission Factor</th>
                  <th className="p-3">Accounting Scope</th>
                  <th className="p-3">Standard Reference Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Petrol (Motor Gasoline)</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">2.31 kg CO₂ / litre</td>
                  <td className="p-3">Scope 1 (Tailpipe)</td>
                  <td className="p-3 text-slate-500">IPCC Guidelines for National GHG Inventories / UK DEFRA</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Diesel (Gas Oil)</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">2.68 kg CO₂ / litre</td>
                  <td className="p-3">Scope 1 (Tailpipe)</td>
                  <td className="p-3 text-slate-500">IPCC Guidelines for National GHG Inventories / UK DEFRA</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">CNG (Compressed Natural Gas)</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">2.75 kg CO₂ / kg</td>
                  <td className="p-3">Scope 1 (Tailpipe)</td>
                  <td className="p-3 text-slate-500">ARAI India Fuel Specifications / DEFRA Conversion Standards</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Grid Electricity (EV Charging)</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">0.82 kg CO₂ / kWh</td>
                  <td className="p-3">Scope 2 (Indirect Generation)</td>
                  <td className="p-3 text-slate-500">Central Electricity Authority (CEA) India CO₂ Baseline Database v19</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 'double-counting-prevention',
      icon: ShieldCheck,
      title: '5. Prevention of Double-Counting',
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            A common error in vehicle emissions accounting is simultaneously computing emissions from distance and then adding fuel consumption receipts. 
            TerraTrace Drive enforces strict architectural prevention:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Exclusive Method Evaluation:</strong> In <em>Distance & Efficiency</em> mode, fuel consumed is derived purely from (Distance ÷ Efficiency); any direct fuel values are bypassed.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Direct Accounting Protection:</strong> In <em>Direct Fuel</em> mode, emissions are calculated strictly from inputted fuel/electricity volume; distance is utilized solely to calculate intensity per kilometre.</span>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-[calc(100vh-140px)]">
      <Container size="default">
        {/* Header */}
        <div className="max-w-3xl mb-10 space-y-3">
          <Badge variant="emerald" size="sm" icon={BookOpen}>
            Scientific Foundation
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Vehicle Emission Methodology & Standards
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Detailed breakdown of mathematical formulas, mobile combustion factors, and accounting scopes implemented in TerraTrace Drive.
          </p>
        </div>

        {/* Sections Stack */}
        <div className="space-y-6 max-w-4xl">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Card key={sec.id} id={sec.id} className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-2xs">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {sec.title}
                    </h2>
                  </div>
                  <div>
                    {sec.content}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Reference Attribution */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 max-w-4xl flex items-start gap-3.5 text-xs text-slate-500">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800 mb-0.5">
              Academic & Environmental Studies Compliance
            </p>
            <p>
              Developed according to IPCC Guidelines for National Greenhouse Gas Inventories (Volume 2: Energy, Chapter 3: Mobile Combustion), UK DEFRA Greenhouse Gas Reporting Conversion Factors, and the Central Electricity Authority (CEA) of India.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
