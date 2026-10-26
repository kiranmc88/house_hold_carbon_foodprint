import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Results from './pages/Results';
import Recommendations from './pages/Recommendations';
import Methodology from './pages/Methodology';
import Comparison from './pages/Comparison';
import Survey from './pages/Survey';
import { CarbonProvider } from './context/CarbonContext';

/**
 * Helper to automatically scroll to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CarbonProvider>
        <ScrollToTop />
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/results" element={<Results />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/methodology" element={<Methodology />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </CarbonProvider>
    </BrowserRouter>
  );
}
