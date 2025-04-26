// @ts-nocheck
'use client'
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SlidersHorizontal } from 'lucide-react';
import CandidateList from './CandidateList';
import filterImage from '../../asset/filter.png'
import EmployerDetail from '../Employer/EmployerDetail';
// Remove TypeScript interface


const SearchResult = ({ results = [], isLoading, error, onPageChange }) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };
  const [showDetails, setShowDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const renderPaginationButtons = () => {
    const totalPages = results.totalPages;
    const currentPage = results.currentPage;
    const pages = [];
    
    // Show up to 10 pages at a time
    let startPage = Math.max(1, currentPage - 4);
    let endPage = Math.min(totalPages, startPage + 9);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage < 9 && startPage > 1) {
      startPage = Math.max(1, endPage - 9);
    }
    
    // Add pages to the array
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const backToDashboard = () => {
    setShowDetails(false);
    setSelectedJob(null);
  }
  const handleSeeDetails = (jobId: string) => {
    setSelectedJob(jobId);
    setShowDetails(true);
  };
  return (
    <div className="bg-gray-50">
      {showDetails ? (
        <div>
          <EmployerDetail candidateId={selectedJob} backToDashboard={backToDashboard} isEditable={false}/>
        </div>
      ) : (

     <div>
      <div className="flex items-center gap-2 mb-6">
        <img src={filterImage.src} alt="Filter" className="w-6 h-6" />
        <h2 className="text-[16px] font-medium text-gray-900">
          {isLoading ? 'Searching...' : `${results?.totalJobs || 0} Jobs found`}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-sm mb-4">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13B5CF]"></div>
        </div>
      ) : results?.data?.length > 0 ? (
        <CandidateList candidates={results?.data} handleSeeDetails={handleSeeDetails}/>
      ) : (
        <div className="bg-white rounded-sm p-8 text-center text-gray-500 border border-gray-200">
          No jobs found. Try adjusting your search criteria.
        </div>
      )}

{results?.totalPages > 0 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(results.currentPage - 1)}
            disabled={results.currentPage === 1}
            className={`flex items-center gap-1 px-2 py-1 ${
              results.currentPage === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 hover:text-[#13B5CF]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {renderPaginationButtons().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-1">...</span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-2 py-1 h-[32px] w-[32px] text-center rounded-full ${
                  results.currentPage === page
                    ? 'bg-[#293E40] text-white'
                    : 'text-gray-500 hover:text-[#293E40]'
                }`}
              >
                {page}
              </button>
            )
          ))}

          <button
            onClick={() => handlePageChange(results.currentPage + 1)}
            disabled={results.currentPage === results.totalPages}
            className={`flex items-center gap-1 px-2 py-1 ${
              results.currentPage === results.totalPages 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 hover:text-[#13B5CF]'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
       </div>)}
    </div>
  );
};

export default SearchResult;