import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface InstagramAccount {
  username: string;
  accountType: 'business' | 'creator';
  connected: boolean;
}

interface SubscriptionDetails {
  tier: 'Baseline' | 'Promotion';
  price: number;
  renewalDate: Date;
  status: 'active' | 'cancelled';
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  
  // TODO: In production, fetch from backend
  const [account, setAccount] = useState<InstagramAccount>({
    username: 'example_brand',
    accountType: 'business',
    connected: true
  });

  const [subscription, setSubscription] = useState<SubscriptionDetails>({
    tier: 'Baseline',
    price: 30,
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'active'
  });

  const [reviewMode, setReviewMode] = useState(true);

  const handleDisconnectAccount = () => {
    // TODO: In production, call backend to disconnect
    console.log('Disconnecting Instagram account...');
  };

  const handleCancelSubscription = () => {
    // TODO: In production, call backend to cancel
    setSubscription(prev => ({ ...prev, status: 'cancelled' }));
  };

  const handleUpgradeSubscription = () => {
    // TODO: In production, implement upgrade flow
    console.log('Upgrading to Promotion tier...');
  };

  return (
    <div className="settings">
      <header className="settings-header">
        <h1>Settings</h1>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </header>

      <section className="instagram-settings">
        <h2>Instagram Account</h2>
        <div className="account-info">
          <p>Username: {account.username}</p>
          <p>Account Type: {account.accountType}</p>
          <p>Status: {account.connected ? 'Connected' : 'Disconnected'}</p>
          <button 
            onClick={handleDisconnectAccount}
            className="disconnect-button"
          >
            Disconnect Account
          </button>
        </div>
      </section>

      <section className="subscription-settings">
        <h2>Subscription</h2>
        <div className="subscription-info">
          <p>Current Plan: {subscription.tier}</p>
          <p>Price: ${subscription.price}/month</p>
          <p>Renewal Date: {subscription.renewalDate.toLocaleDateString()}</p>
          <p>Status: {subscription.status}</p>
          {subscription.tier === 'Baseline' && subscription.status === 'active' && (
            <button 
              onClick={handleUpgradeSubscription}
              className="upgrade-button"
            >
              Upgrade to Promotion ($49/month)
            </button>
          )}
          {subscription.status === 'active' && (
            <button 
              onClick={handleCancelSubscription}
              className="cancel-button"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </section>

      <section className="preferences">
        <h2>Preferences</h2>
        <div className="preference-controls">
          <label>
            <input
              type="checkbox"
              checked={reviewMode}
              onChange={(e) => setReviewMode(e.target.checked)}
            />
            Review posts before publishing
          </label>
        </div>
      </section>
    </div>
  );
};

export default Settings;
