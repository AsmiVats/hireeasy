'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SubscriptionSuccess from '@/components/Subscription/SubscriptionSuccess';
import { useUser } from '@/app/context/UserContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const { refreshUserData, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState({
    planName: '',
    savedAmount: '',
    endDate: ''
  });

  useEffect(() => {
    const syncSubscription = async () => {
      try {
        setLoading(true);
        
        // Get session_id from URL if available
        const sessionId = searchParams.get('session_id');
        const subscriptionId = searchParams.get('subscription_id');
        
        if (sessionId || subscriptionId) {
          // Call your backend to verify and activate the subscription
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Authentication required');
          }
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/activate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              sessionId,
              subscriptionId
            })
          });
          
          if (!response.ok) {
            throw new Error('Failed to activate subscription');
          }
          
          const data = await response.json();
          
          // Update subscription details for display
          setSubscriptionDetails({
            planName: data.planName || 'Premium Plan',
            savedAmount: data.discount ? `$${data.discount}` : '$0',
            endDate: data.expiryDate ? new Date(data.expiryDate).toLocaleDateString() : 'N/A'
          });
          
          // Refresh user data to include the new subscription
          await refreshUserData();
        }
      } catch (err) {
        console.error('Error syncing subscription:', err);
        setError(err instanceof Error ? err.message : 'Failed to sync subscription');
      } finally {
        setLoading(false);
      }
    };
    
    syncSubscription();
  }, [searchParams, refreshUserData]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Subscription Error</h1>
          <p className="text-gray-700">{error}</p>
          <p className="mt-4">Please contact support if this problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <SubscriptionSuccess 
      accountName={user?.name || "User"}
      savedAmount={subscriptionDetails.savedAmount}
      endDate={subscriptionDetails.endDate}
      planName={subscriptionDetails.planName}
    />
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><LoadingSpinner size="large" /></div>}>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}