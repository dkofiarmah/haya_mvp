import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Coffee, Home, Utensils } from "lucide-react"

export function BookingItinerary() {
  const days = [
    {
      day: 1,
      date: "Jun 15, 2025",
      title: "Arrival and Welcome Dinner",
      description:
        "Arrive at Denpasar International Airport where you'll be greeted by your private driver. Check in to your luxury villa at the Four Seasons Resort Bali at Sayan. Evening welcome dinner at the resort's signature restaurant.",
      meals: ["Dinner"],
      accommodation: "Four Seasons Resort Bali at Sayan",
    },
    {
      day: 2,
      date: "Jun 16, 2025",
      title: "Temple Tour and Spa Treatment",
      description:
        "Morning visit to Tirta Empul and Gunung Kawi temples with a private guide. Afternoon spa treatment at the resort's award-winning spa. Evening at leisure.",
      meals: ["Breakfast", "Lunch"],
      accommodation: "Four Seasons Resort Bali at Sayan",
    },
    {
      day: 3,
      date: "Jun 17, 2025",
      title: "Ubud Art and Culture",
      description:
        "Explore Ubud's art galleries and craft villages. Private batik-making workshop with a local artist. Visit the Sacred Monkey Forest Sanctuary. Dinner at a renowned local restaurant.",
      meals: ["Breakfast", "Dinner"],
      accommodation: "Four Seasons Resort Bali at Sayan",
    },
    {
      day: 4,
      date: "Jun 18, 2025",
      title: "Transfer to Seminyak",
      description:
        "Morning yoga session. Transfer to The Legian Seminyak in the afternoon. Free time to explore Seminyak's boutiques and beaches.",
      meals: ["Breakfast"],
      accommodation: "The Legian Seminyak",
    },
    {
      day: 5,
      date: "Jun 19, 2025",
      title: "Beach Day and Sunset Cruise",
      description:
        "Day at leisure at Seminyak Beach with private cabana. Evening sunset cruise with champagne and canapés.",
      meals: ["Breakfast", "Dinner"],
      accommodation: "The Legian Seminyak",
    },
    {
      day: 6,
      date: "Jun 20, 2025",
      title: "Uluwatu Temple and Cultural Performance",
      description:
        "Day trip to Uluwatu Temple. Watch the traditional Kecak fire dance at sunset. Seafood dinner at Jimbaran Bay.",
      meals: ["Breakfast", "Dinner"],
      accommodation: "The Legian Seminyak",
    },
    {
      day: 7,
      date: "Jun 21, 2025",
      title: "Farewell Day",
      description:
        "Morning cooking class to learn Balinese cuisine. Afternoon spa treatment. Special farewell dinner at a beachfront restaurant.",
      meals: ["Breakfast", "Lunch", "Dinner"],
      accommodation: "The Legian Seminyak",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tour Itinerary</CardTitle>
        <CardDescription>Day-by-day schedule for Bali Luxury Retreat</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {days.map((day) => (
            <div
              key={day.day}
              className="relative border-l pl-8 before:absolute before:left-0 before:top-0 before:h-full"
            >
              <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {day.day}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{day.date}</span>
                </div>
                <h3 className="font-medium">{day.title}</h3>
                <p className="text-sm">{day.description}</p>
                <div className="flex flex-wrap gap-2">
                  {day.meals.includes("Breakfast") && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Coffee className="h-3 w-3" />
                      Breakfast
                    </Badge>
                  )}
                  {day.meals.includes("Lunch") && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Utensils className="h-3 w-3" />
                      Lunch
                    </Badge>
                  )}
                  {day.meals.includes("Dinner") && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Utensils className="h-3 w-3" />
                      Dinner
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{day.accommodation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
