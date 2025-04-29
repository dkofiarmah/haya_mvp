'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CustomerForm } from '@/components/customer-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// This tells Next.js not to attempt prerendering this page
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default function CreateCustomerPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Customer</h1>
          <p className="text-muted-foreground">
            Add a new customer to your organization
          </p>
        </div>
        <Suspense fallback={<Button variant="outline">Loading...</Button>}>
          <Button variant="outline" asChild>
            <Link href="/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Link>
          </Button>
        </Suspense>
      </div>
      
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
