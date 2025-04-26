// @ts-nocheck
'use client'
import { useState } from "react";
import { TriangleAlert, Bold, Italic, List, Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from "react-hot-toast";
import { useSession } from 'next-auth/react';
import * as XLSX from 'xlsx';

interface RolesAndResponsibilitiesProps {
  onNext: () => void;
  onBack: () => void;
  data?: {
    responsibilities?: string;
    employmentHistory?: Array<{
      jobTitle?: string;
      companyName?: string;
      fromDate?: string;
      toDate?: string;
      responsibilities?: string;
    }>;
  };
  updateData?: (section: string, data: any) => void;
  goToAddEmployment?: () => void;
}

const RolesAndResponsibilities = ({ 
  onNext, 
  onBack, 
  data, 
  updateData,
  goToAddEmployment 
}: RolesAndResponsibilitiesProps) => {
  const [formData, setFormData] = useState({
    responsibilities: data?.responsibilities || ""
  });

  const [errors, setErrors] = useState({
    responsibilities: ""
  });

  const { data: session } = useSession();

 
  const validateForm = () => {
    const newErrors = {
      responsibilities: ""
    };

    // Responsibilities validation
    if (!formData.responsibilities.trim()) {
      newErrors.responsibilities = "Roles and responsibilities are required";
    } else if (formData.responsibilities.trim().length < 20) {
      newErrors.responsibilities = "Please provide more detailed responsibilities";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (updateData && data?.employmentHistory && data.employmentHistory.length > 0) {
          // Update the responsibilities for the current employment
          const updatedHistory = [...data.employmentHistory];
          updatedHistory[updatedHistory.length - 1].responsibilities = formData.responsibilities;
          const token = localStorage.getItem('token');
          updateData('employmentHistory', updatedHistory);

          // Prepare employment data for API
          const employmentData = updatedHistory.map(employment => ({
            candidateProfile: token, // Assuming you have the user ID in session
            jobTitle: employment.jobTitle,
            companyName: employment.companyName,
            description: data.responsibilities,
            fromDate: formatDateForAPI(employment.fromDate || ''), // Convert date format
            toDate: formatDateForAPI(employment.toDate || ''), // Convert date format
            totalYearsSpent: calculateTotalYears(employment.fromDate || '', employment.toDate || '')
          }));

          // Make API call
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobSeeker/createEmployment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Assuming you have access token in session
            },
            body: JSON.stringify({
              data: employmentData
            })
          });

          if (!response.ok) {
            throw new Error('Failed to save employment data');
          }

          const result = await response.json();
          toast.success('Employment details saved successfully!');
        }
        onNext();
      } catch (error) {
        console.error('Error saving employment:', error);
        onNext();
      }
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

  const formatDateForAPI = (date: string): string => {
    try {
      const [month, year] = date.split(' ');
      const monthNum = (getMonthNumber(month) + 1).toString().padStart(2, '0');
      return `${year}-${monthNum}-01`;
    } catch (error) {
      return date;
    }
  };

  // Helper function to calculate total years
  const calculateTotalYears = (fromDate: string, toDate: string): number => {
    try {
      const fromParts = fromDate.split(' ');
      const toParts = toDate.split(' ');
      
      if (fromParts.length < 2 || toParts.length < 2) return 0;
      
      const fromYear = parseInt(fromParts[1]);
      const toYear = toDate.toLowerCase() === 'present' 
        ? new Date().getFullYear() 
        : parseInt(toParts[1]);
      
      const fromMonth = getMonthNumber(fromParts[0]);
      const toMonth = toDate.toLowerCase() === 'present' 
        ? new Date().getMonth() 
        : getMonthNumber(toParts[0]);
      
      const years = toYear - fromYear;
      const months = toMonth - fromMonth;
      
      return parseFloat((years + months / 12).toFixed(1));
    } catch (error) {
      return 0;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      let text = '';
  
      if (file.type === 'text/plain') {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        toast.error('PDF parsing will be implemented soon');
        return;
      } else if (file.type.includes('word') || file.type.includes('officedocument')) {
        toast.error('Word document parsing will be implemented soon');
        return;
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel') {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        text = XLSX.utils.sheet_to_txt(worksheet);
      } else {
        toast.error('Unsupported file type');
        return;
      }
  
      // This line updates the textarea with the parsed content
      setFormData(prev => ({
        ...prev,
        responsibilities: text.trim()
      }));
  
      toast.success(`File "${file.name}" parsed successfully`);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Failed to parse file');
    }
  };

  const handleEdit = (index: number) => {
    // In a real implementation, you would navigate to edit the specific employment
    toast.success(`Editing employment ${index + 1}`);
  };

  const handleDelete = (index: number) => {
    if (updateData && data?.employmentHistory) {
      const updatedHistory = [...data.employmentHistory];
      updatedHistory.splice(index, 1);
      updateData('employmentHistory', updatedHistory);
      toast.success("Employment deleted successfully");
    }
  };

  const handleAddAnotherEmployment = () => {
    if (goToAddEmployment) {
      goToAddEmployment();
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

        {/* Display existing employment entries */}
        {data && data.employmentHistory.length > 0 && (
          <div className="mb-6">
            {data.employmentHistory.map((employment, index) => (
              <div key={index} className="border border-gray-300 rounded-sm mb-4 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-[16px]">{employment.jobTitle}</h4>
                    <p className="text-gray-600">{employment.companyName}</p>
                    <p className="text-gray-500 text-sm">
                      {employment.fromDate} to {employment.toDate} 
                      {employment.fromDate && employment.toDate && 
                        ` (${calculateDuration(employment.fromDate, employment.toDate)})`}
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

        {/* Add another employment button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleAddAnotherEmployment}
            className="flex items-center px-4 py-2 border border-[#13B5CF] text-[#13B5CF] rounded-sm hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add another employment
          </button>
        </div>

        {/* Only show the responsibilities form if we're adding/editing the current employment */}
        {data?.employmentHistory && data.employmentHistory.length > 0 && (
          <form className="space-y-6">
            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                Roles and Responsibilities <span className="text-[#900B09]">*</span>
              </label>
              <div className="border border-gray-300 rounded-sm overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-300 bg-gray-50">
                  <button type="button" className="p-1 hover:bg-gray-200 rounded">
                    <Bold className="h-4 w-4 text-gray-700" />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded">
                    <Italic className="h-4 w-4 text-gray-700" />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-200 rounded">
                    <List className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
                <textarea
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  className={`w-full px-3 py-2 min-h-[250px] focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                    errors.responsibilities ? 'border-[#900B09]' : ''
                  }`}
                  placeholder="Describe your roles and responsibilities..."
                />
              </div>
              {errors.responsibilities && (
                <p className="mt-1 text-sm text-[#900B09] flex items-center">
                  <TriangleAlert className="h-4 w-4 mr-2" />
                  {errors.responsibilities}
                </p>
              )}
            </div>

            <div>
              <button
                type="button"
                className="flex items-center px-4 py-2 border border-[#13B5CF] text-[#13B5CF] rounded-sm hover:bg-gray-50"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Upload from a file...
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".txt,.doc,.docx,.pdf,.xlsx,.xls"
                onChange={handleFileUpload}
              />
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
        )}
      </div>
    </div>
  );
};

// Helper function to calculate duration between dates
const calculateDuration = (fromDate: string, toDate: string): string => {
  // This is a simplified implementation
  // In a real app, you would use a date library like date-fns
  try {
    // Assuming format is "MMM YYYY" like "Jun 2022"
    const fromParts = fromDate.split(' ');
    const toParts = toDate.split(' ');
    
    if (fromParts.length < 2 || toParts.length < 2) return '';
    
    const fromYear = parseInt(fromParts[1]);
    const toYear = toDate.toLowerCase() === 'present' ? new Date().getFullYear() : parseInt(toParts[1]);
    
    const fromMonth = getMonthNumber(fromParts[0]);
    const toMonth = toDate.toLowerCase() === 'present' ? new Date().getMonth() : getMonthNumber(toParts[0]);
    
    let years = toYear - fromYear;
    let months = toMonth - fromMonth;
    
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

const getMonthNumber = (month: string): number => {
  const months = {
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
    'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
  };
  
  return months[month.toLowerCase().substring(0, 3)] || 0;
};

export default RolesAndResponsibilities;