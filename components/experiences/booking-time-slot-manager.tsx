'use client'

import { useState } from 'react'
import { format, addDays, startOfWeek, addWeeks, parseISO, isValid } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  availableSpots: number;
}

interface BookingTimeSlotManagerProps {
  experienceId: string;
  initialTimeSlots?: TimeSlot[];
  onSave?: (timeSlots: TimeSlot[]) => void;
  readOnly?: boolean;
}

export default function BookingTimeSlotManager({
  experienceId,
  initialTimeSlots = [],
  onSave,
  readOnly = false
}: BookingTimeSlotManagerProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState<string>('09:00')
  const [endTime, setEndTime] = useState<string>('11:00')
  const [availableSpots, setAvailableSpots] = useState<number>(10)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots)
  const [calendarOpen, setCalendarOpen] = useState(false)
  
  // Generate a unique ID for timeslots
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  }
  
  // Add a new timeslot
  const addTimeSlot = () => {
    if (!date) {
      toast({
        title: 'Error',
        description: 'Please select a date',
        variant: 'destructive',
      })
      return
    }
    
    // Validate times
    if (!startTime || !endTime || startTime >= endTime) {
      toast({
        title: 'Error',
        description: 'Start time must be before end time',
        variant: 'destructive',
      })
      return
    }
    
    // Validate available spots
    if (availableSpots <= 0) {
      toast({
        title: 'Error',
        description: 'Available spots must be greater than 0',
        variant: 'destructive',
      })
      return
    }
    
    const newTimeSlot: TimeSlot = {
      id: generateId(),
      date: date,
      startTime,
      endTime,
      availableSpots,
    }
    
    const updatedTimeSlots = [...timeSlots, newTimeSlot]
    setTimeSlots(updatedTimeSlots)
    
    if (onSave) {
      onSave(updatedTimeSlots)
    }
    
    // Reset form
    setStartTime('09:00')
    setEndTime('11:00')
    setAvailableSpots(10)
    
    toast({
      title: 'Time slot added',
      description: `Added on ${format(date, 'PPP')} from ${startTime} to ${endTime}`,
    })
  }
  
  // Remove a timeslot
  const removeTimeSlot = (id: string) => {
    const updatedTimeSlots = timeSlots.filter(slot => slot.id !== id)
    setTimeSlots(updatedTimeSlots)
    
    if (onSave) {
      onSave(updatedTimeSlots)
    }
    
    toast({
      title: 'Time slot removed',
      description: 'The time slot has been removed',
    })
  }
  
  // Sort time slots by date and time
  const sortedTimeSlots = [...timeSlots].sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime()
    if (dateCompare !== 0) return dateCompare
    return a.startTime.localeCompare(b.startTime)
  })
  
  // Group time slots by date for display
  const groupedTimeSlots: { [date: string]: TimeSlot[] } = {}
  sortedTimeSlots.forEach(slot => {
    const dateStr = format(slot.date, 'yyyy-MM-dd')
    if (!groupedTimeSlots[dateStr]) {
      groupedTimeSlots[dateStr] = []
    }
    groupedTimeSlots[dateStr].push(slot)
  })
  
  return (
    <div className="space-y-6">
      {!readOnly && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium mb-4">Add Availability</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
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
                    onSelect={(day) => {
                      setDate(day)
                      setCalendarOpen(false)
                    }}
                    initialFocus
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="startTime"
                  type="time"
                  className="pl-9"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>
            
            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="endTime"
                  type="time"
                  className="pl-9"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            
            {/* Available Spots */}
            <div className="space-y-2">
              <Label htmlFor="spots">Available Spots</Label>
              <Input
                id="spots"
                type="number"
                min="1"
                value={availableSpots}
                onChange={(e) => setAvailableSpots(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <Button className="mt-4" onClick={addTimeSlot}>
            <Plus className="mr-2 h-4 w-4" />
            Add Time Slot
          </Button>
        </div>
      )}
      
      {/* Saved Time Slots */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium mb-4">Available Time Slots</h3>
        
        {Object.keys(groupedTimeSlots).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No time slots available. Add availability for this experience.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTimeSlots).map(([dateStr, slots]) => {
              const dateObj = parseISO(dateStr)
              return isValid(dateObj) ? (
                <div key={dateStr} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-medium mb-2">{format(dateObj, 'PPPP')}</h4>
                  <div className="space-y-2">
                    {slots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div>
                          <span className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span className="ml-3 text-sm text-gray-500">
                            {slot.availableSpots} {slot.availableSpots === 1 ? 'spot' : 'spots'} available
                          </span>
                        </div>
                        
                        {!readOnly && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeSlot(slot.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            })}
          </div>
        )}
      </div>
    </div>
  )
}
