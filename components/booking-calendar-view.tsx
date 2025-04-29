"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { motion } from "framer-motion"

export function BookingCalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Sample booking data
  const bookings = [
    { date: new Date(2025, 5, 15), type: "departure", tour: "Bali Luxury Retreat", customer: "John & Lisa Davis" },
    { date: new Date(2025, 5, 22), type: "arrival", tour: "Bali Luxury Retreat", customer: "John & Lisa Davis" },
    {
      date: new Date(2025, 7, 10),
      type: "departure",
      tour: "African Safari Adventure",
      customer: "Robert Miller Family",
    },
    {
      date: new Date(2025, 7, 17),
      type: "arrival",
      tour: "African Safari Adventure",
      customer: "Robert Miller Family",
    },
    { date: new Date(2025, 7, 10), type: "departure", tour: "Japan Cultural Tour", customer: "Sarah & William Chen" },
    { date: new Date(2025, 7, 17), type: "arrival", tour: "Japan Cultural Tour", customer: "Sarah & William Chen" },
    { date: new Date(2025, 8, 5), type: "departure", tour: "Bali Luxury Retreat", customer: "Johnson Family" },
    { date: new Date(2025, 8, 12), type: "arrival", tour: "Bali Luxury Retreat", customer: "Johnson Family" },
    { date: new Date(2025, 5, 5), type: "departure", tour: "Paris Getaway", customer: "Emma Thompson" },
    { date: new Date(2025, 5, 12), type: "arrival", tour: "Paris Getaway", customer: "Emma Thompson" },
  ]

  // Function to get bookings for a specific date
  const getBookingsForDate = (date: Date | undefined) => {
    if (!date) return []
    return bookings.filter(
      (booking) =>
        booking.date.getDate() === date.getDate() &&
        booking.date.getMonth() === date.getMonth() &&
        booking.date.getFullYear() === date.getFullYear(),
    )
  }

  const selectedDateBookings = getBookingsForDate(date)

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Tour Calendar</CardTitle>
          <CardDescription>View bookings by date</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              booked: bookings.map((booking) => booking.date),
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "#3b82f6",
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {date ? (
              <>
                Bookings for{" "}
                {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </>
            ) : (
              <>Select a date</>
            )}
          </CardTitle>
          <CardDescription>
            {selectedDateBookings.length
              ? `${selectedDateBookings.length} bookings found`
              : "No bookings for this date"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateBookings.length > 0 ? (
            <div className="space-y-4">
              {selectedDateBookings.map((booking, index) => (
                <motion.div
                  key={`${booking.tour}-${booking.type}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{booking.customer}</div>
                    <div className="text-sm text-muted-foreground">{booking.tour}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        booking.type === "departure" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"
                      }
                    >
                      {booking.type === "departure" ? "Departure" : "Arrival"}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">No bookings found for this date</p>
                <p className="text-xs text-muted-foreground mt-1">Select another date or create a new booking</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
