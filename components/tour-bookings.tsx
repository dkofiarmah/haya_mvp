import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Download, MoreHorizontal, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TourBookings() {
  const bookings = [
    {
      id: "BK-001",
      customer: {
        name: "John & Lisa Davis",
        avatar: "JD",
        email: "john.davis@example.com",
      },
      date: "Jun 15 - Jun 22, 2025",
      travelers: 2,
      status: "Confirmed",
      paymentStatus: "Paid",
      amount: "$9,700",
      bookedOn: "Jan 15, 2025",
    },
    {
      id: "BK-002",
      customer: {
        name: "Robert Miller Family",
        avatar: "RM",
        email: "robert.miller@example.com",
      },
      date: "Jul 10 - Jul 17, 2025",
      travelers: 4,
      status: "Pending",
      paymentStatus: "Deposit Paid",
      amount: "$19,400",
      bookedOn: "Jan 20, 2025",
    },
    {
      id: "BK-003",
      customer: {
        name: "Sarah & William Chen",
        avatar: "SC",
        email: "sarah.chen@example.com",
      },
      date: "Jul 10 - Jul 17, 2025",
      travelers: 2,
      status: "Confirmed",
      paymentStatus: "Paid",
      amount: "$9,700",
      bookedOn: "Jan 22, 2025",
    },
    {
      id: "BK-004",
      customer: {
        name: "Johnson Family",
        avatar: "JF",
        email: "johnson.family@example.com",
      },
      date: "Aug 5 - Aug 12, 2025",
      travelers: 5,
      status: "Waitlist",
      paymentStatus: "Not Paid",
      amount: "$24,250",
      bookedOn: "Jan 25, 2025",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tour Bookings</CardTitle>
          <CardDescription>Manage customer bookings for this tour</CardDescription>
        </div>
        <Button>Add Booking</Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Travelers</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Payment</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-1"></div>
          </div>
          {bookings.map((booking) => (
            <div key={booking.id} className="grid grid-cols-12 items-center border-b p-4 last:border-0">
              <div className="col-span-3 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>{booking.customer.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{booking.customer.name}</div>
                  <div className="text-xs text-muted-foreground">{booking.customer.email}</div>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{booking.date}</span>
              </div>
              <div className="col-span-1 flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{booking.travelers}</span>
              </div>
              <div className="col-span-2">
                {booking.status === "Confirmed" ? (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    Confirmed
                  </Badge>
                ) : booking.status === "Pending" ? (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                    Pending
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                    Waitlist
                  </Badge>
                )}
              </div>
              <div className="col-span-2">
                {booking.paymentStatus === "Paid" ? (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    Paid
                  </Badge>
                ) : booking.paymentStatus === "Deposit Paid" ? (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                    Deposit Paid
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-500/10 text-red-500">
                    Not Paid
                  </Badge>
                )}
              </div>
              <div className="col-span-1 text-sm font-medium">{booking.amount}</div>
              <div className="col-span-1 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Booking</DropdownMenuItem>
                    <DropdownMenuItem>Send Confirmation</DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download Invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">Cancel Booking</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
