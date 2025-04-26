// @ts-nocheck
'use client'
import CandidateItem from './CandidateItem';

interface CandidateListProps {
  candidates: {
    id: string;
    title: string;
    name: string;
    experience: string;
    location: string;
    salary: string;
    skills: string[];
    lastActive: string;
    phone: string;
    email: string;
    payRange: {
      min: number;
      max: number;
    };
    employerId: string;
    jobId: string;
    jobTitle: string;
  }[];
  handleSeeDetails: (jobId: string) => void;
}

const CandidateList = ({ candidates = [], handleSeeDetails }: CandidateListProps) => {
  return (
    <div className="space-y-4">
      {candidates.map((candidate, index) => (
        <CandidateItem
          key={candidate._id || index}
          title={candidate.profileHeadline || "Senior Developer"}
          name={candidate.name || "Candidate name"}
          experience={candidate.experience || "N/A"}
          location={candidate.location || "Remote"}
          payRange={candidate.payRange || {}}
          skills={candidate.skills || []}
          lastActive={candidate.createdAt || "N/A"}
          phone={candidate.phone || "N/A"}
          email={candidate.email || "N/A"}
          employerId={candidate.employerId}
          jobId={candidate._id}
          jobTitle={candidate.jobTitle}
          hasApplied={candidate.hasApplied}
          handleSeeDetails={handleSeeDetails}
        />
      ))}
    </div>
  );
};

export default CandidateList;