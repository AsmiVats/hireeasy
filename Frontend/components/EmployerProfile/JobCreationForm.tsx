'use client';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ProgressBar from "@/components/EmployerProfile/ProgressBar";
import { useEmployerProfileStore } from '@/store/employerProfile';
import { useRouter } from 'next/navigation';


interface JobCreationFormProps  {
  onNext: () => void;
  onBack: () => void;
  currentStep?: number;
  totalSteps?: number;
}


const JobCreationForm = ({onNext,onBack, currentStep, totalSteps}:JobCreationFormProps) => {
  const [postType, setPostType] = React.useState('template');
  const { formData, updateFormData } = useEmployerProfileStore();
  const router = useRouter();

  // Add new state for selected template
  const [selectedTemplate, setSelectedTemplate] = React.useState<number | null>(null);

  const templates = [
    {
      title: 'Title of the job',
      location: 'New York, NY 09867',
      skills: 'Skills: Developer, Java, Service now'
    },
    {
      title: 'Title of the job',
      location: 'New York, NY 09867',
      skills: 'Skills: Developer, Java, Service now'
    },
    {
      title: 'Title of the job',
      location: 'New York, NY 09867',
      skills: 'Skills: Developer, Java, Service now'
    },
    {
      title: 'Title of the job',
      location: 'New York, NY 09867',
      skills: 'Skills: Developer, Java, Service now'
    }
  ];

  // Determine if this is the first step shown to users (step 2 in the flow)
  const isFirstStep = currentStep === 2;

  // Initialize the employer profile store with minimum required fields
  useEffect(() => {
    // Check for token
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    // Initialize employer profile with minimum required fields
    // that would normally be set in StepOne
    if (isFirstStep) {
      const employerId = typeof window !== 'undefined' ? localStorage.getItem('user') || '' : '';
      // Only set these fields if they're not already set (preserve data on back navigation)
      if (!formData.employerId) {
        updateFormData({
          employerId: employerId.replace(/\\/g, ''),
          // We can set default values for these fields, or obtain them from the user's profile if available
          companyName: formData.companyName || '',
          name: formData.name || '',
          phone: formData.phone || '',
          // Set a default status value to fix the validation error
          // Using 'Open' to match the backend enum values: ["Open", "Closed", "Paused"]
          status: 'Open'
        });
      }
    }
  }, [isFirstStep, formData, updateFormData, router]);

  const handleNext = () => {
    // If we're using a template, we could populate fields based on the selected template
    if (postType === 'template' && selectedTemplate !== null) {
      const template = templates[selectedTemplate];
      // You could update the store with template data here
      // updateFormData({
      //   title: template.title,
      //   // other fields...
      // });
    }
    
    // Always ensure status is set before proceeding to next step
    if (!formData.status) {
      updateFormData({
        status: 'Open'
      });
    }
    
    onNext();
  };

  return (
    <div className="min-h-screen flex justify-center pt-[100px]">
      <div className="w-full max-w-[550px]">
      <h1 className="text-[36px] font-bold text-center text-[#293E40] mb-[25px]">
          Create a new job
        </h1>
        <h2 className="mb-[25px] text-[26px] text-center opacity-60 text-[#13B5CF]">
          Add job basics
        </h2>
      
      <ProgressBar currentStep={currentStep || 0} totalSteps={totalSteps || 0} />
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <span className="label_color">How would you like to post your job?</span>
            <span className="text-[#900B09]">*</span>
          </div>
          
          <RadioGroup
            value={postType}
            onValueChange={setPostType}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="template" id="template" />
              <Label htmlFor="template" className="label_color">
                Use a previous job as a template
              </Label>
            </div>
            
            {postType === 'template' && (
              <div className="space-y-4">
                <div className="relative">
                  <Input 
                    type="text"
                    placeholder="Search by title or location..."
                    className="pl-3 pr-10"
                  />
                  <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template, index) => (
                    <div 
                      key={index}
                      onClick={() => setSelectedTemplate(index)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors
                        ${selectedTemplate === index 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500'
                        }`}
                    >
                      <h3 className="font-medium text-gray-900">{template.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.location}</p>
                      <p className="text-sm text-gray-600 mt-1">{template.skills}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="label_color">
                Create a brand new post
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          {!isFirstStep && (
            <button 
              className="px-6 py-2 mt-10 rounded-sm transition-colors bg-[#293E40] text-white #009951"
              onClick={onBack}
            >
              Back
            </button>
          )}
          <button
              type="submit"
              onClick={handleNext}
              className={`px-6 py-2 mt-10 rounded-sm transition-colors bg-[#13B5CF] text-white #009951 ${isFirstStep ? 'ml-auto' : ''}`}
            >
              Continue
            </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export { JobCreationForm };