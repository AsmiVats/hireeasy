import { loadStripe } from '@stripe/stripe-js';

// Make sure to add your publishable key in the .env.local file
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Backend API URL from environment variable or default
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const createCheckoutSession = async (priceId: string, email?: string, name?: string, userId?: string) => {
  try {
    console.log('Creating subscription with price ID:', priceId);
    
    const requestBody: { priceId: string; email?: string; name?: string; id?: string } = { priceId };
    
    // Add customer details to request body if provided
    if (email) {
      requestBody.email = email;
    }
    
    if (name) {
      requestBody.name = name;
    }
    
    if (userId) {
      requestBody.id = userId;
    }
    console.log("request Body:: ", requestBody)
    
    const response = await fetch(`${BACKEND_API_URL}/subscriptionsStripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error || 'Failed to create subscription');
      } catch (e) {
        throw new Error(`Failed to create subscription: ${errorText}`);
      }
    }

    const result = await response.json();
    console.log('Subscription created:', result);
    return result; // Contains clientSecret, subscriptionId, and customerId
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const createPortalSession = async () => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/subscriptionsStripe/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create portal session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}; 