"use client";
import React, { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import ProgressBar from "@/components/EmployerProfile/ProgressBar";
interface AddJobDetailsPage2Props {
  onNext?: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

import { useEmployerProfileStore } from '@/store/employerProfile';

const AddJobDetailsPage2 = ({ onNext, onBack, currentStep, totalSteps }: AddJobDetailsPage2Props) => {
  const { formData: storeData, updateFormData } = useEmployerProfileStore();
  const [formData, setFormData] = useState({
    jobType: storeData.jobType || '',
    experience: storeData.experience.toString() || '0',
    minRange: storeData.payRange.min.toString() || '',
    maxRange: storeData.payRange.max.toString() || '',
    payType: 'Monthly',
    benefits: new Set<string>(storeData.benefits || [])
  });

  const [errors, setErrors] = useState({
    jobType: '',
    minRange: '',
    maxRange: '',
    benefits: ''
  });

  const validateForm = () => {
    const newErrors = {
      jobType: '',
      minRange: '',
      maxRange: '',
      benefits: ''
    };

    if (!formData.jobType.trim()) {
      newErrors.jobType = 'Job type is required';
    }

    if (!formData.minRange) {
      newErrors.minRange = 'Minimum range is required';
    }

    if (!formData.maxRange) {
      newErrors.maxRange = 'Maximum range is required';
    } else if (parseInt(formData.maxRange) <= parseInt(formData.minRange)) {
      newErrors.maxRange = 'Maximum range should be greater than minimum range';
    }

    if (formData.benefits.size === 0) {
      newErrors.benefits = 'Please select at least one benefit';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  

  const handleBenefitToggle = (benefit: string) => {
    const newBenefits = new Set(formData.benefits);
    if (newBenefits.has(benefit)) {
      newBenefits.delete(benefit);
    } else {
      newBenefits.add(benefit);
    }
    setFormData(prev => ({ ...prev, benefits: newBenefits }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    updateFormData({
      jobType: formData.jobType,
      experience: parseInt(formData.experience),
      payRange: {
        min: parseInt(formData.minRange),
        max: parseInt(formData.maxRange)
      },
      benefits: Array.from(formData.benefits)
    });
    if (onNext) onNext();
  };
  

  const benefitOptions = [
    'Health insurance',
    'Paid time off',
    'Dental insurance',
    '401(k)',
    'Vision insurance',
    'Flexible schedule',
    'Tuition reimbursement',
    'Life insurance',
    '401(k) matching',
    'Retirement plan',
    'Referral program',
    'Employee discount',
    'Flexible spending account',
    'Health savings account',
    'Relocation assistance',
    'Parental leave',
    'Professional development assistance',
    'Employee assistance program',
    'Signing Bonus',
    'Stock Options',
    'Quarterly  Bonus',
    'Half Yearly Bonus',
    'Yearly Bonus',
    'Other'
  ];

  return (
    <div className="min-h-screen flex justify-center pt-10 sm:pt-[100px] px-2 sm:px-0">
      <div className="w-full max-w-[95vw] sm:max-w-[550px]">
        <h1 className="text-2xl sm:text-[36px] font-bold text-center text-[#293E40] mb-6 sm:mb-[25px]">
          Create a new job
        </h1>
        <h2 className="mb-6 sm:mb-[25px] text-lg sm:text-[26px] text-center opacity-60 text-[#13B5CF]">
          Add job details - page 2
        </h2>
        <ProgressBar currentStep={currentStep || 0} totalSteps={totalSteps || 0} />
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
          <label className="block text-sm font-medium label_color">
            Job type <span className="text-[#900B09]">*</span>
          </label>
          <select 
            value={formData.jobType}
            onChange={(e) => setFormData(prev => ({...prev, jobType: e.target.value }))}
            className={`mt-1 block w-full rounded-sm border px-3 py-2 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
              errors.jobType ? 'border-b-[#900B09]' : 'border-gray-300'
            }`}
          >
            <option value="">Select job type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="temptohire">Temp to hire</option>
            <option value="Internship">Internship</option>
            <option value="Temporary">Temporary</option>
            <option value="contract">Contract</option>
          </select>
          </div>
          <div>
          
          {errors.jobType && (
            <p className="mt-4 text-sm text-[#900B09] flex items-center">
              <TriangleAlert className="mr-4 h-4 w-4" /> {errors.jobType}
            </p>
          )}
          </div>

          <div>
            <label className="block text-sm font-medium label_color">
              Experience (in years) <span className="text-[#900B09]">*</span>
            </label>
            <select
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              className="mt-1 block w-full rounded-sm border border-gray-300 px-3 py-2 shadow-sm focus:border-[#13B5CF] focus:outline-none focus:ring-1 focus:ring-[#13B5CF]"
            >
              {[...Array(21)].map((_, i) => (
                <option key={i} value={i}>{i} years</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium label_color">
              Min. Range <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="number"
              value={formData.minRange}
              onChange={(e) => setFormData(prev => ({ ...prev, minRange: e.target.value }))}
              className={`mt-1 block w-full rounded-sm border px-3 py-2 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                errors.minRange ? 'border-b-[#900B09]' : 'border-gray-300'
              }`}
              placeholder="$10K"
            />
            {errors.minRange && (
              <p className="mt-4 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="mr-4 h-4 w-4" /> {errors.minRange}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium label_color">
              Max Range <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="number"
              value={formData.maxRange}
              onChange={(e) => setFormData(prev => ({ ...prev, maxRange: e.target.value }))}
              className={`mt-1 block w-full rounded-sm border px-3 py-2 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                errors.maxRange ? 'border-b-[#900B09]' : 'border-gray-300'
              }`}
              placeholder="$50K"
            />
            {errors.maxRange && (
              <p className="mt-4 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="mr-4 h-4 w-4" /> {errors.maxRange}
              </p>
            )}
          </div>
          </div>

          <div>
            <label className="block text-sm font-medium label_color">
              Pay type <span className="text-[#900B09]">*</span>
            </label>
            <select
              value={formData.payType}
              onChange={(e) => setFormData(prev => ({ ...prev, payType: e.target.value }))}
              className="mt-1 block w-full rounded-sm border border-gray-300 px-3 py-2 shadow-sm focus:border-[#13B5CF] focus:outline-none focus:ring-1 focus:ring-[#13B5CF]"
            >
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
              <option value="Hourly">Hourly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium label_color mb-[20px]">
              Benefits <span className="text-[#900B09]">*</span>
            </label>
            <div className={`flex flex-wrap gap-2 border rounded-sm p-4 ${
            errors.benefits ? 'border-b-[#900B09]' : 'border-gray-300'
          }`}>
              {benefitOptions.map((benefit) => (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => handleBenefitToggle(benefit)}
                  className={`rounded-sm px-4 py-2 text-sm border ${
                    formData.benefits.has(benefit)
                      ? 'bg-[#13B5CF] text-white border-[#13B5CF]'
                      : 'bg-white text-[#293E40] border-[#D9D9D9] hover:border-[#13B5CF]'
                  }`}
                >
                  {benefit}
                </button>
              ))}
            </div>
            {errors.benefits && (
            <p className="mt-4 text-sm text-[#900B09] flex items-center">
              <TriangleAlert className="mr-4 h-4 w-4" /> {errors.benefits}
            </p>
          )}
          </div>

          <div className="mt-8 flex flex-row  sm:flex-row justify-between gap-4">
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

export { AddJobDetailsPage2 };