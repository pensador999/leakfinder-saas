import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import { ReportPage } from './pages/ReportPage';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { LgpdConsentBanner } from './components/LgpdConsentBanner';

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/report/:id" element={<ReportPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/quem-somos" element={<AboutUsPage />} />
            <Route path="/sobre" element={<AboutUsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <LgpdConsentBanner />
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
}
