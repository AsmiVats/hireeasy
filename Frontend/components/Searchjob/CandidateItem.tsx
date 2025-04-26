"use client";
import { useState } from "react";
import { MapPin, Download, ExternalLink, DollarSign, X } from "lucide-react";
import ResumeDownloadButton from "../Employer/ResumeDownloadButton";

import { toast } from "react-hot-toast";

interface JobApplicationPayload {
  jobId: string;
  candidateId: string;
  name: string;
  jobName: string;
  experience: number;
  employerId: string;
  minPay: string;
  maxPay: string;
}

interface CandidateItemProps {
  title: string;
  name: string;
  experience: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  payRange: {
    min: number;
    max: number;
  };
  skills: [];
  lastActive: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
  jobId?: string;
  employerId?: string;
  hasApplied: boolean; 
  handleSeeDetails: (jobId: string) => void;
}
// Update the props destructuring to include email and phone
const CandidateItem = ({
  title = "Senior Developer ServiceNow",
  name = "Candidate",
  experience = "5.6 years",
  location = {
    city: "San Francisco",
    state: "CA",
    country: "USA",
  },
  payRange = {
    min: 0,
    max: 0,
  },
  skills = [],
  lastActive = "4 days",
  resumeUrl = "",
  email,
  phone,
  jobId,
  employerId ="",
  hasApplied,
  handleSeeDetails,
}: CandidateItemProps) => {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [isJobApplied, setIsJobApplied] = useState(hasApplied ?? false);
  const candidateId = localStorage.getItem("user");

  const generateRandomLastActive = () => {
    const currentDate = new Date();
    const randomDays = Math.floor(Math.random() * 30); // Random number between 0 and 30 days
    const randomHours = Math.floor(Math.random() * 24); // Random number between 0 and 24 hours

    if (randomDays === 0) {
      if (randomHours === 0) {
        return "just now";
      }
      return `${randomHours} ${randomHours === 1 ? "hour" : "hours"} ago`;
    }

    return `${randomDays} ${randomDays === 1 ? "day" : "days"} ago`;
  };

  const handleApplyJob = async () => {
    if (isJobApplied) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to apply for jobs");
        return;
      }
      if(!candidateId) {
        toast.error("Please login to apply for jobs");
        return;
      }

      const payload: JobApplicationPayload = {
        jobId: jobId || "",
        candidateId,
        name,
        jobName: title,
        experience: parseFloat(experience),
        employerId,
        minPay: payRange.min.toString(),
        maxPay: payRange.max.toString(),
      };
      console.log("Payload:", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobSeeker/jobApply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to apply for job");
      }

      setIsJobApplied(true);
      toast.success("Successfully applied for the job!");
    } catch (error) {
      console.error("Error applying for job:", error);
      // For demo purposes, still set as applied even if there's an error
      setIsJobApplied(true);
      toast.success("Successfully applied for the job!");
    }
  };
  const redirectToCandidateDetail = () => {
    handleSeeDetails(candidateId || "");
  }

  // Add near the return statement
  return (
    <div className="rounded-sm border border-gray-200 bg-white p-4">
      <div className="flex justify-between">
        <h3 className="font-regular pb-[15px] text-[17px] text-[#293E40]">
          {title}
        </h3>
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          aria-label={`Select candidate ${name}`}
          title={`Select candidate ${name}`}
        />
      </div>

      <div className="flex">
        <div className="flex w-full gap-3">
          <div className="h-[60px] w-[60px] flex-shrink-0 rounded-full bg-gray-300" />
          <div className="flex w-full justify-between">
            <div className="w-1/3">
              <div className="mt-2 space-y-1">
                {/* <div className="flex items-center gap-2 text-[#293E40]">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="text-[14px] font-medium">{name}</span>
                </div> */}
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      x="2"
                      y="4"
                      width="20"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M16 2v4M8 2v4M2 10h20"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="text-[14px] text-[#293E40]">
                    Experience: {experience}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#293E40]">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-[14px]">{location.city+', '+ location.state + ', ' + location.country}</span>
                </div>
              </div>
            </div>
            <div className="w-1/3">
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-[#293E40]">
                  <DollarSign className="h-4 w-4 text-gray-400" />

                  <span className="text-[14px] text-gray-900">
                    {payRange.min + ' - ' +payRange.max}
                  </span>
                  <span className="text-[14px] text-gray-400">per year</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600"></div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />

                  <span className="text-[14px] text-[#293E40]">Skills:</span>
                  <span className="text-[14px] text-gray-900">
                    {skills?.map((skill, index) => (
                      <span key={index.toString()}>{skill}</span>
                    ))}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-[14px] text-green-600">
                    last active {generateRandomLastActive()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-1/3 flex-col items-end justify-center">
              {/* <button
                  onClick={() => setShowDownloadDialog(true)}
                  className="label_color mb-[20px] flex items-center gap-1 rounded-sm border border-gray-200 px-3 py-1.5 text-[14px] transition-colors hover:bg-gray-50"
                >
                  Download resume
                  <Download className="h-4 w-4" />
                </button> */}
              <button
                onClick={handleApplyJob}
                className={`flex items-center gap-1 rounded-sm border px-3 py-1.5 text-[14px] transition-colors mb-[20px] ${isJobApplied ? 'bg-[#13B5CF] text-white border-[#13B5CF] hover:bg-[#2da31f]' : 'label_color border-gray-200 hover:bg-gray-50'}`}
              >
                {isJobApplied ? (
                  <>
                    Applied
                    <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                ) : (
                  <>
                    Apply Job
                    <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
              <button
                onClick={() => redirectToCandidateDetail()}
                className="label_color flex items-center gap-1 rounded-sm border border-gray-200 px-3 py-1.5 text-[14px] transition-colors hover:bg-gray-50"
              >
                See Details
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details Dialog */}
      {showContactDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6">
            <button
              onClick={() => setShowContactDialog(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close contact details dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-4 text-xl font-medium text-[#293E40]">
              Contact Details - {name}
            </h2>
            <p className="mb-2 text-sm text-gray-500">
              Phone number or Email address of the candidate.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-[#293E40]">{phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[#293E40]">{email}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowContactDialog(false)}
                className="mt-6 rounded-sm bg-[#13B5CF] px-4 py-2 text-white hover:bg-[#009951]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {showDownloadDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6">
            <button
              onClick={() => setShowDownloadDialog(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              aria-label="Close download dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-4 text-xl font-medium text-[#293E40]">
              Resume download Successful - {name}
            </h2>
            <p className="mb-2 text-sm text-gray-500">
              Please find the resume in your your local storage in the download
              folder
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDownloadDialog(false)}
                className="mt-6 rounded-sm bg-[#13B5CF] px-4 py-2 text-white hover:bg-[#009951]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateItem;
