'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { supabaseClient } from '@/lib/supabase/auth-client'
import { useOrganization } from '@/lib/organizations'

// Define schema for customer form
const customerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

export type CustomerFormValues = z.infer<typeof customerSchema>

// Default values for the form
const defaultValues: Partial<CustomerFormValues> = {
  name: '',
  email: '',
  phone: '',
  notes: '',
}

interface CustomerFormProps {
  initialData?: any // Existing customer data if editing
  mode: 'create' | 'edit'
}

export function CustomerForm({ initialData, mode }: CustomerFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { currentOrganization } = useOrganization()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if we have an organization selected
  if (!currentOrganization) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Please select an organization first.</p>
      </div>
    )
  }

  // Initialize form with default values or existing data
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || defaultValues,
  })

  // Handle form submission
  const onSubmit = async (data: CustomerFormValues) => {
    if (!currentOrganization) {
      toast({
        title: 'Error',
        description: 'No organization selected. Please select an organization first.',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare the customer data
      const customerData = {
        org_id: currentOrganization.id,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        // Store notes in the metadata JSON
        metadata: {
          notes: data.notes,
        },
        // Initialize empty preferences if creating
        ...(mode === 'create' && { preferences: {} }),
      }

      let result

      if (mode === 'create') {
        // Insert new customer
        result = await supabaseClient
          .from('customers')
          .insert(customerData)
          .select()
      } else {
        // Update existing customer
        result = await supabaseClient
          .from('customers')
          .update(customerData)
          .eq('id', initialData.id)
          .select()
      }

      const { error } = result

      if (error) {
        throw error
      }

      toast({
        title: mode === 'create' ? 'Customer created' : 'Customer updated',
        description: mode === 'create' 
          ? 'New customer has been created successfully.' 
          : 'Customer information has been updated.',
      })

      // Redirect to customers list
      router.push('/customers')
      router.refresh()
    } catch (error) {
      console.error('Error saving customer:', error)
      toast({
        title: 'Error',
        description: 'Failed to save customer information. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                The customer's full name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  The customer's contact email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormDescription>
                  The customer's contact phone number.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any additional information about this customer..."
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Additional notes or information about the customer.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/customers')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? (mode === 'create' ? 'Creating...' : 'Updating...') 
              : (mode === 'create' ? 'Create Customer' : 'Update Customer')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
