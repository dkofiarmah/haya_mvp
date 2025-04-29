"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Clock, DollarSign, Users } from "lucide-react"
import { motion } from "framer-motion"

export function BookingSummaryCards() {
  const stats = [
    {
      title: "Total Bookings",
      value: "124",
      change: "+12% from last month",
      icon: CalendarDays,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Upcoming Tours",
      value: "8",
      change: "Next 30 days",
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Total Travelers",
      value: "287",
      change: "This season",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Revenue",
      value: "$248,500",
      change: "+18% from last year",
      icon: DollarSign,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.4,
            type: "spring",
            stiffness: 100,
          }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
