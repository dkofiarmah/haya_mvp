import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart } from "@/components/ui/chart"
import { ArrowUpRight, Users, MessageSquare, Calendar, CheckCircle2 } from "lucide-react"

export function AnalyticsOverview() {
  // Sample data for charts
  const monthlyData = [
    { name: "Jan", value: 45 },
    { name: "Feb", value: 52 },
    { name: "Mar", value: 48 },
    { name: "Apr", value: 61 },
    { name: "May", value: 55 },
    { name: "Jun", value: 67 },
    { name: "Jul", value: 78 },
    { name: "Aug", value: 87 },
    { name: "Sep", value: 93 },
    { name: "Oct", value: 102 },
    { name: "Nov", value: 110 },
    { name: "Dec", value: 118 },
  ]

  const channelData = [
    { name: "Email", value: 35 },
    { name: "WhatsApp", value: 45 },
    { name: "SMS", value: 15 },
    { name: "Instagram", value: 20 },
    { name: "Twitter", value: 10 },
    { name: "Phone", value: 5 },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+12.5%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Processed</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,389</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+18.2%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trips Booked</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+7.3%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.4%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+2.1%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Bookings</CardTitle>
            <CardDescription>Number of trips booked per month</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart
              data={monthlyData}
              index="name"
              categories={["value"]}
              colors={["primary"]}
              valueFormatter={(value) => `${value} bookings`}
              showLegend={false}
              showXAxis={true}
              showYAxis={true}
              showGridLines={true}
            />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
            <CardDescription>Message volume by communication channel</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              data={channelData}
              index="name"
              categories={["value"]}
              colors={["primary"]}
              valueFormatter={(value) => `${value}%`}
              showLegend={false}
              showXAxis={true}
              showYAxis={true}
              showGridLines={true}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Performing Agents</CardTitle>
            <CardDescription>Agents with highest completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Communication Agent</span>
                </div>
                <span className="text-sm font-medium">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Discovery Agent</span>
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Feedback & Review Agent</span>
                </div>
                <span className="text-sm font-medium">90%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Itinerary Design Agent</span>
                </div>
                <span className="text-sm font-medium">88%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Booking & Logistics Agent</span>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Destinations</CardTitle>
            <CardDescription>Most requested destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Bali, Indonesia</span>
                </div>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Santorini, Greece</span>
                </div>
                <span className="text-sm font-medium">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Kyoto, Japan</span>
                </div>
                <span className="text-sm font-medium">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Serengeti, Tanzania</span>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Amalfi Coast, Italy</span>
                </div>
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Trip Types</CardTitle>
            <CardDescription>Distribution of trip types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Honeymoon</span>
                </div>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Family Adventure</span>
                </div>
                <span className="text-sm font-medium">24%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Anniversary Trip</span>
                </div>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Cultural Immersion</span>
                </div>
                <span className="text-sm font-medium">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Wellness Retreat</span>
                </div>
                <span className="text-sm font-medium">13%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
