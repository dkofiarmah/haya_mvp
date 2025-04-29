import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, Save } from "lucide-react"
import Link from "next/link"
import { ChannelConfiguration } from "@/components/channel-configuration"
import { ChannelAgents } from "@/components/channel-agents"
import { ChannelTemplates } from "@/components/channel-templates"
import { ChannelAnalytics } from "@/components/channel-analytics"

export default function ChannelDetailPage({ params }: { params: { id: string } }) {
  // This would normally be fetched from an API based on the ID
  const channel = {
    id: params.id,
    name: "WhatsApp",
    description: "WhatsApp Business API integration for instant messaging",
    status: "active",
    icon: "MessageCircle",
    color: "green",
    stats: {
      messages: 3567,
      responseRate: 95,
      avgResponseTime: "5 min",
    },
    agents: ["Discovery Agent", "Communication Agent"],
    lastUpdated: "30 minutes ago",
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/channels">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{channel.name}</h2>
            <p className="text-muted-foreground">{channel.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {channel.status === "active" ? (
          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
        ) : (
          <Badge className="bg-gray-500/10 text-gray-500">Inactive</Badge>
        )}
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="agents">Connected Agents</TabsTrigger>
          <TabsTrigger value="templates">Response Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="configuration" className="space-y-4">
          <ChannelConfiguration channelId={params.id} />
        </TabsContent>
        <TabsContent value="agents" className="space-y-4">
          <ChannelAgents channelId={params.id} />
        </TabsContent>
        <TabsContent value="templates" className="space-y-4">
          <ChannelTemplates channelId={params.id} />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <ChannelAnalytics channelId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
