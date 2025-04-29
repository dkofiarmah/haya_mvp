import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, CheckCircle, Edit, ThumbsDown, ThumbsUp } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "customer" | "agent" | "ai"
  timestamp: string
  status?: "draft" | "sent" | "delivered" | "read"
  aiGenerated?: boolean
  needsReview?: boolean
  attachments?: Array<{
    id: string
    name: string
    type: string
    url: string
  }>
}

interface MessageThreadProps {
  conversationId: string
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  // This would typically come from an API call using the conversationId
  const messages: Message[] = [
    {
      id: "1",
      content:
        "Hi there! We're planning to visit Bali next month and we're concerned about the weather forecast for our arrival day. Are there any alternative transportation options from the airport in case of heavy rain?",
      sender: "customer",
      timestamp: "June 15, 2023 at 10:23 AM",
      status: "read",
    },
    {
      id: "2",
      content:
        "Hello Mr. Davis! Thank you for reaching out. I understand your concern about the weather during your arrival in Bali. While June is typically dry season, occasional rain showers can occur.\n\nWe offer several transportation contingencies:\n\n1. Our premium transportation service includes covered transfers with extra time buffer for weather delays\n2. We can arrange for a luxury SUV instead of the standard sedan if you prefer\n3. We have direct contact with your driver who will monitor conditions\n\nWould you like me to update your booking to include our premium weather-protected transfer service?",
      sender: "ai",
      timestamp: "June 15, 2023 at 10:25 AM",
      status: "delivered",
      aiGenerated: true,
      needsReview: true,
    },
    {
      id: "3",
      content:
        "Yes, that would be great. Could you tell me more about the premium transfer service? Is there an additional cost?",
      sender: "customer",
      timestamp: "June 15, 2023 at 11:05 AM",
      status: "read",
    },
    {
      id: "4",
      content:
        "Hi Mr. Davis, Sarah here from the concierge team. The premium transfer service is an additional $75 and includes:\n\n- Luxury SUV with higher clearance\n- Complimentary refreshments\n- Immediate alternative routing if roads are affected\n- Direct contact with your driver who will monitor weather conditions\n- 24/7 concierge support during transfer\n\nShould I proceed with updating your booking? You can always change it up to 48 hours before arrival.",
      sender: "agent",
      timestamp: "June 15, 2023 at 11:30 AM",
      status: "delivered",
    },
  ]

  return (
    <div className="flex flex-col divide-y">
      {messages.map((message) => (
        <div key={message.id} className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              {message.sender === "customer" ? (
                <>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </>
              ) : message.sender === "ai" ? (
                <>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </>
              ) : (
                <>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>SA</AvatarFallback>
                </>
              )}
            </Avatar>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">
                  {message.sender === "customer"
                    ? "John Davis"
                    : message.sender === "ai"
                      ? "AI Assistant"
                      : "Sarah Anderson"}
                </p>
                {message.aiGenerated && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                    AI Generated
                  </Badge>
                )}
                {message.needsReview && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                    Needs Review
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>

              {message.aiGenerated && message.needsReview && (
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="h-8">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="h-8">
                    <ThumbsDown className="mr-2 h-3 w-3" />
                    Reject
                  </Button>
                  <Button size="sm" variant="secondary" className="h-8">
                    <ThumbsUp className="mr-2 h-3 w-3" />
                    Approve
                  </Button>
                </div>
              )}

              {message.status && (
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
