"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/utils/authService";

import { TriangleAlert } from "lucide-react";
import { useSignupStore } from '@/store/signupStore';

const SignUpStepTwo = ({ clickContinue, onClose }) => {
  const router = useRouter();
  const stepOneData = useSignupStore((state) => state.stepOneData);
  const stepTwoData = useSignupStore((state) => state.stepTwoData);
  const setStepTwoData = useSignupStore((state) => state.setStepTwoData);

  const [formData, setFormData] = useState({
    phone: stepTwoData.phone || "",
    email: stepTwoData.email || "",
    password: stepTwoData.password || "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({
    phone: "",
    email: "",
    password: "",
  });

  // Update the store whenever form data changes
  useEffect(() => {
    setStepTwoData(formData);
  }, [formData, setStepTwoData]);

  const validateForm = () => {
    const newErrors = {
      phone: "",
      email: "",
      password: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.phone.trim()) {
      newErrors.phone = "Contact number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password is normal but could be stronger";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Add numbers to make your password stronger";
    } else if (!/[!@#$_]/.test(formData.password)) {
      newErrors.password = "Include special characters like @, #, $, _ for a stronger password";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For phone field, only allow numeric input
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    
    // Add real-time validation for password
    if (name === "password") {
      const newErrors = { ...errors };
      
      if (!value.trim()) {
        newErrors.password = "Password is required";
      } else if (value.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (value.length < 8) {
        newErrors.password = "Password is normal but could be stronger";
      } else if (!/[0-9]/.test(value)) {
        newErrors.password = "Add numbers to make your password stronger";
      } else if (!/[!@#$_]/.test(value)) {
        newErrors.password = "Include special characters like @, #, $, _";
      } else {
        newErrors.password = "";
      }
      
      setErrors(newErrors);
    }
  }
};

  const handlePhoneKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];

    if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
    if (
      /^\d$/.test(e.key) &&
      formData.phone.length >= 10 &&
      !e.ctrlKey &&
      window.getSelection()?.toString() === ""
    ) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setIsLoading(true);

    const finalData = {
      ...stepOneData,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      isActive: true,
      planId: 0,
    };

    try {
      const response = await authService.signup(finalData);
      sessionStorage.setItem("userdata", JSON.stringify(finalData));
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
      clickContinue(3);
    }
  };

  const goBack = () => {
    // Save the current form data to the store before navigating back
    setStepTwoData(formData);
    clickContinue(1);
  };

  // Add a function to check password strength
  const getPasswordStrength = (password) => {
    if (!password) return { text: '', color: '' };
    
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (password.length < 6) {
      return { text: 'Weak', color: 'text-red-600' };
    } else if (password.length < 8) {
      return { text: 'Normal', color: 'text-yellow-600' };
    } else if (hasLetters && hasNumbers && !hasSpecialChars) {
      return { text: 'Strong', color: 'text-[#009951]' };
    } else if (hasLetters && hasNumbers && hasSpecialChars) {
      return { text: 'Strongest', color: 'text-[#13B5CF] ' };
    } 
    return { text: 'Normal', color: 'text-yellow-600' };
  };

  return (
    <>
      <div className="max-w-[550px]">
        <h1 className="mb-6 text-2xl font-semibold">Sign up</h1>
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
        <div className="mb-6">
          <span className="text-sm font-bold  text-gray-600">
            Already have an account?{" "}
          </span>
          <button
            onClick={onClose}
            className="text-sm font-medium text-[#13B5CF] "
          >
            Sign in
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label_color mb-1 block text-sm">
                Contact number <span className="text-[#900B09]">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onKeyDown={handlePhoneKeyDown}
                inputMode="numeric"
                pattern="\d*"
                className={`input_field w-full rounded-sm border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                  errors.phone ? "border-[#900B09]" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 flex items-center text-sm text-[#900B09]">
                  <TriangleAlert className="mr-2 h-4 w-4" /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="label_color mb-1 block text-sm">
                Email address <span className="text-[#900B09]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input_field w-full rounded-sm border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                  errors.email ? "border-[#900B09]" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 flex items-center text-sm text-[#900B09]">
                  <TriangleAlert className="mr-2 h-4 w-4" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="label_color mb-1 block text-sm">
                Password <span className="text-[#900B09]">*</span>
                
                {formData.password && (
                  <span className={`ml-2 text-sm font-medium ${getPasswordStrength(formData.password).color}`}>
                    {getPasswordStrength(formData.password).text}
                  </span>
                )}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`input_field w-full rounded-sm border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                  errors.password ? "border-[#900B09]" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="mt-1 flex items-center text-sm text-[#900B09]">
                  <TriangleAlert className="mr-2 h-4 w-4" /> {errors.password}
                </p>
              )}
           
            </div>

            <div className="flex items-center justify-between">
              <div className="mt-[14px] space-x-4">
                <button
                  type="button"
                  onClick={goBack}
                  className="globalbackbutton"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="globalbutton"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Signing up...</span>
                    </div>
                  ) : (
                    "Sign up"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-6">
          <a href="#" className="text-sm text-[#13B5CF] hover:text-[#009951]">
            Need Help?
          </a>
        </div>
      </div>
    </>
  );
};

export { SignUpStepTwo };
