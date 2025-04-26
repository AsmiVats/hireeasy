'use client';
import React, { useState, useEffect } from 'react';
import { useEmployerProfileStore } from '@/store/employerProfile';
import ProgressBar from "@/components/EmployerProfile/ProgressBar";
import { TriangleAlert } from 'lucide-react';
interface StepOneProps {
  onNext?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const StepOne = ({ onNext,currentStep,totalSteps }: StepOneProps) => {
  const { formData, updateFormData } = useEmployerProfileStore();
  const [localFormData, setLocalFormData] = useState({
    companyName: '',
    name: '',
    phone: '',
    companyLogo: ''
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [errors, setErrors] = useState({
    companyName: '',
    name: '',
    phone: ''
  });

  const validateForm = () => {
    const newErrors = {
      companyName: '',
      name: '',
      phone: ''
    };

    if (!localFormData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!localFormData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!localFormData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(localFormData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };


  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload an image file (JPEG, PNG, or GIF)');
      return;
    }

    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`https://now-edge-six.vercel.app/uploadFile`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      setLocalFormData(prev => ({
        ...prev,
        companyLogo: file.name
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };
  // Add this near the beginning of the component, after the state declarations
  useEffect(() => {
    // Initialize local form data from the store
    if (formData) {
      setLocalFormData({
        companyName: formData.companyName || '',
        name: formData.name || '',
        phone: formData.phone || '',
        companyLogo: formData.companyLogo || ''
      });
    }
  }, [formData]);
  
  // Update the handleSubmit function to preserve existing data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const employerID = typeof window !== 'undefined' ? localStorage.getItem('user') || '' : '';
    
    // Preserve existing data while updating with new values
    updateFormData({
      ...formData, // Keep existing data
      phone: localFormData.phone,
      companyName: localFormData.companyName,
      name: localFormData.name,
      employerId: employerID.replace(/\\/g, ''),
      companyLogo: localFormData.companyLogo,
    });
    
    if (onNext) onNext();
  };

  return (
    <div className="min-h-screen flex justify-center pt-10 sm:pt-[100px] px-2 sm:px-0">
      <div className="w-full max-w-[95vw] sm:max-w-[550px]">
        <h1 className="text-2xl sm:text-[36px] font-bold text-center text-[#293E40] mb-6 sm:mb-[25px]">
          Create an Employer profile
        </h1>
        
        <h2 className="mb-6 sm:mb-[25px] text-lg sm:text-[26px] text-center opacity-60 text-[#13B5CF]">
          You haven't posted a job before, so you'll need to create an employer account.
        </h2>
        <ProgressBar currentStep={currentStep || 0} totalSteps={totalSteps || 0} />
        <form className="space-y-6">
        <div>
          <label className="block text-sm label_color mb-1">
            Your company name <span className="text-[#900B09]">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={localFormData.companyName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
              errors.companyName ? 'border-b-[#900B09]' : 'border-gray-300'
            }`}
          />
          {errors.companyName && (
            <p className="mt-4 text-sm text-[#900B09] flex"><TriangleAlert className='mr-4'/>  {errors.companyName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm label_color mb-1">
            Your first and last name <span className="text-[#900B09]">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={localFormData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
              errors.name ? 'border-b-[#900B09]' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="mt-4 text-sm text-[#900B09] flex"><TriangleAlert className='mr-4'/> {errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm label_color mb-1">
            Your phone number <span className="text-[#900B09]">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={localFormData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
              errors.phone ? 'border-b-[#900B09]' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="mt-4 text-sm text-[#900B09] flex"><TriangleAlert className='mr-4'/>  {errors.phone}</p>
          )}
        </div>

          <div>
            <label className="block text-sm label_color mb-1">
              Upload your company logo
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent"
                placeholder="No file chosen"
                readOnly
                value={localFormData.companyLogo}
              />
              <label className="px-4 py-2 bg-gray-700 text-white rounded-sm cursor-pointer hover:bg-gray-800 transition-colors text-center">
                Browse...
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-10 sm:mt-20">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full sm:w-auto px-6 py-2 mt-6 sm:mt-10 rounded-sm transition-colors bg-[#13B5CF] text-white #009951"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { StepOne };