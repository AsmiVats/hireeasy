'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface JobPostButtonProps {
  className?: string;
  label?: string;
}

const JobPostButton = ({ 
  className = '', 
  label = 'Post a Job' 
}: JobPostButtonProps) => {
  const { canPostJob, getJobPostsRemaining, incrementJobPostCount, isSubscriptionActive, user } = useUser();
  const [isPosting, setIsPosting] = useState(false);
  const router = useRouter();
  
  const handlePostJob = async () => {
    if (!user) {
      // Redirect to login if not logged in
      router.push('/');
      return;
    }
    
    if (!isSubscriptionActive()) {
      // Redirect to subscription page if no active subscription
      router.push('/subscription');
      return;
    }
    
    if (!canPostJob()) {
      // Show an alert or redirect to upgrade subscription page
      alert('You have reached your job posting limit. Please upgrade your subscription to post more jobs.');
      router.push('/subscription');
      return;
    }
    
    // If user can post, proceed with posting
    setIsPosting(true);
    
    try {
      // Increment job post count
      await incrementJobPostCount();
      
      // Redirect to job post form
      router.push('/dashboard/post-job');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred while posting the job. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };
  
  const remainingPosts = getJobPostsRemaining();
  
  return (
    <div className="flex flex-col">
      <Button 
        onClick={handlePostJob}
        className={`bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded ${className}`}
        disabled={isPosting || !canPostJob()}
      >
        {isPosting ? 'Processing...' : label}
      </Button>
      
      {user && isSubscriptionActive() && (
        <div className="text-sm mt-1 flex items-center">
          <span className={remainingPosts > 0 ? 'text-green-600' : 'text-red-600'}>
            {remainingPosts} job posts remaining
          </span>
          {remainingPosts === 0 && (
            <AlertCircle className="w-4 h-4 ml-1 text-red-600" />
          )}
        </div>
      )}
    </div>
  );
};

export default JobPostButton; 