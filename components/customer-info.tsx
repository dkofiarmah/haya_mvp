import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Phone, Star, User, Mail, Clock, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface CustomerInfoProps {
  customerId: string
}

export function CustomerInfo({ customerId }: CustomerInfoProps) {
  // This would typically come from an API call using the customerId
  const customer = {
    id: customerId,
    name: "John Davis",
    email: "john.davis@example.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    loyalty: "Gold",
    joinedDate: "March 2020",
    upcomingTour: "Bali Luxury Retreat",
    departureDate: "July 15, 2023",
    previousTrips: 3,
    preferredDestinations: ["Bali", "Paris", "Maldives"],
    dietaryRestrictions: ["Gluten-free"],
    notes: "Prefers suite accommodations. Early riser who enjoys cultural activities.",
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-medium">{customer.name}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  {customer.status}
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                  <Star className="mr-1 h-3 w-3" /> {customer.loyalty}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Customer since {customer.joinedDate}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Upcoming Trip</h4>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{customer.upcomingTour}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Departure: {customer.departureDate}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Preferences</h4>
            {customer.dietaryRestrictions.length > 0 && (
              <div className="text-sm">
                <span className="font-medium">Dietary:</span> {customer.dietaryRestrictions.join(", ")}
              </div>
            )}
            {customer.preferredDestinations.length > 0 && (
              <div className="text-sm">
                <span className="font-medium">Favorite Destinations:</span> {customer.preferredDestinations.join(", ")}
              </div>
            )}
            <div className="text-sm">
              <span className="font-medium">Previous Trips:</span> {customer.previousTrips}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Notes</h4>
            <p className="text-sm text-muted-foreground">{customer.notes}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-full">
              <User className="mr-2 h-4 w-4" />
              Full Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
