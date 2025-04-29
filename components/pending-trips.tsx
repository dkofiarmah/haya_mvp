import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Edit, Eye, ThumbsDown, ThumbsUp } from "lucide-react"

export function PendingTrips() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Bali Luxury Retreat</CardTitle>
              <CardDescription>7 days • 2 travelers</CardDescription>
            </div>
            <Badge>Itinerary</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>Jun 15 - Jun 22, 2025</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">John & Lisa Davis</p>
              <p className="text-xs text-muted-foreground">Anniversary Trip</p>
            </div>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs">
              AI has created an itinerary based on client preferences for beaches, spa treatments, and cultural
              experiences.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-red-500">
              <ThumbsDown className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>African Safari</CardTitle>
              <CardDescription>12 days • 4 travelers</CardDescription>
            </div>
            <Badge>Booking</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>Aug 3 - Aug 15, 2025</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>RM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Robert Miller Family</p>
              <p className="text-xs text-muted-foreground">Family Adventure</p>
            </div>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs">
              AI has prepared booking requests for Serengeti lodges and private safari guides. Requires approval before
              submission.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-red-500">
              <ThumbsDown className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Japan Cultural Tour</CardTitle>
              <CardDescription>10 days • 2 travelers</CardDescription>
            </div>
            <Badge>Itinerary</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>Oct 5 - Oct 15, 2025</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>SW</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Sarah & William Chen</p>
              <p className="text-xs text-muted-foreground">Anniversary Trip</p>
            </div>
          </div>
          <div className="rounded-md bg-muted p-3">
            <p className="text-xs">
              AI has designed a cultural immersion itinerary with tea ceremonies, ryokan stays, and private guides in
              Kyoto.
            </p>
          </div>
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
            <Button size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
