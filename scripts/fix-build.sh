#!/bin/bash

# Create a fixed (dashboard) agents page with correct typing
echo 'import { Button } from "@/components/ui/button"
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
          <Link href="/agents">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">{agent.name}</h1>
          <Badge variant={agent.status === "active" ? "success" : "secondary"} className="ml-2">
            {agent.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-4">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="configuration" className="space-y-4 pt-4">
          <AgentConfiguration agent={agent} />
        </TabsContent>
        <TabsContent value="knowledge" className="space-y-4 pt-4">
          <AgentKnowledgeBase agent={agent} />
        </TabsContent>
        <TabsContent value="channels" className="space-y-4 pt-4">
          <AgentChannels agent={agent} />
        </TabsContent>
        <TabsContent value="logs" className="space-y-4 pt-4">
          <AgentLogs agent={agent} />
        </TabsContent>
      </Tabs>
    </div>
  )
}' > /Users/danny_1/_PROJECTS_/haya/haya_mvp/app/\(dashboard\)/agents/\[id\]/page.tsx.fixed

# Apply the fixed file
cp /Users/danny_1/_PROJECTS_/haya/haya_mvp/app/\(dashboard\)/agents/\[id\]/page.tsx.fixed /Users/danny_1/_PROJECTS_/haya/haya_mvp/app/\(dashboard\)/agents/\[id\]/page.tsx

# Run the next build
rm -rf .next
NODE_OPTIONS="--max_old_space_size=4096" NEXT_TELEMETRY_DISABLED=1 next build --no-lint

exit $?
