import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { BarChart3, Edit, MessageSquare, MoreHorizontal, Settings, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AgentsList() {
  const agents = [
    {
      id: 1,
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
    },
    {
      id: 2,
      name: "Itinerary Design Agent",
      description: "Creates detailed itineraries based on client preferences and available experiences.",
      status: "active",
      type: "default",
      performance: 88,
      tasks: {
        completed: 187,
        pending: 12,
      },
      channels: ["internal"],
      lastUpdated: "1 day ago",
    },
    {
      id: 3,
      name: "Booking & Logistics Agent",
      description: "Handles bookings, reservations, and logistics for approved itineraries.",
      status: "active",
      type: "default",
      performance: 85,
      tasks: {
        completed: 156,
        pending: 8,
      },
      channels: ["internal", "email"],
      lastUpdated: "3 days ago",
    },
    {
      id: 4,
      name: "Communication Agent",
      description: "Manages client communications before and during trips.",
      status: "active",
      type: "custom",
      performance: 94,
      tasks: {
        completed: 312,
        pending: 3,
      },
      channels: ["email", "whatsapp", "sms"],
      lastUpdated: "12 hours ago",
    },
    {
      id: 5,
      name: "Feedback & Review Agent",
      description: "Collects and analyzes client feedback after trips.",
      status: "inactive",
      type: "custom",
      performance: 90,
      tasks: {
        completed: 98,
        pending: 0,
      },
      channels: ["email", "sms"],
      lastUpdated: "1 week ago",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="line-clamp-1">{agent.name}</CardTitle>
              <Switch checked={agent.status === "active"} />
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
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{agent.description}</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Performance</span>
                <span className="font-medium">{agent.performance}%</span>
              </div>
              <Progress value={agent.performance} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-md border p-2">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{agent.tasks.completed}</span>
                </div>
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-md border p-2">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{agent.channels.length}</span>
                </div>
                <span className="text-xs text-muted-foreground">Channels</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {agent.channels.map((channel) => (
                <Badge key={channel} variant="outline" className="capitalize">
                  {channel}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Agent
                  </DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>View Knowledge Base</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
