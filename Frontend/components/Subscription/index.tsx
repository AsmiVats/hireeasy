'use client';
import { useState } from 'react';
import { createCheckoutSession, createPortalSession } from '../../utils/stripe';
import { Button } from '../ui/button';
import { PlanCard } from './SubscriptionPlan';
import SubscriptionForm from './SubscriptionPlan';
import type { PricingTier } from './types';

const pricingTiers: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    stripePriceId: 'price_basic', // Replace with your actual Stripe Price ID
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 19.99,
    features: ['All Basic Features', 'Feature 4', 'Feature 5', 'Feature 6'],
    stripePriceId: 'price_pro', // Replace with your actual Stripe Price ID
  },
];

export default function Subscription() {
  const [loading, setLoading] = useState<string | null>(null);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId);
      const selectedTier = pricingTiers.find(tier => tier.stripePriceId === priceId);
      if (selectedTier) {
        setSelectedTier(selectedTier);
        setShowSubscriptionForm(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading('portal');
      const portalUrl = await createPortalSession();
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  if (showSubscriptionForm) {
    return <SubscriptionForm />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Choose your plan
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Select the plan that best fits your needs
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {pricingTiers.map((tier) => (
          <PlanCard
            key={tier.id}
            tier={tier}
            onSubscribe={handleSubscribe}
            loading={loading === tier.stripePriceId}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          variant="outline"
          onClick={handleManageSubscription}
          disabled={loading === 'portal'}
          aria-label="Manage your subscription"
        >
          {loading === 'portal' ? 'Loading...' : 'Manage Subscription'}
        </Button>
      </div>
    </div>
  );
} 