'use client';
import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FindJobs = () => {
  const router = useRouter();
  const [searchSkill, setSearchSkill] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    
    if (searchSkill) queryParams.append('skill', searchSkill);
    if (searchLocation) queryParams.append('location', searchLocation);
    
    router.push(`/search-jobs/searchlist?${queryParams.toString()}`);
  };

  const isSearchEnabled = searchSkill.trim() !== '' || searchLocation.trim() !== '';

  return (
    <div className="min-h-[83vh] pt-24 sm:pt-[180px] pb-8 sm:pb-16">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl md:text-[45px] font-bold mb-2 sm:mb-4">
            <span className="text-navy-900">Find </span>
            <span className="text-[#13B5CF]">Best Suitable Jobs</span>,
            <span className="text-navy-900"> "Faster Than Ever!"</span>
          </h1>
          <p className="text-[#AEB4C1] text-base sm:text-lg md:text-[20px] pb-6 sm:pb-[45px] pt-4 sm:pt-[18px]">
            Join thousands of people securing jobs smarter with Hireeasy
          </p>
        </div>

        <div className="max-w-full sm:max-w-4xl mx-auto border border-[#D9D9D9] p-2 sm:p-4 rounded-sm bg-white">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Skill, Designation, years of experience"
                className="w-full pl-10 sm:pl-12 pr-2 sm:pr-4 py-2 sm:py-3 rounded-sm focus:outline-none text-sm sm:text-base"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
              />
            </div>
            
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="City, state, Zip code or Remote"
                className="w-full pl-10 sm:pl-12 pr-2 sm:pr-4 py-2 sm:py-3 rounded-sm focus:outline-none text-sm sm:text-base"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={!isSearchEnabled}
              className={`w-full md:w-auto px-4 sm:px-8 py-2 sm:py-3 rounded-sm transition-colors text-sm sm:text-base ${
                isSearchEnabled 
                  ? 'bg-[#13B5CF] text-white hover:bg-[#009951]' 
                  : 'bg-[#009951] text-white cursor-not-allowed'
              }`}
            >
              Search Jobs
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FindJobs;