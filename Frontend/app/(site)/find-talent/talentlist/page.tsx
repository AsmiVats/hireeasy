import React, { Suspense } from 'react'
import Searchpage from '@/components/Search/Searchpage'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading talent list...</div>}>
      <div className='m-auto'>
        <Searchpage/>
      </div>
    </Suspense>
  )
}
