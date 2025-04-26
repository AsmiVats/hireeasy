export interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  stripePriceId: string;
}

export interface SubscriptionPlanProps {
  tier: PricingTier;
  onSubscribe: (priceId: string) => Promise<void>;
  loading: boolean;
} 