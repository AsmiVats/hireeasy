'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Search from "./Search";
import SearchFilter from "./SearchFilter";
import SearchResult from "./SearchResult";
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';

interface SearchCriteria {
  skills: string[];
  postedWithin: string;
  maxPay: string;
  minPay: string;
  title: string;
  postalCode: string;
  jobType: string;
  jobLocationType: string;
  experience: string;
  city: string;
  state: string;
  country: string;
  maxExperience: string;
  minExperience: string;
  name: string;
  address: string;
  searchQuery: string;
}

export default function Searchpage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    skills: [],
    postedWithin: '',
    maxPay: '',
    minPay: '',
    title: '',
    postalCode: '',
    jobType: '',
    jobLocationType: '',
    experience: '',
    city: '',
    state: '',
    country: '',
    maxExperience: '',
    minExperience: '',
    name: '',
    address: '',
    searchQuery: ''
  });
  
  // Track if the initial query params have been processed
  const [initialQueryProcessed, setInitialQueryProcessed] = useState(false);
  // Flag to prevent triggering URL updates from URL-initiated changes
  const [isUpdatingFromUrl, setIsUpdatingFromUrl] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const locationQuery = searchParams.get('location') || '';
  const skillQuery = searchParams.get('skill') || '';

  // Function to update URL query parameters
  const updateUrlQueryParams = useCallback((keyword?: string, loc?: string) => {
    // Skip URL updates if we're currently processing URL params
    if (isUpdatingFromUrl) return;
    
    // Create URL with appropriate query parameters
    const params = new URLSearchParams();
    
    // Only add parameters if they have values
    if (keyword) {
      params.set('skill', keyword);
    } else {
      params.delete('skill');
    }
    
    if (loc) {
      params.set('location', loc);
    } else {
      params.delete('location');
    }
    
    // Get current path without query parameters
    const path = window.location.pathname;
    
    // Update the URL without reloading the page
    router.push(`${path}?${params.toString()}`, { scroll: false });
  }, [router, isUpdatingFromUrl]);

  // Memoized search function to prevent unnecessary re-renders
  const performSearch = useCallback(async (criteria, page = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }
      
      const searchBody = {
        ...criteria,
        page
      };
      
      console.log('Performing search with criteria:', searchBody);
      
      const response = await fetch(`${BASE_URL}/job/getRecommendedCandidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(searchBody)
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize search criteria from URL params once
  useEffect(() => {
    if (!initialQueryProcessed && (skillQuery || locationQuery)) {
      setIsUpdatingFromUrl(true);
      const newCriteria = { ...searchCriteria };
      
      if (skillQuery) {
        newCriteria.searchQuery = skillQuery;
        setSearch(skillQuery); // Update the search input field
      }
      
      if (locationQuery) {
        newCriteria.address = locationQuery;
        setLocation(locationQuery); // Update the location input field
      }
      
      setSearchCriteria(newCriteria);
      setInitialQueryProcessed(true);
      
      // After a small delay, allow URL updates again
      setTimeout(() => {
        setIsUpdatingFromUrl(false);
      }, 100);
    } else if (!initialQueryProcessed) {
      // No query params, just mark as processed and allow URL updates
      setInitialQueryProcessed(true);
      setIsUpdatingFromUrl(false);
    }
  }, [skillQuery, locationQuery, searchCriteria, initialQueryProcessed]);

  // Trigger search when criteria changes (but only after initial load)
  useEffect(() => {
    if (initialQueryProcessed) {
      performSearch(searchCriteria, currentPage);
    }
  }, [searchCriteria, currentPage, initialQueryProcessed, performSearch]);

  const handleSearch = async (keyword?: string, loc?: string) => {
    // Create a new criteria object to avoid direct mutation
    const newCriteria = { ...searchCriteria };
    
    if (keyword) {
      newCriteria.searchQuery = keyword;
      setSearch(keyword);
    }
    
    if (loc) {
      newCriteria.address = loc;
      setLocation(loc);
    }
    
    // Update URL with new search parameters
    updateUrlQueryParams(keyword, loc);
    
    // Reset to first page
    setCurrentPage(1);
    setSearchCriteria(newCriteria);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newCriteria: Partial<SearchCriteria>) => {
    const updatedCriteria = { ...searchCriteria, ...newCriteria };
    
    // Reset to first page
    setCurrentPage(1);
    setSearchCriteria(updatedCriteria);
    
    // Update URL based on search query if present
    if (updatedCriteria.searchQuery) {
      updateUrlQueryParams(updatedCriteria.searchQuery, updatedCriteria.address);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mb-10 relative mx-auto items-center justify-between pr-4">
      <Search onSearch={handleSearch} />
      
      <div className="w-full mx-auto pr-4">
        <div className="flex gap-6">
          <div className="w-[280px] flex-shrink-0">
            <SearchFilter
              skillsResult={searchResults["uniqueSkills"] || []}
              criteria={{
                ...searchCriteria,
                maxPay: searchCriteria.maxPay ? Number(searchCriteria.maxPay) : 0,
                minPay: searchCriteria.minPay ? Number(searchCriteria.minPay) : 0,
                experience: searchCriteria.experience ? Number(searchCriteria.experience) : 0,
                maxExperience: searchCriteria.maxExperience ? Number(searchCriteria.maxExperience) : 0,
                minExperience: searchCriteria.minExperience ? Number(searchCriteria.minExperience) : 0
              }}
              onFilterChange={(newCriteria) => {
                const stringifiedCriteria = {
                  ...newCriteria,
                  maxPay: newCriteria.maxPay?.toString(),
                  minPay: newCriteria.minPay?.toString(),
                  experience: newCriteria.experience?.toString(),
                  maxExperience: newCriteria.maxExperience?.toString(),
                  minExperience: newCriteria.minExperience?.toString()
                };
                handleFilterChange(stringifiedCriteria);
              }}
            />
          </div>
          
          <div className="flex-1">
            <SearchResult 
              results={searchResults} 
              isLoading={isLoading} 
              error={error} 
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
