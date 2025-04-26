"use client"
import React, {useState,useEffect} from "react";

import {
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
  StepFive,
  StepSix,
  StepSeven,
  JobCreationForm,
  AddJobDetailsPage1,
  AddJobDetailsPage2,
  AddJobBasics,
} from "@/components/EmployerProfile";
import { useRouter } from 'next/navigation';

// Add to imports
import ProgressBar from "@/components/EmployerProfile/ProgressBar";

const EmployerprofilePage = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const router = useRouter();
  const totalSteps = 9;
  
  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 2) {
      setCurrentStep(prev => prev - 1);
    }
  };

   useEffect(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/'); 
        return;
      }
 
  },[router] )
  
  return (
    <div className="pb-20 max-w-c-1280 m-auto">
      
      {currentStep === 2 && (
        <JobCreationForm 
          onNext={handleNext} 
          onBack={handleBack}
          currentStep={currentStep} totalSteps={totalSteps} 
        />
      )}
      
      {currentStep === 3 && (
        <AddJobDetailsPage1 
          onNext={handleNext} 
          onBack={handleBack}
          currentStep={currentStep} totalSteps={totalSteps} 
        />
      )}
      
      {currentStep === 4 && (
        <AddJobDetailsPage2 
          onNext={handleNext} 
          onBack={handleBack}
          currentStep={currentStep} totalSteps={totalSteps} 
        />
      )}
      
      {currentStep === 5 && (
        <StepThree 
          onNext={handleNext} 
          onBack={handleBack}
          currentStep={currentStep} totalSteps={totalSteps} 
        />
      )}
      
      {currentStep === 6 && (
        <StepFour 
          onNext={handleNext} 
          onBack={handleBack}
          currentStep={currentStep} totalSteps={totalSteps} 
        />
      )}
      
      {currentStep === 7 && (
        <StepFive 
          onNext={handleNext} 
          onBack={handleBack}
          currentStep={currentStep} totalSteps={totalSteps} 
        />
      )}
      
      {currentStep === 8 && (
        <StepSix 
          onNext={handleNext} 
          onBack={handleBack}
          currentStep={currentStep} totalSteps={totalSteps} 
        />
      )}
      
      {currentStep === 9 && (
        <StepSeven 
          onBack={handleBack}
          currentStep={currentStep} totalSteps={totalSteps} 
        />
      )}
    </div>
  );
};

export default EmployerprofilePage;
