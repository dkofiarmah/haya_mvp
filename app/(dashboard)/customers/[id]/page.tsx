'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

        setCustomer(data)
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

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', params.id)
      
      if (error) {
        throw error
      }
      
      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      })
      
      router.push('/customers')
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete customer. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground">
            Customer details and information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/customers/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-lg">{customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd className="text-lg">{customer.email || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd className="text-lg">{customer.phone || 'N/A'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Added On</dt>
                <dd className="text-lg">{new Date(customer.created_at).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd className="text-lg">{new Date(customer.updated_at).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                <dd className="text-lg whitespace-pre-wrap">{customer.metadata?.notes || 'No notes added'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {customer.name}'s information and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
