'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Search, Briefcase, Users, Filter } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  location?: string;
  skills: { id: string; name: string }[];
  experience: {
    id: string;
    company: string;
    title: string;
    current: boolean;
  }[];
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isSubscriptionActive, hasReachedCandidateViewLimit } = useUser();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch candidates');
        }

        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setError(error instanceof Error ? error.message : 'Failed to load candidates');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(candidate => {
    const fullName = `${candidate.firstName} ${candidate.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return (
      fullName.includes(searchLower) ||
      (candidate.title && candidate.title.toLowerCase().includes(searchLower)) ||
      (candidate.location && candidate.location.toLowerCase().includes(searchLower)) ||
      candidate.skills.some(skill => skill.name.toLowerCase().includes(searchLower)) ||
      candidate.experience.some(exp => 
        exp.company.toLowerCase().includes(searchLower) || 
        exp.title.toLowerCase().includes(searchLower)
      )
    );
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center p-8 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Candidates</h1>
          <p className="text-muted-foreground mt-1">
            Browse through our database of qualified candidates
          </p>
        </div>
        
        {!isSubscriptionActive() && (
          <Button 
            className="bg-primary hover:bg-primary-dark"
            onClick={() => window.location.href = '/subscription'}
          >
            Upgrade to Premium
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search candidates by name, skills, or location"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No candidates found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => {
            // For non-subscribers or those who reached limit, mask some candidate info
            const shouldMaskInfo = !isSubscriptionActive() || hasReachedCandidateViewLimit();
            
            const displayName = shouldMaskInfo
              ? `${candidate.firstName.charAt(0)}. ${candidate.lastName.charAt(0)}.`
              : `${candidate.firstName} ${candidate.lastName}`;
            
            const currentJob = candidate.experience.find(exp => exp.current);
            
            return (
              <Link href={`/candidates/${candidate.id}`} key={candidate.id}>
                <Card className="h-full transition-transform hover:shadow-md hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{displayName}</h3>
                        {candidate.title && (
                          <p className="text-muted-foreground">{candidate.title}</p>
                        )}
                        
                        {currentJob && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Briefcase className="h-3 w-3" />
                            <span>{currentJob.company}</span>
                          </div>
                        )}
                        
                        {candidate.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{candidate.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 3).map(skill => (
                        <Badge key={skill.id} variant="secondary" className="font-normal">
                          {skill.name}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="outline">+{candidate.skills.length - 3} more</Badge>
                      )}
                    </div>
                    
                    {shouldMaskInfo && (
                      <div className="mt-4 text-xs text-amber-600 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                        >
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Upgrade to see full profile
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
      
      {filteredCandidates.length > 0 && !isSubscriptionActive() && (
        <div className="mt-10 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
          <h3 className="text-xl font-bold">Unlock Full Access</h3>
          <p className="mt-2">
            With a premium subscription, you'll get full access to candidate profiles, 
            unlimited resume downloads, and advanced search filters.
          </p>
          <Button 
            className="mt-4 bg-primary hover:bg-primary-dark"
            onClick={() => window.location.href = '/subscription'}
          >
            Upgrade Now
          </Button>
        </div>
      )}
    </div>
  );
} 