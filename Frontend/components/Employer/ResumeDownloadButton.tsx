'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@/app/context/UserContext';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { MapPin, Download, ExternalLink } from "lucide-react";
import { toast } from 'react-hot-toast';

interface ResumeDownloadButtonProps {
  className?: string;
  candidateId?: string;
  resumeUrl?: string;
  label?: ReactNode;
}

const ResumeDownloadButton = ({ 
  className = '', 
  candidateId,
  resumeUrl,
  label = 'Download Resume'
}: ResumeDownloadButtonProps) => {
  const { canDownloadResume, getResumeViewsRemaining, incrementResumeDownloadCount, isSubscriptionActive, user } = useUser();
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  
  const handleDownloadResume = async () => {
    if (!user) {
      // Redirect to login if not logged in
      toast.error("Please log in to download resumes");
      router.push('/login');
      return;
    }
    
    if (!isSubscriptionActive()) {
      // Redirect to subscription page if no active subscription
      toast.error("You need an active subscription to download resumes");
      router.push('/subscription');
      return;
    }
    
    if (!canDownloadResume()) {
      // Show an alert or redirect to upgrade subscription page
      toast.error("You've reached your resume download limit. Please upgrade your subscription.");
      router.push('/subscription');
      return;
    }
    
    // If user can download, proceed with download
    setIsDownloading(true);
    
    try {
      // Make API call to download resume (backend will handle permission validation)
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      let response;
      // Different paths depending on whether we have a resume URL or candidate ID
      if (resumeUrl) {
        // For direct URL downloads, make a server request to validate and track usage
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/download-resume?url=${encodeURIComponent(resumeUrl)}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else if (candidateId) {
        // For candidate profile, make an API call to increment usage and get the download URL
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription/candidate-resume/${candidateId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        throw new Error('Either candidateId or resumeUrl must be provided');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to download resume');
      }
      
      // If backend approved, get the resume URL and open it
      const data = await response.json();
      if (data.resumeLink) {
        window.open(data.resumeLink, '_blank');
        
        // Update the UI with the incremented resume count
        incrementResumeDownloadCount();
        
        toast.success(`Resume downloaded successfully! You have ${getResumeViewsRemaining() - 1} resume views remaining.`);
      } else {
        throw new Error('No resume link found');
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred while downloading the resume. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const remainingViews = getResumeViewsRemaining();
  
  return (
    <div className="flex flex-col">
      <button 
        onClick={handleDownloadResume}
        className={className}
        disabled={isDownloading || !canDownloadResume()}
      >
        {isDownloading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></span>
            Processing...
          </>
        ) : (
          <>
            {label}
            <Download className="h-4 w-4 ml-2" />
          </>
        )}
      </button>
      
      {/* {user && isSubscriptionActive() && (
        <div className="text-sm mt-1 flex items-center">
          <span className={remainingViews > 0 ? 'text-green-600' : 'text-red-600'}>
            {remainingViews} resume views remaining
          </span>
          {remainingViews === 0 && (
            <AlertCircle className="w-4 h-4 ml-1 text-red-600" />
          )}
        </div>
      )} */}
    </div>
  );
};

export default ResumeDownloadButton;