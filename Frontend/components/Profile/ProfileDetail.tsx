// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import toast from "react-hot-toast";

import {
  Download,
  Edit,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
  Phone,
  Mail,
  UserCheck,
  Settings,
  Minus,
  Loader2,
  ExternalLink,
  Trash2,
} from "lucide-react";

interface PayScale {
  min: number;
  max: number;
}

interface EmploymentDetail {
  _id: string;
  candidateProfile: string;
  jobTitle: string;
  companyName: string;
  description: string;
  fromDate: string;
  toDate: string;
  totalYearsSpent: number;
  status: string;
  __v: number;
}

interface EducationDetail {
  _id: string;
  candidateProfile: string;
  status: string;
  degreeName: string;
  universityName: string;
  courseName: string;
  specialization: string;
  fromDate: string;
  toDate: string;
  __v: number;
}

interface Skill {
  _id: string;
  candidateProfile: string;
  status: string;
  name: string;
  rating: number;
  __v: number;
}

interface Language {
  _id: string;
  candidateProfile: string;
  status: string;
  name: string;
  rating: number;
  read: boolean;
  write: boolean;
  speak: boolean;
  __v: number;
}

interface CandidateProfile {
  _id: string;
  name: string;
  phone: string;
  yearsOfExperience: number;
  dob: string;
  address: string;
  city: string;
  state: string;
  country: string;
  payScale: PayScale;
  payType: string;
  resumeLink: string;
  linkedinProfile: string;
  mediumProfile: string;
  githubProfile: string;
  profileHeadline: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastActive: string;
  email: string;
  password: string;
  employmentDetails: EmploymentDetail[];
  educationDetails: EducationDetail[];
  skills: Skill[];
  languages: Language[];
  noticePeriod?: string;
}

interface CandidateProfileProps {
  candidate?: CandidateProfile;
}

const ProfileData: React.FC<CandidateProfileProps> = () => {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        debugger;
        const id = searchParams.get("id");
        if (!id) {
          throw new Error("Profile ID not found");
        }

        const uid = localStorage.getItem("candidateid");

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/jobSeeker/getJobSeekerProfile?id=${uid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setCandidate(data[0]);
        console.log("Profile data:", data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [searchParams]);

  // Mock data for development/preview
 

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#13B5CF]" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto  max-w-full p-[30px]">
      {/* Header Section */}
      <div className="mb-6 flex items-start justify-between rounded-lg border border-[#E6E6E6] bg-white p-6">
        {/* Left column - Profile info */}
        <div className="flex gap-6 w-1/3">
          <div className="h-24 w-24 rounded-full bg-[#D9D9D9]"></div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-medium text-[#293E40]">
                {candidate?.name}
              </h1>
              <ExternalLink className="h-4 w-4 cursor-pointer text-[#293E40]" />
            </div>
            <p className="text-[16px] text-[#666666]">
              {candidate?.profileHeadline}
            </p>
            <div className="flex items-center gap-2 text-[14px] text-[#293E40]">
              <Briefcase className="h-4 w-4 text-[#666666]" />
              <span>Stark Industries LLC.</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[#293E40]">
              <MapPin className="h-4 w-4 text-[#666666]" />
              <span>{candidate?.city} {candidate?.country}</span>
            </div>
          </div>
        </div>

        {/* Middle column - Experience and salary */}
        <div className="flex flex-col gap-4 w-1/3 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#666666]" />
            <span className="text-[14px]">
              <strong className="text-[#293E40]">{candidate?.yearsOfExperience}</strong>
              <span className="text-[#666666]"> of experience</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#666666]" />
            <span className="text-[14px]">
              <strong className="text-[#293E40]">{candidate?.payScale?.max}</strong>
              <span className="text-[#666666]"> per year</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#666666]" />
            <span className="text-[14px]">
              <strong className="text-[#293E40]">{candidate?.noticePeriod} Days</strong>
              <span className="text-[#666666]"> notice period</span>
            </span>
          </div>
        </div>

        {/* Right column - Contact info */}
        <div className="flex flex-col gap-4 w-1/3 items-end">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#666666]" />
            <span className="text-[14px] text-[#666666]">{candidate?.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#666666]" />
            <span className="text-[14px] text-[#666666]">
              {candidate?.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-[#666666]" />
            <span className="text-[14px] text-[#666666]">
              Profile last updated - {candidate?.lastActive}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-[240px] rounded-lg border border-[#E6E6E6] bg-white p-4">
          <div className="mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#293E40]" />
            <span className="text-[16px] font-medium text-[#293E40]">
              Quick links
            </span>
          </div>
          <div className="flex flex-col gap-[42px]">
            {["Resume", "Skills", "Employment", "Educations", "Languages"].map(
              (link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="pl-8 text-[16px] text-[#666666] hover:text-[#293E40]"
                >
                  {link}
                </a>
              ),
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Resume Section */}
          <div
            id="resume"
            className="rounded-lg border border-[#E6E6E6] bg-white p-6"
          >
            <h2 className="mb-4 text-[15px] font-medium text-[#0F1137]">
              Resume
            </h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[16px] text-[#293E40]">
                  Resume tony Stark.doc
                </p>
                <p className="text-[14px] text-[#666666]">
                  Uploaded on 20th Jan 2025
                </p>
              </div>
              <button className="flex items-center gap-2 rounded border border-[#13B5CF] px-4 py-2 text-[#293E40]">
                Update resume
                <ExternalLink className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <button className="text-[#13B5CF]">
                  <Download className="h-5 w-5" />
                </button>
                <button className="text-[#FF4040]">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Resume Headline */}
          <div className="rounded-lg border border-[#E6E6E6] bg-white p-6">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-[15px] font-medium text-[#0F1137]">
                Resume headline
              </h2>
              <Edit className="h-4 w-4 cursor-pointer text-[#293E40]" />
            </div>
            <p className="text-[16px] text-[#666666]">
              Software Engineer with 10 years of experience | Service Now
              Developer | Lead Developer | Stark Industries LLC.
            </p>
          </div>

          {/* Skills Section */}
          <div
            id="skills"
            className="rounded-lg border border-[#E6E6E6] bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-medium text-[#0F1137]">Skills</h2>
              <button className="text-sm text-[#13B5CF]">ADD SKILL</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {candidate?.skills && candidate.skills.length > 0 ? (
                candidate.skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="flex items-center gap-2 rounded border border-[#666666] px-4 py-1 text-[14px] text-[#666666]"
                  >
                    {skill.name}
                    <Minus className="h-4 w-4" />
                  </div>
                ))
              ) : (
                <div className="text-[14px] text-[#666666]">No skills available</div>
              )}
            </div>
          </div>

          {/* Employment Section */}
          <div
            id="employment"
            className="rounded-lg border border-[#E6E6E6] bg-white p-6"
          >
            <div className="mb-4 flex border-b pb-2 items-center justify-between">
              <h2 className="text-[15px] font-medium text-[#293E40]">
                Employment
              </h2>
              <button className="text-sm text-[#13B5CF]">ADD EMPLOYMENT</button>
            </div>
            <div className="space-y-6">
              {candidate?.employmentDetails && candidate.employmentDetails.length > 0 ? (
                candidate.employmentDetails.map((employment, index) => (
                  <div 
                    key={employment._id}
                    className={index > 0 ? "border-t border-[#E6E6E6] pt-6" : ""}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-[16px] text-[#293E40]">
                        {employment.jobTitle}
                      </h3>
                      <Edit className="h-4 w-4 cursor-pointer text-[#293E40]" />
                    </div>
                    <div className="mb-3 flex gap-6 text-[14px]">
                      <span className="text-[#666666]">{employment.companyName}</span>
                      <span className="text-[#AEB4C1]">
                        {new Date(employment.fromDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} to {' '}
                        {employment.toDate ? new Date(employment.toDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}
                      </span>
                    </div>
                    <p className="text-[14px] text-[#666666]">
                      {employment.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-[14px] text-[#666666]">No employment history available</div>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div
            id="educations"
            className="rounded-lg border border-[#E6E6E6] bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-medium text-[#293E40]">
                Education
              </h2>
              <button className="text-sm text-[#13B5CF]">ADD EDUCATION</button>
            </div>
            <div className="space-y-6">
              {candidate?.educationDetails && candidate.educationDetails.length > 0 ? (
                candidate.educationDetails.map((education, index) => (
                  <div 
                    key={education._id} 
                    className={index > 0 ? "border-t border-[#E6E6E6] pt-6" : ""}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-[16px] text-[#293E40]">
                        {education.degreeName} {education.specialization && `| ${education.specialization}`}
                      </h3>
                      <Edit className="h-4 w-4 cursor-pointer text-[#293E40]" />
                    </div>
                    <div className="flex gap-6 text-[14px]">
                      <span className="text-[#666666]">{education.universityName}</span>
                      <span className="text-[#AEB4C1]">
                        {new Date(education.fromDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} to {' '}
                        {new Date(education.toDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    {education.courseName && (
                      <div className="mt-2 text-[14px] text-[#666666]">
                        Course: {education.courseName}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-[14px] text-[#666666]">No education details available</div>
              )}
            </div>
          </div>

          {/* Languages Section */}
          <div
            id="languages"
            className="rounded-lg border border-[#E6E6E6] bg-white p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-medium text-[#0F1137]">
                Languages
              </h2>
              <button className="text-sm text-[#13B5CF]">ADD LANGUAGE</button>
            </div>
            <div className="space-y-4">
              {candidate?.languages && candidate.languages.length > 0 ? (
                candidate.languages.map((language, index) => (
                  <div 
                    key={language._id} 
                    className={`flex items-center justify-between ${
                      index < candidate.languages.length - 1 ? "border-b border-[#E6E6E6] pb-4" : ""
                    }`}
                  >
                    <span className="text-[16px] text-[#293E40]">{language.name}</span>
                    <span className="text-[16px] text-[#293E40]">{language.rating}/10</span>
                    <div className="flex gap-[135px]">
                      <span className="text-[16px] text-[#666666]">
                        {language.read ? "Read" : ""}
                      </span>
                      <span className="text-[16px] text-[#666666]">
                        {language.write ? "Write" : ""}
                      </span>
                      <span className="text-[16px] text-[#666666]">
                        {language.speak ? "Speak" : ""}
                      </span>
                    </div>
                    <Edit className="h-4 w-4 cursor-pointer text-[#293E40]" />
                  </div>
                ))
              ) : (
                <div className="text-[16px] text-[#666666]">No language details available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileData;
