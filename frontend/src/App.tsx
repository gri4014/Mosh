import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import Landing from './components/pages/Landing';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import Settings from './components/pages/Settings';
import InstagramConnect from './components/pages/InstagramConnect';
import SubscriptionSelection from './components/pages/SubscriptionSelection';
import BusinessTutorial from './components/pages/BusinessTutorial';
import DynamicSurvey from './components/pages/DynamicSurvey';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/instagram/connect"
        element={
          <PrivateRoute>
            <MainLayout>
              <InstagramConnect />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <PrivateRoute>
            <MainLayout>
              <SubscriptionSelection />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/tutorial"
        element={
          <PrivateRoute>
            <MainLayout>
              <BusinessTutorial />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/survey"
        element={
          <PrivateRoute>
            <MainLayout>
              <DynamicSurvey />
            </MainLayout>
          </PrivateRoute>
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
