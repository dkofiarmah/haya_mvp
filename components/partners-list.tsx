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

export function PartnersList() {
  const partners = [
    {
      id: 1,
      name: "Bali Authentic Tours",
      location: "Bali, Indonesia",
      type: "Tour Operator",
      services: ["Cultural Tours", "Temple Visits", "Cooking Classes", "Rice Terrace Treks"],
      description:
        "Local tour operator specializing in authentic cultural experiences in Bali. Family-owned business with over 20 years of experience.",
      rating: 4.8,
      contactPerson: "Made Wijaya",
      email: "info@baliauthentictours.com",
      phone: "+62 812-3456-7890",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Santorini Luxury Transfers",
      location: "Santorini, Greece",
      type: "Transportation",
      services: ["Airport Transfers", "Private Tours", "Yacht Charters", "Helicopter Services"],
      description:
        "Premium transportation services in Santorini with a fleet of luxury vehicles and professional drivers.",
      rating: 4.9,
      contactPerson: "Nikos Papadopoulos",
      email: "bookings@santoriniluxtransfers.com",
      phone: "+30 694-123-4567",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Safari Experts Kenya",
      location: "Nairobi, Kenya",
      type: "Tour Operator",
      services: ["Safari Tours", "Wildlife Photography", "Maasai Village Visits", "Hot Air Balloon Rides"],
      description:
        "Specialized safari operator with expert guides and sustainable tourism practices. Offers custom safari experiences throughout Kenya.",
      rating: 4.9,
      contactPerson: "James Omondi",
      email: "info@safariexpertskenya.com",
      phone: "+254 712-345-678",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "Tokyo Insider Tours",
      location: "Tokyo, Japan",
      type: "Activity Provider",
      services: ["Food Tours", "Cultural Workshops", "Hidden Tokyo Tours", "Sake Tasting"],
      description:
        "Boutique tour company offering insider experiences in Tokyo led by local experts who speak fluent English.",
      rating: 4.7,
      contactPerson: "Yuki Tanaka",
      email: "hello@tokyoinsidertours.com",
      phone: "+81 90-1234-5678",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      name: "Amalfi Coast Yachting",
      location: "Amalfi, Italy",
      type: "Transportation",
      services: ["Private Yacht Charters", "Coastal Tours", "Island Hopping", "Sunset Cruises"],
      description:
        "Luxury yacht charter company offering private cruises along the Amalfi Coast with experienced captains and crew.",
      rating: 4.8,
      contactPerson: "Marco Rossi",
      email: "bookings@amalficoastyachting.com",
      phone: "+39 333-123-4567",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      name: "Patagonia Adventure Outfitters",
      location: "Torres del Paine, Chile",
      type: "Activity Provider",
      services: ["Hiking Expeditions", "Glacier Treks", "Wildlife Tours", "Photography Tours"],
      description:
        "Adventure specialists in Patagonia offering guided treks and expeditions with top-quality equipment and experienced guides.",
      rating: 4.9,
      contactPerson: "Carlos Mendez",
      email: "info@patagoniaadventureoutfitters.com",
      phone: "+56 9-8765-4321",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {partners.map((partner) => (
        <Card key={partner.id}>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-md">
                <img
                  src={partner.image || "/placeholder.svg"}
                  alt={partner.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <CardTitle className="line-clamp-1 text-base">{partner.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{partner.type}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-medium">{partner.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm">{partner.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Contact:</span>
                <span className="text-sm">{partner.contactPerson}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{partner.description}</p>
            <div className="pt-2">
              <span className="text-sm font-medium">Services:</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {partner.services.map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
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
                  <DropdownMenuItem>Contact Partner</DropdownMenuItem>
                  <DropdownMenuItem>View Bookings</DropdownMenuItem>
                  <DropdownMenuItem>View Contract</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">Remove Partner</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
