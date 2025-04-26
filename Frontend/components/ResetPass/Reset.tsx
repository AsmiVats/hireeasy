import React, { useState, useEffect } from "react";
import axios from "axios";

import LoginModal from "../Auth/LoginModal";


interface ResetPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

enum ResetSteps {
  EMAIL_INPUT,
  EMAIL_SENT,
  CODE_VERIFICATION,
  PROCESSING,
  CREATE_PASSWORD,
  LOGIN_FORM,
}

const Reset: React.FC<ResetPasswordProps> = ({ isOpen, onClose }) => {
  // Get API URL from environment variable
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";

  const [currentStep, setCurrentStep] = useState<ResetSteps>(
    ResetSteps.EMAIL_INPUT,
  );
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // API base URL - replace with your actual API URL
 

  // State to store OTP for verification
  const [generatedOtp, setGeneratedOtp] = useState("");


  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentStep === ResetSteps.PROCESSING) {
      timer = setTimeout(() => {
        setCurrentStep(ResetSteps.CREATE_PASSWORD);
      }, 2000); 
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentStep]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      // Generate a 6-digit OTP code
      const generatedCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      setGeneratedOtp(generatedCode);

      
      const response = await axios.post(
        `${API_URL}/auth/sendOtp?email=${email}&code=${generatedCode} `,
       
      );

      setCurrentStep(ResetSteps.EMAIL_SENT);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to send email. Please try again.",
      );
    } finally {
      setIsLoading(false);

    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      // Verify OTP code
      const response = await axios.post(`${API_URL}/auth/verifyOtp`, null, {
        params: {
          email,
          code,
        },
      });

      setCurrentStep(ResetSteps.PROCESSING);
      // The useEffect will handle the transition after 2 seconds
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Invalid code. Please try again.",
      );
    } finally {
      setIsLoading(false)

    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
 
    // Password validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
   
      // Update the user's password
      await axios.post(`${API_URL}/jobSeeker/updatePassword`, {
        email: email,
        password: newPassword,
      });
  onClose();

  setTimeout(() => {
    // Reset the component state
    setCurrentStep(ResetSteps.EMAIL_INPUT);
    setEmail("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");

   // Then show the login modal
    setIsLoginModalOpen(true);
  }, 2000);
    } catch (error: any) {
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }

  };

  const handleCheckMail = () => {
    setCurrentStep(ResetSteps.CODE_VERIFICATION);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2 sm:px-0">
      <div className="relative w-full max-w-[95vw] sm:max-w-[550px] rounded-lg bg-white p-4 sm:p-8 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>


        {/* Error message display */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-700">

            {error}
          </div>
        )}

        {currentStep === ResetSteps.EMAIL_INPUT && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col">
            <h2 className="mb-[30px] text-[26px] font-semibold text-gray-800">
              Reset Password
            </h2>
            <p className="mb-[30px] text-[14px] text-gray-600">
              Enter the email address associated with the account.
            </p>
            <label className="mb-[12px] block text-[14px] text-gray-600">
              Email address <span className="text-red-500"> * </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-10 h-[38px] w-full rounded-md border border-gray-300 p-2 text-base focus:border-[#13B5CF] focus:outline-none"
            />
            <div className="relative flex h-[42px] w-full justify-start">
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-0 h-[42px] max-w-[135px] rounded-md bg-[#13B5CF] pb-[4px] pl-[15px] pr-[15px] pt-[4px] text-base font-medium text-white disabled:bg-gray-400"
              >
                {isLoading ? "Sending..." : "Send email"}
              </button>
            </div>
          </form>
        )}

        {currentStep === ResetSteps.EMAIL_SENT && (
          <div>
            <h2 className="mb-[30px] text-[26px] font-semibold text-[#0F1137]">
              Reset Password
            </h2>

            <p className="mb-10 text-[14px] font-medium text-[#0F1137]">
              Thanks, an email was sent to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 h-auto w-full">
              <p className="text-sm text-gray-600">
                If you don't receive the email. Please contact{" "}
                <a
                  href="mailto:support@Hireeasy.com"
                  className="text-[#13B5CF] hover:underline"
                >
                  support@Hireeasy.com
                </a>
              </p>
              <button
                onClick={handleCheckMail}
                className="h-[42px] w-full sm:w-[135px] rounded-md bg-[#13B5CF] pb-[4px] pl-[15px] pr-[15px] pt-[4px] text-base font-medium text-white"
              >
                Check mail
              </button>
            </div>
          </div>
        )}

        {currentStep === ResetSteps.CODE_VERIFICATION && (
          <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
            <h2 className="mb-[30px] text-[26px] font-semibold text-[#0F1137]">
              Fill in with code
            </h2>
            <p className="mb-6 text-[#0F1137]">
              You have received an email with code. Fill in your code below.
            </p>

            <div className="mb-10">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,6}$/.test(value)) {
                    setCode(value);
                  }
                }}
                required
                className="h-[38px] w-full rounded-sm border-2 border-gray-200 px-4 py-4 text-lg font-medium tracking-wider placeholder:text-gray-400 focus:border-[#13B5CF] focus:outline-none"
                maxLength={6}
                inputMode="numeric"
                placeholder="Enter 6-digit code"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 h-auto w-full">
              <p className="text-sm text-gray-600">
                If you don't receive the email. Please contact{" "}
                <a href="mailto:support@Hireeasy.com" className="text-[#13B5CF]">
                  support@Hireeasy.com
                </a>
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="h-[42px] w-full sm:w-[135px] rounded-md bg-[#13B5CF] pb-[4px] pl-[15px] pr-[15px] pt-[4px] text-base font-medium text-white disabled:bg-gray-400"
              >
                {isLoading ? "Verifying..." : "Submit"}
              </button>
            </div>
          </form>
        )}

        {currentStep === ResetSteps.CREATE_PASSWORD && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col">
            <h2 className="mb-[30px] text-[26px] font-medium text-[#0F1137]">
              Create new password
            </h2>
            <p className="mb-[30px] text-[14px] text-[#0F1137]">
              Your password has been reset. Create a new password.
            </p>

            <div className="mb-4">
              <label className="mb-2 block text-[14px] text-gray-600">
                New password <span className="text-red-500"> * </span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="h-[38px] w-full rounded-md border border-gray-300 px-3 text-base focus:border-[#13B5CF] focus:outline-none"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div className="mb-10">
              <label className="mb-2 block text-[14px] text-gray-600">
                Confirm password <span className="text-red-500"> * </span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-[38px] w-full rounded-md border border-gray-300 px-3 text-base focus:border-[#13B5CF] focus:outline-none"
                placeholder="Confirm password"
              />
            </div>

            <div className="flex h-[42px] w-full justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="h-[42px] w-full sm:w-[162px] rounded-sm bg-[#13B5CF] px-[15px] py-[4px] text-base font-medium text-white transition-colors disabled:bg-gray-400"
              >
                {isLoading ? "Saving..." : "Save password"}
              </button>
            </div>
          </form>
        )}

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(true)}
        />

        {currentStep === ResetSteps.PROCESSING && (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#13B5CF] border-t-transparent"></div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Processing...
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reset;
