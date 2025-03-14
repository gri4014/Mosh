import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionTier {
  name: string;
  price: number;
  features: string[];
}

const SubscriptionSelection: React.FC = () => {
  const navigate = useNavigate();

  const tiers: SubscriptionTier[] = [
    {
      name: 'Baseline',
      price: 30,
      features: [
        'Automated post creation',
        'AI-powered content generation',
        'Scheduled publishing',
        'Monthly strategy planning'
      ]
    },
    {
      name: 'Promotion',
      price: 49,
      features: [
        'All Baseline features',
        'Automated Instagram ads',
        'Ad campaign management',
        'Performance tracking'
      ]
    }
  ];

  const handleSubscribe = (tierName: string) => {
    // TODO: Implement actual payment flow
    // For MVP, simulate successful subscription
    console.log(`Selected ${tierName} subscription`);
    navigate('/tutorial');
  };

  return (
    <div className="subscription-selection">
      <h2>Choose Your Plan</h2>
      <p>Select the subscription that best fits your needs</p>
      <div className="subscription-tiers">
        {tiers.map((tier) => (
          <div key={tier.name} className="tier-card">
            <h3>{tier.name}</h3>
            <p className="price">${tier.price}/month</p>
            <ul>
              {tier.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button onClick={() => handleSubscribe(tier.name)}>
              Select {tier.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionSelection;
