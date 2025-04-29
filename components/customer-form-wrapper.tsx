'use client'

import { Suspense } from 'react'
import { CustomerForm } from '@/components/customer-form'

export default function CustomerFormWrapper() {
  // Wrap the component in Suspense
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <CustomerForm mode="create" />
    </Suspense>
  )
}
