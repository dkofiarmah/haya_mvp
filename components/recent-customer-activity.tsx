import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentCustomerActivity() {
  const activities = [
    {
      id: 1,
      customer: {
        name: "Emma Thompson",
        avatar: "ET",
      },
      action: "Booked",
      tour: "Paris Getaway",
      time: "10 minutes ago",
      status: "new",
    },
    {
      id: 2,
      customer: {
        name: "Robert Chen",
        avatar: "RC",
      },
      action: "Requested information",
      tour: "Japan Cultural Tour",
      time: "25 minutes ago",
      status: "pending",
    },
    {
      id: 3,
      customer: {
        name: "Sarah Johnson",
        avatar: "SJ",
      },
      action: "Made payment",
      tour: "Bali Luxury Retreat",
      time: "1 hour ago",
      status: "completed",
    },
    {
      id: 4,
      customer: {
        name: "David Miller",
        avatar: "DM",
      },
      action: "Submitted feedback",
      tour: "African Safari",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 5,
      customer: {
        name: "Lisa Davis",
        avatar: "LD",
      },
      action: "Modified booking",
      tour: "European Heritage Tour",
      time: "3 hours ago",
      status: "updated",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>{activity.customer.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{activity.customer.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
            <p className="mt-1 text-sm">
              {activity.action} <span className="font-medium">{activity.tour}</span>
            </p>
            <div className="mt-1">
              {activity.status === "new" && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  New
                </Badge>
              )}
              {activity.status === "pending" && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                  Pending
                </Badge>
              )}
              {activity.status === "completed" && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Completed
                </Badge>
              )}
              {activity.status === "updated" && (
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                  Updated
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
