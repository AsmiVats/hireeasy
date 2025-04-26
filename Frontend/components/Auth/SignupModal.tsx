'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SignUpStepOne, SignUpStepTwo } from '../Signup';
import SignupSuccessModal from '../Signup/SignupSuccessModal';
import { Sign } from 'crypto';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ isOpen, onClose }: SignupModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    resume: null as File | null
  });
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
  };

  const clickContinue =(step:number) => {
    setStep(step);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}>
        
      </div>
      <div className="flex min-h-full items-center justify-center p-4">
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          {step === 1 && <SignUpStepOne clickContinue={clickContinue} onClose={onClose} />}
          {step === 2 && <SignUpStepTwo clickContinue={clickContinue} onClose={onClose} />}
          {step === 3 && <SignupSuccessModal  onClose={onClose} userName=""  />}
        </div>
      </div>
    </div>
  );
};

export default SignupModal;