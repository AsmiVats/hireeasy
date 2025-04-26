// @ts-nocheck
"use client";
import React, { useState } from "react";
import Pagination from "./paginations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CandidatesPopup } from "./CandidatePopup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Users, UserRoundPlus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import EmployerDetail from "../Employer/EmployerDetail";

export const DashboardSection = ({
  filterText,
  setFilterText,
  selectedStatuses,
  toggleStatus,
  filteredJobs,
  currentPage,
  setCurrentPage,
  totalPages,
  totalJobs,
  isLoading,
}) => {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [employerID, setEmployerID] = useState("");
  const [showEmployerDetail, setShowEmployerDetail] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const handleStatusChange = async (jobId: string, newStatus: string) => {
    setUpdatingStatus(jobId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/job/updateJobPosting/${jobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update job status");
      }
   
    } catch (error) {
      console.error("Error updating job status:", error);
      alert("Failed to update job status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };
  const route = useRouter();
  const addEmpID = ()=>{
    setEmployerID(localStorage.getItem("user") || '');
  }

  const handleCandidateRowClick = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    setShowEmployerDetail(true);
  };

  
  
  // Add function to go back to candidates list
  const handleBackToList = () => {
    setShowEmployerDetail(false);
    setSelectedCandidate(null);
  };
  const backToDashboard = () => {
    setShowEmployerDetail(false);
    setSelectedCandidate(null);
  }


  return (
    <div className="pt-4">
      {/* Header with search and filters */}
      {showEmployerDetail ? (
        <div>
          <EmployerDetail candidateId={selectedCandidate} backToDashboard={backToDashboard} />
        </div>
      ) : (<div>
         <div className="mb-4 ml-6 flex items-center justify-end">
        <div className="relative max-w-[500px] flex-1">
          <input
            type="text"
            placeholder="Filter and search jobs"
            className="w-full rounded-sm border py-2 pl-10 pr-4"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            id="filter"
            className="absolute left-3 top-2.5 h-5 w-5 text-white"
            stroke="currentColor"
          >
            <path d="M4 10h7.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2H22.91A6 6 0 0 0 11.09 8H4a1 1 0 0 0 0 2zM17 5a4 4 0 1 1-4 4A4 4 0 0 1 17 5zM44 23H36.91a6 6 0 0 0-11.82 0H4a1 1 0 0 0 0 2H25.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2zM31 28a4 4 0 1 1 4-4A4 4 0 0 1 31 28zM44 38H22.91a6 6 0 0 0-11.82 0H4a1 1 0 0 0 0 2h7.09a6 6 0 0 0 11.82 0H44a1 1 0 0 0 0-2zM17 43a4 4 0 1 1 4-4A4 4 0 0 1 17 43z"></path>
          </svg>
        </div>

        <div className="ml-4 flex items-center gap-3">
          <button
            className={`rounded-sm px-4 py-2 ${
              selectedStatuses.has("Open")
                ? "bg-green-100 text-[#13B5CF]"
                : "bg-gray-100"
            }`}
            onClick={() => toggleStatus("Open")}
          >
            Open
          </button>
          <button
            className={`rounded-sm px-4 py-2 ${
              selectedStatuses.has("Paused")
                ? "bg-green-100 text-[#13B5CF]"
                : "bg-gray-100"
            }`}
            onClick={() => toggleStatus("Paused")}
          >
            Paused
          </button>
          <button
            className={`rounded-sm px-4 py-2 ${
              selectedStatuses.has("Closed")
                ? "bg-green-100 text-[#13B5CF]"
                : "bg-gray-100"
            }`}
            onClick={() => toggleStatus("Closed")}
          >
            Closed
          </button>
        </div>

        <button
          onClick={() => route.push("/employerprofile")}
          className="ml-auto mr-2 rounded-sm bg-[#13B5CF] px-6 py-2 text-white hover:bg-[#009951]"
        >
          Post a job
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto  shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-[#E6E6E6]">
              <th className="px-4 py-3 text-left">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#293E40]">
                Job title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#293E40]">
                Candidates &nbsp;&nbsp;&nbsp;&nbsp;
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#293E40]">
                Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#293E40]">
                Date posted
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#293E40]">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#293E40]">
                Job status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job._id} className="border-b border-gray-200">
                <td className="px-4 py-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-4 py-3 text-sm text-[#293E40]" onClick={() => handleCandidateRowClick(job._id)}>
                  {job.title}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      className={`flex cursor-pointer gap-2 hover:text-blue-600`}
                      disabled={job.totalApplicants === 0}
                      onClick={() => {
                        setSelectedJobId(job._id);
                        setIsModalOpen(true);
                        addEmpID();
                      }}
                    >
                      <Users className="ml-2 h-4 w-4" />
                      {job.totalApplicants}
                    </button>
                    <div className="flex gap-2">

                    <button
                      className="flex cursor-pointer gap-2 hover:text-blue-600"
                      disabled={job.newApplicants === 0}
                      onClick={() => {
                        setSelectedJobId(job._id);
                        setIsModalOpen(true);
                      }}
                    >
                      <UserRoundPlus className="ml-2 h-4 w-4" />{" "}
                      {job.newApplicants}{" "}
                      </button>
                    </div>
                    <UserPlus className="ml-2 h-4 w-4" />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#293E40]">
                  {job.location.city}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <span className="ml-2 text-[#293E40]">
                      {new Date(job.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`mailto:${job.email}`}
                    className="inline-block hover:text-[#13B5CF] transition-colors"
                    title="Send email"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-[#13B5CF]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeWidth="2"
                      />
                    </svg>
                  </a>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <div
                        className={`inline-flex items-center rounded-sm px-3 py-1 text-sm
        ${job.status === "Open" ? "bg-green-50 text-green-600" : ""}
        ${job.status === "Paused" ? "bg-red-50 text-red-600" : ""}
        ${job.status === "Closed" ? "bg-gray-50 text-gray-600" : ""}`}
                      >
                        {updatingStatus === job._id ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <>
                            {job.status}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[120px]">
                      <DropdownMenuItem
                        className={`${
                          job.status === "Open" ? "text-green-600" : ""
                        }`}
                        onClick={() => handleStatusChange(job._id, "Open")}
                      >
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`${
                          job.status === "Paused" ? "text-red-600" : ""
                        }`}
                        onClick={() => handleStatusChange(job._id, "Paused")}
                      >
                        Paused
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`${
                          job.status === "Closed" ? "text-gray-600" : ""
                        }`}
                        onClick={() => handleStatusChange(job._id, "Closed")}
                      >
                        Closed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="h-[700px] max-h-[700px] w-[90vw] max-w-[90vw] overflow-auto">
          <DialogTitle className="sr-only">Candidates applied</DialogTitle>
          <CandidatesPopup selectedJobId={selectedJobId} employerID={employerID} />
        </DialogContent>
      </Dialog>
      <Pagination 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        isLoading={isLoading}
      />
      </div>)}
     
    </div>
  );
};
