'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import CustomersList from '@/components/customers-list'
import { PlusIcon } from 'lucide-react'

export default function CustomersPage() {
  const router = useRouter()
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer information and interactions
          </p>
        </div>
        <Button onClick={() => router.push('/customers/create')}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      
      <Suspense fallback={<div className="flex justify-center p-8">Loading customers...</div>}>
        <CustomersList />
      </Suspense>
    </div>
  )
}
