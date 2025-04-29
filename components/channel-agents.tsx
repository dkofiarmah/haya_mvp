import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { PlusCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

export function ChannelAgents({ channelId }: { channelId: string }) {
  const connectedAgents = [
    {
      id: 1,
      name: "Discovery Agent",
      description: "Converses with users to understand their preferences and requirements for trips.",
      status: "active",
      type: "default",
      performance: 92,
      isConnected: true,
    },
    {
      id: 4,
      name: "Communication Agent",
      description: "Manages client communications before and during trips.",
      status: "active",
      type: "custom",
      performance: 94,
      isConnected: true,
    },
  ]

  const availableAgents = [
    {
      id: 2,
      name: "Itinerary Design Agent",
      description: "Creates detailed itineraries based on client preferences and available experiences.",
      status: "active",
      type: "default",
      performance: 88,
      isConnected: false,
    },
    {
      id: 3,
      name: "Booking & Logistics Agent",
      description: "Handles bookings, reservations, and logistics for approved itineraries.",
      status: "active",
      type: "default",
      performance: 85,
      isConnected: false,
    },
    {
      id: 5,
      name: "Feedback & Review Agent",
      description: "Collects and analyzes client feedback after trips.",
      status: "inactive",
      type: "custom",
      performance: 90,
      isConnected: false,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Connected Agents</CardTitle>
              <CardDescription>AI agents that are connected to this channel.</CardDescription>
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect Agent
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedAgents.map((agent) => (
              <div key={agent.id} className="flex items-start justify-between rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="mt-1 h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{agent.name}</h3>
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
                    <p className="mt-1 text-sm text-muted-foreground">{agent.description}</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/agents/${agent.id}`}>Configure Agent</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Switch checked={agent.isConnected} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Agents</CardTitle>
          <CardDescription>Other AI agents that can be connected to this channel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableAgents.map((agent) => (
              <div key={agent.id} className="flex items-start justify-between rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="mt-1 h-9 w-9">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{agent.name}</h3>
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
                    <p className="mt-1 text-sm text-muted-foreground">{agent.description}</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/agents/${agent.id}`}>View Agent</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Switch checked={agent.isConnected} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
