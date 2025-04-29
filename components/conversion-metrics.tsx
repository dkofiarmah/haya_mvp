import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"

export function ConversionMetrics() {
  // Sample data for charts
  const conversionRateData = [
    { name: "Jan", value: 18 },
    { name: "Feb", value: 20 },
    { name: "Mar", value: 19 },
    { name: "Apr", value: 22 },
    { name: "May", value: 21 },
    { name: "Jun", value: 24 },
    { name: "Jul", value: 26 },
    { name: "Aug", value: 28 },
    { name: "Sep", value: 27 },
    { name: "Oct", value: 30 },
    { name: "Nov", value: 32 },
    { name: "Dec", value: 35 },
  ]

  const conversionByAgentData = [
    { name: "Discovery Agent", value: 25 },
    { name: "Itinerary Design Agent", value: 35 },
    { name: "Booking & Logistics Agent", value: 20 },
    { name: "Communication Agent", value: 15 },
    { name: "Feedback & Review Agent", value: 5 },
  ]

  const conversionByChannelData = [
    { name: "Email", value: 22 },
    { name: "WhatsApp", value: 32 },
    { name: "SMS", value: 18 },
    { name: "Instagram DM", value: 28 },
    { name: "Twitter DM", value: 15 },
    { name: "Phone", value: 40 },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Conversion Rate</CardTitle>
          <CardDescription>Percentage of inquiries that convert to bookings</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <LineChart
            data={conversionRateData}
            index="name"
            categories={["value"]}
            colors={["primary"]}
            valueFormatter={(value) => `${value}%`}
            showLegend={false}
            showXAxis={true}
            showYAxis={true}
            showGridLines={true}
            yAxisWidth={40}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Attribution by Agent</CardTitle>
            <CardDescription>Which agents contribute most to conversions</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart
              data={conversionByAgentData}
              index="name"
              categories={["value"]}
              colors={["blue", "green", "orange", "purple", "red"]}
              valueFormatter={(value) => `${value}%`}
              showLegend={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate by Channel</CardTitle>
            <CardDescription>Conversion effectiveness of each channel</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              data={conversionByChannelData}
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

      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>Customer journey from inquiry to booking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8 py-4">
            <div className="flex justify-between">
              <div className="w-full rounded-t-lg bg-primary/10 p-4 text-center">
                <div className="text-lg font-medium">Initial Inquiries</div>
                <div className="text-3xl font-bold">1,248</div>
                <div className="text-sm text-muted-foreground">100%</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-8 w-0 border-l-2 border-dashed border-primary/50"></div>
            </div>

            <div className="flex justify-between">
              <div className="mx-auto w-5/6 rounded-lg bg-primary/20 p-4 text-center">
                <div className="text-lg font-medium">Detailed Conversations</div>
                <div className="text-3xl font-bold">874</div>
                <div className="text-sm text-muted-foreground">70%</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-8 w-0 border-l-2 border-dashed border-primary/50"></div>
            </div>

            <div className="flex justify-between">
              <div className="mx-auto w-4/6 rounded-lg bg-primary/30 p-4 text-center">
                <div className="text-lg font-medium">Itinerary Creation</div>
                <div className="text-3xl font-bold">612</div>
                <div className="text-sm text-muted-foreground">49%</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-8 w-0 border-l-2 border-dashed border-primary/50"></div>
            </div>

            <div className="flex justify-between">
              <div className="mx-auto w-3/6 rounded-lg bg-primary/40 p-4 text-center">
                <div className="text-lg font-medium">Itinerary Approval</div>
                <div className="text-3xl font-bold">437</div>
                <div className="text-sm text-muted-foreground">35%</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-8 w-0 border-l-2 border-dashed border-primary/50"></div>
            </div>

            <div className="flex justify-between">
              <div className="mx-auto w-2/6 rounded-b-lg bg-primary/50 p-4 text-center">
                <div className="text-lg font-medium">Confirmed Bookings</div>
                <div className="text-3xl font-bold">312</div>
                <div className="text-sm text-muted-foreground">25%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
