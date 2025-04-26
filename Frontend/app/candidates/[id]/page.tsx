'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Briefcase, GraduationCap, Calendar, Mail, Phone, FileText, Download } from 'lucide-react';
import { useUser } from '@/app/context/UserContext';
import ResumeDownloadButton from '@/components/Employer/ResumeDownloadButton';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface Skill {
  id: string;
  name: string;
}

interface Experience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  location?: string;
  summary?: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  resumeUrl?: string;
}

export default function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isSubscriptionActive, canViewCandidateDetails } = useUser();

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch candidate data');
        }

        const data = await response.json();
        setCandidate(data);
      } catch (error) {
        console.error('Error fetching candidate:', error);
        setError(error instanceof Error ? error.message : 'Failed to load candidate profile');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="large" /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  if (!candidate) {
    return <div className="text-center p-8">Candidate not found</div>;
  }

  // Check subscription access
  const hasFullAccess = user && isSubscriptionActive() && canViewCandidateDetails();
  const limitedView = !hasFullAccess;

  const renderName = () => {
    if (limitedView) {
      return `${candidate.firstName.charAt(0)}. ${candidate.lastName.charAt(0)}.`;
    }
    return `${candidate.firstName} ${candidate.lastName}`;
  };

  const renderEmail = () => {
    if (limitedView) {
      const [username, domain] = candidate.email.split('@');
      return `${username.charAt(0)}****@${domain}`;
    }
    return candidate.email;
  };

  const renderPhone = () => {
    if (!candidate.phone) return null;
    if (limitedView) {
      return `***-***-${candidate.phone.slice(-4)}`;
    }
    return candidate.phone;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold">{renderName()}</h1>
                  {candidate.title && <p className="text-lg text-muted-foreground">{candidate.title}</p>}
                </div>
                
                {!hasFullAccess && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/subscription'}
                    className="self-start"
                  >
                    Upgrade to View Full Profile
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {candidate.location && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {candidate.location}
                  </Badge>
                )}
                
                {candidate.skills.slice(0, 5).map(skill => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
                {candidate.skills.length > 5 && (
                  <Badge variant="outline">+{candidate.skills.length - 5} more</Badge>
                )}
              </div>
            </div>
            
            {candidate.resumeUrl && (
              <ResumeDownloadButton 
                candidateId={candidate.id}
                resumeUrl={candidate.resumeUrl}
                className="ml-auto"
              />
            )}
          </div>
          
          {candidate.summary && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Summary</h3>
              <p className="text-muted-foreground">
                {limitedView ? `${candidate.summary.substring(0, 150)}...` : candidate.summary}
              </p>
            </div>
          )}
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{renderEmail()}</span>
            </div>
            
            {candidate.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{renderPhone()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="experience">
          {candidate.experience.length > 0 ? (
            <div className="space-y-6">
              {candidate.experience.map((exp, index) => (
                <Card key={exp.id || index} className={limitedView && index > 1 ? 'filter blur-sm pointer-events-none' : ''}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{exp.title}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          <span>{exp.company}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                            {exp.current 
                              ? ' Present' 
                              : exp.endDate ? ` ${new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` : ' N/A'}
                          </span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-1 text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="mt-3 text-muted-foreground">{exp.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {limitedView && candidate.experience.length > 2 && (
                <div className="text-center mt-4">
                  <Button onClick={() => window.location.href = '/subscription'}>
                    Upgrade to View More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No experience information available.</p>
          )}
        </TabsContent>
        
        <TabsContent value="education">
          {candidate.education.length > 0 ? (
            <div className="space-y-6">
              {candidate.education.map((edu, index) => (
                <Card key={edu.id || index} className={limitedView && index > 1 ? 'filter blur-sm pointer-events-none' : ''}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{edu.degree}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <GraduationCap className="h-4 w-4" />
                          <span>{edu.institution}</span>
                        </div>
                        {edu.fieldOfStudy && (
                          <p className="text-muted-foreground mt-1">{edu.fieldOfStudy}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                            {edu.current 
                              ? ' Present' 
                              : edu.endDate ? ` ${new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` : ' N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {edu.description && (
                      <p className="mt-3 text-muted-foreground">{edu.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {limitedView && candidate.education.length > 2 && (
                <div className="text-center mt-4">
                  <Button onClick={() => window.location.href = '/subscription'}>
                    Upgrade to View More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No education information available.</p>
          )}
        </TabsContent>
        
        <TabsContent value="skills">
          <Card>
            <CardContent className="p-6">
              {candidate.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge 
                      key={skill.id || index} 
                      variant="secondary"
                      className={limitedView && index > 9 ? 'filter blur-sm' : ''}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                  
                  {limitedView && candidate.skills.length > 10 && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = '/subscription'}
                    >
                      Upgrade to View All Skills
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No skills information available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {limitedView && (
        <div className="mt-8 p-6 border border-yellow-300 bg-yellow-50 rounded-lg">
          <h3 className="font-bold text-yellow-800">Limited View</h3>
          <p className="text-yellow-700">You are viewing a limited version of this profile. Upgrade your subscription to access full candidate details.</p>
          <Button 
            className="mt-4 bg-yellow-500 hover:bg-yellow-600"
            onClick={() => window.location.href = '/subscription'}
          >
            Upgrade Subscription
          </Button>
        </div>
      )}
    </div>
  );
} 