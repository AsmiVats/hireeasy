interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mx-auto mb-8 max-w-[1077px] pt-8">
      <div className="mb-2 flex justify-between">
        {/* <span className="text-[14px] text-[#1E1E1E] font-medium">
          Step {currentStep} of {totalSteps}
        </span> */}
        <span className="text-[14px] text-[#13B5CF]">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#293E40] transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
