import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InstagramProvider } from './context/InstagramContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { StrategyProvider } from './context/StrategyContext';
import { PostProvider } from './context/PostContext';
import { SettingsProvider } from './context/SettingsContext';
import MainLayout from './components/layout/MainLayout';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InstagramProvider>
          <SubscriptionProvider>
            <StrategyProvider>
              <PostProvider>
                <SettingsProvider>
                  <MainLayout />
                </SettingsProvider>
              </PostProvider>
            </StrategyProvider>
          </SubscriptionProvider>
        </InstagramProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
