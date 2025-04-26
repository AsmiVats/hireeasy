"use client";
import { useState } from "react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { authService } from "@/utils/authService";
import { useUser } from "@/app/context/UserContext";
import SignupModal from "./SignupModal";
import { TriangleAlert } from 'lucide-react';


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const { setUser, refreshUserData } = useUser();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
  
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 6 characters";
    }
  
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  setError("");
  setIsLoading(true)
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem("token", response.token || "loggedIn");
      localStorage.setItem("user", response.userId);
      localStorage.setItem("role", response.role);
      localStorage.setItem("email", email);
      localStorage.setItem("candidateid", response.candidateId);
      if (staySignedIn) {
        localStorage.setItem("staySignedIn", "true");
      }
      
      // Fetch user data and update context
      await refreshUserData();
      
      onClose();
      debugger;
      if(response.role === "Candidate") {
        router.push("/jobseekers");
      } else {
        router.push("/dashboardhome");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authService.resetPassword({ email: resetEmail });
      setResetSuccess(true);
    } catch (err) {
      setError("Failed to send reset password email");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
    {isSignupModalOpen && <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />}
    {! isSignupModalOpen && (
      <div className="fixed inset-0 z-[100000] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          {/* Close button */}
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
          {!isResetMode && (
            <>
              <h1 className="mb-6 text-[26px] font-medium">Sign in</h1>

              {error && (
                <div className="mb-4 rounded-sm bg-red-50 p-3 text-sm text-[#900B09]">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <span className="text-[14px] text-gray-600">New User? </span>
                <button
                  onClick={() => setIsSignupModalOpen(true)}
                  className="text-[14px] text-[#13B5CF] hover:opacity-80 font-medium"
                >
                  Create an account
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                <div>
  <label
    htmlFor="email"
    className="label_color mb-1 block text-sm"
  >
    Email address
  </label>
  <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className={`input_field mb-3 w-full rounded-sm border px-2 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 ${
      errors.email ? 'border-[#900B09]' : 'border-gray-300'
    }`}

  />
  {errors.email && (
    <p className="mt-1 flex items-center text-sm text-[#900B09]">
      <TriangleAlert className="mr-2 h-4 w-4" /> {errors.email}
    </p>
  )}
</div>

<div>
  <label
    htmlFor="password"
    className="label_color mb-1 block text-sm"
  >
    Password
  </label>
  <input
    id="password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className={`input_field mb-3 w-full rounded-sm border px-2 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 ${
      errors.password ? 'border-[#900B09]' : 'border-gray-300'
    }`}
   
  />
  {errors.password && (
    <p className="mt-1 flex items-center text-sm text-[#900B09]">
      <TriangleAlert className="mr-2 h-4 w-4" /> {errors.password}
    </p>
  )}
</div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="label_color text-sm">
                        Stay signed in
                      </span>
                      <Switch
                        checked={staySignedIn}
                        onCheckedChange={setStaySignedIn}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="globalbutton"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}

          <div className="mt-6">
            {!isResetMode ? (
              <>
                <button
                  onClick={() => setIsResetMode(true)}
                  className="block text-[14px] text-[#13B5CF] hover:opacity-90"
                >
                  Reset your password
                </button>
                {/* <a
                  href="#"
                  className="block text-[14px] text-[#13B5CF] hover:opacity-60 text=[#13B5CF]"
                >
                  Sign in to a different account
                </a> */}
              </>
            ) : (
              <div>
                <h2 className="mb-4 text-xl font-medium">Reset Password</h2>
                {resetSuccess ? (
                  <div className="text-sm text-green-600">
                    Password reset link has been sent to your email.
                    <button
                      onClick={() => {
                        setIsResetMode(false);
                        setResetSuccess(false);
                      }}
                      className="ml-2 text-[#13B5CF]"
                    >
                      Back to login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword}>
                    <div className="mb-[30px]">
                    <p className="label_color mb-[30px] font-medium">Enter the email address associated with the account.</p>
                      <label
                        htmlFor="resetEmail"
                        className="label_color mb-1 block text-sm"
                      >
                        Email address
                      </label>
                      
                      <input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="input_field w-full rounded-sm border border-gray-300 px-2 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div className="flex justify-between mt-[30px]">
                      <button
                        type="button"
                        onClick={() => setIsResetMode(false)}
                        className="text-sm text-gray-600"
                      >
                        Back to login
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="globalbutton"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <span>Sending...</span>
                          </div>
                        ) : (
                          "Send Email"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
     
    </div>
    )}
     
   </>
  );
};

export default LoginModal;
