'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'
import { ChevronLeft, CalendarIcon, ArrowRightIcon } from 'lucide-react'
import { createBooking } from '@/app/actions/experience-bookings'
import { ExperienceSchema } from '@/types/schema-extensions'
import { format, addDays, isAfter, isBefore, isValid, parse } from 'date-fns'

export default function PublicBookingForm({
  experience
}: {
  experience: ExperienceSchema
}) {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [partySize, setPartySize] = useState('1')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  // Derived values
  const totalPrice = parseInt(partySize) * experience.price_per_person
  
  // Calculate min date (based on booking notice)
  const minDate = addDays(new Date(), experience.booking_notice_hours ? 
    Math.ceil(experience.booking_notice_hours / 24) : 1)
  
  // Available dates filter
  const isDateAvailable = (date: Date): boolean => {
    // If no specific available dates, allow all future dates
    if (!experience.available_dates || experience.available_dates.length === 0) {
      return isAfter(date, minDate) || date.toDateString() === minDate.toDateString()
    }
    
    // Check if date is in available dates
    return experience.available_dates.some(availableDate => {
      // Convert string date to Date object if needed
      const availDate = typeof availableDate === 'string' ? 
        parse(availableDate, 'yyyy-MM-dd', new Date()) : 
        new Date(availableDate)
      
      return isValid(availDate) && date.toDateString() === availDate.toDateString()
    })
  }
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date) {
      toast({
        title: "Please select a date",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const bookingData = {
        experienceId: experience.id,
        orgId: experience.org_id,
        bookingDate: date.toISOString(),
        partySize: parseInt(partySize),
        totalPrice,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        specialRequests: form.specialRequests
      }
      
      const result = await createBooking(bookingData)
      
      if (result.success) {
        setShowConfirmation(true)
      } else {
        throw new Error(result.error || 'Failed to create booking')
      }
      
    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: "Booking failed",
        description: "There was a problem creating your booking. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Party size options
  const partySizeOptions = Array.from(
    { length: experience.max_group_size }, 
    (_, i) => (i + 1).toString()
  )
  
  // If minimum group size exists, filter options
  const filteredPartySizeOptions = experience.min_group_size 
    ? partySizeOptions.filter(size => parseInt(size) >= experience.min_group_size)
    : partySizeOptions
  
  return (
    <div className="min-h-screen bg-background">
      {/* Booking Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Booking Confirmed!</AlertDialogTitle>
            <AlertDialogDescription>
              Your booking for {experience.name} on {date && format(date, 'MMMM d, yyyy')} has been confirmed.
              We've sent a confirmation email to {form.email}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Link href={`/experiences/public/${experience.shareable_token}`}>
                Return to experience
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link 
            href={`/experiences/public/${experience.shareable_token}`} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to experience
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Book {experience.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Select a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => 
                          isBefore(date, minDate) || !isDateAvailable(date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">
                    {experience.booking_notice_hours ? 
                      `Bookings must be made at least ${experience.booking_notice_hours} hours in advance` : 
                      "Select an available date for your experience"
                    }
                  </p>
                </div>
                
                {/* Party Size */}
                <div className="space-y-2">
                  <Label htmlFor="partySize">Number of Guests</Label>
                  <Select
                    value={partySize}
                    onValueChange={setPartySize}
                  >
                    <SelectTrigger id="partySize">
                      <SelectValue placeholder="Select number of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPartySizeOptions.map(size => (
                        <SelectItem key={size} value={size}>
                          {size} {parseInt(size) === 1 ? 'guest' : 'guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {experience.min_group_size && experience.min_group_size > 1 && (
                    <p className="text-xs text-muted-foreground">
                      This experience requires at least {experience.min_group_size} guests
                    </p>
                  )}
                </div>
                
                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="font-medium">Your Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      type="email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (optional)</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                {/* Special Requests */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests (optional)</Label>
                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={form.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any special requirements or requests for your booking?"
                    rows={3}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={!date || isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Complete Booking"}
                  {!isSubmitting && <ArrowRightIcon className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </div>
            
            {/* Booking Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Experience</h4>
                    <p>{experience.name}</p>
                  </div>
                  
                  {date && (
                    <div>
                      <h4 className="font-medium text-sm">Date</h4>
                      <p>{format(date, 'MMMM d, yyyy')}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-sm">Guests</h4>
                    <p>{partySize} {parseInt(partySize) === 1 ? 'guest' : 'guests'}</p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span>Price per person:</span>
                      <span>${experience.price_per_person.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg mt-2">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-center text-muted-foreground w-full">
                    By completing this booking, you agree to the host's cancellation policy 
                    and experience terms.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
