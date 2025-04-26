"use client";
import React, { useState, useEffect } from 'react';
import ProgressBar from "@/components/EmployerProfile/ProgressBar";
import { TriangleAlert } from 'lucide-react';

interface AddJobDetailsPage1Props {
  onNext?: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

import { useEmployerProfileStore } from '@/store/employerProfile';

const AddJobDetailsPage1 = ({ onNext, onBack, currentStep, totalSteps }: AddJobDetailsPage1Props) => {
  const { formData: storeData, updateFormData } = useEmployerProfileStore();
  const [formData, setFormData] = useState({
    jobTitle: storeData.title || '',
    numberOfHires: storeData.noOfPeople.toString() || '10',
    jobLocationType: storeData.jobLocationType || 'Full time',
    location: storeData.location.city || ''
  });
  const [errors, setErrors] = useState({
    jobTitle: '',
    location: '',
  });
  useEffect(() => {
    setFormData({
      jobTitle: storeData.title || '',
      numberOfHires: storeData.noOfPeople.toString() || '10',
      jobLocationType: storeData.jobLocationType || 'Full time',
      location: storeData.location.city || ''
    });
  }, [storeData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {
      jobTitle: '',
      location: '',
    };

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    updateFormData({
      ...storeData, // Preserve existing data
      title: formData.jobTitle,
      noOfPeople: parseInt(formData.numberOfHires),
      jobLocationType: formData.jobLocationType,
      location: {
        ...storeData.location,
        city: formData.location
      }
    });
    if (onNext) onNext();
  };

  return (
    <div className="min-h-screen flex justify-center pt-10 sm:pt-[100px] px-2 sm:px-0">
      <div className="w-full max-w-[95vw] sm:max-w-[550px]">
        <h1 className="text-2xl sm:text-[36px] font-bold text-center text-[#293E40] mb-6 sm:mb-[25px]">
          Create a new job
        </h1>
        <h2 className="mb-6 sm:mb-[25px] text-lg sm:text-[26px] text-center opacity-60 text-[#13B5CF]">
          Add job details - page 1
        </h2>
        <ProgressBar currentStep={currentStep || 0} totalSteps={totalSteps || 0} />
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium label_color">
              Job title <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-sm border px-3 py-2 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                errors.jobTitle ? 'border-b-[#900B09]' : 'border-gray-300'
              }`}
              required
            />
             {errors.jobTitle && (
            <p className="mt-4 text-sm text-[#900B09] flex items-center">
              <TriangleAlert className="mr-4 h-4 w-4" /> {errors.jobTitle}
            </p>
          )}
          </div>
          
          <div>
            <label className="block text-sm font-medium label_color">
              Number of people you wish to hire for this job <span className="text-[#900B09]">*</span>
            </label>
            <select
              name="numberOfHires"
              value={formData.numberOfHires}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-sm border border-gray-300 px-3 py-2 shadow-sm focus:border-[#13B5CF] focus:outline-none focus:ring-1 focus:ring-[#13B5CF]"
            >
              {[...Array(20)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium label_color">
              Job Location Type <span className="text-[#900B09]">*</span>
            </label>
            <select
              name="jobLocationType"
              value={formData.jobLocationType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-sm border border-gray-300 px-3 py-2 shadow-sm focus:border-[#13B5CF] focus:outline-none focus:ring-1 focus:ring-[#13B5CF]"
            >
              <option value="in person">In Person</option>
              <option value="Fully Remote">Fully Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="Travelling">Travelling</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium label_color">
              Location <span className="text-[#900B09]">*</span>
            </label>
            <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-sm border px-3 py-2 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
              errors.location ? 'border-b-[#900B09]' : 'border-gray-300'
            }`}
          />
          {errors.location && (
            <p className="mt-4 text-sm text-[#900B09] flex items-center">
              <TriangleAlert className="mr-4 h-4 w-4" /> {errors.location}
            </p>
          )}
          </div>

          <div className="mt-8 flex flex-row sm:flex-row justify-between gap-4">
            <button 
              className="w-full sm:w-auto px-6 py-2 mt-4 sm:mt-10 rounded-sm transition-colors bg-[#293E40] text-white #009951"
              onClick={onBack}
            >
              Back
            </button>
            <button
                type="submit"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-6 py-2 mt-4 sm:mt-10 rounded-sm transition-colors bg-[#13B5CF] text-white #009951"
              >
                Continue
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { AddJobDetailsPage1 };