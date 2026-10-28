import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Globe, ShieldCheck, Fuel } from 'lucide-react';
import Container from '../common/Container';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const currentYear = CURRENT_YEAR;

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <Container>
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Project Summary */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-white group">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                TerraTrace <span className="text-emerald-400">Drive</span>
              </span>
            </Link>

            <p className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Vehicle Carbon Emission Calculator
            </p>
            
            <p className="text-sm italic text-slate-300 font-medium">
              "Measure Every Journey. Understand Your Impact."
            </p>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              <strong>Development of a Web-Based Vehicle Carbon Emission Calculator and Environmental Impact Analysis System.</strong> An Environmental Studies project dedicated to estimating vehicle-related carbon dioxide emissions using real-world vehicle specifications, fuel consumption, distance travelled, and verified emission factors.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                Environmental Studies Project
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                IPCC & DEFRA Standards
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                Dual Calculation Engines
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-emerald-400 transition-colors">
                  Vehicle Calculator
                </Link>
              </li>
              <li>
                <Link to="/survey" className="hover:text-emerald-400 transition-colors">
                  Vehicle Usage Survey
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-emerald-400 transition-colors">
                  Results Dashboard
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="hover:text-emerald-400 transition-colors">
                  Vehicle Comparison
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-emerald-400 transition-colors">
                  Environmental Recommendations
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="hover:text-emerald-400 transition-colors">
                  Calculation Methodology
                </Link>
              </li>
              <li>
                <Link to="/user-manual" className="hover:text-emerald-400 transition-colors text-emerald-400/90 font-medium">
                  User Manual & Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Categories & Scopes */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Vehicle Scopes
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Passenger Cars (Petrol, Diesel, CNG, EV)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Motorcycles & Scooters (Petrol & EV)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Public Transit & City Buses</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Distance & Efficiency Modeling</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Direct Fuel & Energy Accounting</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} TerraTrace Drive. Environmental Studies Academic Project.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Dedicated to vehicle emissions quantification & decarbonization analysis
          </p>
        </div>
      </Container>
    </footer>
  );
}
