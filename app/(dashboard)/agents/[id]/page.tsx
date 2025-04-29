import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AgentConfiguration } from "@/components/agent-configuration"
import { AgentKnowledgeBase } from "@/components/agent-knowledge-base"
import { AgentChannels } from "@/components/agent-channels"
import { AgentLogs } from "@/components/agent-logs"
import { ArrowLeft, BarChart3, Save } from "lucide-react"
import Link from "next/link"

export default function AgentDetailPage({ params }: any) {
  // This would normally be fetched from an API based on the ID
  const agent = {
    id: params.id,
    name: "Discovery Agent",
    description: "Converses with users to understand their preferences and requirements for trips.",
    status: "active",
    type: "default",
    performance: 92,
    tasks: {
      completed: 248,
      pending: 5,
    },
    channels: ["website", "whatsapp", "email"],
    lastUpdated: "2 days ago",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/agents">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{agent.name}</h2>
            <p className="text-muted-foreground">{agent.description}</p>
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
        {agent.type === "custom" ? (
          <Badge className="bg-purple-500/10 text-purple-500">Custom</Badge>
        ) : (
          <Badge variant="secondary">Default</Badge>
        )}
        {agent.status === "active" ? (
          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
        ) : (
          <Badge className="bg-gray-500/10 text-gray-500">Inactive</Badge>
        )}
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="configuration" className="space-y-4">
          <AgentConfiguration agentId={params.id} />
        </TabsContent>
        <TabsContent value="knowledge" className="space-y-4">
          <AgentKnowledgeBase agentId={params.id} />
        </TabsContent>
        <TabsContent value="channels" className="space-y-4">
          <AgentChannels agentId={params.id} />
        </TabsContent>
        <TabsContent value="logs" className="space-y-4">
          <AgentLogs agentId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
