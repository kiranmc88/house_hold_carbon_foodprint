import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Car, 
  Menu, 
  X, 
  Calculator, 
  BarChart3, 
  Lightbulb, 
  BookOpen, 
  ChevronRight,
  GitCompare,
  Gauge,
  ClipboardList,
  HelpCircle
} from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Gauge },
    { name: 'Vehicle Calculator', path: '/calculator', icon: Calculator },
    { name: 'Vehicle Usage Survey', path: '/survey', icon: ClipboardList },
    { name: 'Results Dashboard', path: '/results', icon: BarChart3 },
    { name: 'Vehicle Comparison', path: '/comparison', icon: GitCompare },
    { name: 'Recommendations', path: '/recommendations', icon: Lightbulb },
    { name: 'Methodology', path: '/methodology', icon: BookOpen },
    { name: 'User Manual', path: '/user-manual', icon: HelpCircle },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <Container>
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="TerraTrace Drive Home"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                TerraTrace <span className="text-emerald-600 font-extrabold">Drive</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 -mt-1">
                Vehicle Carbon Calculator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 py-1.5 xl:py-2 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 opacity-80 shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              to="/calculator"
              variant="primary"
              size="sm"
              icon={ChevronRight}
              iconPosition="right"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              Calculate Emissions
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Button
              to="/calculator"
              variant="primary"
              size="md"
              className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={closeMobileMenu}
              icon={ChevronRight}
              iconPosition="right"
            >
              Calculate Emissions
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
