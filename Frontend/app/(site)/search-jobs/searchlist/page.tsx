import React, { Suspense } from 'react'
import SearchJobPage from '@/components/Searchjob/Searchjobpage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading talent list...</div>}>
      <div className='m-auto'>
        <SearchJobPage/>
      </div>
    </Suspense>
  )
}
