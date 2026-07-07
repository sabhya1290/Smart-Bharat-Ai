import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from './layouts/AppLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import LandingPage from './pages/LandingPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AuthCallbackPage from './pages/AuthCallbackPage.jsx';
import EmailVerificationPage from './pages/EmailVerificationPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AiAssistantPage from './pages/AiAssistantPage.jsx';
import ServiceFinderPage from './pages/ServiceFinderPage.jsx';
import ServiceDetailsPage from './pages/ServiceDetailsPage.jsx';
import RecommendationsPage from './pages/RecommendationsPage.jsx';
import ReportIssuePage from './pages/ReportIssuePage.jsx';
import ComplaintTrackerPage from './pages/ComplaintTrackerPage.jsx';
import MyComplaintsPage from './pages/MyComplaintsPage.jsx';
import TransparencyDashboardPage from './pages/TransparencyDashboardPage.jsx';
import SavedServicesPage from './pages/SavedServicesPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />

    {/* OAuth callback — must be outside AuthLayout so it can redirect freely */}
    <Route path="/auth/callback" element={<AuthCallbackPage />} />

    <Route element={<AuthLayout />}>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
    </Route>

    {/* Complaint tracking is public — citizens without an account can still track a complaint */}
    <Route
      path="/complaint-tracker"
      element={
        <AppLayout />
      }
    >
      <Route index element={<ComplaintTrackerPage />} />
    </Route>

    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/assistant" element={<AiAssistantPage />} />
      <Route path="/services" element={<ServiceFinderPage />} />
      <Route path="/services/:id" element={<ServiceDetailsPage />} />
      <Route path="/recommendations" element={<RecommendationsPage />} />
      <Route path="/report-issue" element={<ReportIssuePage />} />
      <Route path="/my-complaints" element={<MyComplaintsPage />} />
      <Route path="/transparency" element={<TransparencyDashboardPage />} />
      <Route path="/saved-services" element={<SavedServicesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
