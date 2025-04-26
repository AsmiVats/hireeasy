import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from "@/components/EmployerProfile/ProgressBar";
interface SuccessScreenProps {
  accountName?: string;
  jobTitle?: string;
}

interface StepSevenProps {
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}



const StepSeven = ({ onBack, currentStep, totalSteps }: StepSevenProps) => {
  const [empNameTitle, setEmpNameTitle] = useState<SuccessScreenProps>({
    accountName: "",
    jobTitle: ""
  });
  const route = useRouter();
useEffect(() => {
  const empData = sessionStorage.getItem('employerData');
  if (empData) {
    const empDataObj = JSON.parse(empData);
    setEmpNameTitle({
      accountName: empDataObj.name,
      jobTitle: empDataObj.title
    })
    
  }
}, [])
const navigateToDash = () => {
  route.push('/dashboardhome');
};


  return (
    <div className="min-h-[72vh] flex justify-center pt-[100px]">
      <div className="w-full max-w-[600px]">
        <h1 className="text-[36px] font-bold text-center text-[#293E40] mb-[50px]">
          Job posted successfully
        </h1>
        
        <div className="mb-[50px] text-center">
          <p className="text-[#13B5CF] text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-7 sm:leading-8 md:leading-9">
            Congratulations! {empNameTitle?.accountName},<br />
            Your job <span className="text-[#293E40]">'{empNameTitle.jobTitle}'</span> posted successfully.
          </p>
        </div>
        
        <div className='text-center'>
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 border border-[#13B5CF] text-[#293E40] rounded-sm hover:bg-blue-50 transition-colors"
          onClick={navigateToDash}
        >
          Check out the new candidates applied
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        </div>
      </div>
    </div>
  );
}

export { StepSeven };