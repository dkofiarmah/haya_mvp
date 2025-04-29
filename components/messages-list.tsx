import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageSquare, ThumbsUp } from "lucide-react"
import Link from "next/link"

export function MessagesList() {
  const messages = [
    {
      id: 1,
      customer: {
        name: "John Davis",
        avatar: "JD",
      },
      tour: "Bali Luxury Retreat",
      message:
        "We're concerned about the weather forecast for our arrival day. Are there any alternative transportation options from the airport?",
      time: "2 hours ago",
      status: "urgent",
      unread: true,
      channel: "email",
    },
    {
      id: 2,
      customer: {
        name: "Emma Thompson",
        avatar: "ET",
      },
      tour: "Paris Getaway",
      message:
        "Just confirming that our dietary restrictions have been communicated to all the restaurants we'll be visiting.",
      time: "5 hours ago",
      status: "ai-handled",
      unread: false,
      channel: "chat",
    },
    {
      id: 3,
      customer: {
        name: "Michael Chen",
        avatar: "MC",
      },
      tour: "Tokyo Adventure",
      message: "We'd like to add a day trip to Nara if possible. Can you suggest how to incorporate this?",
      time: "Yesterday",
      status: "flagged",
      unread: true,
      channel: "email",
    },
    {
      id: 4,
      customer: {
        name: "Sarah Johnson",
        avatar: "SJ",
      },
      tour: "African Safari",
      message: "Thank you for the detailed pre-departure information. We're excited for our trip next month!",
      time: "2 days ago",
      status: "ai-handled",
      unread: false,
      channel: "sms",
    },
    {
      id: 5,
      customer: {
        name: "Robert Miller",
        avatar: "RM",
      },
      tour: "European Heritage Tour",
      message: "We received the updated itinerary. The changes look perfect, thank you!",
      time: "3 days ago",
      status: "ai-handled",
      unread: false,
      channel: "email",
    },
  ]

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Link href={`/messages/${message.id}`} className="block" key={message.id}>
          <Card className={`p-4 ${message.unread ? "border-primary/50 bg-primary/5" : ""}`}>
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{message.customer.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.customer.name}</span>
                    {message.unread && (
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        New
                      </Badge>
                    )}
                    {message.status === "urgent" && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500">
                        Urgent
                      </Badge>
                    )}
                    {message.status === "ai-handled" && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        AI Handled
                      </Badge>
                    )}
                    {message.status === "flagged" && (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                        Flagged
                      </Badge>
                    )}
                    <Badge variant="outline" className="capitalize">
                      {message.channel}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{message.time}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tour: <span className="font-medium text-foreground">{message.tour}</span>
                </p>
                <p className="mt-2 text-sm">{message.message}</p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                  {message.status === "ai-handled" && (
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
