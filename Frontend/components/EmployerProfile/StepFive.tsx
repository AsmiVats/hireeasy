'use client';
import React from "react";
import { useEmployerProfileStore } from '@/store/employerProfile';
import ProgressBar from "@/components/EmployerProfile/ProgressBar";
interface PreviewField {
  label: string;
  value: string;
}

interface StepFiveProps {
  onNext?: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const StepFive = ({ onNext, onBack, currentStep, totalSteps }: StepFiveProps) => {

  const { formData } = useEmployerProfileStore();

  const previewFields: PreviewField[] = [
    { label: "Job title", value: formData.title || ''  },
    { label: "Number of people you wish to hire for this job", value:formData.noOfPeople.toString() || '10' },
    { label: "Job Location Type", value: formData.jobLocationType || 'Full time'  },
    { label: "Location", value: formData.location.city || ''   },
    { label: "Job type", value: formData.jobType },
    { label: "Experience", value: formData.experience.toString() || '0'  },
    
    { label: "Benefits", value: formData.benefits.join(', ') || ''  },
  ];

  const PreviewField = ({ label, value }: PreviewField) => (
    <div className="mb-6">
      <span className="mb-2 block text-gray-600">{label}</span>
      <div className="relative">
        <input
          type="text"
          value={value}
          
          className="w-full rounded-sm border bg-gray-50 p-2 pr-10"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16" 
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex justify-center pt-[100px] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[550px]">
        <h1 className="text-[28px] sm:text-[36px] font-bold text-center text-[#293E40] mb-[20px] sm:mb-[25px]">
          Create a new job
        </h1>
        <h2 className="mb-[20px] sm:mb-[25px] text-[20px] sm:text-[26px] text-center opacity-60 text-[#13B5CF]">
          Job post preview
        </h2>
        <ProgressBar currentStep={currentStep || 0} totalSteps={totalSteps || 0} />
        <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
          {previewFields.map((field, index) => (
            <PreviewField key={index} {...field} />
          ))}



           <div className="mt-8 flex flex-row  sm:flex-row justify-between gap-4">
          <button
              className="w-full sm:w-auto mt-4 sm:mt-10 rounded-sm bg-[#293E40] px-6 py-2 text-white transition-colors #009951"
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="submit"
             onClick={onNext}
              className="w-full sm:w-auto mt-4 sm:mt-10 rounded-sm bg-[#13B5CF] px-6 py-2 text-white transition-colors #009951"
          >
           Continue
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

export { StepFive };
