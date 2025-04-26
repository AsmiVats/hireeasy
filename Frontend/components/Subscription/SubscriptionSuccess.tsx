'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SubscriptionSuccessProps {
  accountName?: string;
  savedAmount?: string;
  endDate?: string;
  planName?: string;
}

const SubscriptionSuccess = ({
  accountName = 'Account name',
  savedAmount = '$XXX',
  endDate = '22.2.26',
  planName = 'Premium'
}: SubscriptionSuccessProps) => {
  return (
    <div className="flex h-[83vh]">
      <div className="text-center max-w-[851px] mx-auto px-4">
        <h1 className="text-[36px] font-bold text-[#293E40] mb-[20px] mt-[125px] tracking-normal">
          Subscribed successfully
        </h1>
        
        <p className="text-[26px] text-[#13B5CF] mb-12 leading-8">
          Congratulations! {accountName}, You are now a premium member of Hireeasy.
        </p>
        
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-xl text-green-800 font-semibold mb-2">{planName} Plan Activated</h2>
          <p className="text-[16px] text-[#1E1E1E] mb-2">
            You have saved {savedAmount} by opting annual plan.
          </p>
          <p className="text-[16px] text-[#1E1E1E]">
            Your subscription will be active until <span className="font-medium">{endDate}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/candidates"
            className="inline-flex items-center gap-2 text-[15px] text-[#293E40] border border-[#13B5CF] rounded-sm px-6 py-3 hover:bg-[#13B5CF] opacity-60 hover:text-white transition-colors"
          >
            Search talents now
            <ArrowRight className="w-5 h-5" />
          </Link>
          
        
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;