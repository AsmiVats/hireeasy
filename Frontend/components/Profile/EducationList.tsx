'use client'
import { useState } from "react";
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from "react-hot-toast";

interface Education {
  id?: string;
  educationDegree?: string;
  schoolName?: string;
  courseName?: string;
  specialization?: string;
  fromDate?: string;
  toDate?: string;
}

interface EducationListProps {
  onNext: () => void;
  onBack: () => void;
  goToAddEducation: () => void;
  data?: {
    educationHistory?: Education[];
  };
  updateData?: (section: string, data: any) => void;
}

const EducationList = ({ onNext, onBack, goToAddEducation, data, updateData }: EducationListProps) => {
  const handleEdit = (index: number) => {
    // In a real implementation, you would navigate to edit the specific education
    toast.success(`Editing education ${index + 1}`);
  };

  const handleDelete = (index: number) => {
    if (updateData && data?.educationHistory) {
      const updatedHistory = [...data.educationHistory];
      updatedHistory.splice(index, 1);
      updateData('educationHistory', updatedHistory);
      toast.success("Education deleted successfully");
    }
  };

  const handleAddAnotherEducation = () => {
    goToAddEducation();
  };

  // Calculate duration between dates (e.g., "2 years")
  const calculateDuration = (fromDate: string, toDate: string): string => {
    try {
      // Assuming format is "MM / YY" like "06 / 22"
      const [fromMonth, fromYear] = fromDate.split('/').map(part => part.trim());
      const [toMonth, toYear] = toDate.split('/').map(part => part.trim());
      
      const fromFullYear = parseInt(`20${fromYear}`);
      const toFullYear = toDate.toLowerCase().includes('present') 
        ? new Date().getFullYear() 
        : parseInt(`20${toYear}`);
      
      const fromMonthNum = parseInt(fromMonth) - 1;
      const toMonthNum = toDate.toLowerCase().includes('present')
        ? new Date().getMonth()
        : parseInt(toMonth) - 1;
      
      let years = toFullYear - fromFullYear;
      let months = toMonthNum - fromMonthNum;
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      const yearText = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
      const monthText = months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '';
      
      if (yearText && monthText) {
        return `${yearText} ${monthText}`;
      } else {
        return yearText || monthText || '';
      }
    } catch (error) {
      return '';
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

        {/* Display existing education entries */}
        {data?.educationHistory && data.educationHistory.length > 0 && (
          <div className="mb-6">
            {data.educationHistory.map((education, index) => (
              <div key={index} className="border border-gray-300 rounded-sm mb-4 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-[16px]">{education.educationDegree}</h4>
                    <p className="text-gray-600">{education.schoolName}</p>
                    <p className="text-gray-500 text-sm">
                      {education.fromDate} to {education.toDate} 
                      {education.fromDate && education.toDate && 
                        ` (${calculateDuration(education.fromDate, education.toDate)})`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      type="button" 
                      onClick={() => handleEdit(index)}
                      className="text-gray-600 hover:text-[#13B5CF]"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleDelete(index)}
                      className="text-gray-600 hover:text-[#900B09]"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add another education button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleAddAnotherEducation}
            className="flex items-center px-4 py-2 border border-[#13B5CF] text-[#13B5CF] rounded-sm hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add another education
          </button>
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
            type="button"
            onClick={onNext}
            className="px-6 py-2 mt-10 rounded-sm transition-colors bg-[#13B5CF] text-white hover:bg-[#009951]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationList;