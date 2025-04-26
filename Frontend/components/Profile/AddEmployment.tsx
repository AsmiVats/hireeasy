'use client'
import { useState } from "react";
import { TriangleAlert } from 'lucide-react';
import { toast } from "react-hot-toast";

interface AddEmploymentProps {
  onNext: () => void;
  onBack: () => void;
  data?: {
    jobTitle?: string;
    companyName?: string;
    fromDate?: string;
    toDate?: string;
    experienceInCompany?: string;
  };
  updateData?: (section: string, data: any) => void;
}

const AddEmployment = ({ onNext, onBack, data, updateData }: AddEmploymentProps) => {
  const [formData, setFormData] = useState({
    jobTitle: data?.jobTitle || "",
    companyName: data?.companyName || "",
    fromDate: data?.fromDate || "",
    toDate: data?.toDate || "",
    experienceInCompany: data?.experienceInCompany || "1 year"
  });

  const [errors, setErrors] = useState({
    jobTitle: "",
    companyName: "",
    fromDate: "",
    toDate: "",
    experienceInCompany: ""
  });

  const validateForm = () => {
    const newErrors = {
      jobTitle: "",
      companyName: "",
      fromDate: "",
      toDate: "",
      experienceInCompany: ""
    };

    // Job title validation
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

    // Company name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    // From date validation
    if (!formData.fromDate.trim()) {
      newErrors.fromDate = "From date is required";
    }

    // To date validation
    if (!formData.toDate.trim()) {
      newErrors.toDate = "To date is required";
    }

    // Experience validation
    if (!formData.experienceInCompany.trim()) {
      newErrors.experienceInCompany = "Experience is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (updateData) {
        updateData('jobTitle', formData.jobTitle);
        updateData('companyName', formData.companyName);
        updateData('fromDate', formData.fromDate);
        updateData('toDate', formData.toDate);
        updateData('experienceInCompany', formData.experienceInCompany);
      }
      onNext();
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

  return (
    <div className="min-h-screen flex justify-center pt-[60px] pb-[90px]">
      <div className="w-full max-w-[550px]">
        <h1 className="text-[36px] font-bold text-center text-[#293E40] mb-[25px]">
          Build your job seeker profile
        </h1>
        
        <h2 className="mb-[45px] text-[26px] text-center text-[#13B5CF]">
          You haven't created your profile yet. To find the best jobs create your profile.
        </h2>

        <div className="mb-[30px]">
          <h3 className="text-[18px] font-medium text-[#293E40]">Add Employment details</h3>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              Job title <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                errors.jobTitle ? 'border-[#900B09]' : 'border-gray-300'
              }`}
            />
            {errors.jobTitle && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.jobTitle}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              Company name <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                errors.companyName ? 'border-[#900B09]' : 'border-gray-300'
              }`}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.companyName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                From date <span className="text-[#900B09]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="MM / YY"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                    errors.fromDate ? 'border-[#900B09]' : 'border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.fromDate && (
                <p className="mt-1 text-sm text-[#900B09] flex items-center">
                  <TriangleAlert className="h-4 w-4 mr-2" />
                  {errors.fromDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                To date <span className="text-[#900B09]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="MM / YY"
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                    errors.toDate ? 'border-[#900B09]' : 'border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.toDate && (
                <p className="mt-1 text-sm text-[#900B09] flex items-center">
                  <TriangleAlert className="h-4 w-4 mr-2" />
                  {errors.toDate}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              Total experience in the company <span className="text-[#900B09]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.experienceInCompany}
                onChange={(e) => setFormData({ ...formData, experienceInCompany: e.target.value })}
                className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                  errors.experienceInCompany ? 'border-[#900B09]' : 'border-gray-300'
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            {errors.experienceInCompany && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.experienceInCompany}
              </p>
            )}
          </div>

          <div className="flex justify-between mt-20">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 mt-10 rounded-sm transition-colors bg-[#6B7280] text-white hover:bg-[#4B5563]"
            >
              Back
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2 mt-10 rounded-sm transition-colors bg-[#13B5CF] text-white hover:bg-[#009951]"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployment;