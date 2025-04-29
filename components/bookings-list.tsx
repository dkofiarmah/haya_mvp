'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from 'lucide-react'

// Mock data for the bookings list
const mockBookings = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    customerInitials: 'SJ',
    customerAvatar: '/avatars/01.png',
    destination: 'Bali, Indonesia',
    startDate: '2023-06-15',
    endDate: '2023-06-22',
    status: 'confirmed',
    guests: 2,
    totalAmount: '$2,450',
  },
  {
    id: '2',
    customerName: 'Michael Chen',
    customerInitials: 'MC',
    customerAvatar: '/avatars/02.png',
    destination: 'Paris, France',
    startDate: '2023-07-10',
    endDate: '2023-07-17',
    status: 'pending',
    guests: 4,
    totalAmount: '$3,800',
  },
  {
    id: '3',
    customerName: 'Emma Rodriguez',
    customerInitials: 'ER',
    customerAvatar: '/avatars/03.png',
    destination: 'Tokyo, Japan',
    startDate: '2023-08-05',
    endDate: '2023-08-15',
    status: 'confirmed',
    guests: 1,
    totalAmount: '$2,100',
  },
  {
    id: '4',
    customerName: 'Alex Thompson',
    customerInitials: 'AT',
    customerAvatar: null,
    destination: 'Santorini, Greece',
    startDate: '2023-09-20',
    endDate: '2023-09-27',
    status: 'cancelled',
    guests: 2,
    totalAmount: '$2,800',
  },
]

// Helper to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  
  const variant = status === 'confirmed' ? 'success' : 
                 status === 'pending' ? 'warning' : 'destructive'
  
  return <Badge variant={variant as any}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

export default function BookingsList() {
  const [bookings, setBookings] = useState(mockBookings)
  
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={booking.customerAvatar || ''} alt={booking.customerName} />
                    <AvatarFallback>{booking.customerInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{booking.customerName}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPinIcon className="mr-1 h-4 w-4" />
                      {booking.destination}
                    </div>
                  </div>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="text-muted-foreground">Dates</p>
                    <p>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="text-muted-foreground">Guests</p>
                    <p>{booking.guests} {booking.guests === 1 ? 'person' : 'people'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="text-muted-foreground">Total</p>
                    <p>{booking.totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t bg-muted/50 p-4 flex justify-end space-x-2">
              <Button variant="outline" size="sm">View Details</Button>
              <Button size="sm">Manage</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
