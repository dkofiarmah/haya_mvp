import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

export function RevenueAnalytics() {
  // Sample data for charts
  const monthlyRevenueData = [
    { name: "Jan", value: 125000 },
    { name: "Feb", value: 142000 },
    { name: "Mar", value: 138000 },
    { name: "Apr", value: 165000 },
    { name: "May", value: 178000 },
    { name: "Jun", value: 195000 },
    { name: "Jul", value: 215000 },
    { name: "Aug", value: 232000 },
    { name: "Sep", value: 220000 },
    { name: "Oct", value: 245000 },
    { name: "Nov", value: 260000 },
    { name: "Dec", value: 285000 },
  ]

  const revenueByTourData = [
    { name: "Bali Luxury Retreat", value: 425000 },
    { name: "Japan Cultural Tour", value: 380000 },
    { name: "African Safari", value: 320000 },
    { name: "European Heritage", value: 290000 },
    { name: "Maldives Getaway", value: 260000 },
    { name: "Other Tours", value: 325000 },
  ]

  const revenueByChannelData = [
    { name: "Direct Website", value: 35 },
    { name: "Travel Agencies", value: 25 },
    { name: "Online Platforms", value: 20 },
    { name: "Referrals", value: 15 },
    { name: "Other", value: 5 },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue YTD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,400,000</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+18.2%</span>
              <span className="ml-1">from last year</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Booking Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,850</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+5.3%</span>
              <span className="ml-1">from last year</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+2.1%</span>
              <span className="ml-1">from last year</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecasted Annual Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,200,000</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+22.5%</span>
              <span className="ml-1">from last year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue trends over the past 12 months</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <LineChart
            data={monthlyRevenueData}
            index="name"
            categories={["value"]}
            colors={["primary"]}
            valueFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
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
            <CardTitle>Revenue by Tour</CardTitle>
            <CardDescription>Top performing tours by revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              data={revenueByTourData}
              index="name"
              categories={["value"]}
              colors={["primary"]}
              valueFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              showLegend={false}
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
            <CardTitle>Revenue by Channel</CardTitle>
            <CardDescription>Distribution of revenue sources</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart
              data={revenueByChannelData}
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
          <CardTitle>Revenue by Season</CardTitle>
          <CardDescription>Seasonal revenue distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground">Winter</div>
                <div className="text-3xl font-bold">$520,000</div>
                <Badge variant="outline" className="mt-1 bg-blue-500/10 text-blue-500">
                  21.7%
                </Badge>
              </div>
              <div className="h-2 rounded-full bg-blue-500/20">
                <div className="h-full w-[21.7%] rounded-full bg-blue-500"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground">Spring</div>
                <div className="text-3xl font-bold">$480,000</div>
                <Badge variant="outline" className="mt-1 bg-green-500/10 text-green-500">
                  20%
                </Badge>
              </div>
              <div className="h-2 rounded-full bg-green-500/20">
                <div className="h-full w-[20%] rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground">Summer</div>
                <div className="text-3xl font-bold">$850,000</div>
                <Badge variant="outline" className="mt-1 bg-orange-500/10 text-orange-500">
                  35.4%
                </Badge>
              </div>
              <div className="h-2 rounded-full bg-orange-500/20">
                <div className="h-full w-[35.4%] rounded-full bg-orange-500"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground">Fall</div>
                <div className="text-3xl font-bold">$550,000</div>
                <Badge variant="outline" className="mt-1 bg-purple-500/10 text-purple-500">
                  22.9%
                </Badge>
              </div>
              <div className="h-2 rounded-full bg-purple-500/20">
                <div className="h-full w-[22.9%] rounded-full bg-purple-500"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
