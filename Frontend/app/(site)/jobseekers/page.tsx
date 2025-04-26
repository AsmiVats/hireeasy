'use client';

import CandidateHome from "@/components/Candidatehome/CandidateHome";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    sessionStorage.setItem('currentPage', 'candidatehome');
  }, []);

  return (
    <main className='m-auto'>
      <CandidateHome />
    </main>
  );
}
