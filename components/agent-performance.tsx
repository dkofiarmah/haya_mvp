import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, BarChart } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AgentPerformance() {
  // Sample data for charts
  const performanceData = [
    { name: "Jan", discovery: 88, itinerary: 82, booking: 78, communication: 90, feedback: 85 },
    { name: "Feb", discovery: 90, itinerary: 83, booking: 80, communication: 91, feedback: 86 },
    { name: "Mar", discovery: 89, itinerary: 85, booking: 81, communication: 92, feedback: 87 },
    { name: "Apr", discovery: 91, itinerary: 86, booking: 82, communication: 93, feedback: 88 },
    { name: "May", discovery: 90, itinerary: 87, booking: 83, communication: 92, feedback: 89 },
    { name: "Jun", discovery: 92, itinerary: 88, booking: 84, communication: 93, feedback: 90 },
    { name: "Jul", discovery: 91, itinerary: 87, booking: 85, communication: 94, feedback: 89 },
    { name: "Aug", discovery: 93, itinerary: 88, booking: 86, communication: 95, feedback: 90 },
    { name: "Sep", discovery: 92, itinerary: 89, booking: 85, communication: 94, feedback: 91 },
    { name: "Oct", discovery: 94, itinerary: 90, booking: 87, communication: 96, feedback: 92 },
    { name: "Nov", discovery: 93, itinerary: 91, booking: 88, communication: 95, feedback: 93 },
    { name: "Dec", discovery: 95, itinerary: 92, booking: 89, communication: 97, feedback: 94 },
  ]

  const taskCompletionData = [
    { name: "Discovery Agent", completed: 248, pending: 5 },
    { name: "Itinerary Design Agent", completed: 187, pending: 12 },
    { name: "Booking & Logistics Agent", completed: 156, pending: 8 },
    { name: "Communication Agent", completed: 312, pending: 3 },
    { name: "Feedback & Review Agent", completed: 98, pending: 0 },
  ]

  const humanInterventionData = [
    { name: "Discovery Agent", value: 8 },
    { name: "Itinerary Design Agent", value: 12 },
    { name: "Booking & Logistics Agent", value: 15 },
    { name: "Communication Agent", value: 6 },
    { name: "Feedback & Review Agent", value: 10 },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Over Time</CardTitle>
          <CardDescription>Monthly performance metrics for each agent type</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <LineChart
            data={performanceData}
            index="name"
            categories={["discovery", "itinerary", "booking", "communication", "feedback"]}
            colors={["blue", "green", "orange", "purple", "red"]}
            valueFormatter={(value) => `${value}%`}
            showLegend={true}
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
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>Completed vs pending tasks by agent</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              data={taskCompletionData}
              index="name"
              categories={["completed", "pending"]}
              colors={["primary", "red"]}
              valueFormatter={(value) => `${value} tasks`}
              showLegend={true}
              showXAxis={true}
              showYAxis={true}
              showGridLines={true}
              layout="vertical"
              yAxisWidth={150}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Human Intervention Rate</CardTitle>
            <CardDescription>Percentage of tasks requiring human intervention</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              data={humanInterventionData}
              index="name"
              categories={["value"]}
              colors={["primary"]}
              valueFormatter={(value) => `${value}%`}
              showLegend={false}
              showXAxis={true}
              showYAxis={true}
              showGridLines={true}
              layout="vertical"
              yAxisWidth={150}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent-Specific Metrics</CardTitle>
          <CardDescription>Detailed performance metrics for each agent</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="discovery">
            <TabsList className="w-full">
              <TabsTrigger value="discovery" className="flex-1">
                Discovery
              </TabsTrigger>
              <TabsTrigger value="itinerary" className="flex-1">
                Itinerary
              </TabsTrigger>
              <TabsTrigger value="booking" className="flex-1">
                Booking
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex-1">
                Communication
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex-1">
                Feedback
              </TabsTrigger>
            </TabsList>
            <TabsContent value="discovery" className="mt-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Preference Accuracy</div>
                  <div className="mt-1 text-2xl font-bold">94%</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Avg. Conversation Length</div>
                  <div className="mt-1 text-2xl font-bold">12 min</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Client Satisfaction</div>
                  <div className="mt-1 text-2xl font-bold">4.8/5</div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="itinerary" className="mt-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Itinerary Approval Rate</div>
                  <div className="mt-1 text-2xl font-bold">88%</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Avg. Creation Time</div>
                  <div className="mt-1 text-2xl font-bold">45 min</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Revision Requests</div>
                  <div className="mt-1 text-2xl font-bold">1.2 avg</div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="booking" className="mt-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Booking Success Rate</div>
                  <div className="mt-1 text-2xl font-bold">92%</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Avg. Processing Time</div>
                  <div className="mt-1 text-2xl font-bold">2.5 hrs</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Error Rate</div>
                  <div className="mt-1 text-2xl font-bold">3.2%</div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="communication" className="mt-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Response Rate</div>
                  <div className="mt-1 text-2xl font-bold">98%</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Avg. Response Time</div>
                  <div className="mt-1 text-2xl font-bold">5 min</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Client Satisfaction</div>
                  <div className="mt-1 text-2xl font-bold">4.9/5</div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="feedback" className="mt-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Feedback Collection Rate</div>
                  <div className="mt-1 text-2xl font-bold">85%</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Sentiment Analysis Accuracy</div>
                  <div className="mt-1 text-2xl font-bold">92%</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium text-muted-foreground">Actionable Insights</div>
                  <div className="mt-1 text-2xl font-bold">3.4 avg</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
