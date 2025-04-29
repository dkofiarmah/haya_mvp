'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomerForm } from '@/components/customer-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) {
          throw error
        }

        // Transform the data to match the form structure
        const formData = {
          ...data,
          notes: data.metadata?.notes || '',
        }

        setCustomer(formData)
      } catch (error) {
        console.error('Error fetching customer:', error)
        toast({
          title: 'Error',
          description: 'Failed to load customer information. Please try again.',
          variant: 'destructive'
        })
        router.push('/customers')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [params.id, router, toast])

  if (loading) {
    return <div className="container mx-auto py-6">Loading customer information...</div>
  }

  if (!customer) {
    return <div className="container mx-auto py-6">Customer not found</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
          <p className="text-muted-foreground">
            Update information for {customer.name}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm mode="edit" initialData={customer} />
        </CardContent>
      </Card>
    </div>
  )
}
