import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import InstagramConnect from '../pages/InstagramConnect';
import SubscriptionSelection from '../pages/SubscriptionSelection';
import BusinessTutorial from '../pages/BusinessTutorial';
import DynamicSurvey from '../pages/DynamicSurvey';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/connect" element={<InstagramConnect />} />
          <Route path="/subscription" element={<SubscriptionSelection />} />
          <Route path="/tutorial" element={<BusinessTutorial />} />
          <Route path="/survey" element={<DynamicSurvey />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default MainLayout;
