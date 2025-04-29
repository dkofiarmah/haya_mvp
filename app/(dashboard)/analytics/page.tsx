import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsOverview } from "@/components/analytics-overview"
import { AgentPerformance } from "@/components/agent-performance"
import { ChannelEngagement } from "@/components/channel-engagement"
import { ConversionMetrics } from "@/components/conversion-metrics"
import { CustomerAnalytics } from "@/components/customer-analytics"
import { RevenueAnalytics } from "@/components/revenue-analytics"

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive analytics and insights for your luxury tour operations
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="channels">Channel Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <AnalyticsOverview />
        </TabsContent>
        <TabsContent value="agents" className="space-y-6">
          <AgentPerformance />
        </TabsContent>
        <TabsContent value="channels" className="space-y-6">
          <ChannelEngagement />
        </TabsContent>
        <TabsContent value="conversion" className="space-y-6">
          <ConversionMetrics />
        </TabsContent>
        <TabsContent value="customers" className="space-y-6">
          <CustomerAnalytics />
        </TabsContent>
        <TabsContent value="revenue" className="space-y-6">
          <RevenueAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
