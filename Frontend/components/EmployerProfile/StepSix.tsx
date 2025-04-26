"use client";
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import ProgressBar from "@/components/EmployerProfile/ProgressBar";
import { useEmployerProfileStore } from "@/store/employerProfile";
import { useUser } from "@/app/context/UserContext";
import { toast } from "react-hot-toast";

interface PreviewField {
  label: string;
  value: string;
}

interface StepSixProps {
  onNext?: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const StepSix = ({ onNext, onBack, currentStep, totalSteps }: StepSixProps) => {
  const { formData, updateFormData } = useEmployerProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const { canPostJob, incrementJobPostCount, getJobPostsRemaining, user } = useUser();

  const [applicationEmail, setApplicationEmail] = useState(formData.email);
  const [alternateEmails, setAlternateEmails] = useState({
    alternateEmails: formData.alternativeEmail1,
    alternateEmails2: formData.alternativeEmail2,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Enter job description...',
        showOnlyWhenEditable: true,
      }),
    ],
    content: formData.description,
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none min-h-[200px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateFormData({ description: html });
    },
  });

  const EditableField = ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }) => (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-sm border p-2 pr-10"
      />
      <button
        type="button"
        aria-label="Clear text"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            d="M13.5 2.5l-11 11m0-11l11 11"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const handlePostJob = async () => {
    // if (!canPostJob()) {
    //   toast.error("You have reached the maximum number of job postings allowed in your subscription plan.");
    //   return;
    // }
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      // Ensure the job status is set before submission
      if (!formData.status || formData.status.trim() === '') {
        // Update the status in the store
        updateFormData({
          status: 'Open' // Set to 'Open' when posting (enum values: ["Open", "Closed", "Paused"])
        });
      }
      
      // Create a submission object with all required fields
      const submissionData = {
        ...formData,
        status: formData.status || 'Open',
        email: applicationEmail, // Use the values from the form
        alternativeEmail1: alternateEmails.alternateEmails,
        alternativeEmail2: alternateEmails.alternateEmails2,
        description: editor?.getHTML() || formData.description
      };
      
      const response = await fetch(`${BASE_URL}/job/createJobPosting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post job");
      }
      
      const result = await response.json();
      console.log("Job posted successfully:", result);
      
      await incrementJobPostCount();
      
      toast.success("Job posted successfully! You have " + getJobPostsRemaining() + " job postings remaining.");
      
      if (onNext) onNext();
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Failed to post job. Please try again.");
    } finally {
      setIsLoading(false);
      sessionStorage.setItem("employerData", JSON.stringify(formData));
    }
  };

  return (
    <div className="flex min-h-screen justify-center pt-10 sm:pt-[100px] px-2 sm:px-0">
      <div className="w-full max-w-[95vw] sm:max-w-[550px]">
        <h1 className="mb-6 sm:mb-[25px] text-center text-2xl sm:text-[36px] font-bold text-[#293E40]">
          Create a new job
        </h1>
        <h2 className="mb-6 sm:mb-[25px] text-center text-lg sm:text-[26px] text-[#13B5CF] opacity-60">
          Job post preview
        </h2>
        <ProgressBar
          currentStep={currentStep || 0}
          totalSteps={totalSteps || 0}
        />
        
        {user?.subscription && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Subscription:</span> {user.subscription.displayName || (user.subscription.planName ? `${user.subscription.planName} Plan` : 'Basic Plan')}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Job postings remaining:</span> {getJobPostsRemaining()} of {user.subscription.features.jobPosting.limit}
            </p>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-6">
            <label className="mb-2 block text-gray-600">
              Send Application profile to
            </label>
            <EditableField
              value={applicationEmail}
              onChange={setApplicationEmail}
              placeholder="Enter email address"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-gray-600">
              Alternate email ids
            </label>
            <EditableField
              value={
                alternateEmails.alternateEmails ||
                alternateEmails.alternateEmails2
              }
              onChange={setApplicationEmail}
              placeholder="Enter alternate email addresses"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-gray-600">
              Job description <span className="text-[#900B09]">*</span>
            </label>
            <div className="overflow-hidden rounded-sm border">
              <div className="flex items-center gap-2 border-b border-gray-300 bg-white px-3 py-2">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`rounded p-1 ${
                    editor?.isActive("bold") ? "bg-gray-200" : ""
                  }`}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`rounded p-1 ${
                    editor?.isActive("italic") ? "bg-gray-200" : ""
                  }`}
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`rounded p-1 ${
                    editor?.isActive("underline") ? "bg-gray-200" : ""
                  }`}
                >
                  <u>U</u>
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`rounded p-1 ${
                    editor?.isActive("bulletList") ? "bg-gray-200" : ""
                  }`}
                >
                  •
                </button>
              </div>
              <EditorContent editor={editor} className="bg-white" />
            </div>
          </div>

          <div className="mt-8 flex flex-row sm:flex-row justify-between gap-4">
            <button
              className="w-full sm:w-auto mt-4 sm:mt-10 rounded-sm bg-[#293E40] px-6 py-2 text-white transition-colors #009951"
              onClick={onBack}
            >
              Back
            </button>
            <button
              type="submit"
              onClick={handlePostJob}
              disabled={isLoading}
             className="w-full sm:w-auto mt-4 sm:mt-10 rounded-sm bg-[#13B5CF] px-6 py-2 text-white transition-colors #009951"
            >

              {isLoading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Posting...
                </>
              ) : (
                "Post Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { StepSix };
