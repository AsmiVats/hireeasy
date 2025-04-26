'use client';
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Lock } from 'lucide-react';

interface CardDetails {
  cardNumber?: string;
  nameOnCard?: string;
  expiryDate?: string;
  email?: string;
  cvv?: string;
  country?: string;
}

interface SecureCheckoutProps {
  nameOnCard?: string;
  email?: string;
}

const SecureCheckout = ({ nameOnCard = '', email = '' }: SecureCheckoutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '2344 XXXX XXXX XX78',
    nameOnCard: nameOnCard || 'Tony Stark',
    expiryDate: '27/09',
    email: email || 'tonystark@starkindustries.com',
    cvv: '***',
    country: 'United States of America'
  });

  // Update card details when props change
  useEffect(() => {
    if (nameOnCard || email) {
      setCardDetails(prev => ({
        ...prev,
        nameOnCard: nameOnCard || prev.nameOnCard,
        email: email || prev.email
      }));
    }
  }, [nameOnCard, email]);

  return (
    <div className="border-[2px] border-[#D9D9D9] max-w-[851px] mx-auto rounded-lg mt-[30px]">

      <div className="rounded-lg p-6">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5" />
            <h2 className="text-[17px] text-[#1E1E1E]">Secure checkout</h2>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-4 ml-[30px]">
            <div>
                <p className="text-[15px] text-[#293E40]">Credit card details</p>
              </div>
            <div className="grid grid-cols-2">
            
              <div>
                <p className="text-[15px] text-[#AEB4C1]">Card number - {cardDetails.cardNumber}</p>
              </div>
              <div>
                <p className="text-[15px] text-[#AEB4C1]">Name on the card - {cardDetails.nameOnCard}</p>
              </div>
              <div>
                <p className="text-[15px] text-[#AEB4C1]">Date of Expiry - {cardDetails.expiryDate}</p>
              </div>
              <div>
                <p className="text-[15px] text-[#AEB4C1]">Email Address - {cardDetails.email}</p>
              </div>
              <div>
                <p className="text-[15px] text-[#AEB4C1]">CVV - {cardDetails.cvv}</p>
              </div>
              <div>
                <p className="text-[15px] text-[#AEB4C1]">Country - {cardDetails.country}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureCheckout;