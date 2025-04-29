import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TourPricing() {
  const dates = [
    {
      id: 1,
      startDate: "Jun 15, 2025",
      endDate: "Jun 22, 2025",
      capacity: 12,
      booked: 8,
      status: "Open",
    },
    {
      id: 2,
      startDate: "Jul 10, 2025",
      endDate: "Jul 17, 2025",
      capacity: 12,
      booked: 6,
      status: "Open",
    },
    {
      id: 3,
      startDate: "Aug 5, 2025",
      endDate: "Aug 12, 2025",
      capacity: 12,
      booked: 2,
      status: "Open",
    },
  ]

  const pricingOptions = [
    {
      id: 1,
      name: "Standard Package",
      description: "Base tour package with all included activities",
      price: "$4,850",
      perPerson: true,
      default: true,
    },
    {
      id: 2,
      name: "Deluxe Package",
      description: "Enhanced experience with premium accommodations and additional activities",
      price: "$5,950",
      perPerson: true,
      default: false,
    },
    {
      id: 3,
      name: "Private Tour",
      description: "Exclusive tour for your group with personalized itinerary",
      price: "$24,250",
      perPerson: false,
      default: false,
      minPeople: 2,
      maxPeople: 6,
    },
  ]

  const addons = [
    {
      id: 1,
      name: "Airport VIP Service",
      description: "Fast-track immigration and luxury airport transfer",
      price: "$150",
      perPerson: true,
    },
    {
      id: 2,
      name: "Spa Package",
      description: "3 premium spa treatments during your stay",
      price: "$350",
      perPerson: true,
    },
    {
      id: 3,
      name: "Photography Service",
      description: "Professional photographer for one full day",
      price: "$500",
      perPerson: false,
    },
  ]

  return (
    <Tabs defaultValue="dates" className="space-y-6">
      <TabsList>
        <TabsTrigger value="dates">Available Dates</TabsTrigger>
        <TabsTrigger value="pricing">Pricing Options</TabsTrigger>
        <TabsTrigger value="addons">Add-ons</TabsTrigger>
        <TabsTrigger value="policies">Policies</TabsTrigger>
      </TabsList>
      <TabsContent value="dates" className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tour Dates</CardTitle>
              <CardDescription>Manage available dates for this tour</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Date
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
                <div className="col-span-3">Start Date</div>
                <div className="col-span-3">End Date</div>
                <div className="col-span-2">Capacity</div>
                <div className="col-span-2">Bookings</div>
                <div className="col-span-2">Status</div>
              </div>
              {dates.map((date) => (
                <div key={date.id} className="grid grid-cols-12 items-center border-b p-4 last:border-0">
                  <div className="col-span-3 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>{date.startDate}</span>
                  </div>
                  <div className="col-span-3">{date.endDate}</div>
                  <div className="col-span-2">{date.capacity}</div>
                  <div className="col-span-2">{date.booked}</div>
                  <div className="col-span-2">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      {date.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="pricing" className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pricing Options</CardTitle>
              <CardDescription>Manage pricing packages for this tour</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pricingOptions.map((option) => (
                <div key={option.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{option.name}</h3>
                        {option.default && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                      {(option.minPeople || option.maxPeople) && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {option.minPeople && `Min: ${option.minPeople} people`}
                          {option.minPeople && option.maxPeople && " • "}
                          {option.maxPeople && `Max: ${option.maxPeople} people`}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{option.price}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.perPerson ? "per person" : "per group"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="addons" className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Optional Add-ons</CardTitle>
              <CardDescription>Additional services customers can purchase</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {addons.map((addon) => (
                <div key={addon.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{addon.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{addon.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{addon.price}</div>
                      <div className="text-xs text-muted-foreground">
                        {addon.perPerson ? "per person" : "per group"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="policies" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Policies</CardTitle>
            <CardDescription>Set payment and cancellation policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="deposit">Deposit Required</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input id="deposit" value="30" className="w-20" />
                  <span>% of total price</span>
                </div>
              </div>
              <div>
                <Label htmlFor="final-payment">Final Payment Due</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input id="final-payment" value="60" className="w-20" />
                  <span>days before departure</span>
                </div>
              </div>
              <div>
                <Label htmlFor="cancellation">Cancellation Policy</Label>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input value="90" className="w-20" />
                    <span>days or more: Full refund minus $200 admin fee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input value="60" className="w-20" />
                    <span>to 89 days: 75% refund</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input value="30" className="w-20" />
                    <span>to 59 days: 50% refund</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input value="0" className="w-20" />
                    <span>to 29 days: No refund</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
