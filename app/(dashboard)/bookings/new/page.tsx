// filepath: /Users/danny_1/_PROJECTS_/haya/haya_mvp/app/(dashboard)/bookings/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseClient } from '@/lib/supabase/browser'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CalendarIcon, ChevronLeft } from 'lucide-react'
import { format } from 'date-fns'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Database } from '@/types/supabase'

// Define form schema
const formSchema = z.object({
  customer_id: z.string({ required_error: 'Please select a customer' }),
  organization_id: z.string(),
  status: z.string().default('pending'),
  start_date: z.date({ required_error: 'Please select a check-in date' }),
  end_date: z.date({ required_error: 'Please select a check-out date' }),
  accommodation_id: z.string().optional(),
  experience_id: z.string().optional(),
  total_amount: z.coerce.number().min(0, { message: 'Amount must be a positive number' }),
  notes: z.string().optional(),
  number_of_guests: z.coerce.number().int().min(1, { message: 'At least one guest is required' }),
})

type FormValues = z.infer<typeof formSchema>

export default function NewBookingPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()
  const [customers, setCustomers] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [accommodations, setAccommodations] = useState<any[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'pending',
      number_of_guests: 1,
      total_amount: 0,
    },
  })

  // Fetch data for form options
  useEffect(() => {
    async function fetchData() {
      // Get user's organizations - no param needed, uses auth.uid() by default
      const { data: orgsData } = await supabase.rpc('get_user_organizations')
      setOrganizations(orgsData || [])
      
      if (orgsData && orgsData.length > 0) {
        // Set default organization
        form.setValue('organization_id', orgsData[0].organization_id)
        
        // Fetch customers for user's organizations
        const orgIds = orgsData.map(org => org.organization_id)
        const { data: customersData } = await supabase
          .from('customers')
          .select('*')
          .in('organization_id', orgIds)
        setCustomers(customersData || [])
        
        // Fetch accommodations for user's organizations
        const { data: accommodationsData } = await supabase
          .from('accommodations')
          .select('*')
          .in('organization_id', orgIds)
        setAccommodations(accommodationsData || [])
        
        // Fetch experiences for user's organizations
        const { data: experiencesData } = await supabase
          .from('experiences')
          .select('*')
          .in('organization_id', orgIds)
        setExperiences(experiencesData || [])
      }
    }
    
    fetchData()
  }, [supabase, form])

  // Handle form submission
  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    
    try {
      // Calculate total days
      const startDate = new Date(values.start_date)
      const endDate = new Date(values.end_date)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      // Insert booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: values.customer_id,
          organization_id: values.organization_id,
          status: values.status,
          start_date: values.start_date.toISOString(),
          end_date: values.end_date.toISOString(),
          accommodation_id: values.accommodation_id || null,
          experience_id: values.experience_id || null,
          total_amount: values.total_amount,
          notes: values.notes,
          number_of_guests: values.number_of_guests,
          duration_days: diffDays,
        })
        .select('id')
        .single()
      
      if (error) {
        throw error
      }
      
      // Redirect to booking detail page
      router.push(`/bookings/${data.id}`)
      
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Link href="/bookings" className="mr-4">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Booking</h1>
          <p className="text-muted-foreground">
            Create a new booking for a customer
          </p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>
                    Enter the essential information for this booking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customer_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.full_name} ({customer.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the customer for this booking
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-in Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={
                                    "w-full pl-3 text-left font-normal " +
                                    (!field.value && "text-muted-foreground")
                                  }
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-out Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={
                                    "w-full pl-3 text-left font-normal " +
                                    (!field.value && "text-muted-foreground")
                                  }
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => 
                                  date < new Date() || 
                                  (form.getValues().start_date && date < form.getValues().start_date)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="accommodation_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accommodation (Optional)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select accommodation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {accommodations.map((accommodation) => (
                                <SelectItem key={accommodation.id} value={accommodation.id}>
                                  {accommodation.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experience_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience (Optional)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {experiences.map((experience) => (
                                <SelectItem key={experience.id} value={experience.id}>
                                  {experience.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="number_of_guests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Guests</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="total_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Amount ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
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
                            placeholder="Add any special requests or additional information" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="organization_id"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Organization</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizations.map((org) => (
                              <SelectItem key={org.organization_id} value={org.organization_id}>
                                {org.organization_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Booking'}
                </Button>
                <Button variant="outline" type="button" onClick={() => router.push('/bookings')}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
