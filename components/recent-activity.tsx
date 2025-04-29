import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      actor: {
        type: "ai",
        name: "Discovery Agent",
        avatar: "DA",
      },
      action: "Completed client preference interview",
      trip: "Patagonia Hiking",
      time: "10 minutes ago",
      status: "success",
    },
    {
      id: 2,
      actor: {
        type: "human",
        name: "Sarah Johnson",
        avatar: "SJ",
      },
      action: "Approved itinerary",
      trip: "Greek Islands",
      time: "25 minutes ago",
      status: "approved",
    },
    {
      id: 3,
      actor: {
        type: "ai",
        name: "Booking Agent",
        avatar: "BA",
      },
      action: "Sent booking requests to partners",
      trip: "Morocco Desert",
      time: "1 hour ago",
      status: "pending",
    },
    {
      id: 4,
      actor: {
        type: "ai",
        name: "Communication Agent",
        avatar: "CA",
      },
      action: "Sent pre-departure information",
      trip: "Costa Rica Adventure",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 5,
      actor: {
        type: "human",
        name: "Sarah Johnson",
        avatar: "SJ",
      },
      action: "Modified itinerary",
      trip: "New Zealand Tour",
      time: "3 hours ago",
      status: "modified",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className={activity.actor.type === "ai" ? "bg-primary/10 text-primary" : ""}>
              {activity.actor.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{activity.actor.name}</span>
                {activity.actor.type === "ai" && (
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    AI
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
            <p className="mt-1 text-sm">
              {activity.action} for <span className="font-medium">{activity.trip}</span>
            </p>
            <div className="mt-1">
              {activity.status === "success" && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Completed
                </Badge>
              )}
              {activity.status === "pending" && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                  Pending
                </Badge>
              )}
              {activity.status === "approved" && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  Approved
                </Badge>
              )}
              {activity.status === "modified" && (
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                  Modified
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
