"use client";
import { useState, useEffect } from "react";
import Pagination from "./paginations";

interface Candidate {
  phone: string;
  createdAt: string;
  location: any;
  id: number;
  name: string;
  jobApplied: string;
  designation: string;
  address: string;
  dateApplied: string;
  contactNo: string;
  title: string;
  profileHeadline: string;
  appliedAt:string;
}


const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
export const CandidatesPopup = ({selectedJobId, employerID}) => {
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

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    let url = ''
    if(selectedJobId && employerID){
      url = `${BASE_URL}/job/getAllAppliedCandidates?jobId=${selectedJobId}&employerId=${employerID}`
    }else{
      url = `${BASE_URL}/job/getAllAppliedCandidates?jobId=${selectedJobId}`
    }
    
    const fetchCandidates = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch candidates');
        }
        const data = await response.json();
        
        setCandidates(data.candidates);
        console.log(data.candidates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token && selectedJobId) {
      fetchCandidates();
    } else {
      setIsLoading(false);
      console.error("Authentication token or job ID not found");
    }
  }, [selectedJobId, employerID, BASE_URL]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13B5CF]"></div>
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div className="mb-4 ml-6 flex items-center justify-left">
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
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            stroke="currentColor"
          >
            <path d="M4 10h7.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2H22.91A6 6 0 0 0 11.09 8H4a1 1 0 0 0 0 2zM17 5a4 4 0 1 1-4 4A4 4 0 0 1 17 5zM44 23H36.91a6 6 0 0 0-11.82 0H4a1 1 0 0 0 0 2H25.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2zM31 28a4 4 0 1 1 4-4A4 4 0 0 1 31 28zM44 38H22.91a6 6 0 0 0-11.82 0H4a1 1 0 0 0 0 2h7.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2zM17 43a4 4 0 1 1 4-4A4 4 0 0 1 17 43z"></path>
          </svg>
        </div>
       
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Candidate name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Job Applied
              </th>
              
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Candidate Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Date applied
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Contact no
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-b border-gray-200">
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300" 
                    aria-label={`Select candidate ${candidate.name}`}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {candidate?.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {candidate?.profileHeadline}
                </td>
                
                <td className="px-4 py-3 text-sm text-gray-600">
                  {candidate?.address}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  
                  {formatDate(candidate.appliedAt)} 
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {candidate?.phone}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <button 
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button 
                      className="text-red-400 hover:text-red-600"
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
      {/* <Pagination currentPage={1} setCurrentPage={undefined}/> */}
    </div>
  );
};
