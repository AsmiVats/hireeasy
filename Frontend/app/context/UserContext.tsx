'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  _id: string;
  id: string;
  email: string;
  name: string;
  subscription?: {
    planId: string;
    planName: string;
    displayName?: string;
    expiryDate: string;
    features: {
      resumeViews: {
        limit: number;
        used: number;
      };
      jobPosting: {
        limit: number;
        used: number;
      };
    };
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  canPostJob: () => boolean;
  canDownloadResume: () => boolean;
  incrementJobPostCount: () => void;
  incrementResumeDownloadCount: () => void;
  getJobPostsRemaining: () => number;
  getResumeViewsRemaining: () => number;
  refreshUserData: () => Promise<void>;
  isSubscriptionActive: () => boolean;
  canViewCandidateDetails: () => boolean;
  hasReachedCandidateViewLimit: () => boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const fetchSubscriptionData = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Decode the JWT token to get user type
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userType = tokenPayload.userType;

      console.log('user type', userType)

      // Only fetch subscription data for Employer users
      if (userType.toLowerCase() !== 'employer') {
        console.log('Skipping subscription fetch for non-employer user:', userType);
        return null;
      }

      console.log('Fetching subscription data for employer:', userId);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn('Failed to fetch subscription data:', response.status, response.statusText);
        return null;
      }

      const subscriptionData = await response.json();
      console.log('Subscription data received:', JSON.stringify(subscriptionData, null, 2));
      
      // We'll define the subscription structure here to match what we need
      interface Subscription {
        planId: string;
        planName: string;
        displayName?: string;
        expiryDate: string;
        features: {
          resumeViews: { 
            limit: number; 
            used: number; 
          };
          jobPosting: { 
            limit: number; 
            used: number; 
          };
        };
      }
      
      // Create a properly structured subscription object
      let processedSubscription: Subscription = {
        planId: '',
        planName: 'Basic',
        displayName: 'Basic Plan',
        expiryDate: new Date().toISOString(),
        features: {
          resumeViews: { 
            limit: 0, 
            used: 0 
          },
          jobPosting: { 
            limit: 0, 
            used: 0 
          }
        }
      };
      
      // If we received subscription data, merge it with our default structure
      if (subscriptionData) {
        // Handle flat data structure from API
        if (typeof subscriptionData === 'object') {
          // Merge the received data with our defaults
          processedSubscription = {
            ...processedSubscription,
            // Extract known properties
            planId: subscriptionData.planId || processedSubscription.planId,
            expiryDate: subscriptionData.expiryDate || processedSubscription.expiryDate,
          };
          
          // Handle flat features structure
          if (subscriptionData.resumeViews !== undefined || subscriptionData.jobPosting !== undefined) {
            // API returns flat structure, create nested
            processedSubscription.features = {
              resumeViews: {
                limit: subscriptionData.resumeViews || 0, 
                used: subscriptionData.resumeViewsUsed || 0
              },
              jobPosting: {
                limit: subscriptionData.jobPosting || 0,
                used: subscriptionData.jobPostingsUsed || 0
              }
            };
          } else if (subscriptionData.features) {
            // API returns nested structure, use as is
            processedSubscription.features = {
              resumeViews: {
                limit: subscriptionData.features.resumeViews?.limit || 0,
                used: subscriptionData.features.resumeViews?.used || 0
              },
              jobPosting: {
                limit: subscriptionData.features.jobPosting?.limit || 0,
                used: subscriptionData.features.jobPosting?.used || 0
              }
            };
          }
          
          // Determine plan name
          if (subscriptionData.planName) {
            // Remove the "Plan" suffix if it exists to match backend enum
            processedSubscription.planName = subscriptionData.planName.replace(/\s+Plan$/i, '');
            
            // Also add a displayName property that includes the "Plan" suffix for UI display
            processedSubscription.displayName = subscriptionData.planName;
          } else if (subscriptionData.planId) {
            // Derive plan name from planId - WITHOUT the "Plan" suffix for backend compatibility
            const planIdLower = subscriptionData.planId.toLowerCase();
            
            if (planIdLower.includes('bronze')) {
              processedSubscription.planName = 'Bronze';
              processedSubscription.displayName = 'Bronze Plan';
            } else if (planIdLower.includes('silver')) {
              processedSubscription.planName = 'Silver';
              processedSubscription.displayName = 'Silver Plan';
            } else if (planIdLower.includes('unlimited')) {
              processedSubscription.planName = 'Unlimited';
              processedSubscription.displayName = 'Unlimited Plan';
            } else {
              processedSubscription.planName = 'Basic';
              processedSubscription.displayName = 'Basic Plan';
            }
            
            console.log('Plan name derived from planId:', processedSubscription.planName);
          }
        }
      }
      
      console.log('Final processed subscription data:', JSON.stringify(processedSubscription, null, 2));
      return processedSubscription;
    } catch (err) {
      console.error('Error fetching subscription:', err);
      return null;
    }
  };

  const refreshUserData = async () => {
    const userId = localStorage.getItem('user');
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userData = await fetchUserData(userId);
      const subscriptionData = await fetchSubscriptionData(userId);

      if (userData) {
        setUser({
          ...userData,
          subscription: subscriptionData || undefined,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('staySignedIn');
    setUser(null);
  };

  const canPostJob = () => {
    if (!user || !user.subscription) return false;
    
    // Check if subscription is active and user has job posts remaining
    return (
      isSubscriptionActive() && 
      user.subscription.features.jobPosting.used < user.subscription.features.jobPosting.limit
    );
  };

  const canDownloadResume = () => {
    if (!user || !user.subscription) return false;
    
    // Check if subscription is active and user has resume views remaining
    return (
      isSubscriptionActive() && 
      user.subscription.features.resumeViews.used < user.subscription.features.resumeViews.limit
    );
  };

  const incrementJobPostCount = async () => {
    if (!user || !user.subscription) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Update locally first for immediate feedback
      setUser({
        ...user,
        subscription: {
          ...user.subscription,
          features: {
            ...user.subscription.features,
            jobPosting: {
              ...user.subscription.features.jobPosting,
              used: user.subscription.features.jobPosting.used + 1
            }
          }
        }
      });

      // Then update on server
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/job-post-count`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      console.error('Error incrementing job post count:', err);
      // Revert the local update if server update fails
      await refreshUserData();
    }
  };

  const incrementResumeDownloadCount = async () => {
    if (!user || !user.subscription) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Update locally first for immediate feedback
      setUser({
        ...user,
        subscription: {
          ...user.subscription,
          features: {
            ...user.subscription.features,
            resumeViews: {
              ...user.subscription.features.resumeViews,
              used: user.subscription.features.resumeViews.used + 1
            }
          }
        }
      });

      // We don't need to call a separate endpoint as the resume view count
      // is incremented by the backend when downloading a resume.
      // Just refresh the data to ensure consistency
      await refreshUserData();
    } catch (err) {
      console.error('Error incrementing resume view count:', err);
      // Revert the local update if server update fails
      await refreshUserData();
    }
  };

  const getJobPostsRemaining = () => {
    if (!user || !user.subscription) return 0;
    
    const { limit, used } = user.subscription.features.jobPosting;
    return Math.max(0, limit - used);
  };

  const getResumeViewsRemaining = () => {
    if (!user || !user.subscription) return 0;
    
    const { limit, used } = user.subscription.features.resumeViews;
    return Math.max(0, limit - used);
  };

  const isSubscriptionActive = () => {
    if (!user || !user.subscription) return false;
    
    const expiryDate = new Date(user.subscription.expiryDate);
    return expiryDate > new Date();
  };

  const canViewCandidateDetails = () => {
    if (!user || !user.subscription) return false;
    
    // User can view candidate details if they have an active subscription
    // with resume views remaining
    return (
      isSubscriptionActive() && 
      user.subscription.features.resumeViews.used < user.subscription.features.resumeViews.limit
    );
  };

  const hasReachedCandidateViewLimit = () => {
    if (!user || !user.subscription) return true;
    
    // Check if the user has reached their candidate view limit
    if (!isSubscriptionActive()) return true;
    
    return user.subscription.features.resumeViews.used >= user.subscription.features.resumeViews.limit;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        setUser,
        logout,
        canPostJob,
        canDownloadResume,
        incrementJobPostCount,
        incrementResumeDownloadCount,
        getJobPostsRemaining,
        getResumeViewsRemaining,
        refreshUserData,
        isSubscriptionActive,
        canViewCandidateDetails,
        hasReachedCandidateViewLimit
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 