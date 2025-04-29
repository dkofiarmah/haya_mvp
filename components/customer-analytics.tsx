import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"

export function CustomerAnalytics() {
  // Sample data for charts
  const customerGrowthData = [
    { name: "Jan", value: 120 },
    { name: "Feb", value: 132 },
    { name: "Mar", value: 145 },
    { name: "Apr", value: 160 },
    { name: "May", value: 178 },
    { name: "Jun", value: 190 },
    { name: "Jul", value: 210 },
    { name: "Aug", value: 235 },
    { name: "Sep", value: 256 },
    { name: "Oct", value: 278 },
    { name: "Nov", value: 294 },
    { name: "Dec", value: 310 },
  ]

  const customerSegmentData = [
    { name: "Luxury Seekers", value: 35 },
    { name: "Adventure Enthusiasts", value: 25 },
    { name: "Cultural Explorers", value: 20 },
    { name: "Wellness Travelers", value: 15 },
    { name: "Family Vacationers", value: 5 },
  ]

  const customerSourceData = [
    { name: "Direct Website", value: 30 },
    { name: "Referrals", value: 25 },
    { name: "Social Media", value: 20 },
    { name: "Travel Agencies", value: 15 },
    { name: "Email Campaigns", value: 10 },
  ]

  const customerRetentionData = [
    { name: "Jan", new: 25, returning: 95 },
    { name: "Feb", new: 28, returning: 104 },
    { name: "Mar", new: 30, returning: 115 },
    { name: "Apr", new: 35, returning: 125 },
    { name: "May", new: 38, returning: 140 },
    { name: "Jun", new: 40, returning: 150 },
    { name: "Jul", new: 45, returning: 165 },
    { name: "Aug", new: 50, returning: 185 },
    { name: "Sep", new: 46, returning: 210 },
    { name: "Oct", new: 48, returning: 230 },
    { name: "Nov", new: 52, returning: 242 },
    { name: "Dec", new: 55, returning: 255 },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
          <CardDescription>Monthly customer acquisition over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <LineChart
            data={customerGrowthData}
            index="name"
            categories={["value"]}
            colors={["primary"]}
            valueFormatter={(value) => `${value} customers`}
            showLegend={false}
            showXAxis={true}
            showYAxis={true}
            showGridLines={true}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Distribution of customer types</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart
              data={customerSegmentData}
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
            <CardTitle>Customer Acquisition Sources</CardTitle>
            <CardDescription>How customers discover your services</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart
              data={customerSourceData}
              index="name"
              categories={["value"]}
              colors={["blue", "green", "orange", "purple", "red"]}
              valueFormatter={(value) => `${value}%`}
              showLegend={true}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New vs. Returning Customers</CardTitle>
          <CardDescription>Monthly breakdown of new and returning customers</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <BarChart
            data={customerRetentionData}
            index="name"
            categories={["new", "returning"]}
            colors={["blue", "green"]}
            valueFormatter={(value) => `${value} customers`}
            showLegend={true}
            showXAxis={true}
            showYAxis={true}
            showGridLines={true}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Lifetime Value</CardTitle>
          <CardDescription>Average revenue generated per customer segment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium">Customer Segment</th>
                  <th className="px-4 py-2 text-left font-medium">Avg. Lifetime Value</th>
                  <th className="px-4 py-2 text-left font-medium">Avg. Bookings</th>
                  <th className="px-4 py-2 text-left font-medium">Retention Rate</th>
                  <th className="px-4 py-2 text-left font-medium">Avg. Booking Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">Luxury Seekers</td>
                  <td className="px-4 py-2">$45,200</td>
                  <td className="px-4 py-2">3.2</td>
                  <td className="px-4 py-2">78%</td>
                  <td className="px-4 py-2">$14,125</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Adventure Enthusiasts</td>
                  <td className="px-4 py-2">$32,800</td>
                  <td className="px-4 py-2">2.8</td>
                  <td className="px-4 py-2">72%</td>
                  <td className="px-4 py-2">$11,714</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Cultural Explorers</td>
                  <td className="px-4 py-2">$28,500</td>
                  <td className="px-4 py-2">2.5</td>
                  <td className="px-4 py-2">68%</td>
                  <td className="px-4 py-2">$11,400</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Wellness Travelers</td>
                  <td className="px-4 py-2">$36,200</td>
                  <td className="px-4 py-2">2.6</td>
                  <td className="px-4 py-2">75%</td>
                  <td className="px-4 py-2">$13,923</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Family Vacationers</td>
                  <td className="px-4 py-2">$42,500</td>
                  <td className="px-4 py-2">2.2</td>
                  <td className="px-4 py-2">65%</td>
                  <td className="px-4 py-2">$19,318</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
