"use client";
import React, { useState, useEffect, Suspense } from "react";
import Pagination from "./paginations";
import { useRouter } from "next/navigation";
import { DashboardSection } from "./DashboardSection";
import { SettingsSection } from "./SettingsSection";
import { CandidatesSection } from "./CandidatesSection";
import { MessagesSection } from "./MessagesSection";
import { useSearchParams } from 'next/navigation'

interface Job {
  id: number;
  title: string;
  candidates: number;
  address: string;
  datePosted: string;
  timeAgo: string;
  status: "Open" | "Paused" | "Closed";
}

function Dashboard() {
  const [filterText, setFilterText] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set([]),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs");
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
const [totalJobs, setTotalJobs] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const route = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  
   // Add filtered jobs logic
const filteredJobs = jobs.filter(
  (job) =>
    (selectedStatuses.size === 0 || selectedStatuses.has(job.status)) &&
    (filterText === "" ||
      job.title.toLowerCase().includes(filterText.toLowerCase())),
);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('tab');
  
  useEffect(() => {
    if (searchQuery) {
      setActiveTab(searchQuery);
    }
  }, [searchQuery]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      
      let currentStatus = Array.from(selectedStatuses)[0] || '';
      const response = await fetch(
        `${BASE_URL}/job/getJobPostings?page=${currentPage}&status=${currentStatus}&employerId=${localStorage.getItem('user')}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
  
      const data = await response.json();
      setJobs(data.job);
      
      setTotalPages(data.totalPages || 0);
      setTotalJobs(data.totalJobs || 0);
      setCurrentPage(data.currentPage || 0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };


useEffect(() => {
  fetchJobs();
}, [selectedStatuses, currentPage]);

 

  const toggleStatus = (status: string) => {
    const newStatuses = new Set(selectedStatuses);
    if (newStatuses.has(status)) {
      newStatuses.delete(status);
    } else {
      newStatuses.add(status);
    }
    setSelectedStatuses(newStatuses);
  };

  const switchTabs = (id) => {
    switch (id) {
      case "dashboard":
        setActiveTab("jobs");
        route.push("/");
        break;
      case "jobs":
        setActiveTab("jobs");
        break;
      case "candidates":
        setActiveTab("candidates");
        break;
      case "messages":
        setActiveTab("messages");
        break;
      case "settings":
        setActiveTab("settings");
        break;
      default:
        break;
    }
  };

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13B5CF]"></div>
      </div>
    }>
    <div className="flex h-screen">
      {/* Side Navigation */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } flex flex-col bg-white shadow-lg transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          className="p-4 hover:bg-gray-100"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 pt-4">
          {/* <button
            id="dashboard"
            onClick={() => switchTabs("dashboard")}
            className={`flex w-full items-center px-4 py-3 cursor-pointer ${
              activeTab === "dashboard"
                ? "border-r-4 border-[#009951] bg-green-50 text-[#13B5CF]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {isSidebarOpen && <span className="ml-3">Dashboard</span>}
          </button> */}

          <button
            id="jobs"
            className={`flex w-full items-center px-4 py-3 cursor-pointer ${
              activeTab === "jobs"
                ? "border-r-4 border-[#009951] bg-green-50 text-[#13B5CF]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => switchTabs("jobs")}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {isSidebarOpen && <span className="ml-3">Jobs</span>}
          </button>

          <button
            id="candidates"
            onClick={() => switchTabs("candidates")}
            className={`flex w-full items-center px-4 py-3 cursor-pointer ${
              activeTab === "candidates"
                ? "border-r-4 border-[#009951] bg-green-50 text-[#13B5CF]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {isSidebarOpen && <span className="ml-3">Candidates</span>}
          </button>

          <button
            id="messages"
            onClick={() => switchTabs("messages")}
            className={`flex w-full items-center px-4 py-3 cursor-pointer ${
              activeTab === "messages"
                ? "border-r-4 border-[#009951] bg-green-50 text-[#13B5CF]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {isSidebarOpen && <span className="ml-3">Messages</span>}
          </button>

          <button
            onClick={() => switchTabs("settings")}
            id="settings"
            className={`flex w-full items-center px-4 py-3 cursor-pointer ${
              activeTab === "settings"
                ? "border-r-4 border-[#009951] bg-green-50 text-[#13B5CF]"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {isSidebarOpen && <span className="ml-3">Settings</span>}
          </button>
        </nav>

        {/* User Profile */}
        {/* <div className="border-t p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300"></div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium label_color">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            )}
          </div>
        </div> */}
      </div>

      {/* Main Content */}

      <div className="flex-1 overflow-auto" id="jobs">
        {activeTab === "jobs" && (
        isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13B5CF]"></div>
          </div>
        ) : (
          <DashboardSection
            filterText={filterText}
            setFilterText={setFilterText}
            selectedStatuses={selectedStatuses}
            toggleStatus={toggleStatus}
            filteredJobs={filteredJobs}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalJobs={totalJobs}
            isLoading={isLoading}
          />
        )
      )}
        {activeTab === "candidates" && <CandidatesSection />}
        {activeTab === "messages" && <MessagesSection />}
        {activeTab === "settings" && <SettingsSection />}
      </div>
    </div>
    </Suspense>
  );
}

export { Dashboard };
