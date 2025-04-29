import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Plus } from "lucide-react"

export function TourItinerary() {
  const days = [
    {
      day: 1,
      title: "Arrival & Welcome Dinner",
      description:
        "Arrive at Denpasar International Airport where you'll be greeted by your private driver. Transfer to your luxury villa in Ubud. Enjoy a welcome dinner at a traditional Balinese restaurant with cultural performances.",
      activities: [
        {
          time: "14:00",
          title: "Airport Pickup",
          description: "Meet and greet at Denpasar International Airport",
          included: true,
        },
        {
          time: "16:00",
          title: "Check-in at Luxury Villa",
          description: "Welcome drinks and villa orientation",
          included: true,
        },
        {
          time: "19:00",
          title: "Welcome Dinner",
          description: "Traditional Balinese cuisine with cultural performances",
          included: true,
        },
      ],
      accommodation: "Mandapa, a Ritz-Carlton Reserve - Pool Villa",
      meals: ["Dinner"],
    },
    {
      day: 2,
      title: "Ubud Cultural Immersion",
      description:
        "Explore the cultural heart of Bali with visits to sacred temples, art galleries, and craft villages. Participate in a private Balinese cooking class and enjoy lunch with your creations.",
      activities: [
        {
          time: "08:00",
          title: "Breakfast at Villa",
          description: "Fresh tropical fruits, pastries, and Balinese coffee",
          included: true,
        },
        {
          time: "09:30",
          title: "Temple Tour",
          description: "Visit Tirta Empul and Gunung Kawi temples with private guide",
          included: true,
        },
        {
          time: "12:30",
          title: "Cooking Class",
          description: "Private Balinese cooking class with market visit",
          included: true,
        },
        {
          time: "15:00",
          title: "Art Village Tour",
          description: "Visit to Ubud art galleries and craft villages",
          included: true,
        },
        {
          time: "19:00",
          title: "Dinner at Locavore",
          description: "Fine dining experience at one of Bali's top restaurants",
          included: true,
        },
      ],
      accommodation: "Mandapa, a Ritz-Carlton Reserve - Pool Villa",
      meals: ["Breakfast", "Lunch", "Dinner"],
    },
    {
      day: 3,
      title: "Nature & Adventure Day",
      description:
        "Experience Bali's natural beauty with a morning trek through rice terraces, followed by a visit to a coffee plantation. Afternoon white water rafting adventure on the Ayung River.",
      activities: [
        {
          time: "07:00",
          title: "Breakfast at Villa",
          description: "Energizing breakfast before adventure activities",
          included: true,
        },
        {
          time: "08:00",
          title: "Rice Terrace Trek",
          description: "Guided trek through Tegallalang Rice Terraces",
          included: true,
        },
        {
          time: "11:00",
          title: "Coffee Plantation Tour",
          description: "Visit to traditional coffee plantation with tasting",
          included: true,
        },
        {
          time: "13:00",
          title: "Lunch at Organic Restaurant",
          description: "Farm-to-table lunch with panoramic views",
          included: true,
        },
        {
          time: "14:30",
          title: "White Water Rafting",
          description: "Guided rafting adventure on the Ayung River",
          included: true,
        },
        {
          time: "19:00",
          title: "Dinner at Villa",
          description: "Private chef dinner on your villa terrace",
          included: true,
        },
      ],
      accommodation: "Mandapa, a Ritz-Carlton Reserve - Pool Villa",
      meals: ["Breakfast", "Lunch", "Dinner"],
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tour Itinerary</CardTitle>
          <CardDescription>Day-by-day schedule for the Bali Luxury Retreat</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Itinerary
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Day
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {days.map((day) => (
            <div key={day.day} className="relative border-l-2 border-muted pl-6 pt-2">
              <div className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {day.day}
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold">{day.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{day.description}</p>
              </div>
              <div className="space-y-4">
                {day.activities.map((activity, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-muted-foreground">{activity.time}</span>
                          <h4 className="font-medium">{activity.title}</h4>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                      {activity.included && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          Included
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <div>
                  <span className="text-sm font-medium">Accommodation:</span>
                  <span className="ml-2 text-sm">{day.accommodation}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Meals:</span>
                  <span className="ml-2 text-sm">{day.meals.join(", ")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
