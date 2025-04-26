import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, AlertCircle } from 'lucide-react';
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface SubsInfo {
  plan: string;
  creditsLeft: {
    resumeViews: {
      used: number;
      limit: number;
      remaining: number;
    };
    jobPosting: {
      used: number;
      limit: number;
      remaining: number;
    };
  };
  expiresOn: string;
  cardDetails?: string;
}

export const Subscription = () => {
  const { user, isSubscriptionActive, getJobPostsRemaining, getResumeViewsRemaining, refreshUserData } = useUser();
  const router = useRouter();
  const [subsInfo, setSubsInfo] = useState<SubsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [rawApiResponse, setRawApiResponse] = useState<any>(null);
  console.log('user',user);

  useEffect(() => {
    if (user && user.subscription) {
      console.log('Subscription details:', JSON.stringify(user.subscription, null, 2));
      
      // Check if plan name is present
      if (!user.subscription.planName) {
        console.warn('Plan name is missing in subscription data');
      }
      
      // Generate a proper plan name for display
      let planName = user.subscription.displayName || user.subscription.planName || "Basic";
      
      // Ensure planName has "Plan" suffix for display
      if (!planName.includes('Plan')) {
        planName = `${planName} Plan`;
      }
      
      // As a fallback, check the planId field to derive the plan name
      if (planName === "Basic Plan" && user.subscription.planId) {
        const planIdLower = user.subscription.planId.toLowerCase();
        if (planIdLower.includes('bronze')) {
          planName = 'Bronze Plan';
        } else if (planIdLower.includes('silver')) {
          planName = 'Silver Plan';
        } else if (planIdLower.includes('unlimited')) {
          planName = 'Unlimited Plan';
        }
        console.log('Derived plan name from planId:', planName);
      }
      
      // Determine plan details for display
      setSubsInfo({
        plan: planName,
        creditsLeft: {
          resumeViews: {
            used: user.subscription.features?.resumeViews?.used || 0,
            limit: user.subscription.features?.resumeViews?.limit || 0,
            remaining: getResumeViewsRemaining()
          },
          jobPosting: {
            used: user.subscription.features?.jobPosting?.used || 0,
            limit: user.subscription.features?.jobPosting?.limit || 0,
            remaining: getJobPostsRemaining()
          }
        },
        expiresOn: user.subscription.expiryDate ? 
          format(new Date(user.subscription.expiryDate), 'yyyy-MM-dd') : 
          'Unknown',
        cardDetails: "••••-••••-••••-••••" // We don't store this in the user context
      });
    } else {
      console.log('No subscription data available for user');
      // Set default or placeholder values when no subscription exists
      setSubsInfo(null);
    }
    setLoading(false);
  }, [user, getJobPostsRemaining, getResumeViewsRemaining]);

  const handleUpgradeClick = () => {
    router.push('/subscription');
  };

  // Add function to test the subscription debug endpoint
  const handleDebugClick = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        return;
      }
      
      // First check the raw subscription data from the API
      console.log("Fetching raw subscription data for user:", user.id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        console.error("Subscription fetch failed:", response.status, response.statusText);
        return;
      }
      
      const data = await response.json();
      console.log("Raw subscription API response:", data);
      setRawApiResponse(data);
      
      // Then call the debug endpoint (with correct userId)
      console.log("Calling debug endpoint for user:", user.id);
      const debugResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/debug/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      if (!debugResponse.ok) {
        console.error("Debug endpoint failed:", debugResponse.status, debugResponse.statusText);
        return;
      }
      
      const debugData = await debugResponse.json();
      console.log("Debug endpoint response:", debugData);
      
      // Refresh user data to ensure we have the latest subscription info
      await refreshUserData();
      
    } catch (error) {
      console.error("Error in debug function:", error);
    }
  };

  const toggleDebugInfo = () => {
    setShowDebugInfo(prev => !prev);
  };

  if (loading) {
    return <div className="text-center py-10">Loading subscription information...</div>;
  }

  if (!subsInfo) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="text-center space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="text-xl font-medium text-gray-900">No Active Subscription</h2>
          <p className="text-gray-600">You don't have an active subscription plan.</p>
          <Button onClick={handleUpgradeClick} className="bg-primary hover:bg-primary-dark">
            Subscribe Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-medium">
      <div>
        <h2 className=" text-[#0F1137] mb-8 font-semibold">Subscription Information</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between w-[385px]">
            <span className="text-[15px] text-[#5A5A5A]">Account Plan</span>
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-[#1E1E1E]">{subsInfo.plan}</span>
              <button 
                className="text-[#13B5CF]"
                onClick={handleUpgradeClick}
                title="View subscription plans"
                aria-label="View subscription plans"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between w-[385px]">
            <span className="text-[15px] text-[#5A5A5A]">Resume Views</span>
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-[#1E1E1E]">
                {subsInfo.creditsLeft.resumeViews.remaining} / {subsInfo.creditsLeft.resumeViews.limit} remaining
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between w-[385px]">
            <span className="text-[15px] text-[#5A5A5A]">Job Postings</span>
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-[#1E1E1E]">
                {subsInfo.creditsLeft.jobPosting.remaining} / {subsInfo.creditsLeft.jobPosting.limit} remaining
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between w-[385px]">
            <span className="text-[15px] text-[#5A5A5A]">Plan Expires On</span>
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-[#1E1E1E]">{subsInfo.expiresOn}</span>
              <button 
                className="text-[#13B5CF]"
                onClick={handleUpgradeClick}
                title="Renew subscription"
                aria-label="Renew subscription"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className=" text-[#0F1137] mb-8 font-semibold">Payment Information</h2>
        
        <div className="flex items-center justify-between w-[385px]">
          <span className="text-[15px] text-[#5A5A5A]">Card Details</span>
          <div className="flex items-center gap-3">
            <span className="text-[15px] text-[#1E1E1E]">{subsInfo.cardDetails}</span>
            <button 
              className="text-[#13B5CF]"
              onClick={handleUpgradeClick}
              title="Update payment method"
              aria-label="Update payment method"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 border-t pt-4">
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleDebugClick} 
                variant="outline"
                className="text-sm"
              >
                Refresh Subscription
              </Button>
              
              <Button 
                onClick={toggleDebugInfo} 
                variant="outline"
                className="text-sm"
              >
                {showDebugInfo ? 'Hide Debug Info' : 'Show Debug Info'}
              </Button>
            </div>
            
            {showDebugInfo && (
              <div className="mt-4 p-4 bg-slate-50 rounded text-xs font-mono whitespace-pre-wrap">
                <h3 className="font-bold mb-2">Raw API Response:</h3>
                {rawApiResponse ? JSON.stringify(rawApiResponse, null, 2) : 'No API response yet. Click Refresh Subscription.'}
                
                <h3 className="font-bold mt-4 mb-2">Raw Subscription Data from UserContext:</h3>
                {user?.subscription ? JSON.stringify(user.subscription, null, 2) : 'No subscription data available.'}
                
                <h3 className="font-bold mt-4 mb-2">Processed Subscription Info:</h3>
                {JSON.stringify(subsInfo, null, 2)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};