'use client'
import React, { Suspense } from 'react'
import { CandidateProfilecomp } from '@/components/Profile/candidateprofilecomp'

export default function BuildProfilePage() {
  return (
    <div className='max-w-c-1280 m-auto'>
      <Suspense fallback={<div>Loading...</div>}>
        <CandidateProfilecomp />
      </Suspense>
    </div>
  )
}
