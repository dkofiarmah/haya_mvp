import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"

export function ChannelAnalytics() {
  // Sample data for charts
  const channelVolumeData = [
    { name: "Jan", email: 1200, whatsapp: 2500, sms: 800, instagram: 450, twitter: 120, phone: 80 },
    { name: "Feb", email: 1250, whatsapp: 2600, sms: 820, instagram: 470, twitter: 125, phone: 85 },
    { name: "Mar", email: 1300, whatsapp: 2700, sms: 840, instagram: 490, twitter: 130, phone: 90 },
    { name: "Apr", email: 1350, whatsapp: 2800, sms: 860, instagram: 510, twitter: 135, phone: 95 },
    { name: "May", email: 1400, whatsapp: 2900, sms: 880, instagram: 530, twitter: 140, phone: 100 },
    { name: "Jun", email: 1450, whatsapp: 3000, sms: 900, instagram: 550, twitter: 145, phone: 105 },
    { name: "Jul", email: 1500, whatsapp: 3100, sms: 920, instagram: 570, twitter: 150, phone: 110 },
    { name: "Aug", email: 1550, whatsapp: 3200, sms: 940, instagram: 590, twitter: 155, phone: 115 },
    { name: "Sep", email: 1600, whatsapp: 3300, sms: 960, instagram: 610, twitter: 160, phone: 120 },
    { name: "Oct", email: 1650, whatsapp: 3400, sms: 980, instagram: 630, twitter: 165, phone: 125 },
    { name: "Nov", email: 1700, whatsapp: 3500, sms: 1000, instagram: 650, twitter: 170, phone: 130 },
    { name: "Dec", email: 1750, whatsapp: 3600, sms: 1020, instagram: 670, twitter: 175, phone: 135 },
  ]

  const responseTimeData = [
    { name: "Email", value: 15 },
    { name: "WhatsApp", value: 5 },
    { name: "SMS", value: 8 },
    { name: "Instagram DM", value: 25 },
    { name: "Twitter DM", value: 35 },
    { name: "Phone", value: 1 },
  ]

  const channelDistributionData = [
    { name: "Email", value: 25 },
    { name: "WhatsApp", value: 45 },
    { name: "SMS", value: 15 },
    { name: "Instagram DM", value: 8 },
    { name: "Twitter DM", value: 4 },
    { name: "Phone", value: 3 },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Message Volume by Channel</CardTitle>
          <CardDescription>Monthly message volume across all communication channels</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <LineChart
            data={channelVolumeData}
            index="name"
            categories={["email", "whatsapp", "sms", "instagram", "twitter", "phone"]}
            colors={["blue", "green", "orange", "purple", "sky", "red"]}
            valueFormatter={(value) => `${value} messages`}
            showLegend={true}
            showXAxis={true}
            showYAxis={true}
            showGridLines={true}
            yAxisWidth={50}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Average Response Time</CardTitle>
            <CardDescription>Average time to respond by channel (minutes)</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              data={responseTimeData}
              index="name"
              categories={["value"]}
              colors={["primary"]}
              valueFormatter={(value) => `${value} min`}
              showLegend={false}
              showXAxis={true}
              showYAxis={true}
              showGridLines={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
            <CardDescription>Percentage of messages by channel</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart
              data={channelDistributionData}
              index="name"
              categories={["value"]}
              colors={["blue", "green", "orange", "purple", "sky", "red"]}
              valueFormatter={(value) => `${value}%`}
              showLegend={true}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Channel Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators by channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium">Channel</th>
                  <th className="px-4 py-2 text-left font-medium">Messages</th>
                  <th className="px-4 py-2 text-left font-medium">Response Rate</th>
                  <th className="px-4 py-2 text-left font-medium">Avg. Response Time</th>
                  <th className="px-4 py-2 text-left font-medium">Client Satisfaction</th>
                  <th className="px-4 py-2 text-left font-medium">AI Handling Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">Email</td>
                  <td className="px-4 py-2">1,248</td>
                  <td className="px-4 py-2">98%</td>
                  <td className="px-4 py-2">15 min</td>
                  <td className="px-4 py-2">4.7/5</td>
                  <td className="px-4 py-2">85%</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">WhatsApp</td>
                  <td className="px-4 py-2">3,567</td>
                  <td className="px-4 py-2">95%</td>
                  <td className="px-4 py-2">5 min</td>
                  <td className="px-4 py-2">4.8/5</td>
                  <td className="px-4 py-2">92%</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">SMS</td>
                  <td className="px-4 py-2">892</td>
                  <td className="px-4 py-2">99%</td>
                  <td className="px-4 py-2">8 min</td>
                  <td className="px-4 py-2">4.6/5</td>
                  <td className="px-4 py-2">90%</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Instagram DM</td>
                  <td className="px-4 py-2">456</td>
                  <td className="px-4 py-2">90%</td>
                  <td className="px-4 py-2">25 min</td>
                  <td className="px-4 py-2">4.5/5</td>
                  <td className="px-4 py-2">80%</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Twitter DM</td>
                  <td className="px-4 py-2">124</td>
                  <td className="px-4 py-2">85%</td>
                  <td className="px-4 py-2">35 min</td>
                  <td className="px-4 py-2">4.3/5</td>
                  <td className="px-4 py-2">75%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Phone</td>
                  <td className="px-4 py-2">78</td>
                  <td className="px-4 py-2">100%</td>
                  <td className="px-4 py-2">1 min</td>
                  <td className="px-4 py-2">4.9/5</td>
                  <td className="px-4 py-2">30%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
