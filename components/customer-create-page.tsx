'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomerForm } from '@/components/customer-form'
import CustomerPageHeader from '@/components/customer-page-header'

export default function CreateCustomerPageClient() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Loading header...</div>}>
        <CustomerPageHeader />
      </Suspense>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading form...</div>}>
            <CustomerForm mode="create" />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
