"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface CandidateDetailProps {
  candidateId?: string | null;
  backToDashboard: () => void;
}

import {
  Building,
  MapPin,
  Briefcase,
  Calendar,
  Users,
  Globe,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  Loader2,
  ChevronLeft,
  Monitor,
  Linkedin,
  Download,
  Github,
  DollarSign,
  X,
  Video,
  SplitSquareVertical
} from "lucide-react";
import { debug } from "console";

interface JobPosting {
  newApplicants: number;
  totalApplicants: number;
  alternateEmail: string;
  totalViews: number;
  _id: string;
  title: string;
  companyName: string;
  location: {
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  numberOfVacancies: number;
  minSalary: number;
  maxSalary: number;
  jobType: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  contactEmail: string;
  createdAt: string;
  employerId: string;
}

function EmployerDetailContent({ id, backToDashboard }) {
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [employerID, setEmployerID] = useState('');
  const router = useRouter();

  // Fetch job posting details when the component mounts or when the ID changes
  useEffect(() => {
    const eid = localStorage.getItem("user") || ''
    const fetchJobPosting = async () => {
      try {
        if (!id) {
          throw new Error('Job ID not found');
        }

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobSeeker/getJobSeekerProfile?id=${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch candidate profile');
        }
        const data = await response.json();
        console.log(data);
        const finalData = data[0]
        setJobPosting(finalData);
      } catch (error) {
        console.error('Error fetching candidate profile:', error);
        setError(error.message || 'Failed to fetch candidate profile');
        toast.error('Failed to fetch candidate d');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobPosting();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#13B5CF]" />
      </div>
    );
  }

  if (error || !jobPosting) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <p className="text-lg text-gray-600 mb-4">
          {error || 'Candidate profile not found'}
        </p>
        <button onClick={backToDashboard} className="text-[#13B5CF] flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-50">
      {/* Header with back button */}
      <div className="mb-6 flex justify-between">
        <button 
          onClick={backToDashboard}
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to jobs
        </button>
        <button className="bg-[#13B5CF] text-white px-4 py-2 rounded hover:bg-[#2a9d1c] transition-colors">
          Edit job
        </button>
      </div>

      {/* Job Header Section */}
      <div className="mb-6 rounded-lg border border-[#E6E6E6] bg-white p-6">
        <h1 className="text-[24px] font-medium text-[#293E40] mb-4">
          {jobPosting?.title}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="text-[#293E40]">{jobPosting?.companyName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-[#293E40]">
                {typeof jobPosting?.location === 'object' 
                  ? `${jobPosting?.location?.city || ''}, ${jobPosting?.location?.state || ''}, ${jobPosting?.location?.country || ''}`
                  : jobPosting?.location}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Number of vacancies</p>
              <p className="text-[#293E40]">{jobPosting?.numberOfVacancies}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Primary Email</p>
              <p className="text-[#293E40]">{jobPosting?.contactEmail}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Job type</p>
              <p className="text-[#293E40]">{jobPosting?.jobType}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Salary range</p>
              <p className="text-[#293E40]">${jobPosting?.minSalary} - ${jobPosting?.maxSalary} per week</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          {/* Skills Section */}
          <div className="mb-6 rounded-lg border border-[#E6E6E6] bg-white p-6">
            <h2 className="mb-4 text-[18px] font-medium text-[#293E40]">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {jobPosting?.skills?.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-6 rounded-lg border border-[#E6E6E6] bg-white p-6">
            <h2 className="mb-4 text-[18px] font-medium text-[#293E40]">
              Benefits
            </h2>
            <div className="flex flex-wrap gap-2">
              {jobPosting?.benefits.map((benefit, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center"
                >
                  {benefit}
                  <span className="ml-1 text-gray-400">+</span>
                </span>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-6 rounded-lg border border-[#E6E6E6] bg-white p-6">
            <h2 className="mb-4 text-[18px] font-medium text-[#293E40]">
              Description
            </h2>
            <div className="prose max-w-none text-[#666666]">
              <p className="whitespace-pre-line">{jobPosting?.description}</p>
            </div>
            
            <h3 className="mt-6 mb-2 text-[16px] font-medium text-[#293E40]">
              Key Responsibilities:
            </h3>
            <ul className="list-disc pl-5 text-[#666666] space-y-2">
              {jobPosting?.responsibilities?.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
            
            <h3 className="mt-6 mb-2 text-[16px] font-medium text-[#293E40]">
              Job Requirements:
            </h3>
            <ul className="list-disc pl-5 text-[#666666] space-y-2">
              {jobPosting?.requirements?.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="lg:w-1/4">
          <div className="rounded-lg border border-[#E6E6E6] bg-white p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="text-[18px] font-medium text-[#293E40]">
                Job Settings
              </h2>
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <select
                  className="w-full appearance-none rounded border border-gray-300 px-3 py-2 pr-8 focus:border-[#13B5CF] focus:outline-none"
                  defaultValue="Open"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                <p className="text-[#293E40]">New Applicants - {jobPosting?.newApplicants || 20}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                <p className="text-[#293E40]">Total Applicants - {jobPosting?.totalApplicants || 100}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email 2</p>
                  <p className="text-[#293E40]">{jobPosting?.contactEmail || "tony.stark@gmail.com"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email 3</p>
                  <p className="text-[#293E40]">{jobPosting?.alternateEmail || "tony.stark@gmail.com"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-gray-400" />
                <p className="text-[#293E40]">Total views - {jobPosting?.totalViews || 200}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Job posted on</p>
                  <p className="text-[#293E40]">{new Date(jobPosting?.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) || "20th Jan 2025"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
interface CandidateData {
  name: string;
  profileHeadline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  dob: string;
  yearsOfExperience: number;
  payScale: {
    min: number;
    max: number;
  };
  payType: string;
  githubProfile: string;
  linkedinProfile: string;
  languages: Array<{
    name: string;
    rating: number;
    read: boolean;
    speak: boolean;
    write: boolean;
  }>;
  educationDetails: Array<any>;
  employmentDetails: Array<any>;
  skills: Array<any>;
  resumeLink: string;
}

function CandidateDetailContent({ id, backToDashboard }) {
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidateProfile = async () => {
      try {
        if (!id) {
          throw new Error('Candidate ID not found');
        }

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobSeeker/getJobSeekerProfile?id=${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch candidate profile');
        }
        const data = await response.json();
        setCandidate(data[0]);
      } catch (error) {
        console.error('Error fetching candidate profile:', error);
        setError(error.message || 'Failed to fetch candidate profile');
        toast.error('Failed to fetch candidate details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#13B5CF]" />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <p className="text-lg text-gray-600 mb-4">
          {error || 'Candidate profile not found'}
        </p>
        <button onClick={backToDashboard} className="text-[#13B5CF] flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f5f6f8] min-h-screen">
      {/* Header section with back button */}
      <div className="w-full p-6 mb-6 border-b">
        <button
          onClick={backToDashboard}
          className="inline-flex items-center text-[#1a75e8] hover:text-[#0f1137] transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>

      {/* Profile card */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-md shadow-sm mb-6 p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Profile image */}
            <div className="w-24 h-24 rounded-full bg-[#d9d9d9] flex-shrink-0"></div>

            {/* Profile info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[24px] font-medium text-[#292d32]">{candidate.name}</h1>
                    <ExternalLink className="h-4 w-4 text-[#aeb4c1]" />
                  </div>
                  <p className="text-[#5a5a5a] mb-2">{candidate.profileHeadline}</p>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-2">
                    <div className="flex items-center gap-2 text-[#5a5a5a]">
                      <Briefcase className="h-4 w-4 text-[#aeb4c1]" />
                      <span>{candidate.employmentDetails[0]?.companyName || "Stark Industries LLC."}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#5a5a5a]">
                      <MapPin className="h-4 w-4 text-[#aeb4c1]" />
                      <span>{`${candidate.city}, ${candidate.state}`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-[#aeb4c1] mt-0.5" />
                  <div>
                    <p className="text-[#5a5a5a]">{candidate.yearsOfExperience} Years</p>
                    <p className="text-xs text-[#aeb4c1]">of experience</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="h-5 w-5 text-[#aeb4c1] mt-0.5" />
                  <div>
                    <p className="text-[#5a5a5a]">{candidate.payScale?.min || "100,000"} USD</p>
                    <p className="text-xs text-[#aeb4c1]">per year</p>
                  </div>
                </div>

                {/* <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-[#aeb4c1] mt-0.5" />
                  <div>
                    <p className="text-[#5a5a5a]">{candidate.noticePeriod || "60 Days"}</p>
                    <p className="text-xs text-[#aeb4c1]">notice period</p>
                  </div>
                </div> */}

                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-[#aeb4c1] mt-0.5" />
                  <div>
                    <p className="text-[#5a5a5a]">{candidate.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-[#aeb4c1] mt-0.5" />
                  <div>
                    <p className="text-[#5a5a5a]">{candidate.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 col-span-1 md:col-span-2">
                  <Clock className="h-5 w-5 text-[#aeb4c1] mt-0.5" />
                  <div>
                    <p className="text-[#5a5a5a]">
                      Profile last updated -{" "}
                      {new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content with sidebar */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-60 bg-white rounded-md shadow-sm p-4 h-fit">
            <div className="flex items-center gap-2 mb-4 text-[#5a5a5a]">
              <SplitSquareVertical className="h-5 w-5" />
              <span className="font-medium">Quick links</span>
            </div>

            <div className="space-y-4">
              <a href="#resume" className="block text-[#1a75e8] font-medium">
                Resume
              </a>
              <a href="#skills" className="block text-[#5a5a5a] hover:text-[#1a75e8]">
                Skills
              </a>
              <a href="#employment" className="block text-[#5a5a5a] hover:text-[#1a75e8]">
                Employment
              </a>
              <a href="#education" className="block text-[#5a5a5a] hover:text-[#1a75e8]">
                Educations
              </a>
              <a href="#languages" className="block text-[#5a5a5a] hover:text-[#1a75e8]">
                Languages
              </a>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Resume section */}
            <div id="resume" className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-[#292d32] mb-4">Resume</h2>

              <div className="mb-4">
                <p className="text-[#292d32] font-medium">Resume {candidate.name.toLowerCase()}.doc</p>
                <p className="text-xs text-[#aeb4c1]">
                  Uploaded on{" "}
                  {new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={candidate.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#1a75e8] text-[#1a75e8] rounded hover:bg-[#f5f6f8] transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Download resume
                </a>

                <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#1a75e8] text-[#1a75e8] rounded hover:bg-[#f5f6f8] transition-colors">
                  <Video className="h-5 w-5" />
                  Video resume
                </button>
              </div>
            </div>

            {/* Resume headline */}
            <div className="bg-white rounded-md shadow-sm p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-medium text-[#292d32]">Resume headline</h2>
                <ExternalLink className="h-4 w-4 text-[#aeb4c1]" />
              </div>

              <p className="text-[#5a5a5a]">
                {candidate.profileHeadline ||
                  "Software Engineer with 10 years of experience | Service Now Developer | Lead Developer | Stark Industries LLC."}
              </p>
            </div>

            {/* Skills section */}
            <div id="skills" className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-[#292d32] mb-4">Skills</h2>

              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-1 border border-[#d9d9d9] rounded-full text-[#5a5a5a] flex items-center gap-1"
                  >
                    {skill.name}
                    <X className="h-3 w-3 text-[#aeb4c1]" />
                  </span>
                ))}
              </div>
            </div>

            {/* Employment section */}
            <div id="employment" className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-[#292d32] mb-6">Employment</h2>

              {candidate.employmentDetails.map((emp, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-medium text-[#292d32]">Senior Software Engineer</h3>
                    <ExternalLink className="h-4 w-4 text-[#aeb4c1]" />
                  </div>

                  <p className="text-[#5a5a5a] mb-1">{emp.companyName}</p>

                  <p className="text-[#aeb4c1] text-sm mb-4">
                    {new Date(emp.fromDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} to{" "}
                    {emp.toDate
                      ? new Date(emp.toDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                      : "Present"}
                  </p>

                  <p className="text-[#5a5a5a]">
                    A results-driven Senior Software Engineer specializing in ServiceNow development and implementation,
                    with extensive experience in building robust IT Service Management (ITSM) solutions. Proficient in
                    designing, developing, and deploying end-to-end ServiceNow applications tailored to meet business
                    needs, ensuring high performance, scalability, and seamless user experience.
                  </p>
                </div>
              ))}
            </div>

            {/* Education section */}
            <div id="education" className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-[#292d32] mb-6">Education</h2>

              {candidate.educationDetails.map((edu, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="font-medium text-[#292d32]">M. Sc. | Mathematics and Computer Science</h3>
                    <ExternalLink className="h-4 w-4 text-[#aeb4c1]" />
                  </div>

                  <p className="text-[#5a5a5a] mb-1">{edu.institution}</p>

                  <p className="text-[#aeb4c1] text-sm">June 2021 to May 2023</p>
                </div>
              ))}
            </div>

            {/* Languages section */}
            <div id="languages" className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-[#292d32] mb-6">Languages</h2>

              {candidate.languages.map((lang, index) => (
                <div key={index} className="mb-6 last:mb-0 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-[#292d32] font-medium">{lang.name}</p>
                  </div>

                  <div className="flex-1 text-center">
                    <p className="text-[#5a5a5a]">6/10</p>
                  </div>

                  <div className="flex-1 text-center">
                    <p className="text-[#5a5a5a]">{lang.read ? "Read" : "-"}</p>
                  </div>

                  <div className="flex-1 text-center">
                    <p className="text-[#5a5a5a]">{lang.write ? "Write" : "-"}</p>
                  </div>

                  <div className="flex-1 text-center">
                    <p className="text-[#5a5a5a]">{lang.speak ? "Speak" : "-"}</p>
                  </div>

                  <div className="w-6 flex justify-end">
                    <ExternalLink className="h-4 w-4 text-[#aeb4c1]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      
    
    </div>
  );
}

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidateId,backToDashboard }) => {
  const searchParams = useSearchParams();
  const id = candidateId || searchParams.get('id');

  return (
    <Suspense 
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#13B5CF]" />
        </div>
      }
    >
      {/* <EmployerDetailContent id={id} backToDashboard={backToDashboard} /> */}
      <CandidateDetailContent id={id} backToDashboard={backToDashboard} />
    </Suspense>
  );
};

export default CandidateDetail;