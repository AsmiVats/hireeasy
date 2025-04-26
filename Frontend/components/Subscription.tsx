'use client';
import { useState } from 'react';
import { createCheckoutSession, createPortalSession } from '../utils/stripe';
import { Button } from './ui/button';
import { useUser } from '@/app/context/UserContext';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  stripePriceId: string;
}

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
  const { user } = useUser();

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId);

      // Log the entire user object to debug its structure
      console.log('User object:', user);
      console.log('User ID when subscribing:', user?.id || 'Not available');
      
      const session = await createCheckoutSession(
        priceId,
        user?.email,
        user?.name,
        user?.id
      );
      
      window.location.href = session.url;
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
          <div
            key={tier.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="px-6 py-8">
              <h3 className="text-2xl font-semibold text-gray-900">
                {tier.name}
              </h3>
              <p className="mt-4 text-gray-600">
                <span className="text-4xl font-extrabold">${tier.price}</span>
                <span className="text-base font-medium">/month</span>
              </p>
              <ul className="mt-6 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full"
                onClick={() => handleSubscribe(tier.stripePriceId)}
                disabled={loading === tier.stripePriceId}
              >
                {loading === tier.stripePriceId ? 'Loading...' : 'Subscribe Now'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          variant="outline"
          onClick={handleManageSubscription}
          disabled={loading === 'portal'}
        >
          {loading === 'portal' ? 'Loading...' : 'Manage Subscription'}
        </Button>
      </div>
    </div>
  );
} 