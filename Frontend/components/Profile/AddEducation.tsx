// @ts-nocheck
'use client'
import { useState } from "react";
import { TriangleAlert } from 'lucide-react';
import { toast } from "react-hot-toast";

interface AddEducationProps {
  onNext: () => void;
  onBack: () => void;
  data?: {
    educationDegree?: string;
    schoolName?: string;
    courseName?: string;
    specialization?: string;
    fromDate?: string;
    toDate?: string;
  };
  updateData?: (section: string, data: any) => void;
}

const AddEducation = ({ onNext, onBack, data, updateData }: AddEducationProps) => {
  const [formData, setFormData] = useState({
    educationDegree: data?.educationDegree || "",
    schoolName: data?.schoolName || "",
    courseName: data?.courseName || "",
    specialization: data?.specialization || "",
    fromDate: data?.fromDate || "",
    toDate: data?.toDate || ""
  });

  const [errors, setErrors] = useState({
    educationDegree: "",
    schoolName: "",
    courseName: "",
    specialization: "",
    fromDate: "",
    toDate: ""
  });

  const formatDateForAPI = (date: string): string => {
    try {
      // Assuming format is "MM / YY" like "06 / 22"
      const [month, year] = date.split('/').map(part => part.trim());
      const fullYear = `20${year}`; // Assuming years are in format "YY" for 2000s
      return `${fullYear}-${month.padStart(2, '0')}-01`; // Using first day of month
    } catch (error) {
      // If parsing fails, return original
      return date;
    }
  };

  const validateForm = () => {
    const newErrors = {
      educationDegree: "",
      schoolName: "",
      courseName: "",
      specialization: "",
      fromDate: "",
      toDate: ""
    };

    // Education/Degree validation
    if (!formData.educationDegree.trim()) {
      newErrors.educationDegree = "Education/Degree name is required";
    }

    // School/University validation
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = "School/University name is required";
    }

    // Course name validation
    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course name is required";
    }

    // Specialization validation
    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    }

    // From date validation
    if (!formData.fromDate.trim()) {
      newErrors.fromDate = "From date is required";
    }

    // To date validation
    if (!formData.toDate.trim()) {
      newErrors.toDate = "To date is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Create education object
        const newEducation = {
          educationDegree: formData.educationDegree,
          schoolName: formData.schoolName,
          courseName: formData.courseName,
          specialization: formData.specialization,
          fromDate: formData.fromDate,
          toDate: formData.toDate
        };
        
        // Update education history
        if (updateData) {
          // Get existing education history or create new array
          const educationHistory = data?.educationHistory || [];
          // Add new education
          educationHistory.push(newEducation);
          // Update data
          updateData('educationHistory', educationHistory);
        }
        
        // Format dates for API
        const fromDateFormatted = formatDateForAPI(formData.fromDate);
        const toDateFormatted = formatDateForAPI(formData.toDate);
        const token = localStorage.getItem('token');
        
        // Make API call to save education details
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobSeeker/createEducation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            data: [
              {
                candidateProfile: localStorage.getItem('userId'), // Get user ID from localStorage
                degreeName: formData.educationDegree,
                universityName: formData.schoolName,
                courseName: formData.courseName,
                specialization: formData.specialization,
                fromDate: fromDateFormatted,
                toDate: toDateFormatted
              }
            ]
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to save education data');
        }
        
        const result = await response.json();
        toast.success('Education details saved successfully!');
        onNext();
      } catch (error) {
        console.error('Error saving education:', error);
       
        onNext();
      }
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
          <h3 className="text-[18px] font-medium text-[#293E40]">Add Education details</h3>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              Education / Degree name <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={formData.educationDegree}
              onChange={(e) => setFormData({ ...formData, educationDegree: e.target.value })}
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                errors.educationDegree ? 'border-[#900B09]' : 'border-gray-300'
              }`}
            />
            {errors.educationDegree && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.educationDegree}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              School/ University name <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                errors.schoolName ? 'border-[#900B09]' : 'border-gray-300'
              }`}
            />
            {errors.schoolName && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.schoolName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                Course name <span className="text-[#900B09]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                    errors.courseName ? 'border-[#900B09]' : 'border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.courseName && (
                <p className="mt-1 text-sm text-[#900B09] flex items-center">
                  <TriangleAlert className="h-4 w-4 mr-2" />
                  {errors.courseName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                Specialisation <span className="text-[#900B09]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                    errors.specialization ? 'border-[#900B09]' : 'border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.specialization && (
                <p className="mt-1 text-sm text-[#900B09] flex items-center">
                  <TriangleAlert className="h-4 w-4 mr-2" />
                  {errors.specialization}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                Course From date <span className="text-[#900B09]">*</span>
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
                Course End date <span className="text-[#900B09]">*</span>
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

export default AddEducation;