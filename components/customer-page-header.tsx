'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CustomerPageHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Customer</h1>
        <p className="text-muted-foreground">
          Add a new customer to your organization
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/customers">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Link>
      </Button>
    </div>
  )
}
