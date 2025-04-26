"use client";
import React, { useState } from "react";
import { TriangleAlert } from 'lucide-react';
import { useEmployerProfileStore } from '@/store/employerProfile';
import ProgressBar from "@/components/EmployerProfile/ProgressBar";
interface StepFourProps {
  onNext?: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const StepFour = ({ onNext, onBack, currentStep, totalSteps }: StepFourProps) => {
  const { formData: storeData, updateFormData } = useEmployerProfileStore();
  const [emails, setEmails] = useState<string[]>([
    storeData.email || '',
    storeData.alternativeEmail1 || '',
    storeData.alternativeEmail2 || ''
  ]);
  const [errors, setErrors] = useState({
    primaryEmail: ''
  });
  const maxEmails = 2;

  const validateForm = () => {
    const newErrors = {
      primaryEmail: ''
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emails[0]) {
      newErrors.primaryEmail = 'Primary email is required';
    } else if (!emailRegex.test(emails[0])) {
      newErrors.primaryEmail = 'Please enter a valid email address';
    }

    

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleAddEmail = () => {
    if (emails.length < maxEmails) {
      setEmails([...emails, ""]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateFormData({
      email: emails[0],
      alternativeEmail1: emails[1] || '',
      alternativeEmail2: emails[2] || ''
    });
    if (onNext) onNext();
  };

  return (
    <div className="min-h-screen flex justify-center pt-[100px] px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-[550px]">
      <h1 className="text-[28px] sm:text-[36px] font-bold text-center text-[#293E40] mb-[20px] sm:mb-[25px]">
        Create a new job
      </h1>
      <h2 className="mb-[20px] sm:mb-[25px] text-[20px] sm:text-[26px] text-center opacity-60 text-[#13B5CF]">
        Communication Preferences
      </h2>
      <ProgressBar currentStep={currentStep || 0} totalSteps={totalSteps || 0} />
      <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm label_color">
            Send Application profile to{" "}
            <span className="text-[#900B09]">*</span>
          </label>
          <input
            type="email"
            value={emails[0]}
            onChange={(e) => handleEmailChange(0, e.target.value)}
            className={`w-full rounded-sm border p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
              errors.primaryEmail ? 'border-b-[#900B09]' : 'border-gray-300'
            }`}
          />
          {errors.primaryEmail && (
            <p className="mt-4 text-sm text-[#900B09] flex items-center">
              <TriangleAlert className="mr-4 h-4 w-4" /> {errors.primaryEmail}
            </p>
          )}
        </div>

        {emails.slice(1).map((email, index) => (
          <div key={index + 1}>
            <label className="mb-1 block text-sm label_color">
              Add alternative email address {index + 1}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index + 1, e.target.value)}
                className="w-full rounded-sm border p-2 pr-10"
              />
              <button
                type="button"
                onClick={() => handleRemoveEmail(index + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ⨯
              </button>
            </div>
          </div>
        ))}

        {emails.length < maxEmails && (
          <div>
            <button
              type="button"
              onClick={handleAddEmail}
              className="flex items-center rounded-sm border border-blue-500 px-4 py-2 text-[#13B5CF] #009951"
            >
              Add another email <span className="ml-2">+</span>
            </button>
            <p className="mt-2 text-sm text-gray-400">
              Add up to {maxEmails} alternate email ids
            </p>
          </div>
        )}

         <div className="mt-8 flex flex-row  sm:flex-row justify-between gap-4">
          <button
              className="w-full sm:w-auto mt-4 sm:mt-10 rounded-sm bg-[#293E40] px-6 py-2 text-white transition-colors #009951"
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
              className="w-full sm:w-auto mt-4 sm:mt-10 rounded-sm bg-[#13B5CF] px-6 py-2 text-white transition-colors #009951"
          >
            Job Preview
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export { StepFour };
