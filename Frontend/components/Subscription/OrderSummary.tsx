'use client';
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, FileText } from 'lucide-react';

interface OrderSummaryProps {
  planName?: string;
  oneTimeCharge?: number;
  taxes?: number;
  renewalDate?: string;
  duration?: string;
}

const OrderSummary = ({ 
  planName = 'Premium Subscription Hireeasy - Unlimited',
  oneTimeCharge = 5000.00,
  taxes = 15.00,
  renewalDate = 'January 20, 2025',
  duration = '1 year'
}: OrderSummaryProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Calculate the total
  const total = oneTimeCharge + taxes;

  // Log to verify re-rendering with props
  useEffect(() => {
    console.log('OrderSummary received updated props:', { planName, oneTimeCharge, taxes, duration, renewalDate });
  }, [planName, oneTimeCharge, taxes, duration, renewalDate]);

  return (
    <div className="max-w-[851px] mx-auto border-[2px] border-[#D9D9D9] rounded-lg mt-[30px] mb-[30px] ">
      <div className="rounded-lg p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#293E40]" />
            <h2 className="text-[17px] font-medium text-[#1E1E1E]">Order Summary</h2>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-4 ml-[30px]">
            <p className="text-[15px] text-[#5A5A5A] font-meduim">{planName}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between text-[14px]  ">
                <span className="text-[#5A5A5A] font-meduim ">One time charges</span>
                <span className="text-[#5A5A5A]">${oneTimeCharge.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-[14px]">
                <span className="text-[#5A5A5A]  font-meduim">Taxes</span>
                <span className="text-[#5A5A5A]   font-meduim">${taxes.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between text-[14px]">
                  <span className="text-[#5A5A5A]  font-meduim">Subtotal Today</span>
                  <span className="text-[#5A5A5A]  font-meduim">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-[13px] text-[#AEB4C1]">
                Your plan begins today and will be valid for {duration}.
              </p>
              <p className="text-[13px] text-[#AEB4C1]">
                Your payment method will be charged ${oneTimeCharge.toFixed(2)} (plus applicable taxes).
              </p>
              <p className="text-[13px] text-[#AEB4C1]">
                To avoid charges for next month, cancel before {renewalDate}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;