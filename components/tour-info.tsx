import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Hotel, MapPin, Sun, Users } from "lucide-react"

interface TourInfoProps {
  tourId: string
}

export function TourInfo({ tourId }: TourInfoProps) {
  // This would typically come from an API call using the tourId
  const tour = {
    id: tourId,
    name: "Bali Luxury Retreat",
    status: "Upcoming",
    dates: "July 15 - July 25, 2023",
    duration: "10 days",
    destination: "Bali, Indonesia",
    participants: 2,
    accommodations: "Four Seasons Resort Bali at Sayan",
    roomType: "River-View Suite",
    activities: ["Private Temple Tour", "Cooking Class", "Spa Treatment", "Rice Terrace Trek"],
    specialRequests: "Airport transfer, Late checkout requested",
    weatherForecast: "Mostly sunny, 28-32°C",
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <h3 className="font-medium">{tour.name}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                {tour.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{tour.dates}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{tour.destination}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{tour.participants} travelers</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Accommodation</h4>
            <div className="flex items-center gap-2 text-sm">
              <Hotel className="h-4 w-4 text-muted-foreground" />
              <span>{tour.accommodations}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Room:</span> {tour.roomType}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Activities</h4>
            <ul className="space-y-1">
              {tour.activities.map((activity, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  {activity}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Weather Forecast</h4>
            <div className="flex items-center gap-2 text-sm">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <span>{tour.weatherForecast}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Special Requests</h4>
            <p className="text-sm text-muted-foreground">{tour.specialRequests}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              View Itinerary
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
