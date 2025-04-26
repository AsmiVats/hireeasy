'use client'
// @ts-nocheck
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProfileSuccessProps {
  data?: {
    name?: string;
  };
}

const ProfileSuccess = ({ data }: ProfileSuccessProps) => {
  const userName = data?.name || "Account name";

  return (
    <div className="min-h-screen flex justify-center pt-[60px] pb-[90px]">
      <div className="w-full max-w-[550px] flex flex-col items-center">
        <h1 className="text-[36px] font-bold text-center text-[#293E40] mb-[25px] leading-[30px]">
          Your Profile built successfully
        </h1>
        
        <h2 className="mb-[45px] text-[26px] text-center text-[#13B5CF]">
          Congratulations! {userName},<br />
          Your Job profile built successfully.
        </h2>

        <Link 
          href="/search-jobs"
          className="inline-flex items-center px-6 py-3 border border-[#13B5CF] text-[#13B5CF] rounded-sm hover:bg-[#009951] transition-colors"
        >
          Search jobs now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default ProfileSuccess;