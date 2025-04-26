'use client'
import { useState } from "react";
import { TriangleAlert } from 'lucide-react';
import { toast } from "react-hot-toast";

interface AddressSectionProps {
  onNext: () => void;
  onBack: () => void;
  data?: {
    address: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
  updateData?: (section: string, data: any) => void;
}

const AddressSection = ({ onNext, onBack, data, updateData }: AddressSectionProps) => {
  const [formData, setFormData] = useState({
    address: data?.address || "",
    city: data?.city || "",
    state: data?.state || "",
    zipcode: data?.zipcode || "",
    country: data?.country || "United States"
  });

  const [errors, setErrors] = useState({
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: ""
  });

  const validateForm = () => {
    const newErrors = {
      address: "",
      city: "",
      state: "",
      zipcode: "",
      country: ""
    };

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    // Zipcode validation
    if (!formData.zipcode.trim()) {
      newErrors.zipcode = "Zip code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipcode)) {
      newErrors.zipcode = "Please enter a valid zip code";
    }

    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (updateData) {
        updateData('address', formData.address);
        updateData('city', formData.city);
        updateData('state', formData.state);
        updateData('zipcode', formData.zipcode);
        updateData('country', formData.country);
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
          <h3 className="text-[18px] font-medium text-[#293E40]">Address of Residence</h3>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              Address 1 <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                errors.address ? 'border-[#900B09]' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.address}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              City <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                errors.city ? 'border-[#900B09]' : 'border-gray-300'
              }`}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.city}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              State <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                errors.state ? 'border-[#900B09]' : 'border-gray-300'
              }`}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.state}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                Zip code <span className="text-[#900B09]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="08067"
                  value={formData.zipcode}
                  onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                    errors.zipcode ? 'border-[#900B09]' : 'border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.zipcode && (
                <p className="mt-1 text-sm text-[#900B09] flex items-center">
                  <TriangleAlert className="h-4 w-4 mr-2" />
                  {errors.zipcode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                Country <span className="text-[#900B09]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                    errors.country ? 'border-[#900B09]' : 'border-gray-300'
                  }`}
                  placeholder="United States"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.country && (
                <p className="mt-1 text-sm text-[#900B09] flex items-center">
                  <TriangleAlert className="h-4 w-4 mr-2" />
                  {errors.country}
                </p>
              )}
            </div>
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

export default AddressSection;