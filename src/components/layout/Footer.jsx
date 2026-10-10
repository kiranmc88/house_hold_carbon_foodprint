import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Globe, ShieldCheck } from 'lucide-react';
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
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Carbon<span className="text-emerald-400">Wise</span>
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              CarbonWise is a dedicated household carbon footprint estimation platform developed as an 
              <strong> Environmental Studies Activity-Based Learning (ABL) project</strong>. It enables households 
              to quantify monthly emissions in kg CO₂e and annual impact in tonnes CO₂e.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                ABL Project
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Standard CO₂e Metrics
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
                  Footprint Calculator
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-emerald-400 transition-colors">
                  Results Dashboard
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-emerald-400 transition-colors">
                  Recommendations
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="hover:text-emerald-400 transition-colors">
                  Calculation Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Category Scope */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Emission Scopes
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Household Electricity</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>LPG & Cooking Fuels</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Mobility & Transport</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Dietary Footprint</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Solid Waste & Disposal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} CarbonWise. Environmental Studies ABL Project.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Designed for environmental awareness & sustainability education
          </p>
        </div>
      </Container>
    </footer>
  );
}
