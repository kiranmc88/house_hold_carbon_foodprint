import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Printer,
  ArrowUp,
  Calculator,
  BarChart3,
  GitCompare,
  Lightbulb,
  ClipboardList,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Fuel,
  Gauge,
  Layers,
  Users,
  Trash2,
  HelpCircle,
  Compass,
  Home as HomeIcon,
  X
} from 'lucide-react';
import Container from '../components/common/Container';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

// Sections definition for Table of Contents and Navigation
const manualSections = [
  { id: 'section-1', shortTitle: '1. Overview', title: 'Section 1: Project Overview & Academic Mission', icon: Compass, keywords: 'overview purpose environmental studies activity-based learning abl capabilities' },
  { id: 'section-2', shortTitle: '2. Getting Started', title: 'Section 2: Getting Started & Navigation', icon: Compass, keywords: 'getting started navigation preparation odometer fuel economy' },
  { id: 'section-3', shortTitle: '3. Home Page', title: 'Section 3: Home Page Walkthrough', icon: HomeIcon, keywords: 'homepage home features three-tier calculate understand reduce' },
  { id: 'section-4', shortTitle: '4. Calculator', title: 'Section 4: Vehicle Carbon Calculator & Formulas', icon: Calculator, keywords: 'calculator method a method b formula distance efficiency 600 km 15 km/l 2.3149 worked petrol example ev electric validation' },
  { id: 'section-5', shortTitle: '5. Results', title: 'Section 5: Results Dashboard & Fleet Breakdown', icon: BarChart3, keywords: 'results monthly co2 annual tonnes fuel consumed intensity multi-vehicle fleet breakdown' },
  { id: 'section-6', shortTitle: '6. Comparison', title: 'Section 6: Vehicle Powertrain Comparison Page', icon: GitCompare, keywords: 'comparison powertrain baseline petrol car diesel cng electric scooter bus slider 5000 km' },
  { id: 'section-7', shortTitle: '7. Survey Form', title: 'Section 7: Vehicle Usage Survey (Field Study)', icon: ClipboardList, keywords: 'survey form participant category vehicle age commute distance calculator consent live preview unsupported combinations' },
  { id: 'section-8', shortTitle: '8. Survey Dashboard', title: 'Section 8: Survey Analytics Dashboard & KPIs', icon: BarChart3, keywords: 'dashboard analytics kpi sample size n avg monthly distance avg emissions scope 1 scope 2 vehicle distribution fuel distribution cross-tabulation log csv export demo benchmark' },
  { id: 'section-9', shortTitle: '9. Recommendations', title: 'Section 9: Decarbonization Recommendations', icon: Lightbulb, keywords: 'recommendations eco-driving tire pressure maintenance transit ev switching carpooling' },
  { id: 'section-10', shortTitle: '10. Methodology', title: 'Section 10: Scientific Methodology & Emission Factors', icon: BookOpen, keywords: 'methodology emission factors ipcc defra cea india baseline 2.3149 2.6878 2.7500 0.8200 scope 1 scope 2 scope 3 lifecycle operational double-counting' },
  { id: 'section-11', shortTitle: '11. Privacy & Storage', title: 'Section 11: Privacy, Local Storage & Data Handling', icon: ShieldCheck, keywords: 'privacy localstorage terratrace_vehicle_survey_actual terratrace_vehicle_survey_demo cross-device synchronization pii cache' },
  { id: 'section-12', shortTitle: '12. Troubleshooting', title: 'Section 12: Troubleshooting Guide & FAQ', icon: HelpCircle, keywords: 'troubleshooting faq distance validation negative values unsupported combinations empty results csv export sync tailpipe annualization' },
  { id: 'section-routes', shortTitle: 'Route Index', title: 'Application Route & Dashboard Reference Directory', icon: Layers, keywords: 'routes / /calculator /results /comparison /survey /recommendations /methodology /user-manual controls outputs limitations' },
];

export default function UserManual() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('section-1');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState({
    faq_1: true, // open first by default
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  const filteredSections = manualSections.filter((sec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.keywords.toLowerCase().includes(q) ||
      sec.shortTitle.toLowerCase().includes(q)
    );
  });

  const isSectionVisible = (id) => {
    if (!searchQuery.trim()) return true;
    return filteredSections.some((s) => s.id === id);
  };

  // Monitor scroll for "Back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active section based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: '-90px 0px -60% 0px', threshold: 0 }
    );

    const sectionElements = document.querySelectorAll('section[id^="section-"]');
    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredSections]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFaq = (id) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllFaqs = (expand) => {
    const all = {};
    for (let i = 1; i <= 10; i++) {
      all[`faq_${i}`] = expand;
    }
    setExpandedFaqs(all);
  };

  return (
    <div className="py-8 sm:py-14 bg-slate-50 min-h-screen">
      <Container size="default">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-emerald-700 flex items-center gap-1 transition-colors">
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-semibold">User Manual & Help Center</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Printer}
              iconPosition="left"
              onClick={handlePrint}
              className="text-xs bg-white shadow-2xs hover:bg-slate-50 border-slate-200 text-slate-700"
            >
              Print / Save as PDF
            </Button>
            <Button
              to="/"
              variant="secondary"
              size="sm"
              icon={HomeIcon}
              iconPosition="left"
              className="text-xs"
            >
              Back to Home
            </Button>
          </div>
        </div>

        {/* Header Hero */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-md relative overflow-hidden border border-slate-700 w-full">
          <div className="max-w-4xl space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald" size="sm" icon={BookOpen}>
                Official Documentation & Help Center
              </Badge>
              <Badge variant="blue" size="sm" icon={ShieldCheck}>
                Environmental Studies ABL Project
              </Badge>
              <span className="text-xs font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                v1.0 Standard Edition
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              TerraTrace Drive User Manual
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              Complete, interactive operational reference manual for the TerraTrace Drive Vehicle Carbon Emission Calculator and Environmental Impact Analysis System.
              Learn how to operate each page, understand mathematical formulations, enter valid parameters, interpret real-time emissions analytics, and export research survey datasets.
            </p>

            {/* Live Search Bar */}
            <div className="pt-3 print:hidden max-w-2xl w-full">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search manual (e.g., Method A, 600 km, Scope 2, CSV export, validation, EV charging)..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all"
                  aria-label="Search User Manual"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="text-[11px] text-emerald-300 mt-1.5 flex items-center justify-between">
                  <span>Filtering manual for: <strong>"{searchQuery}"</strong></span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="underline text-slate-300 hover:text-white cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid: Sticky Sidebar TOC + Content Area */}
        <div className="manual-layout grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)] gap-6 lg:gap-8 items-start w-full">
          {/* Left Sidebar: Table of Contents */}
          <aside className="manual-sidebar w-full min-w-0 print:hidden">
            <div className="relative md:sticky md:top-22 space-y-4">
              <Card className="p-4 bg-white border-slate-200/90 shadow-2xs space-y-3">
                <div className="border-b border-slate-100 pb-2.5">
                  <button
                    type="button"
                    onClick={() => setMobileTocOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between text-left cursor-pointer md:cursor-default"
                    aria-expanded={mobileTocOpen}
                    aria-label="Toggle Table of Contents"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Table of Contents</span>
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold">{filteredSections.length} Sections</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 md:hidden ${
                          mobileTocOpen ? 'rotate-180 text-emerald-600' : ''
                        }`}
                      />
                    </div>
                  </button>
                </div>

                <div className={`${mobileTocOpen ? 'block' : 'hidden'} md:block space-y-3`}>
                  <nav className="space-y-1 text-xs max-h-[60vh] md:max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                    {filteredSections.length === 0 ? (
                      <div className="py-4 text-center text-slate-500 space-y-1">
                        <p>No matching sections.</p>
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="text-xs text-emerald-700 font-semibold underline cursor-pointer"
                        >
                          Reset search
                        </button>
                      </div>
                    ) : (
                      filteredSections.map((sec) => {
                        const Icon = sec.icon;
                        const isActive = activeSection === sec.id;
                        return (
                          <a
                            key={sec.id}
                            href={`#${sec.id}`}
                            onClick={() => {
                              setActiveSection(sec.id);
                              setMobileTocOpen(false);
                            }}
                            className={`flex items-start gap-2 px-2.5 py-2 rounded-lg font-medium transition-colors ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-800 font-bold border-l-2 border-emerald-600'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0 opacity-70 mt-0.5" />
                            <span className="leading-snug break-words">{sec.shortTitle}</span>
                          </a>
                        );
                      })
                    )}
                  </nav>

                  <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 shrink-0" />
                      <span>Printable Reference</span>
                    </button>
                    <Link
                      to="/calculator"
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors text-center"
                    >
                      <Calculator className="w-3.5 h-3.5 shrink-0" />
                      <span>Open Calculator</span>
                    </Link>
                  </div>
                </div>
              </Card>

              {/* Quick Specs Quickcard */}
              <Card className="p-4 bg-emerald-950 text-white border-emerald-900 text-xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Standard Fuel Factors</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px] text-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Petrol:</span>
                    <span className="text-emerald-300 font-bold">2.3149 kg CO₂/L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Diesel:</span>
                    <span className="text-emerald-300 font-bold">2.6878 kg CO₂/L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CNG:</span>
                    <span className="text-emerald-300 font-bold">2.7500 kg CO₂/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Electricity:</span>
                    <span className="text-amber-300 font-bold">0.8200 kg CO₂e/kWh</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-emerald-900 leading-normal">
                  IPCC Vol 2 Mobile Combustion, UK DEFRA 2023, and CEA India Grid Baseline v19.
                </p>
              </Card>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <article className="manual-content w-full min-w-0 space-y-10 sm:space-y-14">
            {searchQuery && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <span>Showing <strong>{filteredSections.length}</strong> matching sections for <strong>"{searchQuery}"</strong></span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="font-bold underline cursor-pointer text-emerald-800"
                >
                  Clear search
                </button>
              </div>
            )}

            {searchQuery && filteredSections.length === 0 && (
              <Card className="p-8 text-center bg-white border-slate-200">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h3 className="font-bold text-slate-900 text-base">No sections matched "{searchQuery}"</h3>
                <p className="text-xs text-slate-500 mt-1">Try searching for "Method A", "600 km", "Scope 2", "Survey", or "CSV".</p>
                <div className="pt-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search Filter
                  </Button>
                </div>
              </Card>
            )}

            {/* ========================================================================= */}
            {/* SECTION 1: PROJECT OVERVIEW */}
            {/* ========================================================================= */}
            <section id="section-1" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-1') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="emerald" size="sm">Section 1</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Project Overview & Academic Mission
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">Route: /</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-4 text-sm text-slate-700 leading-relaxed shadow-xs">
                <h3 className="text-base font-bold text-slate-900">
                  What is TerraTrace Drive?
                </h3>
                <p>
                  <strong>TerraTrace Drive</strong> is a web-based vehicular greenhouse gas accounting and environmental impact analysis system. 
                  Developed as part of the <strong>Environmental Studies Activity-Based Learning (ABL) project</strong>, the platform equips students, researchers, faculty, and everyday motorists with transparent, scientifically verified computational tools to quantify operational carbon dioxide (CO₂) emissions resulting from motorized road transport.
                </p>

                <h3 className="text-base font-bold text-slate-900 pt-2">
                  Purpose & Educational Objective
                </h3>
                <p>
                  Road transport is one of the largest and fastest-growing sources of global anthropogenic greenhouse gases. 
                  The primary purpose of TerraTrace Drive is to transform abstract environmental concepts into tangible, quantifiable metrics. 
                  By calculating exact monthly kilogram (kg CO₂) and annualized metric tonne (tonnes CO₂) values, the platform empowers users to evaluate the climate consequence of individual commuting choices, compare diverse powertrains (internal combustion vs. electric), and design data-driven decarbonization strategies.
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Core Capabilities of TerraTrace Drive
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Dual-Method Engine:</strong> Distance & efficiency modeling and direct fuel/kWh accounting.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Multi-Vehicle Fleets:</strong> Add, configure, and aggregate emissions across multiple family or commercial vehicles.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Real-World Survey:</strong> Anonymous field-study intake for campus travel pattern research.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Interactive Analytics:</strong> Real-time cross-tabulation, vehicle distributions, and RFC 4180 CSV dataset export.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Side-by-Side Comparison:</strong> Dynamic mileage simulation across 7 distinct vehicle profiles and powertrains.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Strict Scope Isolation:</strong> Clear boundaries separating Scope 1 tailpipe from Scope 2 power generation.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>Important Distinction: Single Calculation vs. Survey Field Observations</span>
                  </div>
                  <p>
                    <strong>The Personal Vehicle Calculator (/calculator)</strong> is an individualized modeling workspace where you configure your vehicle parameters (or multi-vehicle household fleet) to evaluate personal carbon footprint metrics, test alternative fuels, and review tailored decarbonization recommendations.
                  </p>
                  <p>
                    <strong>The Vehicle Usage Survey (/survey)</strong> is an empirical data collection instrument. Submissions are saved anonymously to local browser storage to assemble a sample cohort dataset (N responses) visualized on the Analytics Dashboard and exportable for academic research.
                  </p>
                </div>
              </Card>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 2: GETTING STARTED */}
            {/* ========================================================================= */}
            <section id="section-2" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-2') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="blue" size="sm">Section 2</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Getting Started & Navigation
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Navigation Guide</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-5 text-sm text-slate-700 leading-relaxed shadow-xs">
                <h3 className="text-base font-bold text-slate-900">
                  How to Access & Navigate TerraTrace Drive
                </h3>
                <p>
                  TerraTrace Drive is accessible directly through any standard desktop, tablet, or smartphone web browser. 
                  The top navigation bar provides instant access to all primary pages and tools:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-slate-700" />
                      Home (/)
                    </span>
                    <p className="text-slate-600">Executive project overview, core methodology highlights, three-tier framework, and quick launch entry points.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                      Vehicle Calculator (/calculator)
                    </span>
                    <p className="text-slate-600">Two-step multi-vehicle calculation wizard with dual-method support and live preview.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                      Vehicle Usage Survey (/survey)
                    </span>
                    <p className="text-slate-600">Empirical ABL field study form, dual-mode storage (Actual vs. Demo), and research analytics dashboard.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
                      Results Dashboard (/results)
                    </span>
                    <p className="text-slate-600">Detailed carbon metrics, multi-vehicle fleet breakdown, verified factor citations, and alternatives comparison.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <GitCompare className="w-3.5 h-3.5 text-amber-600" />
                      Vehicle Comparison (/comparison)
                    </span>
                    <p className="text-slate-600">Interactive mileage slider to evaluate 7 powertrains and compute annual carbon savings against the petrol baseline.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-teal-600" />
                      Recommendations (/recommendations)
                    </span>
                    <p className="text-slate-600">6 high-impact decarbonization strategies spanning eco-driving, maintenance, transit, and EV switching.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      Methodology (/methodology)
                    </span>
                    <p className="text-slate-600">Scientific equations, emissions boundaries, IPCC/DEFRA/CEA standard factors, and double-counting prevention.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                      User Manual (/user-manual)
                    </span>
                    <p className="text-slate-600">This interactive guide, step-by-step instructions, formulas, troubleshooting, and route documentation.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    What Information to Prepare Before Calculating
                  </h4>
                  <p className="text-xs text-slate-600">
                    To achieve maximum calculation accuracy, have the following parameters ready:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700">
                    <li><strong>Vehicle Classification:</strong> Car, Motorcycle, Scooter, Bus, or Other Light Utility.</li>
                    <li><strong>Powertrain Fuel Type:</strong> Petrol, Diesel, CNG (Compressed Natural Gas), or Battery Electric (EV).</li>
                    <li><strong>Monthly Travel Distance (km):</strong> Estimated from your daily round-trip commute (e.g. 25 km/day × 24 days = 600 km/month) or odometer logs.</li>
                    <li><strong>Fuel Economy / Efficiency:</strong> Tested or real-world efficiency (km/L for liquid fuels, km/kg for CNG, km/kWh for electric vehicles).</li>
                    <li><em>(Alternatively for Method B):</em> <strong>Actual Monthly Fuel Volume or Energy:</strong> Total litres purchased, kg of CNG, or kWh charged from utility bills.</li>
                  </ol>
                </div>
              </Card>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 3: HOME PAGE */}
            {/* ========================================================================= */}
            <section id="section-3" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-3') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="emerald" size="sm">Section 3</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Home Page Walkthrough
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Route: /</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-5 text-sm text-slate-700 leading-relaxed shadow-xs">
                <p>
                  The TerraTrace Drive homepage (<code>Home.jsx</code>) serves as the primary gateway to the application. 
                  Every section on the homepage is engineered to guide users smoothly toward emission measurement and scientific literacy:
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-sm text-slate-900">1. Hero Section & Entry Points</h4>
                    <p className="text-xs text-slate-600">
                      Features the project subtitle <em>"Development of a Web-Based Vehicle Carbon Emission Calculator and Environmental Impact Analysis System"</em> and the guiding ethos: <strong>"Measure Every Journey. Understand Your Impact."</strong>
                      Provides three direct action buttons:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
                      <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-md">Launch Vehicle Calculator (/calculator)</span>
                      <span className="bg-white border border-slate-300 text-slate-700 px-2.5 py-1 rounded-md">Vehicle Usage Survey (/survey)</span>
                      <span className="bg-white border border-slate-300 text-slate-700 px-2.5 py-1 rounded-md">Compare Powertrains (/comparison)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-sm text-slate-900">2. Three-Tier Vehicle Impact Analysis Cards</h4>
                    <p className="text-xs text-slate-600">
                      Outlines the three sequential phases of environmental impact management:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <strong className="text-emerald-700 block">Phase 1: Calculate Emissions</strong>
                        <span className="text-slate-500">Dual calculation models with zero double-counting.</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <strong className="text-blue-700 block">Phase 2: Real-World Analytics</strong>
                        <span className="text-slate-500">Transparent IPCC & DEFRA factors with per-km intensities.</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <strong className="text-amber-800 block">Phase 3: Optimize & Decarbonize</strong>
                        <span className="text-slate-500">Actionable eco-driving, maintenance, and modal shifts.</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-sm text-slate-900">3. Scientific Methodology Section & Formula Cards</h4>
                    <p className="text-xs text-slate-600">
                      Explains the difference between Method 1 (Direct Fuel Accounting) and Method 2 (Distance & Efficiency Modeling), followed by a 3-step procedural guide (Select Vehicle & Fuel → Provide Travel Metrics → Review & Decarbonize) and a link to the detailed methodology page.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-sm text-slate-900">4. Activity-Based Learning (ABL) Survey Callout Banner</h4>
                    <p className="text-xs text-slate-600">
                      A distinctive dark emerald banner inviting students and community members to contribute anonymous travel observations to the ongoing environmental field study. Clicking <em>"Take the Survey"</em> directs users straight to <code>/survey</code>.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 4: VEHICLE CARBON CALCULATOR */}
            {/* ========================================================================= */}
            <section id="section-4" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-4') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="emerald" size="sm">Section 4</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Vehicle Carbon Calculator & Formulas
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Route: /calculator</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Multi-Step Wizard Workflow
                  </h3>
                  <p>
                    The Vehicle Carbon Calculator (<code>Calculator.jsx</code>) operates as a guided two-step wizard, preventing overwhelming single-page forms while maintaining complete multi-vehicle fleet support:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 mt-2">
                    <li><strong>Section 1: Vehicle Details:</strong> Vehicle Name/Nickname (optional), Registration Year (optional dropdown), Vehicle Type selector, Fuel/Powertrain selector, and Monthly Distance Travelled (km).</li>
                    <li><strong>Section 2: Fuel & Efficiency:</strong> Calculation Method selection (Method A vs. Method B), Fuel Efficiency input (for Method A) or Actual Fuel/kWh Consumption (for Method B), and Live Preview with double-counting safeguard.</li>
                  </ul>
                </div>

                {/* Mathematical Formulation Cards */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Mathematical Formulations Implemented
                  </h3>

                  {/* Method A */}
                  <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        Method A: Distance & Efficiency Modeling
                      </span>
                      <Badge variant="emerald" size="sm">Default Mode</Badge>
                    </div>

                    <p className="text-xs text-slate-300">
                      Applicable when monthly odometer distance (km) and tested vehicle fuel economy are known:
                    </p>

                    <div className="bg-slate-800 p-3 rounded-xl font-mono text-xs sm:text-sm text-center text-emerald-300 space-y-1">
                      <div>Fuel Consumed (L or kg) = Distance Travelled (km) ÷ Fuel Efficiency (km/L or km/kg)</div>
                      <div className="text-white font-bold">Monthly Emissions (kg CO₂) = Fuel Consumed × Applicable Emission Factor</div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                      <strong className="text-emerald-400">Electric Vehicle (EV) Formulation:</strong>
                      <div className="bg-slate-800/80 p-2.5 rounded-lg font-mono text-[11px] text-amber-200">
                        Electricity Consumed (kWh) = Distance Travelled (km) ÷ Energy Efficiency (km/kWh)<br />
                        Scope 2 Emissions (kg CO₂e) = Electricity Consumed (kWh) × Grid Factor (0.82 kg CO₂e/kWh)
                      </div>
                    </div>
                  </div>

                  {/* Method B */}
                  <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                        Method B: Direct Actual Consumption Accounting
                      </span>
                      <Badge variant="blue" size="sm">Direct Accounting</Badge>
                    </div>

                    <p className="text-xs text-slate-300">
                      Applicable when exact monthly fuel purchases (receipts) or EV charging bills are available:
                    </p>

                    <div className="bg-slate-800 p-3 rounded-xl font-mono text-xs sm:text-sm text-center text-blue-300 space-y-1">
                      <div>Monthly Emissions (kg CO₂) = Actual Fuel or Electricity Consumed × Applicable Emission Factor</div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                      <p>
                        <strong>Key Scientific Rule:</strong> In Method B, <em>fuel efficiency is not required</em> to calculate total emissions, because total fuel consumed is already explicitly known.
                      </p>
                      <p>
                        <strong>Distance Usage in Method B:</strong> Distance is strictly optional. If provided, distance is utilized solely to calculate normalized emissions intensity (<code>g CO₂/km</code>). It does <em>not</em> alter or duplicate total fuel consumption.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Worked Petrol Vehicle Example Card */}
                <div className="p-6 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-5 h-5 text-emerald-700" />
                      <h4 className="font-bold text-emerald-950 text-base">
                        Worked Example: Petrol Passenger Car (Method A)
                      </h4>
                    </div>
                    <Badge variant="emerald" size="sm">Standard Demonstration</Badge>
                  </div>

                  <p className="text-xs text-emerald-900">
                    The following step-by-step example demonstrates the exact calculation performed by TerraTrace Drive using configured project constants:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-emerald-200">
                      <span className="text-slate-500 block">Monthly Distance</span>
                      <strong className="text-slate-900 text-sm">600 km</strong>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200">
                      <span className="text-slate-500 block">Fuel Efficiency</span>
                      <strong className="text-slate-900 text-sm">15 km / litre</strong>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200">
                      <span className="text-slate-500 block">Petrol Emission Factor</span>
                      <strong className="text-emerald-700 text-sm">2.3149 kg CO₂ / L</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-slate-800 space-y-2">
                    <div>
                      <span className="text-slate-500">Step 1 — Calculate Fuel Consumed:</span><br />
                      <strong>Fuel consumed = 600 km ÷ 15 km/L = 40.000 Litres</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Step 2 — Calculate Monthly Emissions:</span><br />
                      <strong>Monthly emissions = 40 L × 2.3149 kg CO₂/L = 92.596 kg CO₂</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Step 3 — Annualize Projected Emissions (12 months):</span><br />
                      <strong>Annualized emissions = 92.596 kg CO₂ × 12 = 1,111.152 kg CO₂ (= 1.111 tonnes CO₂)</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Step 4 — Calculate Emissions Intensity:</span><br />
                      <strong>Intensity = (92.596 kg ÷ 600 km) × 1,000 = 154.33 g CO₂ / km</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-800 italic">
                    * Clearly labeled: This is an illustrative calculation demonstrating the exact mathematical pipeline and UK DEFRA / IPCC factor applied by the codebase.
                  </p>
                </div>

                {/* Input Validation & Resolution */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Input Validation Rules & Error Resolution
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>
                      <strong>"Monthly distance travelled must be greater than 0 km":</strong> Triggered in Step 1 or Method A if the distance input is left empty, zero, or negative. <em>Resolution:</em> Enter a positive distance (e.g., 600).
                    </li>
                    <li>
                      <strong>"Fuel efficiency must be greater than 0":</strong> Triggered in Method A if efficiency is zero, blank, or negative (which would cause division by zero). <em>Resolution:</em> Enter a valid rating (e.g., 15 for cars, 42 for motorcycles).
                    </li>
                    <li>
                      <strong>"Please enter a valid monthly consumption greater than 0":</strong> Triggered in Method B if fuel or kWh volume is missing. <em>Resolution:</em> Enter your monthly fuel litres, CNG kg, or EV charging kWh.
                    </li>
                    <li>
                      <strong>Fleet Multi-Vehicle Validation:</strong> If you have added multiple vehicles, clicking <em>"Calculate Emissions"</em> automatically validates each vehicle in order. If vehicle 2 has an error, the tab switches to vehicle 2 and highlights the required field.
                    </li>
                  </ul>
                </div>
              </Card>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 5: RESULTS PAGE */}
            {/* ========================================================================= */}
            <section id="section-5" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-5') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="blue" size="sm">Section 5</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Results Dashboard & Fleet Breakdown
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Route: /results</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-5 text-sm text-slate-700 leading-relaxed shadow-xs">
                <p>
                  The Results Dashboard (<code>Results.jsx</code>) renders the full environmental accounting report computed by the calculation engine. 
                  Every metric, card, and action button displayed on the page has an exact purpose:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900">Monthly CO₂ Emissions (kg)</span>
                    <p className="text-slate-600">The primary operational footprint generated during one typical month of travel for the configured distance.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900">Annual Projected CO₂ (tonnes & kg)</span>
                    <p className="text-slate-600">Projected 12-month footprint (Monthly × 12 ÷ 1,000). <em>Assumption:</em> Assumes consistent monthly travel habits across all 12 calendar months.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900">Fuel / Energy Consumed</span>
                    <p className="text-slate-600">Displays exact litres (petrol/diesel), kilograms (CNG), or kilowatt-hours (EV charging electricity) consumed per month.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900">Emissions Intensity (g / km)</span>
                    <p className="text-slate-600">Grams of CO₂ released per kilometre. Allows direct comparison against international vehicle emission standards regardless of mileage.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    Multi-Vehicle Fleet Analytics Section
                  </h4>
                  <p className="text-xs text-slate-600">
                    When you calculate for two or more vehicles (e.g. Family Sedan + Daily Commuter Scooter), the dashboard renders a dedicated <strong>Fleet Vehicle Breakdown</strong> card showing:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    <li>Individual monthly emissions (kg CO₂) and annual impact (tonnes) for each vehicle.</li>
                    <li>Individual fuel/energy consumed and calculation method applied.</li>
                    <li>Visual progress share bar displaying each vehicle's percentage contribution to total household vehicular footprint.</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    Vehicle Accounting & Factor Reference Cards
                  </h4>
                  <p className="text-xs text-slate-600">
                    The lower half of the page details the exact parameters utilized: Vehicle Category & Nickname, Registration Year, Fuel/Powertrain, Calculation Method, Fuel Economy, Applied Emission Factor with its publication source, and a <strong>Scope Clarification</strong> callout explaining whether emissions are Scope 1 (tailpipe) or Scope 2 (grid electricity).
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900">
                    Available Action Controls
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800">
                      <strong>Start New:</strong> Resets all vehicle data and returns to calculator.
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800">
                      <strong>Edit Inputs:</strong> Returns to calculator keeping current inputs intact.
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800">
                      <strong>Contribute to Survey:</strong> Navigates to /survey to submit anonymous study data.
                    </div>
                    <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900">
                      <strong>View Recommendations:</strong> Opens /recommendations for reduction tips.
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 6: VEHICLE COMPARISON PAGE */}
            {/* ========================================================================= */}
            <section id="section-6" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-6') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="amber" size="sm">Section 6</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Vehicle Powertrain Comparison Page
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Route: /comparison</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-5 text-sm text-slate-700 leading-relaxed shadow-xs">
                <p>
                  The Vehicle Comparison page (<code>Comparison.jsx</code>) allows side-by-side evaluation of 7 standardized vehicle profiles across identical travel distances:
                </p>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Vehicle Profile</th>
                        <th className="p-2.5">Powertrain</th>
                        <th className="p-2.5">Efficiency</th>
                        <th className="p-2.5">Emission Factor</th>
                        <th className="p-2.5">Scope</th>
                        <th className="p-2.5">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr className="bg-slate-50/60 font-semibold">
                        <td className="p-2.5">Petrol Passenger Car</td>
                        <td className="p-2.5">Petrol</td>
                        <td className="p-2.5">15 km/L</td>
                        <td className="p-2.5">2.3149 kg CO₂/L</td>
                        <td className="p-2.5">Scope 1 Tailpipe</td>
                        <td className="p-2.5"><Badge variant="slate" size="sm">Baseline</Badge></td>
                      </tr>
                      <tr>
                        <td className="p-2.5">Diesel Passenger Car</td>
                        <td className="p-2.5">Diesel</td>
                        <td className="p-2.5">18 km/L</td>
                        <td className="p-2.5">2.6878 kg CO₂/L</td>
                        <td className="p-2.5">Scope 1 Tailpipe</td>
                        <td className="p-2.5">Comparison</td>
                      </tr>
                      <tr>
                        <td className="p-2.5">CNG Passenger Car</td>
                        <td className="p-2.5">CNG</td>
                        <td className="p-2.5">22 km/kg</td>
                        <td className="p-2.5">2.7500 kg CO₂/kg</td>
                        <td className="p-2.5">Scope 1 Tailpipe</td>
                        <td className="p-2.5">Comparison</td>
                      </tr>
                      <tr>
                        <td className="p-2.5">Electric Car (EV)</td>
                        <td className="p-2.5">Grid Electricity</td>
                        <td className="p-2.5">7.0 km/kWh</td>
                        <td className="p-2.5">0.8200 kg CO₂e/kWh</td>
                        <td className="p-2.5">Scope 2 Grid</td>
                        <td className="p-2.5">Comparison</td>
                      </tr>
                      <tr>
                        <td className="p-2.5">Petrol Motorcycle</td>
                        <td className="p-2.5">Petrol</td>
                        <td className="p-2.5">42 km/L</td>
                        <td className="p-2.5">2.3149 kg CO₂/L</td>
                        <td className="p-2.5">Scope 1 Tailpipe</td>
                        <td className="p-2.5">Comparison</td>
                      </tr>
                      <tr>
                        <td className="p-2.5">Electric Scooter (EV)</td>
                        <td className="p-2.5">Grid Electricity</td>
                        <td className="p-2.5">30.0 km/kWh</td>
                        <td className="p-2.5">0.8200 kg CO₂e/kWh</td>
                        <td className="p-2.5">Scope 2 Grid</td>
                        <td className="p-2.5">Comparison</td>
                      </tr>
                      <tr>
                        <td className="p-2.5">City Transit Bus (Passenger Share)</td>
                        <td className="p-2.5">Diesel/CNG Shared</td>
                        <td className="p-2.5">Shared Transit</td>
                        <td className="p-2.5">0.035 kg CO₂/km</td>
                        <td className="p-2.5">Scope 1 Shared</td>
                        <td className="p-2.5">Comparison</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    Controls & Interpretation
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li>
                      <strong>Distance Slider & Numeric Input:</strong> Users can dynamically adjust the simulated monthly travel distance from 50 km up to 5,000 km (slider runs from 100 to 3,000 km in 50 km increments). All 7 profiles recalculate in real time.
                    </li>
                    <li>
                      <strong>Baseline Benchmark:</strong> The standard 15 km/L petrol car serves as the comparative reference point. Each alternative card displays a badge showing percentage reduction (e.g., <code>↓ 55% Less CO₂</code>) and calculated annual tonnes of CO₂ saved.
                    </li>
                    <li>
                      <strong>Why Comparisons Vary:</strong> Differences stem from thermal efficiency differences, drivetrain characteristics, physical fuel carbon density, and grid electricity intensity.
                    </li>
                    <li>
                      <strong>Scientific Disclaimer:</strong> Values are engineering estimates based on standard representative test cycles (ARAI/WLTP/DEFRA) rather than universal on-road vehicle measurements.
                    </li>
                  </ul>
                </div>
              </Card>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 7: VEHICLE USAGE SURVEY */}
            {/* ========================================================================= */}
            <section id="section-7" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-7') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="emerald" size="sm">Section 7</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Vehicle Usage Survey (Field Study)
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Route: /survey (Tab 1)</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-5 text-sm text-slate-700 leading-relaxed shadow-xs">
                <p>
                  The Vehicle Usage Survey (<code>Survey.jsx</code>) collects real-world empirical travel activity data for the Environmental Studies Activity-Based Learning project. 
                  Every field and control in the survey form is documented below:
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                      1. Participant Category (Anonymous Affiliation)
                    </h4>
                    <p className="text-xs text-slate-600">
                      Options: <strong>Student</strong>, <strong>Staff</strong>, <strong>Faculty</strong>, <strong>Community Member</strong>, or <strong>Other</strong>.
                      Classifies travel cohorts without collecting personal names or student/employee ID numbers.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                      2. Vehicle Classification & Powertrain
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li><strong>Vehicle Type:</strong> Car, Motorcycle, Scooter, Public Transit Bus, or Other Light Vehicle.</li>
                      <li><strong>Fuel / Powertrain Type:</strong> Petrol, Diesel, CNG, or Electric (EV).</li>
                      <li><strong>Vehicle Age (Optional):</strong> Not specified, Under 2 years, 2–5 years, 6–10 years, Over 10 years.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Rejection of Unsupported Vehicle/Fuel Combinations</span>
                    </div>
                    <p>
                      TerraTrace Drive rejects scientifically unverified vehicle/fuel configurations rather than silently substituting default factors. If an invalid pairing is chosen:
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-amber-900 font-medium">
                      <li><strong>Motorcycle + Diesel:</strong> Commercial diesel motorcycles are not standard production vehicles.</li>
                      <li><strong>Motorcycle + CNG:</strong> Aftermarket CNG motorcycle conversions lack verified factors.</li>
                      <li><strong>Scooter + Diesel:</strong> Diesel commuter scooters are non-existent in commercial production.</li>
                      <li><strong>Scooter + CNG:</strong> CNG commuter scooters lack certified mobile combustion factors.</li>
                      <li><strong>Bus + Petrol:</strong> Transit buses operate exclusively on diesel, CNG, or electric drivetrains.</li>
                    </ul>
                    <p className="text-[11px] text-amber-800">
                      When an unsupported pairing is selected, an explanatory alert appears and the submission button is safely disabled.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                      3. Travel Distance, Calculation Method & Commute Assist
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li><strong>Calculation Formulation:</strong> Choose between Method A (Distance & Efficiency) or Method B (Actual Direct Consumption).</li>
                      <li><strong>Monthly Distance (km):</strong> Accepts any positive integer or decimal distance up to 100,000 km (e.g., 100, 250, 650, 1200, 2500 km).</li>
                      <li><strong>Fuel Efficiency (Method A):</strong> Tested or observed km/L, km/kg, or km/kWh.</li>
                      <li><strong>Actual Consumption (Method B):</strong> Direct physical units consumed (litres, kg, or kWh).</li>
                      <li><strong>Commute Distance Calculator (Optional):</strong> Enter Daily Distance (km) and Days Used Per Month (1–31); click <em>"Calculate Monthly Distance"</em> to auto-populate the monthly field.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                      4. Academic Research Consent Requirement & Live Preview
                    </h4>
                    <p className="text-xs text-slate-600">
                      Users must check the <strong>Academic Research Consent</strong> checkbox confirming voluntary anonymous submission.
                      The sticky <strong>Live Calculation Preview</strong> card computes estimated monthly emissions (kg CO₂e), annual emissions (tonnes), intensity (g/km), and applied factor details in real time before submission.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 8: SURVEY ANALYTICS DASHBOARD */}
            {/* ========================================================================= */}
            <section id="section-8" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-8') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="blue" size="sm">Section 8</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Survey Analytics Dashboard & KPIs
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Route: /survey (Tab 2)</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-5 text-sm text-slate-700 leading-relaxed shadow-xs">
                <p>
                  The Survey Analytics Dashboard (<code>Survey.jsx</code> tab 2) provides empirical cohort analysis computed dynamically via <code>surveyCalculations.js</code>. 
                  Every component displayed is documented below:
                </p>

                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <strong className="text-slate-900 block">Statistical Representativeness Disclosure</strong>
                  <p>
                    The dashboard explicitly notes that sample averages describe only the collected survey records (N responses) stored in the current browser. 
                    In accordance with environmental research principles, these figures should not be extrapolated as representing the entire regional population without controlled stratified sampling.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      1. Valid Sample Size (N)
                    </span>
                    <p className="text-slate-600">Total number of verified responses. Sub-label displays Method A vs. Method B distribution.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-blue-600" />
                      2. Avg Monthly Distance
                    </span>
                    <p className="text-slate-600">Total sample distance divided by sample size N. Sub-label displays total accumulated kilometres.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-amber-600" />
                      3. Avg Monthly Emissions
                    </span>
                    <p className="text-slate-600">Mean monthly emissions across all respondents (kg CO₂e). Sub-label displays total annual sample tonnes.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
                      4. Avg Intensity per KM
                    </span>
                    <p className="text-slate-600">Sample weighted mean emission intensity in grams CO₂e per kilometre (g/km) and kg CO₂e/km.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    Additional Visualizations & Tables
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li>
                      <strong>Scope 1 vs. Scope 2 Boundary Pill Indicator:</strong> Horizontal dual-color proportion bar comparing total direct combustion tailpipe emissions (green) against indirect EV grid charging emissions (amber).
                    </li>
                    <li>
                      <strong>Vehicle-Type Distribution Chart:</strong> Horizontal bars showing respondent counts, percentage share, average monthly mileage, and average emissions by vehicle category.
                    </li>
                    <li>
                      <strong>Fuel/Powertrain Distribution Chart:</strong> Breakdown across petrol, diesel, CNG, and electric powertrains with associated emissions scopes.
                    </li>
                    <li>
                      <strong>Participant Category Comparison Table:</strong> Cross-sectional tabulation detailing sample share, average monthly distance, average monthly CO₂, emissions intensity, dominant vehicle, and dominant fuel for students, staff, faculty, and community members.
                    </li>
                    <li>
                      <strong>Survey Submissions Log:</strong> Chronological log of individual responses with date, category, vehicle, fuel, method, distance, emissions, scope badge, and individual deletion button (<Trash2 className="w-3 h-3 inline text-slate-400" />).
                    </li>
                    <li>
                      <strong>Demonstration Benchmark Controls:</strong> Toggle between <em>Actual Field Observations</em> and <em>Synthetic Benchmark Data</em> (10 standardized educational sample records).
                    </li>
                    <li>
                      <strong>CSV Export:</strong> Triggers an RFC 4180 compliant CSV download of the active dataset (actual or demo).
                    </li>
                  </ul>
                </div>
              </Card>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 9: RECOMMENDATIONS */}
            {/* ========================================================================= */}
            <section id="section-9" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-9') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="teal" size="sm">Section 9</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Decarbonization Recommendations
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Route: /recommendations</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-5 text-sm text-slate-700 leading-relaxed shadow-xs">
                <p>
                  The Recommendations page (<code>Recommendations.jsx</code>) translates numerical carbon calculations into actionable mitigation pathways. 
                  If a user has completed a calculation on <code>/calculator</code>, a personalized banner displays active monthly emissions and reduction potentials.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 flex items-center justify-between">
                      <span>1. Eco-Driving & Speed Management</span>
                      <Badge variant="emerald" size="sm">10–15% Savings</Badge>
                    </span>
                    <p className="text-slate-600">Smooth acceleration, anticipating traffic flow, maintaining 80–90 km/h highway speeds, and avoiding prolonged idling (&gt;20 sec).</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 flex items-center justify-between">
                      <span>2. Tire Pressure & Aerodynamics</span>
                      <Badge variant="blue" size="sm">3–6% Savings</Badge>
                    </span>
                    <p className="text-slate-600">Inspect cold tire PSI bi-weekly (under-inflation by 5 PSI increases fuel burn by 2-3%), and remove empty rooftop racks to eliminate drag.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 flex items-center justify-between">
                      <span>3. Preventative Maintenance & Tuning</span>
                      <Badge variant="amber" size="sm">5–10% Savings</Badge>
                    </span>
                    <p className="text-slate-600">Replace clogged air filters to prevent rich fuel mixtures, use manufacturer-specified oil viscosity, and ensure proper wheel alignment.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 flex items-center justify-between">
                      <span>4. Modal Shift & Mass Transit Integration</span>
                      <Badge variant="emerald" size="sm">40–70% Savings</Badge>
                    </span>
                    <p className="text-slate-600">Substitute 1–2 car commute days per week with metro rail or city buses, utilize park-and-ride hubs, and walk/cycle for trips under 2 km.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 flex items-center justify-between">
                      <span>5. Powertrain Transition & EV Adoption</span>
                      <Badge variant="teal" size="sm">25–50% Savings</Badge>
                    </span>
                    <p className="text-slate-600">Transition urban stop-and-go commuting to battery electric vehicles or e-scooters; charge during solar daylight or off-peak hours.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 flex items-center justify-between">
                      <span>6. Carpooling & Trip Consolidation</span>
                      <Badge variant="purple" size="sm">30–50% Savings</Badge>
                    </span>
                    <p className="text-slate-600">Form workplace carpools to split per-passenger emissions, chain multiple errands into a single circular journey, and avoid single-occupancy gridlock.</p>
                  </div>
                </div>
              </Card>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 10: METHODOLOGY */}
            {/* ========================================================================= */}
            <section id="section-10" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-10') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="indigo" size="sm">Section 10</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Scientific Methodology & Emission Factors
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Route: /methodology</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-5 text-sm text-slate-700 leading-relaxed shadow-xs">
                <p>
                  TerraTrace Drive follows international mobile combustion protocols established by the <strong>Intergovernmental Panel on Climate Change (IPCC)</strong>, the <strong>UK Department for Energy Security and Net Zero (DESNZ / DEFRA)</strong>, and the <strong>Central Electricity Authority (CEA) of India</strong>:
                </p>

                {/* Factor Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Fuel / Energy Type</th>
                        <th className="p-3">Calculation Factor</th>
                        <th className="p-3">Accounting Scope</th>
                        <th className="p-3">Official Citation & Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Petrol (Gasoline)</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">2.3149 kg CO₂ / L</td>
                        <td className="p-3">Scope 1 (Tailpipe)</td>
                        <td className="p-3 text-slate-500">UK DESNZ/DEFRA (2023) & IPCC Guidelines Vol 2 Mobile Combustion</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Diesel (Gas Oil)</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">2.6878 kg CO₂ / L</td>
                        <td className="p-3">Scope 1 (Tailpipe)</td>
                        <td className="p-3 text-slate-500">UK DESNZ/DEFRA (2023) & IPCC Guidelines Vol 2 Mobile Combustion</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">CNG (Methane)</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">2.7500 kg CO₂ / kg</td>
                        <td className="p-3">Scope 1 (Tailpipe)</td>
                        <td className="p-3 text-slate-500">Automotive Research Association of India (ARAI) & DEFRA Conversion Factors</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Grid Electricity (EV)</td>
                        <td className="p-3 font-mono font-bold text-amber-600">0.8200 kg CO₂e / kWh</td>
                        <td className="p-3">Scope 2 (Power Grid)</td>
                        <td className="p-3 text-slate-500">Central Electricity Authority (CEA) India CO₂ Baseline Database v19 (2023)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900">Operational vs. Full Lifecycle Emissions Boundary</h4>
                  <p className="text-slate-600">
                    TerraTrace Drive evaluates <strong>operational emissions</strong> resulting directly from vehicle usage. 
                    It distinguishes Scope 1 direct combustion (petrol, diesel, CNG) from Scope 2 power generation (EV charging). 
                    It does <em>not</em> conflate operational carbon with full lifecycle emissions (Scope 3 Well-to-Wheel, crude refining, or vehicle and battery manufacturing embodied emissions), ensuring clear and accurate scientific accounting.
                  </p>
                </div>
              </Card>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 11: PRIVACY & DATA STORAGE */}
            {/* ========================================================================= */}
            <section id="section-11" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-11') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="emerald" size="sm">Section 11</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Privacy, Local Storage & Data Handling
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Data Protocol</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-5 text-sm text-slate-700 leading-relaxed shadow-xs">
                <p>
                  TerraTrace Drive is architected to protect user privacy while facilitating open academic research in client-side web environments:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block">1. Client-Side Browser localStorage</strong>
                    <p className="text-slate-600">
                      Survey submissions and calculator fleet states reside exclusively in your current browser's <code>localStorage</code> under keys <code>terratrace_vehicle_survey_actual</code> and <code>terratrace_vehicle_survey_demo</code>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block">2. No Cross-Device Synchronization</strong>
                    <p className="text-slate-600">
                      Because data is saved locally, records entered in Chrome on one computer will not automatically appear in Safari on a smartphone or another PC. 
                      To consolidate observations collected across multiple devices or field enumerators, use the <strong>Export CSV</strong> button and combine the CSV files in spreadsheet software.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block">3. Strict Partitioning of Demo Data</strong>
                    <p className="text-slate-600">
                      Actual field survey records are never contaminated with synthetic demonstration data. Demonstration records are explicitly flagged <code>isSynthetic: true</code> and stored in an isolated storage key.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block">4. Zero Personally Identifying Information (PII)</strong>
                    <p className="text-slate-600">
                      The application never asks for or stores personal names, phone numbers, email addresses, license plate numbers, or residential addresses. Users should never enter personal identifiers into optional text fields.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block">5. Browser Cache & Clearing Storage</strong>
                    <p className="text-slate-600">
                      Clearing your browser's website data or private browsing cache will delete locally stored survey records. Users conducting academic studies are advised to export their CSV dataset frequently.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* ========================================================================= */}
            {/* SECTION 12: TROUBLESHOOTING & FAQ */}
            {/* ========================================================================= */}
            <section id="section-12" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-12') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="blue" size="sm">Section 12</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Troubleshooting Guide & FAQ
                  </h2>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={() => toggleAllFaqs(true)}
                    className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    Expand All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => toggleAllFaqs(false)}
                    className="text-xs text-slate-500 font-semibold hover:underline cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* 10 FAQ Accordion Items */}
              <div className="space-y-3">
                {[
                  {
                    id: 'faq_1',
                    q: '1. Why am I seeing a "Monthly distance travelled must be greater than 0 km" validation error?',
                    a: 'In Method A (Distance and Efficiency), the calculation engine derives fuel consumption by dividing distance by fuel efficiency. A distance value of 0, empty string, or negative number is invalid. Enter a positive number representing your monthly travel (e.g. 600 km). In the survey form, distances up to 100,000 km/month are accepted.',
                  },
                  {
                    id: 'faq_2',
                    q: '2. What happens if I enter an empty, negative, or extremely high distance?',
                    a: 'The system validates all distance fields: negative values are immediately rejected with a descriptive warning ("Monthly distance cannot be negative"). In Method A, empty distances block progression to Step 2. Distances exceeding 100,000 km/month are flagged with a safety cap notice to prevent overflow or malformed data.',
                  },
                  {
                    id: 'faq_3',
                    q: '3. Why are combinations like Diesel Motorcycle, CNG Scooter, or Petrol Bus rejected?',
                    a: 'TerraTrace Drive enforces strict scientific integrity. Commercial diesel motorcycles and commuter CNG scooters are not mass-produced vehicles and have no verified emission coefficients in IPCC or DEFRA conversion inventories. Similarly, commercial transit buses operate on diesel, CNG, or electric drivetrains. The system explicitly alerts you with the technical reason rather than silently assigning a false factor.',
                  },
                  {
                    id: 'faq_4',
                    q: '4. Why does the Results page (/results) show an empty state message?',
                    a: 'The Results page renders data stored in application state. If you navigate directly to /results in a fresh browser session without first clicking "Calculate Emissions" on the calculator, the system displays an informative card inviting you to launch the calculator or explore the vehicle comparison.',
                  },
                  {
                    id: 'faq_5',
                    q: '5. Why does the Survey Analytics Dashboard show "No survey responses recorded in this view"?',
                    a: 'When you first open the website, no survey records exist in your browser\'s local storage. You can either submit a record using the survey form or toggle the view mode button in the top right control bar to "Demo Benchmark (10)" to inspect a complete synthetic sample fleet.',
                  },
                  {
                    id: 'faq_6',
                    q: '6. What is the difference between Actual Field Observations and Demo Benchmark data?',
                    a: 'Actual Field Observations are real responses submitted by users into the survey form on that specific browser. Demo Benchmark data is a standardized set of 10 synthetic vehicle responses (students, faculty, cars, bikes, electric scooters) designed for classroom demonstration. They are stored under separate localStorage keys and are never combined in calculations.',
                  },
                  {
                    id: 'faq_7',
                    q: '7. How does CSV export work and where is the exported file saved?',
                    a: 'Clicking "Export CSV" generates a standardized, RFC 4180 compliant comma-separated values file containing all 22 data columns (including response ID, vehicle classification, calculation method, emissions, factor citations, and record nature). The file is saved directly to your operating system\'s default Downloads directory.',
                  },
                  {
                    id: 'faq_8',
                    q: '8. Why do my survey submissions not appear when I open the website on another computer or phone?',
                    a: 'TerraTrace Drive operates as a client-side application storing records strictly within your current browser\'s local storage. It does not send personal travel data to a remote central database. To consolidate records from multiple classroom computers, export each dataset as a CSV and merge them in Excel or Python.',
                  },
                  {
                    id: 'faq_9',
                    q: '9. How do I interpret the difference between direct tailpipe emissions and electricity emissions?',
                    a: 'Petrol, diesel, and CNG produce Scope 1 emissions directly from the vehicle exhaust pipe as fuel burns. Battery electric vehicles (EVs) have zero tailpipe emissions at point of operation (0 g CO₂/km). However, charging an EV consumes grid electricity, which causes Scope 2 emissions upstream at electrical power utilities (~0.82 kg CO₂e/kWh based on the CEA India baseline).',
                  },
                  {
                    id: 'faq_10',
                    q: '10. Why are annual emissions values exactly 12 times the monthly emissions?',
                    a: 'Annual emissions represent an annualized projection calculated as: (Monthly kg CO₂ × 12) ÷ 1,000 = Annual Tonnes CO₂. This standard environmental modeling convention assumes that your typical monthly travel pattern continues over all 12 calendar months.',
                  },
                ].map((item) => {
                  const isOpen = Boolean(expandedFaqs[item.id]);
                  return (
                    <div
                      key={item.id}
                      className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(item.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-sm text-slate-900 hover:bg-slate-50/80 transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{item.q}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ========================================================================= */}
            {/* ROUTE DIRECTORY & DASHBOARD REFERENCE (PART 4) */}
            {/* ========================================================================= */}
            <section id="section-routes" className={`scroll-mt-24 space-y-4 ${isSectionVisible('section-routes') ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="space-y-0.5">
                  <Badge variant="emerald" size="sm">Route Index</Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Application Route & Dashboard Reference Directory
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">Part 4 Reference</span>
              </div>

              <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-6 text-sm text-slate-700 leading-relaxed shadow-xs">
                <p>
                  Comprehensive architectural specification for every route implemented in TerraTrace Drive, covering purpose, navigation controls, user inputs, outputs, interpretation, and known limitations:
                </p>

                <div className="space-y-6">
                  {/* Route 1: / */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">1. Route: / (Home Page)</span>
                      <Badge variant="slate" size="sm">Public Gateway</Badge>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      <li><strong>Purpose:</strong> Academic mission introduction, framework overview, and calculator/survey entry points.</li>
                      <li><strong>How to Access:</strong> Navigation bar logo, "Home" link, or browser root URL.</li>
                      <li><strong>Main Controls:</strong> "Launch Vehicle Calculator", "Vehicle Usage Survey", and "Compare Powertrains" action buttons.</li>
                      <li><strong>User Inputs:</strong> None (informational gateway).</li>
                      <li><strong>Outputs:</strong> Supported scope badges, phase overview cards, methodology summary, and ABL banner.</li>
                      <li><strong>Interpretation:</strong> Provides the scientific framing before engaging in emissions modeling.</li>
                      <li><strong>Limitations:</strong> Static overview; does not compute individual emissions.</li>
                    </ul>
                  </div>

                  {/* Route 2: /calculator */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">2. Route: /calculator (Vehicle Carbon Calculator)</span>
                      <Badge variant="emerald" size="sm">Core Calculator</Badge>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      <li><strong>Purpose:</strong> Comprehensive personal and multi-vehicle household emissions calculation.</li>
                      <li><strong>How to Access:</strong> Nav bar "Vehicle Calculator" or hero "Calculate Emissions" button.</li>
                      <li><strong>Main Controls:</strong> Fleet tabs, "Add Another Vehicle", Section 1/2 step pills, Reset Form, and "Load Sample Fleet".</li>
                      <li><strong>User Inputs:</strong> Vehicle type, fuel type, monthly distance (km), fuel efficiency, or actual fuel/kWh volume.</li>
                      <li><strong>Outputs:</strong> Real-time preview card displaying estimated monthly kg CO₂, grams per km, and double-counting indicator.</li>
                      <li><strong>Interpretation:</strong> Computes the carbon dioxide consequences of current vehicle specifications.</li>
                      <li><strong>Limitations:</strong> Requires user to know approximate distance or fuel efficiency.</li>
                    </ul>
                  </div>

                  {/* Route 3: /results */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">3. Route: /results (Results Dashboard)</span>
                      <Badge variant="blue" size="sm">Personal Dashboard</Badge>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      <li><strong>Purpose:</strong> Visualizes verified personal or fleet emission metrics and alternative powertrain benchmarks.</li>
                      <li><strong>How to Access:</strong> Automatic redirect upon submitting calculator, or nav bar "Results Dashboard".</li>
                      <li><strong>Main Controls:</strong> "Start New", "Edit Inputs", "Contribute to Survey", and "View Recommendations" buttons.</li>
                      <li><strong>User Inputs:</strong> None directly on this page (renders calculated state).</li>
                      <li><strong>Outputs:</strong> 4 core KPI cards (Monthly kg, Annual tonnes, Fuel consumed, Intensity g/km), fleet share breakdown, factor specifications.</li>
                      <li><strong>Interpretation:</strong> Identifies which vehicle produces the highest emissions and potential savings from transitioning.</li>
                      <li><strong>Limitations:</strong> Annual figures assume uniform 12-month travel habits.</li>
                    </ul>
                  </div>

                  {/* Route 4: /comparison */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">4. Route: /comparison (Vehicle Comparison)</span>
                      <Badge variant="amber" size="sm">Powertrain Simulation</Badge>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      <li><strong>Purpose:</strong> Evaluates relative emission differentials between internal combustion, electric, and public transit options.</li>
                      <li><strong>How to Access:</strong> Nav bar "Vehicle Comparison" or button on Home/Results.</li>
                      <li><strong>Main Controls:</strong> Mileage slider (100–3,000 km) and direct number input (50–5,000 km).</li>
                      <li><strong>User Inputs:</strong> Simulated monthly distance (km).</li>
                      <li><strong>Outputs:</strong> 7 vehicle profile cards with monthly kg CO₂, annual tonnes, emission scopes, and % reduction against baseline petrol car.</li>
                      <li><strong>Interpretation:</strong> Demonstrates tangible carbon reduction potential from modal shifts or EV adoption.</li>
                      <li><strong>Limitations:</strong> Uses standardized representative test cycle efficiencies rather than specific vehicle trims.</li>
                    </ul>
                  </div>

                  {/* Route 5: /survey */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">5. Route: /survey (Vehicle Usage Survey & Analytics Dashboard)</span>
                      <Badge variant="emerald" size="sm">Research & Analytics</Badge>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      <li><strong>Purpose:</strong> Collects anonymous ABL field observations and presents aggregated cohort analytics and CSV exports.</li>
                      <li><strong>How to Access:</strong> Nav bar "Vehicle Usage Survey" or Home ABL banner.</li>
                      <li><strong>Main Controls:</strong> Form/Dashboard tabs, Actual/Demo dataset toggle, Commute assist button, CSV export, and clear records.</li>
                      <li><strong>User Inputs:</strong> Participant category, vehicle type, fuel type, vehicle age, monthly distance, commute days, consent checkbox.</li>
                      <li><strong>Outputs:</strong> Sample size N, average distance, average emissions, Scope 1 vs 2 proportion bar, vehicle & fuel distribution charts, cross-tabulation table, raw submission log.</li>
                      <li><strong>Interpretation:</strong> Analyzes travel behaviors and fleet composition across a sample of campus respondents.</li>
                      <li><strong>Limitations:</strong> Local browser storage requires manual CSV export to combine data across separate machines.</li>
                    </ul>
                  </div>

                  {/* Route 6: /recommendations */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">6. Route: /recommendations (Environmental Recommendations)</span>
                      <Badge variant="teal" size="sm">Decarbonization Plan</Badge>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      <li><strong>Purpose:</strong> Educates users on actionable vehicle maintenance, driving behavior, and transit interventions.</li>
                      <li><strong>How to Access:</strong> Nav bar "Recommendations" or Results page CTA.</li>
                      <li><strong>Main Controls:</strong> Actionable checkboxes and quick links to Calculator and Comparison.</li>
                      <li><strong>User Inputs:</strong> None (interactive informational catalog).</li>
                      <li><strong>Outputs:</strong> 6 strategic decarbonization cards with verified potential savings percentages (3% to 70%).</li>
                      <li><strong>Interpretation:</strong> Prioritizes interventions from immediate zero-cost driving habits to long-term EV transition.</li>
                      <li><strong>Limitations:</strong> Percentage savings are empirical averages; real-world savings depend on individual baseline driving style.</li>
                    </ul>
                  </div>

                  {/* Route 7: /methodology */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">7. Route: /methodology (Calculation Methodology)</span>
                      <Badge variant="indigo" size="sm">Scientific Standards</Badge>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      <li><strong>Purpose:</strong> Full documentation of mathematical equations, IPCC/DEFRA conversion factors, and accounting standards.</li>
                      <li><strong>How to Access:</strong> Nav bar "Methodology" or Footer link.</li>
                      <li><strong>Main Controls:</strong> Jump links to methodology cards.</li>
                      <li><strong>User Inputs:</strong> None.</li>
                      <li><strong>Outputs:</strong> Formulations 1, 2, and 3, Scope 1/2/3 boundary definitions, factor citation table, and double-counting prevention architecture.</li>
                      <li><strong>Interpretation:</strong> Ensures academic transparency and reproducibility for Environmental Studies evaluation.</li>
                      <li><strong>Limitations:</strong> Covers operational mobile combustion; excludes embodied lifecycle manufacturing emissions.</li>
                    </ul>
                  </div>

                  {/* Route 8: /user-manual */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">8. Route: /user-manual (User Manual & Help Center)</span>
                      <Badge variant="emerald" size="sm">Comprehensive Guide</Badge>
                    </div>
                    <ul className="space-y-1 text-slate-600">
                      <li><strong>Purpose:</strong> Centralized interactive operating manual, formula walkthrough, troubleshooting FAQ, and route catalog.</li>
                      <li><strong>How to Access:</strong> Nav bar "User Manual", Footer links, or direct URL <code>/user-manual</code>.</li>
                      <li><strong>Main Controls:</strong> Table of contents jump links, live search keyword filter, FAQ accordion toggles, and "Print / Save as PDF".</li>
                      <li><strong>User Inputs:</strong> Search query string to filter documentation.</li>
                      <li><strong>Outputs:</strong> 12 structured instructional sections, worked petrol car example, and 10 FAQ solutions.</li>
                      <li><strong>Interpretation:</strong> Provides answers for system operation, calculation inquiries, and validation errors.</li>
                      <li><strong>Limitations:</strong> Purely client-side documentation; prints cleanly via standard browser PDF generation.</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </section>

          </article>
        </div>

        {/* Floating Back to Top Control */}
        {showScrollTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 print:hidden"
            aria-label="Back to top of manual"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </Container>
    </div>
  );
}
