import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import Landing from './components/pages/Landing';
import Dashboard from './components/pages/Dashboard';
import Settings from './components/pages/Settings';
import InstagramConnect from './components/pages/InstagramConnect';
import SubscriptionSelection from './components/pages/SubscriptionSelection';
import BusinessTutorial from './components/pages/BusinessTutorial';
import DynamicSurvey from './components/pages/DynamicSurvey';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: { user, loading } } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/instagram/callback" element={<InstagramConnect />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SubscriptionSelection />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutorial"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BusinessTutorial />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/survey"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DynamicSurvey />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
