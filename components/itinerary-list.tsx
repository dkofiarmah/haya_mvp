import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Edit, Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ItineraryList() {
  const itineraries = [
    {
      id: 1,
      title: "Bali Luxury Retreat",
      description: "7 days • 2 travelers",
      dates: "Jun 15 - Jun 22, 2025",
      client: {
        name: "John & Lisa Davis",
        type: "Anniversary Trip",
        avatar: "JD",
      },
      status: "pending",
      aiGenerated: true,
    },
    {
      id: 2,
      title: "African Safari",
      description: "12 days • 4 travelers",
      dates: "Aug 3 - Aug 15, 2025",
      client: {
        name: "Robert Miller Family",
        type: "Family Adventure",
        avatar: "RM",
      },
      status: "pending",
      aiGenerated: true,
    },
    {
      id: 3,
      title: "Japan Cultural Tour",
      description: "10 days • 2 travelers",
      dates: "Oct 5 - Oct 15, 2025",
      client: {
        name: "Sarah & William Chen",
        type: "Anniversary Trip",
        avatar: "SW",
      },
      status: "pending",
      aiGenerated: true,
    },
    {
      id: 4,
      title: "Greek Islands",
      description: "14 days • 2 travelers",
      dates: "Jul 10 - Jul 24, 2025",
      client: {
        name: "Michael & Emma Thompson",
        type: "Honeymoon",
        avatar: "MT",
      },
      status: "approved",
      aiGenerated: true,
    },
    {
      id: 5,
      title: "New Zealand Tour",
      description: "18 days • 6 travelers",
      dates: "Nov 12 - Nov 30, 2025",
      client: {
        name: "Johnson Family",
        type: "Family Adventure",
        avatar: "JF",
      },
      status: "draft",
      aiGenerated: false,
    },
    {
      id: 6,
      title: "Costa Rica Adventure",
      description: "9 days • 4 travelers",
      dates: "Dec 5 - Dec 14, 2025",
      client: {
        name: "Garcia Family",
        type: "Family Adventure",
        avatar: "GF",
      },
      status: "approved",
      aiGenerated: true,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {itineraries.map((itinerary) => (
        <Card key={itinerary.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{itinerary.title}</CardTitle>
                <CardDescription>{itinerary.description}</CardDescription>
              </div>
              {itinerary.status === "pending" && <Badge className="bg-amber-500/10 text-amber-500">Pending</Badge>}
              {itinerary.status === "approved" && <Badge className="bg-green-500/10 text-green-500">Approved</Badge>}
              {itinerary.status === "draft" && <Badge variant="outline">Draft</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              <span>{itinerary.dates}</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>{itinerary.client.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{itinerary.client.name}</p>
                <p className="text-xs text-muted-foreground">{itinerary.client.type}</p>
              </div>
            </div>
            {itinerary.aiGenerated && (
              <Badge variant="outline" className="bg-primary/10 text-primary">
                AI Generated
              </Badge>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View
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
                  <DropdownMenuItem>Send to Client</DropdownMenuItem>
                  <DropdownMenuItem>Download PDF</DropdownMenuItem>
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
