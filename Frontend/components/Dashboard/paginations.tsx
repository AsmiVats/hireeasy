
// @ts-nocheck
export default function Pagination({ 
  currentPage, 
  setCurrentPage, 
  totalPages,
  totalJobs, 
  isLoading
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalJobs: number;
  isLoading?: boolean;
}) {
  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      pages.push(i as number);
    }
    return pages;
  };

  return (
    <div className="mt-3 flex justify-items-center m-auto w-[300px]">
      <button
        className="flex items-center px-4 py-2 text-gray-600"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <svg
          className="mr-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page) => (
          <button
            key={`page-${page}`}
            type="button"
            className={`flex h-8 w-8 items-center justify-center rounded-full
              ${
                currentPage === page
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="flex items-center px-4 py-2 text-gray-600"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        type="button"
      >
        Next
        <svg
          className="ml-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
