"use client";
import React, { useState } from 'react';
import {SecuritySection} from './SecuritySection'
import {Subscription} from './Subscription'
import { ProfileSection } from './ProfileSection';
interface ProfileInfo {
  name: string;
  company: string;
  location: string;
  companyDescription: string;
}

export const SettingsSection = () => {
  const [activeSettingTab, setActiveSettingTab] = useState('profile');
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: 'Tony Stark',
    company: 'Stark Industries Ltd.',
    location: 'New York City, NY 9090',
    companyDescription: 'At Innovexa Technologies, we prioritize user-centric design and seamless functionality, ensuring our products are both intuitive and high-performing. Our agile development approach allows us to adapt quickly to market trends and client demands, delivering high-quality solutions within optimal timeframes.\n\nWe serve clients across industries, including finance, healthcare, e-commerce, and logistics. Our commitment to innovation, reliability, and excellence has earned us a reputation for delivering impactful digital transformations.\n\nBeyond development, we provide IT consulting, system integration, and continuous support to help businesses thrive in an ever-evolving tech landscape. Whether you\'re a startup or an enterprise, Innovexa Technologies is your trusted partner for driving digital success.'
  });

  const renderContent = () => {
    switch (activeSettingTab) {
      case 'profile':
        return (
          <ProfileSection/>
        );
      case 'security':
        return (
          <div>
           <SecuritySection/>
          </div>
        );
      case 'subscription':
        return (
          <div>
            <Subscription/>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {/* Settings Navigation */}
      <div className="w-64 border-r bg-white p-6" style={{borderLeft:"1px solid #D9D9D9"}}>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
        <nav className="space-y-2" >
          <button
            onClick={() => setActiveSettingTab('profile')}
            className={`w-full text-left px-3 py-2 rounded-sm ${
              activeSettingTab === 'profile' 
                ? 'text-[#13B5CF] #009951' 
                : 'text-[#293E40] #009951'
            }`}
          >
            Profile & Account
          </button>
          <button
            onClick={() => setActiveSettingTab('security')}
            className={`w-full text-left px-3 py-2 rounded-sm ${
              activeSettingTab === 'security' 
                ? 'text-[#13B5CF] #009951' 
                : 'text-[#293E40] #009951'
            }`}
          >
            Sign in & Security
          </button>
          <button
            onClick={() => setActiveSettingTab('subscription')}
            className={`w-full text-left px-3 py-2 rounded-sm ${
              activeSettingTab === 'subscription' 
                ? 'text-[#13B5CF] #009951' 
                : 'text-[#293E40] #009951'
            }`}
          >
            Subscription & Payments
          </button>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 bg-white">
        {renderContent()}
      </div>
    </div>
  );
};