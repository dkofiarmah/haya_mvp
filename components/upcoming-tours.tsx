import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users } from "lucide-react"

export function UpcomingTours() {
  const tours = [
    {
      id: 1,
      name: "Bali Luxury Retreat",
      dates: "Jun 15 - Jun 22, 2025",
      status: "Confirmed",
      customers: 2,
      customerName: "John & Lisa Davis",
      customerAvatar: "JD",
      price: "$4,850",
    },
    {
      id: 2,
      name: "Paris Getaway",
      dates: "Jul 3 - Jul 10, 2025",
      status: "Pending",
      customers: 4,
      customerName: "Smith Family",
      customerAvatar: "SF",
      price: "$6,200",
    },
    {
      id: 3,
      name: "Tokyo Adventure",
      dates: "Jul 18 - Jul 28, 2025",
      status: "Confirmed",
      customers: 2,
      customerName: "Michael & Emma Chen",
      customerAvatar: "MC",
      price: "$5,400",
    },
    {
      id: 4,
      name: "African Safari",
      dates: "Aug 5 - Aug 15, 2025",
      status: "Confirmed",
      customers: 6,
      customerName: "Johnson Group",
      customerAvatar: "JG",
      price: "$12,800",
    },
  ]

  return (
    <div className="space-y-4">
      {tours.map((tour) => (
        <div key={tour.id} className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="font-medium">{tour.name}</h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>{tour.dates}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    tour.status === "Confirmed" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                  }
                >
                  {tour.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{tour.customers}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>{tour.customerAvatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{tour.customerName}</p>
                  <p className="text-sm text-muted-foreground">{tour.price}</p>
                </div>
              </div>
            </div>
            <Button size="sm">View</Button>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full">
        View All Tours
      </Button>
    </div>
  )
}
