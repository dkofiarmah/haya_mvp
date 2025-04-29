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

export function CustomerBookings() {
  const bookings = [
    {
      id: "BK-001",
      tour: "Bali Luxury Retreat",
      date: "Jun 15 - Jun 22, 2025",
      travelers: 2,
      status: "Confirmed",
      paymentStatus: "Paid",
      amount: "$9,700",
      bookedOn: "Jan 15, 2025",
    },
    {
      id: "BK-002",
      tour: "Japan Cultural Tour",
      date: "Oct 5 - Oct 15, 2024",
      travelers: 2,
      status: "Completed",
      paymentStatus: "Paid",
      amount: "$10,800",
      bookedOn: "Mar 10, 2024",
    },
    {
      id: "BK-003",
      tour: "European Heritage Tour",
      date: "May 12 - May 26, 2024",
      travelers: 2,
      status: "Completed",
      paymentStatus: "Paid",
      amount: "$12,400",
      bookedOn: "Nov 5, 2023",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Booking History</CardTitle>
          <CardDescription>Past and upcoming tours</CardDescription>
        </div>
        <Button>Add Booking</Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
            <div className="col-span-3">Tour</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Travelers</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Payment</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-1"></div>
          </div>
          {bookings.map((booking) => (
            <div key={booking.id} className="grid grid-cols-12 items-center border-b p-4 last:border-0">
              <div className="col-span-3 font-medium">{booking.tour}</div>
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
                ) : booking.status === "Completed" ? (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                    Completed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                    Pending
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
