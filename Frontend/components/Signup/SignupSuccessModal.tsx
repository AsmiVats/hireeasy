'use client';

import { useEffect, useState } from "react";

interface SignupSuccessModalProps {
  userName: string;
  onClose: ()=> void;
}

const SignupSuccessModal = ({ userName,onClose }: SignupSuccessModalProps) => {

  const [userData, setUserData] = useState();

  useEffect(() => {
    try {
      
      const formData = sessionStorage.getItem('userdata');
      
      setUserData(formData ? JSON.parse(formData) : null);
    }catch{
      console.log('error')
    }
  },[]);

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-4">
      <h2 className="text-[26px] font-medium">Sign up was successful</h2>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
        title="Close login modal"
        aria-label="Close login modal"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <p className="mb-[30px] mt-4 text-[#13B5CF]">
        Welcome aboard, {(userData as unknown as { name: string })?.name}. You
        have been signed up successfully.
      </p>

      <p className="mb-[30px] text-[#5A5A5A]">
        We have sent you an on your registered email to verify your ID.
      </p>

      <div className="mt-[30px] flex justify-between">
        <button
          onClick={() => {}}
          className="text-sm font-medium text-[#13B5CF] hover:text-[#009951]"
        >
          Need help?
        </button>
        <button
          onClick={onClose}
          className="rounded-sm bg-[#13B5CF] px-6 py-2 text-white hover:bg-[#009951]"
        >
           Signin Now
        </button>
      </div>



    </div>

  );
};
 
export default SignupSuccessModal;