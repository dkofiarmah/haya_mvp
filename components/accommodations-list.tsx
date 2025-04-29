import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Eye, MoreHorizontal, Star } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AccommodationsList() {
  const accommodations = [
    {
      id: 1,
      name: "Four Seasons Resort Bali at Sayan",
      location: "Bali, Indonesia",
      type: "Resort",
      price: "$$$$$",
      description:
        "Nestled in the lush highlands of Bali, this luxury resort offers private villas with infinity pools overlooking the Ayung River valley.",
      amenities: ["Spa", "Pool", "Restaurant", "Fitness Center", "WiFi"],
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Santorini Secret Suites & Spa",
      location: "Santorini, Greece",
      type: "Hotel",
      price: "$$$$",
      description:
        "Perched on the cliffs of Oia, these luxury suites offer private terraces with stunning views of the Aegean Sea and the famous Santorini sunset.",
      amenities: ["Spa", "Pool", "Restaurant", "WiFi"],
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Villa Punto de Vista",
      location: "Manuel Antonio, Costa Rica",
      type: "Villa",
      price: "$$$$$",
      description:
        "This exclusive 10-bedroom villa offers panoramic views of the Pacific Ocean and Manuel Antonio National Park. Includes full staff and private chef.",
      amenities: ["Pool", "Chef", "Staff", "WiFi", "Ocean View"],
      rating: 5.0,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "Giraffe Manor",
      location: "Nairobi, Kenya",
      type: "Boutique Hotel",
      price: "$$$$",
      description:
        "A unique boutique hotel where endangered Rothschild's giraffes visit morning and evening, poking their heads through windows for treats.",
      amenities: ["Wildlife Interaction", "Restaurant", "WiFi", "Airport Transfer"],
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      name: "Aman Tokyo",
      location: "Tokyo, Japan",
      type: "Hotel",
      price: "$$$$$",
      description:
        "Occupying the top six floors of the Otemachi Tower, this urban sanctuary offers panoramic views of Tokyo and Mount Fuji on clear days.",
      amenities: ["Spa", "Pool", "Restaurant", "Fitness Center", "WiFi"],
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      name: "The Brando",
      location: "Tetiaroa, French Polynesia",
      type: "Resort",
      price: "$$$$$",
      description:
        "An exclusive luxury resort on a private island once owned by Marlon Brando. Features private villas with direct beach access and plunge pools.",
      amenities: ["Private Beach", "Spa", "Pool", "Restaurant", "WiFi"],
      rating: 5.0,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accommodations.map((accommodation) => (
        <Card key={accommodation.id} className="overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={accommodation.image || "/placeholder.svg"}
              alt={accommodation.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="line-clamp-1">{accommodation.name}</CardTitle>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="text-sm font-medium">{accommodation.rating}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{accommodation.type}</Badge>
              <Badge variant="outline">{accommodation.price}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm">{accommodation.location}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">{accommodation.description}</p>
            <div className="flex flex-wrap gap-1 pt-2">
              {accommodation.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Add to Featured</DropdownMenuItem>
                  <DropdownMenuItem>View Analytics</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
