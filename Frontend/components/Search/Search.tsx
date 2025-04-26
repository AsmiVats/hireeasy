"use client";
import { useState } from "react";
import { Search as SearchIcon, MapPin } from "lucide-react";

interface SearchProps {
  onSearch: (keyword: string, location: string) => void;
}

const Search = ({ onSearch }: SearchProps) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [sortBy, setSortBy] = useState('Recommended');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword, location);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  return (
    <div className="mx-auto w-full px-4 py-6">
      <div className="flex gap-6">
        <div className="w-[260px] flex-shrink-0">
        </div>
        <div className="flex flex-row w-full gap-10">
          {/* Left Column */}
          <div className="basis-full">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 rounded-sm border border-gray-200 bg-white p-2 shadow-sm"
            >
              <div className="flex w-1/2 min-w-0 items-center border-r border-gray-200 pr-2">
                <SearchIcon className="ml-2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Skill, Designation, years of experience"
                  className="w-full border-0 px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none"
                  value={keyword}
                  onChange={handleKeywordChange}
                />
              </div>

              <div className="flex w-1/2 min-w-0 items-center">
                <MapPin className="ml-2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, state, Zip code or Remote"
                  className="w-full border-0 px-3 py-2 text-gray-600 placeholder-gray-400 focus:outline-none"
                  value={location}
                  onChange={handleLocationChange}
                />
              </div>

              <button
                type="submit"
                className="whitespace-nowrap rounded-sm bg-[#13B5CF] px-6 py-2 text-white transition-colors hover:bg-[#009951]"
              >
                Search Talent
              </button>
            </form>
          </div>
          
          {/* Right Column */}
          <div className="flex justify-end items-start basis-10">
          <div className="relative w-[200px]">
  <div className="absolute">
    <span className="text-[13px] text-[#5A5A5A] top-[-15px] absolute">Sort</span>
  </div>
  <button
    type="button"
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    className="flex items-center gap-2 rounded-sm border border-[#13B5CF] px-4 py-[5px] mt-[20px] text-[#13B5CF] transition-colors hover:bg-blue-50"
  >
    {sortBy}
    <svg
      className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
  
  {isDropdownOpen && (
    <div className="absolute right-0 mt-1 w-40 rounded-sm border border-gray-200 bg-white shadow-lg">
      <button
        onClick={() => {
          setSortBy('By Date');
          setIsDropdownOpen(false);
        }}
        className="w-full px-4 py-2 text-left text-[#5A5A5A] hover:bg-gray-50"
      >
        By Date
      </button>
      <button
        onClick={() => {
          setSortBy('By Relevance');
          setIsDropdownOpen(false);
        }}
        className="w-full px-4 py-2 text-left text-[#5A5A5A] hover:bg-gray-50"
      >
        By Relevance
      </button>
    </div>
  )}
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
