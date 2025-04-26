"use client";

import React, { useState, useEffect } from "react";

interface HelpDeskProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpDesk({ isOpen, onClose }: HelpDeskProps) {
  const [step, setStep] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    problem: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "+91 9876543210",
    alternatePhone: "",
  });

  useEffect(() => {
    const fetchProfileInfo = async () => {

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile information");
        }
        const responseData = await response.json();

        const userData = {
          name: responseData.data.name,
          email: responseData.data.email,
          phone: responseData.data.phone,
        };

        setFormData((prevState) => ({
          ...prevState,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || prevState.phone,
        }));
      } catch (error) {
        console.error("Error fetching profile information:", error);
      }
    };

    if (isOpen) {
      fetchProfileInfo();
    }
  }, [isOpen]);

  // Reset the form state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSubmitError(null);
      setFormData({
        problem: "",
        date: "",
        time: "",
        name: "",
        email: "",
        phone: "+91 9876543210",
        alternatePhone: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleContinue = () => {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.date)) {
      alert("Please select a valid date");
      return;
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(formData.time)) {
      alert("Please select a valid time");
      return;
    }

    // Basic validation
    if (!formData.problem || !formData.date || !formData.time) {
      alert("Please fill in all required fields");
      return;
    }

    setStep(2);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Use the same BASE_URL as in your user profile fetch
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

      const response = await fetch(`${BASE_URL}/job/addHelpDeskIssue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          problem: formData.problem,
          date: formData.date,
          time: formData.time,
          name: formData.name,
          email: formData.email,
          phone: formData.alternatePhone || formData.phone,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      if (response.ok) {
        setStep(3);
      }
    } catch (error) {
      console.error("Error submitting help desk issue:", error);
      setSubmitError("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    onClose();
  };

  const handleBack = () => {
    setStep(step - 1);
  
    setSubmitError(null);
  };

  const formatDateTime = () => {
    try {
      // Format the ISO date for display
      const date = new Date(formData.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Format time for display (convert from 24h to 12h format)
      const [hours, minutes] = formData.time.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      const formattedTime = `${hour12}:${minutes} ${ampm}`;

      return `${formattedTime}, ${formattedDate}`;
    } catch (e) {
      return `${formData.time}, ${formData.date}`;
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format for min date attribute
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Get date 30 days from now for max date attribute
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

 

  const renderStep1 = () => (
    <div className="relative mx-auto max-w-lg rounded-md bg-white p-8 shadow-md">

      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
        title="Close help desk modal"
        aria-label="Close help desk modal"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <h2 className="mb-6 text-[26px] font-medium text-[#0F1137]">Help desk</h2>

      <div className="mb-6 rounded-md border-blue-200">
        <p className="mb-2 text-[#13B5CF]">
          Hi {formData.name.split(" ")[0] || "there"}, thank you for contacting
          us. Please tell me how can I help you today?
        </p>
        <p className="mb-2 text-[17px]">
          Please book a meeting with our expert, He / She will call contact you
          and resolve your problem.
        </p>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-gray-600">
          Please share your problem in here{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          name="problem"
          value={formData.problem}
          onChange={handleChange}
          className="h-[38px] w-full rounded-md border border-[#AEB4C1] p-2 transition-colors focus:border-2 focus:border-[#13B5CF] focus:outline-none"
          required
        />
      </div>

      <div className="mb-6 flex gap-4">
        <div className="w-1/2">
          <label className="mb-2 block text-gray-600">
            Preferred Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getTomorrowDate()}
              max={getMaxDate()}
              className="w-full rounded-md border border-[#AEB4C1] p-2 transition-colors focus:border-2 focus:border-[#13B5CF] focus:outline-none"
              required
            />
          </div>
        </div>
        <div className="w-1/2">
          <label className="mb-2 block text-gray-600">
            Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              min="09:00"
              max="18:00"
              className="w-full rounded-md border border-[#AEB4C1] p-2 transition-colors focus:border-2 focus:border-[#13B5CF] focus:outline-none"
              required
            />
         
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-[80px]">
        <button
          onClick={handleContinue}
          className="rounded-md bg-[#13B5CF] h-[42px] w-[121px] text-white disabled:bg-gray-400"
          disabled={!formData.problem || !formData.date || !formData.time}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="relative mx-auto w-full max-w-[95vw] sm:max-w-lg rounded-md bg-white p-4 sm:p-8 shadow-md">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
        title="Close help desk modal"
        aria-label="Close help desk modal"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <h2 className="mb-4 sm:mb-6 text-xl sm:text-[26px] font-medium text-[#0F1137]">Help desk</h2>

      <p className="mb-6 sm:mb-[30px] text-[#13B5CF] text-base sm:text-[17px]">
        We have setup a meeting with our expert in your scheduled time. Please
        find the details below.
      </p>

      <div className="mb-6 sm:mb-[30px] w-full sm:w-[460px] h-auto sm:h-[200px] rounded-md border border-[#AEB4C1] p-3 sm:p-[15px]">
        <div>
          <p className="mb-2 sm:mb-[10px] text-sm sm:text-[15px] font-medium">Ticket no: #012</p>
          <p className="mb-2 sm:mb-[10px] text-sm sm:text-[15px] font-medium">
            Meeting time: {formatDateTime()}
          </p>
          <p className="mb-2 sm:mb-[10px] text-sm sm:text-[15px] font-medium">
            Email Address: {formData.email}
          </p>
          <p className="mb-2 sm:mb-[10px] text-sm sm:text-[15px] font-medium text-[#AEB4C1]">
            Name: {formData.name}
          </p>
          <p className="text-sm sm:text-[15px] font-medium text-[#AEB4C1]">
            Contact no: {formData.alternatePhone || formData.phone}
          </p>
        </div>
      </div>

      <div className="mb-8 sm:mb-[80px]">
        <p className="mb-2">Call me on this number instead (optional)</p>
        <input
          type="tel"
          name="alternatePhone"
          value={formData.alternatePhone}
          onChange={handleChange}
          className="w-full rounded-md border border-[#AEB4C1] p-2 transition-colors focus:border-2 focus:border-[#13B5CF] focus:outline-none"
        />
      </div>

      {submitError && (
        <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex flex-row sm:flex-row justify-between gap-4">
        <button
          onClick={handleBack}
          className="w-full sm:w-auto rounded-md bg-gray-500 px-6 py-2 text-white hover:bg-gray-600"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          onClick={handleFinish}
          className="w-full sm:w-auto rounded-md bg-[#13B5CF] px-6 py-2 text-white  disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Finish up"}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="relative mx-auto w-full max-w-[95vw] rounded-md bg-white p-4 shadow-md sm:max-w-lg sm:p-8">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
        title="Close help desk modal"
        aria-label="Close help desk modal"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <h2 className="mb-6 text-xl font-medium text-[#0F1137] sm:text-[26px]">
        Help desk
      </h2>

      <div className="mb-6 rounded-md text-[#13B5CF] sm:mb-[30px]">
        <p className="font-medium">Meeting scheduled successfully!</p>
        <p>We have sent an email with all the necessary details.</p>
      </div>

      <div className="mb-8 h-auto w-full rounded-md border border-[#AEB4C1] p-3 sm:mb-0 sm:h-[200px] sm:w-[460px] sm:p-[15px]">
        <div>
          <p className="mb-2 text-sm font-medium sm:mb-[10px] sm:text-[15px]">
            Ticket no: #012
          </p>
          <p className="mb-2 text-sm font-medium sm:mb-[10px] sm:text-[15px]">
            Meeting time: {formatDateTime()}
          </p>
          <p className="mb-2 text-sm font-medium sm:mb-[10px] sm:text-[15px]">
            Email Address: {formData.email}
          </p>
          <p className="mb-2 text-sm font-medium text-[#AEB4C1] sm:mb-[10px] sm:text-[15px]">
            Name: {formData.name}
          </p>
          <p className="text-sm font-medium text-[#AEB4C1] sm:text-[15px]">
            Contact no: {formData.alternatePhone || formData.phone}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-row justify-between gap-4 sm:mt-[80px] sm:flex-row">
        <button
          onClick={handleBack}
          className="h-[42px] w-full rounded-md bg-gray-500 text-white hover:bg-gray-600 sm:w-auto"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          className="h-[42px] w-full rounded-md bg-[#13B5CF] text-white sm:w-auto"
          onClick={handleDone}
        >
          Done
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100000] overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      <div className="flex min-h-full items-center justify-center p-4">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}
