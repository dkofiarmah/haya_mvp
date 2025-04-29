import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Phone, PlusCircle } from "lucide-react"

export function MessageChannels() {
  const channels = [
    {
      id: 1,
      name: "Email",
      icon: Mail,
      unread: 3,
      active: true,
    },
    {
      id: 2,
      name: "Chat",
      icon: MessageSquare,
      unread: 2,
      active: false,
    },
    {
      id: 3,
      name: "SMS",
      icon: Phone,
      unread: 0,
      active: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Channels</CardTitle>
        <CardDescription>Communication channels with customers</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant={channel.active ? "secondary" : "ghost"}
              className="w-full justify-start px-4"
            >
              <channel.icon className="mr-2 h-4 w-4" />
              <span>{channel.name}</span>
              {channel.unread > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {channel.unread}
                </Badge>
              )}
            </Button>
          ))}
          <Button variant="ghost" className="w-full justify-start px-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Add Channel</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
