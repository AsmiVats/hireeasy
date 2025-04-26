"use client";
import { useState } from "react";
import { MapPin, Download, ExternalLink, DollarSign, X } from "lucide-react";
import ResumeDownloadButton from "../Employer/ResumeDownloadButton";

interface CandidateItemProps {
  title: string;
  name: string;
  experience: string;
  location: string;
  payScale: {
    min: number;
    max: number;
  };
  skills: [];
  lastActive: string;
  email?: string;
  phone?: string;
  candidateId?: string;
  resumeUrl?: string;
}
// Update the props destructuring to include email and phone
const CandidateItem = ({
  title = "Senior Developer ServiceNow",
  name = "Candidates name",
  experience = "5.6 years",
  location = "New Jersey, NYC",
  payScale = {
    min: 0,
    max: 0,
  },
  skills = [],
  lastActive = "4 days",
  candidateId = "",
  resumeUrl = "",
  email,
  phone,
}: CandidateItemProps) => {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const generateRandomLastActive = () => {
    const currentDate = new Date();
    const randomDays = Math.floor(Math.random() * 30); // Random number between 0 and 30 days
    const randomHours = Math.floor(Math.random() * 24); // Random number between 0 and 24 hours

    let text;
    if (randomDays === 0) {
      if (randomHours === 0) {
        text = "just now";
      } else {
        text = `${randomHours} ${randomHours === 1 ? "hour" : "hours"} ago`;
      }
    } else {
      text = `${randomDays} ${randomDays === 1 ? "day" : "days"} ago`;
    }

    return { text, days: randomDays };
  };

  const getActivityStatusColors = (days) => {
    if (days < 7) {
      return { dotColor: "bg-[#02542D]", textColor: "text-[#02542D]" };
    } else if (days >= 7 && days < 14) {
      return { dotColor: "bg-[#E5A000]", textColor: "text-[#E5A000]" };
    } else {
      return { dotColor: "bg-[#900B09]", textColor: "text-[#900B09]" };
    }
  };

  const lastActivityData = generateRandomLastActive();
  const activityColors = getActivityStatusColors(lastActivityData.days);

  // Add near the return statement
  return (

<div className="rounded-sm  h-[179px] border border-gray-200 bg-white px-[20px] py-[15px] ">
      <div className="flex  justify-between">
        <h3 className="font-bold pb-[15px] text-[17px] text-[#293E40]">
          {title}
        </h3>
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          aria-label={`Select candidate ${name}`}
          title={`Select candidate ${name}`} />
      </div>

        <div className="flex">
          <div className="flex w-full p-2  gap-3">
            <div className="h-[75px] w-[75px] mr-[40px] mt-2 flex-shrink-0 rounded-full bg-gray-300" />
            <div className="flex w-full justify-between">
  <div className="w-1/3 pr-2">
    <div className=" space-y-1">
      <div className="flex items-center gap-2 text-[#293E40]">
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
        <span className="text-[14px] text-[#0F1137] font-semibold">{name}</span>
      </div>
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
        <span className="text-[14px] mt-2 mb-1 text-[#293E40]">
          Experience: {experience}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[#293E40]">
        <MapPin className="h-4 w-4 text-[#5A5A5A] " />
        <span className="text-[14px] text-[#293E40] ">{location}</span>
      </div>
    </div>
  </div>
  <div className="w-1/3 px-2">
    <div className=" space-y-1">
      <div className="flex items-center gap-2 mb-2 text-[#293E40]">
        <DollarSign className="h-4 w-4 text-gray-400" />
        <span className="text-[14px] text-gray-900">
          1000 {payScale.max}
        </span>
        <span className="text-[14px] text-gray-400">per year</span>
      </div>
     
      <div className="flex items-center gap-1 text-gray-600">
        <MapPin className="h-4 w-4 mt-2 text-gray-400" />
        <span className="text-[14px] mt-2  text-[#5A5A5A]">Skills:</span>
        <span className="text-[14px] mt-2 text-gray-900">
          {skills?.length > 0 ? (
            <span>{skills.join(', ')}</span>
          ) : (
            <span>No skills listed</span>
          )}
        </span>
      </div>
      <div className="flex items-center  gap-1">
        <span
                    className={`h-2 w-2 mt-1 rounded-full ${activityColors.dotColor}`}
                  ></span>
                  <span className={`text-[14px] mt-1 ${activityColors.textColor}`}>
                    last active {lastActivityData.text}
                  </span>
                </div>
              </div>
            </div>
  <div className="w-1/3 pl-2 flex flex-col items-end justify-start">
    <ResumeDownloadButton 
      className="label_color flex items-center gap-1 rounded-sm border-[2px] border-[#009951] px-3 py-1.5 text-[14px] transition-colors hover:bg-gray-50 mb-[20px]  w-[183px] h-[36px] justify-center"
      candidateId={candidateId}
      resumeUrl={resumeUrl}
      label="Download resume"
    />
    <button
      onClick={() => setShowContactDialog(true)}
      className="label_color flex items-center gap-1 rounded-sm border border-gray-200 px-3 py-1.5 text-[14px] transition-colors hover:bg-gray-50 mb-[20px]  w-[183px] h-[36px] justify-center"
    >
      See contact details
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
