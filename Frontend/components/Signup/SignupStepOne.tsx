"use client";

import React, { useState, useEffect } from "react";
import { useSignupStore } from "@/store/signupStore";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

const SignUpStepOne = ({ clickContinue, onClose }) => {
  const stepOneData = useSignupStore((state) => state.stepOneData);
  const setStepOneData = useSignupStore((state) => state.setStepOneData);
  const [formData, setFormData] = useState({
    name: stepOneData.name || "",
    companyName: stepOneData.companyName || "",
    companySize: stepOneData.companySize || "",
    logoUrl: stepOneData.logoUrl || "",
    userType:  stepOneData.userType || "",
  });

  const [errors, setErrors] = useState({
    name: "",
    companyName: "",
    companySize: "",
    userType: "",
  });
  // Add state to track the selected file name
  const [selectedFileName, setSelectedFileName] = useState("");

  // Set the selected file name when component mounts if logoUrl exists
  useEffect(() => {
    if (stepOneData.logoUrl) {
      const urlParts = stepOneData.logoUrl.split("/");
      setSelectedFileName(urlParts[urlParts.length - 1]);
    }
  }, [stepOneData.logoUrl]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      companyName: "",
      companySize: "",
      userType: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.userType.trim()) {
      newErrors.userType = "User type is required";
    }
    if(formData.userType === 'Employer'){

      
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Company name is required";
      }
      
      if (!formData.companySize.trim()) {
        newErrors.companySize = "Company size is required";
      }
    }


    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Update store with the form data
    setStepOneData({
      name: formData.name,
      companyName: formData.companyName,
      companySize: formData.companySize,
      userType: formData.userType,
      logoUrl: formData.logoUrl || "",
    });

    clickContinue(2);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Update the selected file name state
      setSelectedFileName(file.name);

      try {
        // Create form data for file upload
        const formData = new FormData();
        formData.append("file", file);

        // Upload the file to the server
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/uploadFile`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to upload logo");
        }

        const result = await response.json();

        // Store the logo URL with the correct property name
        setFormData((prev) => ({
          ...prev,
          logoUrl: result.fileUrl, // Assuming the API returns the file URL in this format
        }));
      } catch (error) {
        console.error("Error uploading logo:", error);
      }
    }
  };

  return (
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
        <span className="text-sm font-bold text-gray-600">
          Already have an account?{" "}
        </span>
        <button
          onClick={onClose}
          className="text-sm font-medium text-[#13B5CF] "
        >
          Sign in
        </button>
      </div>

      <form onSubmit={handleContinue}>
        <div className="space-y-4">
          <div>
            <label className="label_color mb-1 block text-sm">
              Name <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input_field w-full rounded-sm border px-3 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                errors.name ? "border-[#900B09]" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 flex items-center text-sm text-[#900B09]">
                <TriangleAlert className="mr-2 h-4 w-4" /> {errors.name}
              </p>
            )}
          </div>
          <div>
            <label className="label_color mb-1 block text-sm">
              User type <span className="text-[#900B09]">*</span>
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="input_field w-full appearance-none rounded-sm border border-[#D0D5DD] bg-white px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
            >
              <option value="" disabled>
                Select user type
              </option>
              <option value="Employer">Employer</option>
              <option value="Candidate">Candidate</option>
            </select>
            {errors.userType && (
              <p className="mt-1 flex items-center text-sm text-[#900B09]">
                <TriangleAlert className="mr-2 h-4 w-4" /> {errors.userType}
              </p>
            )}
          </div>

          {formData.userType === "Employer" && (
            <>
              <div>
                <label className="label_color mb-1 block text-sm">
                  Company name <span className="text-[#900B09]">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`input_field w-full rounded-sm border px-3 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                    errors.companyName ? "border-[#900B09]" : "border-gray-300"
                  }`}
                />
                {errors.companyName && (
                  <p className="mt-1 flex items-center text-sm text-[#900B09]">
                    <TriangleAlert className="mr-2 h-4 w-4" />{" "}
                    {errors.companyName}
                  </p>
                )}
              </div>

              <div>
                <label className="label_color mb-1 block text-sm">
                  Company size <span className="text-[#900B09]">*</span>
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="input_field w-full appearance-none rounded-sm border border-[#D0D5DD] bg-white px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
                >
                  <option value="" disabled>
                    Select company size
                  </option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
                {errors.companySize && (
                  <p className="mt-1 flex items-center text-sm text-[#900B09]">
                    <TriangleAlert className="mr-2 h-4 w-4" />{" "}
                    {errors.companySize}
                  </p>
                )}
              </div>

              <div>
                <label className="label_color mb-1 block text-sm">
                  Upload your company logo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input_field flex-1 rounded-sm border border-gray-300 px-3 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
                    placeholder="No file chosen"
                    readOnly
                    value={selectedFileName}
                  />
                  <label className="cursor-pointer rounded-sm bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-800">
                    Browse...
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="mt-[30px] flex items-center justify-between">
            <Link
              href="#"
              className="cursor-pointer text-sm text-[#009951] hover:text-[#13B5CF]"
            >
              Need Help?
            </Link>
            <button type="submit" className="globalbutton">
              Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export { SignUpStepOne };
