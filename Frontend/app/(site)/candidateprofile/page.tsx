'use client';
import { Suspense } from "react";
import ProfileData from "@/components/Profile/ProfileDetail";

export default function Candidateprofilepage() {


  return (
    <main className=' m-auto'>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileData />
      </Suspense>
    </main>
  );
}
