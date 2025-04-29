import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  BarChart3,
  Edit,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Settings,
  Instagram,
  Twitter,
  MessageSquare,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ChannelsList() {
  const channels = [
    {
      id: 1,
      name: "Email",
      description: "Primary email channel for client communications",
      status: "active",
      icon: Mail,
      color: "blue",
      stats: {
        messages: 1248,
        responseRate: 98,
        avgResponseTime: "15 min",
      },
      agents: ["Communication Agent", "Feedback & Review Agent"],
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      name: "WhatsApp",
      description: "WhatsApp Business API integration for instant messaging",
      status: "active",
      icon: MessageCircle,
      color: "green",
      stats: {
        messages: 3567,
        responseRate: 95,
        avgResponseTime: "5 min",
      },
      agents: ["Discovery Agent", "Communication Agent"],
      lastUpdated: "30 minutes ago",
    },
    {
      id: 3,
      name: "SMS",
      description: "Text messaging for urgent communications and alerts",
      status: "active",
      icon: MessageSquare,
      color: "orange",
      stats: {
        messages: 892,
        responseRate: 99,
        avgResponseTime: "8 min",
      },
      agents: ["Communication Agent", "Feedback & Review Agent"],
      lastUpdated: "1 day ago",
    },
    {
      id: 4,
      name: "Instagram DM",
      description: "Instagram direct messaging for social media inquiries",
      status: "active",
      icon: Instagram,
      color: "purple",
      stats: {
        messages: 456,
        responseRate: 90,
        avgResponseTime: "25 min",
      },
      agents: ["Discovery Agent"],
      lastUpdated: "3 days ago",
    },
    {
      id: 5,
      name: "Twitter DM",
      description: "Twitter direct messaging for social media inquiries",
      status: "inactive",
      icon: Twitter,
      color: "sky",
      stats: {
        messages: 124,
        responseRate: 85,
        avgResponseTime: "35 min",
      },
      agents: [],
      lastUpdated: "1 week ago",
    },
    {
      id: 6,
      name: "Phone",
      description: "Voice call integration for personal communication",
      status: "inactive",
      icon: Phone,
      color: "red",
      stats: {
        messages: 78,
        responseRate: 100,
        avgResponseTime: "immediate",
      },
      agents: [],
      lastUpdated: "2 weeks ago",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {channels.map((channel) => (
        <Card key={channel.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-${channel.color}-500/10`}>
                  <channel.icon className={`h-4 w-4 text-${channel.color}-500`} />
                </div>
                <CardTitle className="line-clamp-1">{channel.name}</CardTitle>
              </div>
              <Switch checked={channel.status === "active"} />
            </div>
            <div className="flex flex-wrap gap-2">
              {channel.status === "active" ? (
                <Badge className="bg-green-500/10 text-green-500">Active</Badge>
              ) : (
                <Badge className="bg-gray-500/10 text-gray-500">Inactive</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{channel.description}</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Response Rate</span>
                <span className="font-medium">{channel.stats.responseRate}%</span>
              </div>
              <Progress value={channel.stats.responseRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center rounded-md border p-2">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{channel.stats.messages}</span>
                </div>
                <span className="text-xs text-muted-foreground">Messages</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-md border p-2">
                <span className="text-sm font-medium">{channel.stats.avgResponseTime}</span>
                <span className="text-xs text-muted-foreground">Avg. Response</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium">Connected Agents:</p>
              <div className="flex flex-wrap gap-2">
                {channel.agents.length > 0 ? (
                  channel.agents.map((agent) => (
                    <Badge key={agent} variant="outline">
                      {agent}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No agents connected</span>
                )}
              </div>
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
                    Edit Channel
                  </DropdownMenuItem>
                  <DropdownMenuItem>Connect Agent</DropdownMenuItem>
                  <DropdownMenuItem>Test Connection</DropdownMenuItem>
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
