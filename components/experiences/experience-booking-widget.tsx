'use client'

import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { Calendar as CalendarIcon, Users, ArrowRight, Check } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

// Mock data for available time slots
// In a real app, these would come from an API
const mockTimeSlots = [
  { id: '1', time: '09:00', available: 8 },
  { id: '2', time: '11:30', available: 5 },
  { id: '3', time: '14:00', available: 2 },
  { id: '4', time: '16:30', available: 10 },
]

interface ExperienceBookingWidgetProps {
  experience: any;
}

export default function ExperienceBookingWidget({ experience }: ExperienceBookingWidgetProps) {
  const [date, setDate] = useState<Date | undefined>()
  const [numGuests, setNumGuests] = useState(experience.min_group_size || 1)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [bookingDetails, setBookingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  })
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Move to the contact information step
  const handleProceedToContactInfo = () => {
    if (!date || !selectedTimeSlot) {
      toast({
        title: 'Missing information',
        description: 'Please select a date and time for your booking',
        variant: 'destructive',
      })
      return
    }
    
    setBookingStep(2)
  }
  
  // Submit the booking
  const handleSubmitBooking = () => {
    // Validate required fields
    const { firstName, lastName, email, phone } = bookingDetails
    if (!firstName || !lastName || !email || !phone) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }
    
    // Here you would typically call an API to create the booking
    // For now, we'll just show a success message
    toast({
      title: 'Booking Requested',
      description: 'Your booking request has been submitted successfully!',
    })
    
    // Reset form and show confirmation
    setBookingStep(3)
  }
  
  // Calculate total price
  const totalPrice = experience.price_per_person * numGuests
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Book this Experience</CardTitle>
        <CardDescription>
          Select a date, time and number of guests to book
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {bookingStep === 1 && (
          <div className="space-y-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Time Selection - only shown if date is selected */}
            {date && (
              <div className="space-y-2">
                <Label>Select Time</Label>
                <div className="grid grid-cols-2 gap-2">
                  {mockTimeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                      className={cn(
                        "justify-start",
                        slot.available === 0 && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={slot.available === 0}
                      onClick={() => setSelectedTimeSlot(slot.id)}
                    >
                      {selectedTimeSlot === slot.id && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {slot.time}
                      <span className="ml-auto text-xs">
                        {slot.available} {slot.available === 1 ? 'spot' : 'spots'}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Number of Guests */}
            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-gray-500" />
                <Select
                  value={numGuests.toString()}
                  onValueChange={(value) => setNumGuests(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: (experience.max_group_size - experience.min_group_size) + 1 },
                      (_, i) => experience.min_group_size + i
                    ).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'guest' : 'guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Price Summary */}
            <div className="pt-4 border-t">
              <div className="flex justify-between mb-2">
                <span>Price per person</span>
                <span>{formatCurrency(experience.price_per_person, experience.currency)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Number of guests</span>
                <span>x {numGuests}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(totalPrice, experience.currency)}</span>
              </div>
            </div>
          </div>
        )}
        
        {bookingStep === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Date:</span>
                <span className="text-sm font-medium">{date ? format(date, 'PPP') : 'Not selected'}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Time:</span>
                <span className="text-sm font-medium">
                  {selectedTimeSlot ? mockTimeSlots.find(s => s.id === selectedTimeSlot)?.time : 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Guests:</span>
                <span className="text-sm font-medium">{numGuests}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={bookingDetails.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={bookingDetails.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={bookingDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={bookingDetails.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Input
                id="specialRequests"
                name="specialRequests"
                value={bookingDetails.specialRequests}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Price Summary */}
            <div className="pt-4 border-t">
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formatCurrency(totalPrice, experience.currency)}</span>
              </div>
            </div>
          </div>
        )}
        
        {bookingStep === 3 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Booking Requested!</h3>
            <p className="text-gray-500 mb-6">
              Thank you for booking with us. We will contact you shortly to confirm your reservation.
            </p>
            <div className="bg-gray-50 p-4 rounded-md text-left">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="font-medium">{experience.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{date ? format(date, 'PPP') : 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">
                    {selectedTimeSlot ? mockTimeSlots.find(s => s.id === selectedTimeSlot)?.time : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span className="font-medium">{numGuests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium">{formatCurrency(totalPrice, experience.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {bookingStep < 3 && (
        <CardFooter className="flex justify-between">
          {bookingStep === 2 && (
            <Button
              variant="outline"
              onClick={() => setBookingStep(1)}
            >
              Back
            </Button>
          )}
          <Button
            className={bookingStep === 1 ? "w-full" : ""}
            onClick={bookingStep === 1 ? handleProceedToContactInfo : handleSubmitBooking}
          >
            {bookingStep === 1 ? (
              <>
                Continue to Booking
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Complete Booking'
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
