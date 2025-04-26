'use client';
import { useState, FormEvent, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { RadioGroup } from '@/components/ui/radio-group';
import SecureCheckout from './SecureCheckout';
import OrderSummary from './OrderSummary';
import { Button } from '../ui/button';
import type { SubscriptionPlanProps } from './types';
import { createCheckoutSession } from '../../utils/stripe';
import { useUser } from '@/app/context/UserContext';
import SubscriptionSuccess from './SubscriptionSuccess';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function PlanCard({ tier, onSubscribe, loading }: SubscriptionPlanProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" role="article">
      <div className="px-6 py-8">
        <h3 className="text-2xl font-semibold text-gray-900">
          {tier.name}
        </h3>
        <p className="mt-4 text-gray-600">
          <span className="text-4xl font-extrabold">${tier.price}</span>
          <span className="text-base font-medium">/month</span>
        </p>
        <ul className="mt-6 space-y-4" role="list">
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
                aria-hidden="true"
                role="img"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="ml-3 text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className="mt-8 w-full"
          onClick={() => onSubscribe(tier.stripePriceId)}
          disabled={loading}
          aria-label={`Subscribe to ${tier.name}`}
        >
          {loading ? 'Loading...' : 'Subscribe Now'}
        </Button>
      </div>
    </div>
  );
}

const plans = [
  {
    id: 'bronze',
    name: 'Bronze plan',
    price: 500,
    duration: '90 days',
    stripePriceId: 'price_1R698xID3hMCnXD6mugbhTX9',
    features: {
      resumeViews: 100,
      jobPosting: 5
    }
  },
  {
    id: 'silver',
    name: 'Silver plan',
    price: 800,
    duration: '180 days',
    stripePriceId: 'price_1R698yID3hMCnXD6xTEusFrF',
    features: {
      resumeViews: 200,
      jobPosting: 10
    }
  },
  {
    id: 'gold',
    name: 'Gold plan',
    price: 1200,
    duration: '365 days',
    stripePriceId: 'price_1R698zID3hMCnXD6kvh6FUUX',
    features: {
      resumeViews: 500,
      jobPosting: 20
    }
  }
];

const SubscriptionFormContent = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedPlan, setSelectedPlan] = useState('bronze');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
  });
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle');
  const [subscription, setSubscription] = useState<{subscriptionId?: string, customerId?: string} | null>(null);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(plans.find(p => p.id === 'bronze'));
  const { user, refreshUserData } = useUser();
  

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: user.name || ''
      }));
      setUserEmail(user.email);
      
      // Log successful autofill
      console.log('Autofill successful:', {
        email: user.email,
        name: user.name
      });
    } else {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        setFormData(prev => ({
          ...prev,
          email: storedEmail
        }));
        setUserEmail(storedEmail);
        console.log('Used email from localStorage:', storedEmail);
      } else {
        console.log('No user data available for autofill');
      }
    }
  }, [user]);

  useEffect(() => {
    const planDetails = plans.find(p => p.id === selectedPlan);
    if (planDetails) {
      setSelectedPlanDetails(planDetails);
    }
  }, [selectedPlan]);

  // Function to calculate renewal date based on plan duration
  const calculateRenewalDate = (duration: string | undefined): string => {
    if (!duration) return "January 20, 2025"; // Default fallback
    
    const today = new Date();
    let daysToAdd = 0;
    
    // Parse duration string to get number of days
    if (duration.includes('90')) {
      daysToAdd = 90;
    } else if (duration.includes('180')) {
      daysToAdd = 180;
    } else if (duration.includes('365') || duration.includes('year')) {
      daysToAdd = 365;
    }
    
    // Add days to today's date
    const renewalDate = new Date(today);
    renewalDate.setDate(today.getDate() + daysToAdd);
    
    // Format the date as MMM DD, YYYY
    return renewalDate.toLocaleDateString('en-US', {
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(null);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Save email to localStorage
    if (name === 'email') {
      localStorage.setItem('userEmail', value);
      setUserEmail(value);
    }
  };

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentStatus('processing');

    // Log the form data being submitted
    console.log('Submitting form with data:', {
      firstName: formData.firstName,
      email: formData.email,
      selectedPlan: selectedPlan,
      userId: user?._id || 'No user ID available'
    });
    
    // Log the entire user object to debug its structure
    console.log('User object structure:', JSON.stringify(user, null, 2));

    try {
      const plan = plans.find(p => p.id === selectedPlan);
      if (!plan) {
        throw new Error('Please select a plan');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create a subscription and get the client secret for payment
      const result = await createCheckoutSession(
        plan.stripePriceId, 
        formData.email, 
        formData.firstName,
        user?._id // Pass the user ID to the createCheckoutSession function
      );
      
      if (!result?.clientSecret) {
        throw new Error('Failed to create subscription');
      }

      // Store subscription data
      setSubscription({
        subscriptionId: result.subscriptionId,
        customerId: result.customerId
      });

      // Confirm card payment with the client secret
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        result.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.firstName,
              email: formData.email,
            },
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        setPaymentStatus('succeeded');
        
        // Refresh user data after successful payment to update the subscription information
        await refreshUserData();
        console.log('User data refreshed after successful subscription');
      } else {
        throw new Error('Payment failed');
      }
      
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment. Please try again.');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  // If payment succeeded, show success message
  if (paymentStatus === 'succeeded') {
    return (
   <>
    <SubscriptionSuccess
      accountName={formData.firstName}
      planName={selectedPlanDetails?.name}
      savedAmount={selectedPlanDetails?.price}
      endDate={calculateRenewalDate(selectedPlanDetails?.duration)}
    /> 
   
    </>     
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto mt-[125px]">
      <h1 className="text-[36px] font-bold text-[#293E40] text-center mb-6 pt-[60px]">
        Subscription plans
      </h1>
      <p className="text-[26px] text-[#13B5CF] text-center mb-12 opacity-60">
        {userEmail ? `${userEmail.split('@')[0]}, Thank you for choosing us` : 'Thank you for choosing us'}
      </p>

      <p className="text-[16px] text-[#1E1E1E] mb-8 mx-auto max-w-[851px]">
        Confirm your billing cycle, Save $XXX /year when you select annual billing cycle
      </p>

      {/* plans section */}
      <div className="flex justify-between mb-[30px] max-w-[851px] mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`border-[2px] border-[#D9D9D9] rounded-lg p-[15px] hover:border-[#4ACA34] transition-colors w-[249px] cursor-pointer ${
              selectedPlan === plan.id ? 'border-[#1A75E8]' : 'border-gray-200 hover:border-[#1A75E8]'
            }`}
            onClick={() => handlePlanChange(plan.id)}
          >
            <div className="flex items-start gap-3 mb-4">
              <input 
                type="radio" 
                name="plan" 
                value={plan.id}
                checked={selectedPlan === plan.id}
                onChange={() => handlePlanChange(plan.id)}
                className="mt-1 "
                id={`${plan.id}-plan`}
                aria-label={plan.name}
              />
              <div>
                <h3 className="text-[15px] font-[550] text-[#0F1137] pb-[15px]">{plan.name}</h3>
                <p className="text-[24px] text-[#4ACA34] opacity-60 font-medium">
                  ${plan.price.toFixed(2)} 
                  <span className="text-[13px] ml-[5px] font-normal text-[#4f5256] tracking-tighter">
                    Valid for {plan.duration}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-[13px] text-[#1E1E1E] pl-[22px]">
              <p>Resume views: {plan.features.resumeViews}</p>
              <p>Job Posting: {plan.features.jobPosting}</p>
            </div>
          </div>
        ))}
      </div>

    

      <div className="max-w-[851px] mx-auto border-[2px] border-[#D9D9D9] rounded-lg p-8 mb-[30px] ">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-[17px] text-[#1E1E1E]">Secure checkout</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <p className="text-[15px] text-[#1E1E1E] mb-6">Credit /Debit card details</p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
          <div>
            <label htmlFor="firstName" className="block text-[14px] text-[#1E1E1E] mb-2">Full name</label>
            <input 
              type="text" 
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:border-[#1A75E8] focus:outline-none"
              placeholder="Enter your full name"
              required
              disabled={!!user?.name}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-[14px] text-[#1E1E1E] mb-2">Email address</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:border-[#1A75E8] focus:outline-none"
              placeholder="Enter your email address"
              required
              disabled
            />
          </div>
          
          <div className="col-span-2 mb-4">
            <label htmlFor="card-element" className="block text-[14px] text-[#1E1E1E] mb-2">
              Card details
            </label>
            <div className="p-3 border border-gray-300 rounded-sm">
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#1E1E1E',
                      '::placeholder': {
                        color: '#AEB4C1',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-2">
            <p className="text-[12px] text-[#AEB4C1] mt-[20px] mb-4 leading-[1.4]">
              By clicking "Continue" you are consenting to Hireeasy managing your card details in accordance with the US banks regulations
            </p>

            <div className="text-right mt-[20px]">
              <Button 
                type="submit"
                className="px-8 py-2 bg-[#1A75E8] text-white rounded-md hover:bg-[#1565D8] transition-colors"
                disabled={loading || !stripe || paymentStatus === 'processing'}
              >
                {paymentStatus === 'processing' ? 'Processing...' : loading ? 'Loading...' : 'Continue'}
              </Button>
            </div>
          </div>
        </form>
      </div>

        <OrderSummary
        planName={selectedPlanDetails?.name}
        oneTimeCharge={selectedPlanDetails?.price}
        taxes={15.00} // Assuming a fixed tax rate, adjust as needed
        renewalDate={calculateRenewalDate(selectedPlanDetails?.duration)}
        duration={selectedPlanDetails?.duration}
      />

      {/* <SecureCheckout /> */}
      
    </div>
  );
};

// Export the main component wrapped with Stripe Elements
export default function SubscriptionForm() {
     const router = useRouter();

     useEffect(() => {
       const token = localStorage.getItem("token");

       if (!token) {
         router.push("/");
         return;
       }
     }, [router]);
  return (
    <Elements stripe={stripePromise}>
      <SubscriptionFormContent />
    </Elements>
  );
}