'use client'
import { useState } from "react";
import { TriangleAlert } from 'lucide-react';
import { toast } from "react-hot-toast";

interface PersonalInfoProps {
  onNext: () => void;
  data?: {
    name: string;
    phone: string;
    dob: string;
    experience: string;
  };
  updateData?: (section: string, data: any) => void;
}

const PersonalInfo = ({ onNext, data, updateData }: PersonalInfoProps) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    phone: data?.phone || "",
    dateOfBirth: data?.dob || "",
    experience: data?.experience || "10 years"
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    experience: ""
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      dateOfBirth: "",
      experience: ""
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.name)) {
      newErrors.name = "Please enter a valid name";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Date of Birth validation
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\s*\/\s*(0[1-9]|1[0-2])\s*\/\s*\d{2}$/;
      if (!dateRegex.test(formData.dateOfBirth)) {
        newErrors.dateOfBirth = "Please enter date in DD/MM/YY format";
      }
    }

    // Experience validation
    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (updateData) {
        updateData('name', formData.name);
        updateData('phone', formData.phone);
        updateData('dob', formData.dateOfBirth);
        updateData('experience', formData.experience);
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
          <h3 className="text-[18px] font-medium text-[#293E40]">Personal info</h3>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              Your first and last name <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                errors.name ? 'border-[#900B09]' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              Your phone number <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                errors.phone ? 'border-[#900B09]' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.phone}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                Date of Birth <span className="text-[#900B09]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="DD / MM / YY"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                    errors.dateOfBirth ? 'border-[#900B09]' : 'border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-[#900B09] flex items-center">
                  <TriangleAlert className="h-4 w-4 mr-2" />
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                Total years of experience <span className="text-[#900B09]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                    errors.experience ? 'border-[#900B09]' : 'border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.experience && (
                <p className="mt-1 text-sm text-[#900B09] flex items-center">
                  <TriangleAlert className="h-4 w-4 mr-2" />
                  {errors.experience}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-20">
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

export default PersonalInfo;