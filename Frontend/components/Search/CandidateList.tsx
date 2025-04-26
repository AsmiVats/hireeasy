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
    payScale: {
      min: number;
      max: number;
    };
  }[];
}

const CandidateList = ({ candidates = [] }: CandidateListProps) => {
  return (
    <div className="space-y-4">
      {candidates.map((candidate, index) => (
        <CandidateItem
          key={candidate._id || index}
          title={candidate.profileHeadline || "Senior Developer"}
          name={candidate.name || "Candidate name"}
          experience={candidate.experience || "N/A"}
          location={candidate.city || "Remote"}
          payScale={candidate.payScale || {}}
          skills={candidate.skills || []}
          lastActive={candidate.createdAt || "N/A"}
          phone={candidate.phone || "N/A"}
          email={candidate.email || "N/A"}
          candidateId={candidate._id}
        />
      ))}
    </div>
  );
};

export default CandidateList;