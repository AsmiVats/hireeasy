"use client";
import { useState, useEffect } from "react";
import Pagination from "./paginations";
import EmployerDetail from "../Employer/EmployerDetail";
import CandidateDetail from "./CandidateDetail";

interface Candidate {
  city: string;
  createdAt: string;
  location: any;
  id: string;
  candidateName: string;
  jobApplied: string;
  designation: string;
  address: string;
  dateApplied: string;
  candidatePhone: string;
  jobTitle: string;
  jobApplicationId: string;
  appliedAt: string;
  candidateId: string;
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};



export const CandidatesSection = () => {
  // const candidates: Candidate[] = [
  //   {
  //     id: 1,
  //     name: "John Dow",
  //     jobApplied: "Engineering lead",
  //     designation: "Senior Engineer",
  //     address: "Washington, NY 08067",
  //     dateApplied: "Dec 05, 2024",
  //     contactNo: "+1 9876543210",
  //   },

  //   {
  //     id: 2,
  //     name: "John Dow",
  //     jobApplied: "Engineering lead",
  //     designation: "Senior Engineer",
  //     address: "Washington, NY 08067",
  //     dateApplied: "Dec 05, 2024",
  //     contactNo: "+1 9876543210",
  //   },
  //   // Add more candidate data as needed
  // ];
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // Add state to track selected candidate and view mode
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showEmployerDetail, setShowEmployerDetail] = useState(false);
  const [employerID, setEmployerID] = useState('');
  

   // Add function to handle row click
 const handleCandidateRowClick = (candidateId: string) => {
  setSelectedCandidate(candidateId);
  setShowEmployerDetail(true);
};

// Add function to go back to candidates list
const handleBackToList = () => {
  setShowEmployerDetail(false);
  setSelectedCandidate(null);
};

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/job/getAllCandidatesData?page=${currentPage}&employerId=${user}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }
        const data = await response.json();
        
        setCandidates(data.data);
        setTotalPages(data.totalPages || 0);
        setTotalJobs(data.totalCount || 0);
        setCurrentPage(data.currentPage || 0);
        console.log(data.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token && user) {
      fetchCandidates();
    } else {
      setIsLoading(false);
      console.error("Authentication token or user ID not found");
    }
  }, [currentPage, BASE_URL]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#13B5CF]"></div>
      </div>
    );
  }

  const handleDeleteCandidate = async (candidateId: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/job/updateJobAppliedStatus/${candidateId}?status=INACTIVE`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete candidate");
      }

      // Refresh the candidates list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      alert("Failed to delete candidate. Please try again.");
    }
  };

  // Add this function near the top of your component
  const handleDownloadResume = async (candidateId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(
        `${BASE_URL}/subscription/candidate-resume/${candidateId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch resume link');
      }
      
      const data = await response.json();
      // Open the resume link in a new tab
      window.open(data.resumeLink, '_blank');
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  const backToDashboard = () => {
    setShowEmployerDetail(false);
    setSelectedCandidate(null);
  }

  return (
    <div className="pt-4 font-medium">
      {showEmployerDetail ? (
        <div>
          <CandidateDetail candidateId={selectedCandidate} backToDashboard={backToDashboard} />
        </div>
      ) : (
        <>
      <div className="mb-4 ml-6 flex items-center justify-end">
        <div className="relative max-w-[500px] flex-1">
          <input
            type="text"
            placeholder="Filter and search jobs"
            className="w-full rounded-sm border py-2 pl-10 pr-4"
            value={""}
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            id="filter"
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-800"
            stroke="currentColor"
          >
            <path d="M4 10h7.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2H22.91A6 6 0 0 0 11.09 8H4a1 1 0 0 0 0 2zM17 5a4 4 0 1 1-4 4A4 4 0 0 1 17 5zM44 23H36.91a6 6 0 0 0-11.82 0H4a1 1 0 0 0 0 2H25.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2zM31 28a4 4 0 1 1 4-4A4 4 0 0 1 31 28zM44 38H22.91a6 6 0 0 0-11.82 0H4a1 1 0 0 0 0 2h7.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2zM17 43a4 4 0 1 1 4-4A4 4 0 0 1 17 43z"></path>
          </svg>
        </div>
        <button className="ml-auto globalbutton mr-2">
          Post a job
        </button>
      </div>
      <div className="overflow-x-auto shadow">
        <table className="w-full">
          <thead className="bg-[#E6E6E6]">
            <tr>
              <th className="px-4 py-3 text-left">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300" 
                  aria-label="Select all candidates"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Candidate name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Job Applied
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Candidate Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Date applied
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Contact no
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.candidateId} className="border-b border-gray-200"
              >
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300" 
                    aria-label={`Select candidate ${candidate.candidateName}`}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 cursor-pointer" onClick={() => handleCandidateRowClick("67ead7a1ef383fe68e463143")}>
                  {candidate?.candidateName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 cursor-pointer"  onClick={() => handleCandidateRowClick(candidate.candidateId)}>
                  {candidate?.jobTitle}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600">
                  {candidate?.city as string}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(candidate.appliedAt)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {candidate?.candidatePhone}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleDownloadResume(candidate.candidateId)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Download resume"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                    <button 
                      className="text-green-400 hover:text-green-600"
                      aria-label="Edit candidate"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-red-400 hover:text-red-600"
                      onClick={() => handleDeleteCandidate(candidate.jobApplicationId)}
                      aria-label="Delete candidate"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        isLoading={isLoading} 
        totalJobs={totalJobs}  
            />
      </>
      )}
    </div>
  );
};

// Replace the download button with this:

