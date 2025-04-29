import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Filter, PlusCircle, Search } from "lucide-react"
import { ItineraryList } from "@/components/itinerary-list"

export default function ItinerariesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Itineraries</h2>
          <p className="text-muted-foreground">Manage and edit trip itineraries created by AI agents.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Itinerary
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search itineraries..." className="w-full pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Calendar className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Itineraries
            <Badge variant="secondary" className="ml-2">
              24
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft
            <Badge variant="secondary" className="ml-2">
              8
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval
            <Badge variant="secondary" className="ml-2">
              5
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            <Badge variant="secondary" className="ml-2">
              11
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <ItineraryList />
        </TabsContent>
        <TabsContent value="draft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Draft Itineraries</CardTitle>
              <CardDescription>Itineraries that are still being worked on by AI agents.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Draft itineraries content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval</CardTitle>
              <CardDescription>Itineraries waiting for your review and approval.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Pending approval itineraries content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Itineraries</CardTitle>
              <CardDescription>Itineraries that have been approved and sent to clients.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Approved itineraries content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
